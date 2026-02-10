'use server';

import { prisma } from '@/lib/db';
import { Car } from '@prisma/client';

export async function getCarById(id: string): Promise<Car | null> {
    try {
        const car = await prisma.car.findUnique({
            where: { id }
        });
        return car;
    } catch (error) {
        console.error('Error fetching car by id:', error);
        return null;
    }
}
