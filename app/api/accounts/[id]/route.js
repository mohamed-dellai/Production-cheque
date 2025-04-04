import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
    const { id: accountId } = await params;
      const userIdCookie = request.cookies.get('user-id');
  if (!userIdCookie) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }
  const userId = userIdCookie.value;

  try {
    const { name, email, password, isAdmin } = await request.json();

    // Verify the account exists and belongs to the authenticated user
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account || account.userId !== userId || account.auth !== 1) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Update the account record
    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: {
        name,
        email,
        ...(password && password.trim() !== "" ? { password } : {}),
        auth: isAdmin ? 1 : 0,
        verified: TRUE,
      },
    });

    return NextResponse.json({
      account: {
        id: updatedAccount.id,
        name: updatedAccount.name,
        email: updatedAccount.email,
        isAdmin: updatedAccount.auth === 1,
      },
    });
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  await params
  const { id } = params;
  const userIdCookie = request.cookies.get('user-id');
  if (!userIdCookie) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }
  const userId = userIdCookie.value;

  try {
    const account = await prisma.account.findUnique({
      where: { id },
    });
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    if (account.userId !== userId || account.auth !== 1) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Delete the account record
    await prisma.account.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Account deleted" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}