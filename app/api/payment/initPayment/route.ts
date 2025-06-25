import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const userIdCookie = req.cookies.get('user-id');
    const userId = userIdCookie?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: User ID not found in cookies' }, { status: 401 });
    }

    const { selectedPlan } = await req.json();

    if (!selectedPlan || (selectedPlan !== 'monthly' && selectedPlan !== 'annuel')) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const amount = selectedPlan === 'monthly' ? 24000 : 240000;
    const description = `Abonnement ${selectedPlan === 'monthly' ? 'mensuel' : 'annuel'} - Cheques Management`;
    const konnectOrderId = `ORDER-${Date.now()}`; // This is for Konnect, not our DB

    // Ensure environment variables are set for sensitive data
    const konnectApiKey = process.env.KONNECT_API_KEY;
    const konnectReceiverWalletId = process.env.KONNECT_WALLET;
    const webhookUrl = `https://finflowtn.vercel.app/api/payment/receivePaymentStatus`;
    const successUrl = `https://finflowtn.vercel.app/payment/success`;
    const failUrl = `https://finflowtn.vercel.app/payment/failure`;

    if (!konnectApiKey || !konnectReceiverWalletId) {
      console.error('Konnect API key or Receiver Wallet ID is not configured in environment variables.');
      return NextResponse.json({ error: 'Payment gateway configuration error.' }, { status: 500 });
    }

    const konnectResponse = await fetch('https://api.konnect.network/api/v2/payments/init-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': konnectApiKey,
      },
      body: JSON.stringify({
        receiverWalletId: konnectReceiverWalletId,
        token: 'TND',
        webhook: webhookUrl,
        amount: amount,
        type: 'immediate',
        description: description,
        acceptedPaymentMethods: ['bank_card', 'e-DINAR'],
        lifespan: 30,
        checkoutForm: true,
        addPaymentFeesToAmount: false,
        orderId: konnectOrderId, // Use the Konnect-specific orderId here
        successUrl: successUrl,
        failUrl: failUrl,
        theme: 'light',
      }),
    });

    if (!konnectResponse.ok) {
      const errorData = await konnectResponse.json();
      console.error('Konnect API Error:', errorData);
      return NextResponse.json({ error: 'Failed to initialize payment with Konnect.', details: errorData }, { status: konnectResponse.status });
    }

    const konnectData = await konnectResponse.json();

    // Save payment details to our database
    const paymentRecord = await prisma.payment.create({
      data: {
        paymentRef: konnectData.paymentRef,
        userId: userId, // Use the retrieved userId
        amount: amount,
        paymentMethod: 'KONNECT', // Defaulting, adjust if other methods are used via Konnect
        status: 'PENDING', // Initial status
        // 'plan' field removed as it's not in the Payment model based on schema.prisma
        // 'orderId' field removed as it's not in the Payment model based on schema.prisma
      },
    });

    // The Payment model uses paymentRef as @id, so there's no separate 'id' field to return for the paymentRecord itself.
    return NextResponse.json({ payUrl: konnectData.payUrl, paymentRef: konnectData.paymentRef });

  } catch (error: any) {
    console.error('Error in initPayment API route:', error.stack || error);
    // Ensure Prisma client is disconnected in case of error too, if appropriate for your setup
    // await prisma.$disconnect(); // Consider if this is needed here or in a finally block
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    // It's good practice to disconnect Prisma Client when it's no longer needed, 
    // especially in serverless environments.
    await prisma.$disconnect();
  }
}