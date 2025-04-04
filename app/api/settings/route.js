import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, rib, bank, password } = body;

        // Get user id from secure cookie (set by your auth middleware)
        const userIdCookie = request.cookies.get('user-id');
        if (!userIdCookie) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }
        const userId = userIdCookie.value;

        // Update user info in the database
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                rib,
                bank,
                password  // Note: storing plain text is not recommended in production
            }
        });

        return NextResponse.json({ message: 'User settings updated', user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error updating user settings:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}