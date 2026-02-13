import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const member = await prisma.teamMember.create({
      data: {
        name: data.name,
        position: data.position,
        bio: data.bio,
        image: data.image || null,
        linkedIn: data.linkedIn || null,
        email: data.email || null,
        website: data.website || null,
        order: data.order || 0,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}
