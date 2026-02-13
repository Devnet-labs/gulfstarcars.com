'use server';

import { prisma } from '@/lib/db';

export async function getLatestCars(locale?: string) {
    try {
        const cars = await prisma.car.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            take: 6,
            include: {
                translations: locale && locale !== 'en'
                    ? { where: { locale, status: 'COMPLETED' } }
                    : false,
            },
        });
        return cars;
    } catch (error) {
        console.error('Error fetching latest cars:', error);
        return [];
    }
}
