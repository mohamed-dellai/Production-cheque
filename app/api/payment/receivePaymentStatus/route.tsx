import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paymentRef = searchParams.get('payment_ref');

    if (!paymentRef) {
      console.error('Missing payment_ref parameter');
      return NextResponse.json({ error: 'Missing payment reference' }, { status: 400 });
    }

    const paymentDetails: any = await fetchPaymentDetails(paymentRef);
    console.log('Payment details:', paymentDetails);
    
    // Helper function to calculate next billing date
    const calculateNextBillingDate = (amount: number) => {
      const date = new Date();
      if (amount === 35) {
        date.setMonth(date.getMonth() + 1);
      } else {
        // Default to yearly
        date.setFullYear(date.getFullYear() + 1);
      }
      return date;
    };

    // Extract subscription duration from details
    const getBillingCycle = (amount: number) => {
      return amount === 35 ? 'monthly' : 'yearly';
    };

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: {
        paymentRef: paymentRef,
      },
      data: {
        status: paymentDetails.payment.status,
        amount: paymentDetails.payment.amount,
        transactionDate: new Date(),
      },
    });

    // If payment is successful, update subscription
    if (paymentDetails.payment.status === 'completed') {
      const subscription = await prisma.subscription.update({
        where: {
          userId: updatedPayment.userId,
        },
        data: {
          status: 'active',
          billingCycle: getBillingCycle(paymentDetails.payment.details),
          nextBillingDate: calculateNextBillingDate(paymentDetails.payment.details),
        },
      });

      console.log(`Subscription updated for user ${updatedPayment.userId}`, {
        billingCycle: subscription.billingCycle,
        nextBillingDate: subscription.nextBillingDate,
      });
    }

    console.log(`Webhook received for payment ${paymentRef}`, {
      status: paymentDetails.payment.status,
      timestamp: new Date().toISOString(),
      details: paymentDetails.payment.details,
    });

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      payment: updatedPayment
    }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    console.error('Webhook processing error:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function fetchPaymentDetails(paymentRef: string) {
  const apiUrl ='https://api.sandbox.konnect.network';
  const apiKey = process.env.KONNECT_API_KEY;

  if (!apiKey) {
    throw new Error('Payment API key is not configured');
  }

  try {
    const response = await fetch(`${apiUrl}/payments/${paymentRef}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Accept': 'application/json',
      },
    });

  
      console.log(`Payment API error: ${response.status} ${response.statusText}`);


    const data = await response.json();
    console.log('Payment details:', data);
    return data;

  } catch (error: any) {
    console.error('Error fetching payment details:', error.message);
    throw new Error('Failed to fetch payment details');
  }
}