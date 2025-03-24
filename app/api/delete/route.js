import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req, res) {
  const accountId = req.cookies.get('account-id');
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  try {
    const account = await prisma.account.findUnique({
      where: { id: accountId.value },
    });
    console.log(account)
    if (account.auth !== 1) {
      return NextResponse.json({ error: 'Only admin accounts can delete a cheque' }, { status: 403 });
    }

    await prisma.cheque.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Cheque deleted' });
  } catch (error) {
    console.error('Error deleting cheque:', error.stack);
    return NextResponse.json({ error: 'Error deleting cheque' }, { status: 500 });
  }
}