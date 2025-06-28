import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import admin from '../../../../utils/firebaseAdmin';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const now = new Date();
    // Find all cheques that are overdue (date < now and status != 'encaisse')
    const overdueCheques = await prisma.cheque.findMany({
      where: {
        date: { lt: now },
        status: { not: 'encaisse' }
      },
      select: {
        id: true,
        number: true,
        amount: true,
        date: true,
        status: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        account: {
          select: {
            fcmToken: true
          }
        }
      }
    });

    // Send notification for each cheque (if FCM tokens exist)
    const notificationResults = [];
    for (const cheque of overdueCheques) {
      const tokens = cheque.account?.fcmToken || [];
      if (tokens.length > 0) {
        const message = {
          data: {
            title: 'Rappel',
            body: `Chèque n°${cheque.number} de ${cheque.amount} DH est en retard.`
          },
          tokens
        };
        try {
          const res = await admin.messaging().sendEachForMulticast(message);
          notificationResults.push({
            chequeId: cheque.id,
            user: cheque.user?.email,
            sent: res.successCount,
            failed: res.failureCount
          });
        } catch (error) {
          notificationResults.push({
            chequeId: cheque.id,
            user: cheque.user?.email,
            sent: 0,
            failed: tokens.length,
            error: String(error)
          });
        }
      } else {
        notificationResults.push({
          chequeId: cheque.id,
          user: cheque.user?.email,
          sent: 0,
          failed: 0,
          error: 'No FCM tokens'
        });
      }
    }

    return NextResponse.json({ overdueCheques, notificationResults }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}