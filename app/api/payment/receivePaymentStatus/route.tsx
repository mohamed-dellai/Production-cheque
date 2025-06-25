import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to log webhook interactions
const logWebhookEvent = (level: 'info' | 'error' | 'warn', message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [WEBHOOK-${level.toUpperCase()}] ${message}`, data ? JSON.stringify(data) : '');
};

// Validate payment reference format
const isValidPaymentRef = (paymentRef: string): boolean => {
  return /^[a-zA-Z0-9]{24}$/.test(paymentRef);
};

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  let paymentRef: string | null = null;
  
  try {
    logWebhookEvent('info', 'Webhook request received', { url: request.url });
    
    const searchParams = request.nextUrl.searchParams;
    paymentRef = searchParams.get('payment_ref');

    // Validate payment reference
    if (!paymentRef) {
      logWebhookEvent('error', 'Missing payment_ref parameter');
      return NextResponse.redirect(new URL('/payment/failure', request.url), 302);
    }

    if (!isValidPaymentRef(paymentRef)) {
      logWebhookEvent('error', 'Invalid payment_ref format', { paymentRef });
      return NextResponse.redirect(new URL('/payment/failure', request.url), 302);
    }

    logWebhookEvent('info', 'Processing payment reference', { paymentRef });

    // Check for duplicate processing (idempotency)
    const existingCompletedPayment = await prisma.payment.findUnique({
      where: {
        paymentRef: paymentRef,
        status: "completed"
      }
    });

    if (existingCompletedPayment) {
      logWebhookEvent('warn', 'Payment already processed', { paymentRef });
      return NextResponse.redirect(new URL('/payment/success', request.url), 302);
    }

    // Fetch payment details with timeout handling
    const paymentDetails: any = await fetchPaymentDetails(paymentRef);
    
    if (!paymentDetails || !paymentDetails.payment) {
      logWebhookEvent('error', 'Invalid payment details received', { paymentRef, paymentDetails });
      return NextResponse.redirect(new URL('/payment/failure', request.url), 302);
    }

    logWebhookEvent('info', 'Payment details retrieved', { 
      paymentRef, 
      status: paymentDetails.payment.status,
      amount: paymentDetails.payment.amount 
    });
    
    // Helper function to calculate next billing date
    const calculateNextBillingDate = (amount: number) => {
      const date = new Date();
      if (amount === 24000) {
        date.setMonth(date.getMonth() + 1);
      } else {
        // Default to yearly
        date.setFullYear(date.getFullYear() + 1);
      }
      return date;
    };

    // Extract subscription duration from details
    const getBillingCycle = (amount: number) => {
      return amount === 24000 ? 'monthly' : 'yearly';
    };

    // Validate payment amount
    if (!paymentDetails.payment.amount || paymentDetails.payment.amount <= 0) {
      logWebhookEvent('error', 'Invalid payment amount', { paymentRef, amount: paymentDetails.payment.amount });
      return NextResponse.redirect(new URL('/payment/failure', request.url), 302);
    }

    // Update payment status with error handling
    let updatedPayment;
    try {
      updatedPayment = await prisma.payment.update({
        where: {
          paymentRef: paymentRef,
        },
        data: {
          status: paymentDetails.payment.status,
          amount: paymentDetails.payment.amount,
          transactionDate: new Date(),
        },
      });
      logWebhookEvent('info', 'Payment record updated', { paymentRef, status: paymentDetails.payment.status });
    } catch (updateError: any) {
      logWebhookEvent('error', 'Failed to update payment record', { paymentRef, error: updateError.message });
      return NextResponse.redirect(new URL('/payment/failure', request.url), 302);
    }
     
    

    if (paymentDetails.payment.status === 'completed') {
      try {
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
            if (paymentDetails.payment.amount === 24000) {
              nextDate.setMonth(nextDate.getMonth() + 1);
            } else {
              nextDate.setFullYear(nextDate.getFullYear() + 1);
            }
            return nextDate;
          } else {
            // If no subscription or expired, start from today
            const date = new Date();
            if (paymentDetails.payment.amount === 24000) {
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

        logWebhookEvent('info', 'Subscription updated successfully', { 
          paymentRef, 
          userId: updatedPayment.userId,
          subscriptionId: subscription.id 
        });
        
      } catch (subscriptionError: any) {
        logWebhookEvent('error', 'Failed to update subscription', { 
          paymentRef, 
          userId: updatedPayment.userId,
          error: subscriptionError.message 
        });
        return NextResponse.redirect(new URL('/payment/failure', request.url), 302);
      }
    }

    const processingTime = Date.now() - startTime;
    if (paymentDetails.payment.status === 'completed') {
      logWebhookEvent('info', 'Webhook processed successfully (completed)', { 
        paymentRef, 
        status: paymentDetails.payment.status,
        processingTime: `${processingTime}ms` 
      });
      return NextResponse.redirect(new URL('/payment/success', request.url), 302);
    } else {
      logWebhookEvent('info', 'Webhook processed (payment not completed)', { 
        paymentRef, 
        status: paymentDetails.payment.status,
        processingTime: `${processingTime}ms` 
      });
      // Redirect to failure if payment is not completed, unless it was a non-completed status we still want to acknowledge
      // For now, any status other than 'completed' will redirect to failure if not handled by idempotency.
      return NextResponse.redirect(new URL('/payment/failure', request.url), 302);
    }
  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    logWebhookEvent('error', 'Webhook processing failed', { 
      paymentRef,
      error: error.message,
      stack: error.stack,
      processingTime: `${processingTime}ms`
    });
    
    // Ensure we always redirect to failure page on any unhandled error
    return NextResponse.redirect(new URL('/payment/failure', request.url), 302);
  } finally {
    // Clean up database connection
    await prisma.$disconnect();
  }
}

async function fetchPaymentDetails(paymentRef: string) {
  const apiUrl = 'https://api.konnect.network/api/v2';
  const apiKey = process.env.KONNECT_API_KEY;

  if (!apiKey) {
    logWebhookEvent('error', 'Payment API key is not configured');
    throw new Error('Payment API key is not configured');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    logWebhookEvent('info', 'Fetching payment details from Konnect API', { paymentRef });
    
    const response = await fetch(`${apiUrl}/payments/${paymentRef}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Accept': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      logWebhookEvent('error', 'Konnect API request failed', { 
        paymentRef,
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText
      });
      
      if (response.status === 401) {
        throw new Error('Authentication failure - Invalid API credentials');
      } else if (response.status === 404) {
        throw new Error('Invalid payment reference - Payment not found');
      } else {
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }
    }

    const data = await response.json();
    logWebhookEvent('info', 'Payment details fetched successfully', { paymentRef });
    return data;
    
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      logWebhookEvent('error', 'API request timeout', { paymentRef });
      throw new Error('Timeout - Slow server response from payment provider');
    }
    
    logWebhookEvent('error', 'Failed to fetch payment details', { 
      paymentRef,
      error: error.message 
    });
    throw error;
  }
}