import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const chequeId = url.searchParams.get('chequeId');
    
    if (!chequeId) {
      return NextResponse.json({ error: 'Cheque ID not provided' }, { status: 400 });
    }

    // Query the cheque information from the database
    const cheque = await prisma.cheque.findUnique({
      where: { id: parseInt(chequeId) },
      include: { account: true } // Include related account information
    });

    if (!cheque) {
      return NextResponse.json({ error: 'Cheque not found' }, { status: 404 });
    }

    // Get the account information from the cheque
    const account = cheque.account;

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Return the account information
    return NextResponse.json(account);
  } catch (error) {
    console.error('Error fetching account info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
