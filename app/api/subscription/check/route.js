import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  console.log('Subscription check API called');
  
  try {
    const userIdCookie = request.cookies.get('user-id');
    if (!userIdCookie) {
      console.log('No user-id cookie found');
      return NextResponse.json({ 
        valid: false,
        reason: 'not_authenticated',
        message: 'User not authenticated'
      }, { status: 401 });
    }
    
    const userId = userIdCookie.value;
    console.log('Checking subscription for user:', userId);
    
    // Handle potential Prisma errors gracefully
    let subscription;
    try {
      subscription = await prisma.subscription.findUnique({
        where: { userId },
      });
    } catch (prismaError) {
      console.error('Prisma error:', prismaError);
      return NextResponse.json({
        valid: false,
        reason: 'database_error',
        message: 'Error checking subscription status'
      }, { status: 500 });
    }
    
    if (!subscription) {
      console.log('No subscription found for user');
      return NextResponse.json({ 
        valid: false,
        reason: 'no_subscription',
        message: 'Aucun abonnement trouvé'
      });
    }
    
    console.log('Subscription found:', subscription);
    const isExpired = new Date(subscription.nextBillingDate) < new Date();
    console.log('Is subscription expired?', isExpired);
    
    return NextResponse.json({
      valid: !isExpired,
      status: subscription.status,
      nextBillingDate: subscription.nextBillingDate,
      planName: subscription.planName,
      daysRemaining: isExpired ? 0 : Math.ceil((new Date(subscription.nextBillingDate) - new Date()) / (1000 * 60 * 60 * 24))
    });
  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json({ 
      valid: false,
      reason: 'server_error',
      message: 'Error checking subscription'
    }, { status: 500 });
  }
} 