import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
      const userIdCookie = request.cookies.get('user-id');
  try {
    const accounts = await prisma.account.findMany({
      where: {
        userId: userIdCookie.value
      }
  });
    const formattedAccounts = accounts.map((acc) => ({
      id: acc.id,
      name: acc.name,
      email: acc.email,
      isAdmin: acc.auth=== 1 ? true : false,
    }));
    return NextResponse.json({ accounts: formattedAccounts });
  } catch (error) {
    console.error("Error listing accounts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Get user id from cookie, since the user is authenticated.
    const userIdCookie = request.cookies.get('user-id');
    if (!userIdCookie) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }
    const userId = userIdCookie.value;

    const { name, email, password, isAdmin } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Optional: Verify that the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create the account for the existing user
    const newAccount = await prisma.account.create({
      data: {
        name,
        email,
        password, // WARNING: Plain text; hash in production
        auth: isAdmin ? 1 : 0,
        userId,
        fcmToken: [],
        verified: true,
      },
    });

    return NextResponse.json(
      {
        account: {
          id: newAccount.id,
          name: newAccount.name,
          email: newAccount.email,
          isAdmin: newAccount.auth === 1,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating account:", error.stack);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}