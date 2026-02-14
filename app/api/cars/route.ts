import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const cars = await prisma.car.findMany({
            where: { isActive: true, status: 'AVAILABLE' },
            orderBy: { createdAt: 'desc' },
        });

        if (cars.length > 0) {
            return NextResponse.json(cars);
        }

        return NextResponse.json([]);
    } catch (e) {
        console.error("Database connection failed or empty:", e);
        return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
    }
};


