import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(documents);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, content, owner, isShared } = await req.json();
    const newDoc = await prisma.document.create({
      data: {
        title: title || 'Untitled Document',
        content: content || '',
        owner: owner || 'User (You)',
        isShared: isShared || false,
      },
    });
    return NextResponse.json(newDoc);
  } catch {
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}