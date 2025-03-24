import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle POST (Create) and GET (Read All for a specific user)
export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    // Retrieve the user ID from cookies
    const userId = request.cookies.get('user-id');
    const accountId = request.cookies.get('account-id');
    if (!userId || !accountId) {
      console.warn('User not authenticated');
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }


    const chequeData = {
      ...body,
      userId: userId.value,
      accountId: accountId.value
    };

    const cheque = await prisma.cheque.create({
      data: chequeData
    });

    return NextResponse.json(cheque, { status: 201 });
  } catch (error: any) {
    console.error('Error creating cheque:', error.stack);
    return NextResponse.json({ error: 'Error creating cheque' }, { status: 500 });
  }
}

/**
 * Handle GET (Read All for a specific user)
 * @returns A JSON response containing the user's cheques
 * @throws {Error} If the user is not authenticated
 * @throws {Error} If there is an error fetching the cheques
 */
export async function GET(request: NextRequest) {
  try {
    // Retrieve the user ID from cookies
    const userId = request.cookies.get('user-id');

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const cheques = await prisma.cheque.findMany({
      where: {
        userId: userId.value,
      },
    });
    return NextResponse.json(cheques);
  } catch (error) {
    console.error('Error fetching cheques:', error);
    return NextResponse.json({ error: 'Error fetching cheques' }, { status: 500 });
  }
}
