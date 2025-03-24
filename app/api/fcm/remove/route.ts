import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const accountId = request.cookies.get('account-id');
    const { fcmToken } = await request.json();

    if (!accountId || !fcmToken) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    const account = await prisma.account.findUnique({
      where: { id: accountId.value }
    });

    await prisma.account.update({
      where: { id: accountId.value },
      data: {
        fcmToken: account?.fcmToken.filter((token: string) => token !== fcmToken)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error removing FCM token:', error.stack);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 