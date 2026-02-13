import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const car = await prisma.car.findUnique({
            where: { id },
            select: {
                id: true,
                make: true,
                model: true,
                year: true,
                description: true,
            },
        });

        if (!car) {
            return NextResponse.json({ error: 'Car not found' }, { status: 404 });
        }

        const translations = await (prisma as any).carTranslation.findMany({
            where: { carId: id },
            orderBy: { locale: 'asc' },
        });

        return NextResponse.json({ car, translations });
    } catch (error) {
        console.error('Error fetching translations:', error);
        return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 });
    }
}
