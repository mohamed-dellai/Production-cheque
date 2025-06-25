import { NextResponse } from "next/server";
import { generateToken } from '../../../lib/jwt';
import { PrismaClient } from '@prisma/client';

export async function POST(request) {
    const prisma = new PrismaClient();
  
    const data = await request.json();
    const { email, password, fcmToken } = data;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    try {
      var account = await prisma.account.findFirst({
        where: { email: data.email },
        include: { user: true },
      });
    } catch (error) {
      console.log('Error:', error.stack)
      return NextResponse.json({ error: 'erreur de serveur' }, { status: 500 });
    }

    try {
      if (!account) {
        return NextResponse.json({ error: "compte not found" }, { status: 404 });
      }

      if (!account.verified) {
        return NextResponse.json({ error: "Veuillez vérifier votre adresse email avant de vous connecter." }, { status: 401 });
      }

      if (account.password !== password) {
        return NextResponse.json({ error: "Mot de pass incorrect" }, { status: 401 });
      }

      if (!account.user) {
        return NextResponse.json({ error: "email introvable" }, { status: 500 });
      }

      // If FCM token is provided, update the account's fcmToken array
      if (fcmToken) {
        await prisma.account.update({
          where: { id: account.id },
          data: {
            fcmToken: {
              set: Array.from(new Set([...account.fcmToken, fcmToken]))
            }
          }
        });
      }

      const token = await generateToken(account);

      const response = NextResponse.json({ token }, { status: 200 });
      response.cookies.set('user-id', account.user.id, { httpOnly: true });
      response.cookies.set('account-id', account.id, { httpOnly: true });

      return response;

    } catch (error) {
      console.log('Error:', error);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
}