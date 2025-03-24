import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import admin from '../../../../utils/firebaseAdmin';


console.log(admin)
const prisma = new PrismaClient();

export async function GET() {
  try {
    const now = new Date();
    
    const usersWithOverdueCheques = await prisma.user.findMany({
      where: {
        account: {
          some: {
            cheques: {
              some: {
                date: {
                  lt: now.toISOString()
                },
                status: {
                  not: 'encaisse'
                }
              }
            }
          }
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        account: {
          where: {
            cheques: {
              some: {
                date: {
                  lt: now.toISOString()
                },
                status: {
                  not: 'encaisse'
                }
              }
            }
          },
          select: {
            id: true,
            fcmToken: true,
            cheques: {
              where: {
                date: {
                  lt: now.toISOString()
                },
                status: {
                  not: 'encaisse'
                }
              }
            }
          }
        }
      }
    });
    const userNotifications = usersWithOverdueCheques.map(user => ({
      userId: user.id,
      email: user.email,
      name: user.name,
      fcmTokens: Array.from(new Set(
        user.account.flatMap(account => account.fcmToken || [])
      )),
      overdueCount: user.account.reduce((sum, acc) => sum + acc.cheques.length, 0)
    }));
for (const user of userNotifications) {
  if (user.fcmTokens.length > 0) {
    const message = {
      data: {
        title: 'Rappel',
        body: `Vous avez ${user.overdueCount} chèque(s) qui nécessite(nt) votre attention.`
      },
      tokens: user.fcmTokens
    };

    try {
      const res = await admin.messaging().sendEachForMulticast(message);
      console.log(message)
      } catch (error) {
      console.error(`Error sending notification to user ${user.email}:`, error);
    }
  }
}
    return NextResponse.json(userNotifications);
  } catch (error: any) {
    console.error('Error checking overdue cheques:', error.stack);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}