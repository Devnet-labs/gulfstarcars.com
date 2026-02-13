'use server';

import { prisma } from '@/lib/db';

export async function getCarById(id: string, locale?: string) {
    try {
        const car = await prisma.car.findUnique({
            where: { id },
            include: {
                translations: locale && locale !== 'en'
                    ? { where: { locale, status: 'COMPLETED' } }
                    : false,
            },
        });
        return car;
    } catch (error) {
        console.error('Error fetching car by id:', error);
        return null;
    }
}
