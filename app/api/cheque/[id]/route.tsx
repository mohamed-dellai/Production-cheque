import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle GET (Read by ID)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const userId=request.cookies.get('user-id');
  if(userId===undefined){
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }
  try {
    const cheque = await prisma.cheque.findUnique({
      where: { id: parseInt(id), userId: userId.value },
    });

    if (!cheque) {
      return NextResponse.json({ error: 'Cheque not found' }, { status: 404 });
    }

    return NextResponse.json(cheque);
  } catch (error) {
    console.error('Error fetching cheque:', error);
    return NextResponse.json({ error: 'Error fetching cheque' }, { status: 500 });
  }
}

// Handle PUT (Update by ID)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const body = await request.json();
  try {
    const updatedCheque = await prisma.cheque.update({
      where: { id: parseInt(id) },
      data: body,
    });

    return NextResponse.json(updatedCheque);
  } catch (error) {
    console.error('Error updating cheque:', error);
    return NextResponse.json({ error: 'Error updating cheque' }, { status: 500 });
  }
}

// Handle DELETE (Delete by ID)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  try {
    await prisma.cheque.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Cheque deleted' });
  } catch (error) {
    console.error('Error deleting cheque:', error);
    return NextResponse.json({ error: 'Error deleting cheque' }, { status: 500 });
  }
}
