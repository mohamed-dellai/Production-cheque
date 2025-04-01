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
    console.log('Payment details:', paymentDetails.payment);
    
    // Helper function to calculate next billing date
    const calculateNextBillingDate = (amount: number) => {
      const date = new Date();
      if (amount === 35000) {
        date.setMonth(date.getMonth() + 1);
      } else {
        // Default to yearly
        date.setFullYear(date.getFullYear() + 1);
      }
      return date;
    };

    // Extract subscription duration from details
    const getBillingCycle = (amount: number) => {
      return amount === 35000 ? 'monthly' : 'yearly';
    };

    const chequePaymentProcced= await prisma.payment.findUnique({
      where:{
        paymentRef: paymentRef,
        status:"completed"
      }
    })
    if(!chequePaymentProcced){
      return NextResponse.json({ error: 'Payment déja proceed' }, { status: 404 });
    }
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
     
    

    if (paymentDetails.payment.status === 'completed') {
      // First, try to get existing subscription
      const existingSubscription = await prisma.subscription.findUnique({
        where: {
          userId: updatedPayment.userId,
        }
      });

      // Calculate next billing date based on existing subscription or create new
      const getNextBillingDate = (currentSubscription: any) => {
        const today = new Date();
        if (currentSubscription && currentSubscription.nextBillingDate > today) {
          // If subscription exists and not expired, extend from current billing date
          const nextDate = new Date(currentSubscription.nextBillingDate);
          if (paymentDetails.payment.amount === 35000) {
            nextDate.setMonth(nextDate.getMonth() + 1);
          } else {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
          }
          return nextDate;
        } else {
          // If no subscription or expired, start from today
          const date = new Date();
          if (paymentDetails.payment.amount === 35000) {
            date.setMonth(date.getMonth() + 1);
          } else {
            date.setFullYear(date.getFullYear() + 1);
          }
          return date;
        }
      };

      const subscription = await prisma.subscription.upsert({
        where: {
          userId: updatedPayment.userId,
        },
        update: {
          status: 'active',
          billingCycle: getBillingCycle(paymentDetails.payment.amount),
          nextBillingDate: getNextBillingDate(existingSubscription),
          price: paymentDetails.payment.amount,
          planName: 'standard'
        },
        create: {
          userId: updatedPayment.userId,
          status: 'active',
          billingCycle: getBillingCycle(paymentDetails.payment.amount),
          nextBillingDate: getNextBillingDate(null),
          price: paymentDetails.payment.amount,
          planName: 'standard'
        },
      });

      console.log(`Subscription upserted for user ${updatedPayment.userId}`, {
        billingCycle: subscription.billingCycle,
        nextBillingDate: subscription.nextBillingDate,
        price: subscription.price,
        planName: subscription.planName
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
    console.error('Webhook processing error:', error.stack);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

}

async function fetchPaymentDetails(paymentRef: string) {
  console.log(paymentRef)
  const apiUrl ='https://api.sandbox.konnect.network/api/v2';
  const apiKey = process.env.KONNECT_API_KEY;

  if (!apiKey) {
    throw new Error('Payment API key is not configured');
  }

  
    const response = await fetch(`${apiUrl}/payments/${paymentRef}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Accept': 'application/json',
      }})
   

  


    
    return response.json();
    
  
}