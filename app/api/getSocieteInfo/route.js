import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function GET(request,response){
    const userId = request.cookies.get('user-id');
    console.log(userId);

    try{
        const societe =await prisma.user.findUnique({
            where: {
                id: userId.value,
            },
            select: {
              name: true,
              rib: true,
              bank: true,
            },
          });
          return NextResponse.json(societe,{status:200})

    }
    
    catch(error){
        console.log(error.stack);
        return NextResponse.json({error: 'Server error'},{status:500});
    }
}