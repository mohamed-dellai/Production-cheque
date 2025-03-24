import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
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
          type: "a-payer",
          status: "en-attente"
        },
        select: {
          id: true,
          amount: true,
          date: true,
        },
      });
      return NextResponse.json(cheques);
    } catch (error: any) {
      console.error('Error fetching cheques:', error.stack);
      return NextResponse.json({ error: 'Error fetching cheques' }, { status: 500 });
    }
  }
  