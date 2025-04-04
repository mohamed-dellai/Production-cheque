import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { decryptEmail } from '../../../lib/crypto';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Code de vérification manquant.' }, { status: 400 });
    }

    // Decrypt the email from the code
    const email = decryptEmail(code);
    
    if (!email) {
      return NextResponse.redirect(new URL('/verification-failed', request.url));
    }

    // Find the account with this email
    const account = await prisma.account.findUnique({
      where: { 
        email,
        verified: false // Account not already verified
      }
    });

    if (!account) {
      return NextResponse.redirect(new URL('/verification-failed', request.url));
    }

    // Update account to verified
    await prisma.account.update({
      where: { id: account.id },
      data: {
        verified: true
      }
    });

    // Redirect to success page
    return NextResponse.redirect(new URL('/verification-success', request.url));
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.redirect(new URL('/verification-failed', request.url));
  }
} 