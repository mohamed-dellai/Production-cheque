import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendVerificationEmail } from '../../../lib/email';
import { encryptEmail } from '../../../lib/crypto';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, bank, rib, password } = body;

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé.' }, { status: 400 });
    }

    // Check if an account with this email already exists
    const existingAccount = await prisma.account.findUnique({
      where: { email },
    });

    if (existingAccount) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé.' }, { status: 400 });
    }

    // Encrypt email for verification link
    const encryptedEmail = encryptEmail(email);

    // Transaction to create both user and account
    const result = await prisma.$transaction(async (prisma) => {
      // Create the user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          bank: bank || '',
          rib: rib || '',
          password, // Note: In production, you should hash this password
        },
      });

      // Create the account with verified = false
      const newAccount = await prisma.account.create({
        data: {
          name,
          email,
          password, // Should be hashed in production
          auth: 1, // Not an admin by default
          userId: newUser.id,
          fcmToken: [],
          verified: false,
        },
      });
      
      // Create a free 1-week trial subscription
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 days from now
      
      const subscription = await prisma.subscription.create({
        data: {
          userId: newUser.id,
          planName: 'free trial',
          price: 0,
          billingCycle: 'weekly',
          status: 'trialing',
          nextBillingDate: trialEndDate,
        },
      });

      return { user: newUser, account: newAccount, subscription };
    });

    // Send verification email
    await sendVerificationEmail(email, encryptedEmail);

    return NextResponse.json({ 
      message: 'Utilisateur créé avec succès. Veuillez vérifier votre email pour activer votre compte.' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du compte.' }, { status: 500 });
  }
} 