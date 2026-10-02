import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    return NextResponse.json(document);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, content, isShared } = await req.json();
    const updatedDoc = await prisma.document.update({
      where: { id },
      data: { title, content, isShared },
    });
    return NextResponse.json(updatedDoc);
  } catch {
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.document.delete({ where: { id } });
    return NextResponse.json({ message: 'Document deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}