import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendVerificationEmail } from '../../../lib/email';
import { encryptEmail } from '../../../lib/crypto';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    // Find account by email
    const account = await prisma.account.findUnique({
      where: { email },
    });

    if (!account) {
      // Don't reveal whether the account exists for security reasons
      return NextResponse.json({ message: 'Si votre email existe dans notre système, un nouveau lien de vérification vous a été envoyé.' });
    }

    if (account.verified) {
      return NextResponse.json({ error: 'Ce compte est déjà vérifié. Veuillez vous connecter.' }, { status: 400 });
    }

    // Encrypt email for verification link
    const encryptedEmail = encryptEmail(email);

    // Send new verification email
    await sendVerificationEmail(email, encryptedEmail);

    return NextResponse.json({ message: 'Un nouveau lien de vérification a été envoyé à votre adresse email.' });
  } catch (error) {
    console.error('Error resending verification email:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'envoi du lien de vérification.' }, { status: 500 });
  }
} 