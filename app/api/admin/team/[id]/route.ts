import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();

    const member = await prisma.teamMember.update({
      where: { id: params.id },
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
    console.error('Error updating team member:', error);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.teamMember.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
}
