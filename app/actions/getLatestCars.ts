'use server';

import { prisma } from '@/lib/db';
import { Car } from '@prisma/client';

export async function getLatestCars(): Promise<Car[]> {
    try {
        const cars = await prisma.car.findMany({
            orderBy: { createdAt: 'desc' },
            take: 6,
        });
        return cars;
    } catch (error) {
        console.error('Error fetching latest cars:', error);
        return [];
    }
}
