import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = request.cookies.get('user-id');

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const payment = await prisma.payment.create({
      data: {
        paymentRef: body.paymentRef,
        userId: userId.value,
        amount: body.amount,
        paymentMethod: 'konnect',
        status: 'pending',
        transactionDate: new Date(),
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Error creating payment' }, { status: 500 });
  }
}