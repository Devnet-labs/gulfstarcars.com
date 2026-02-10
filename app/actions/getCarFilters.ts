'use server';

import { prisma } from '@/lib/db';

export async function getUniqueMakes() {
    try {
        const cars = await prisma.car.findMany({
            select: {
                make: true,
            },
            distinct: ['make'],
            orderBy: {
                make: 'asc',
            },
        });
        return cars.map((car) => car.make);
    } catch (error) {
        console.error('Error fetching makes:', error);
        return [];
    }
}

export async function getModelsByMake(make: string) {
    try {
        const cars = await prisma.car.findMany({
            where: {
                make: {
                    equals: make,
                    mode: 'insensitive', // Handle case variations
                },
            },
            select: {
                model: true,
            },
            distinct: ['model'],
            orderBy: {
                model: 'asc',
            },
        });
        return cars.map((car) => car.model);
    } catch (error) {
        console.error(`Error fetching models for make ${make}:`, error);
        return [];
    }
}

export async function getYearRange() {
    try {
        const aggregate = await prisma.car.aggregate({
            _min: {
                year: true,
            },
            _max: {
                year: true,
            },
        });
        return {
            min: aggregate._min.year || 1990,
            max: aggregate._max.year || new Date().getFullYear() + 1,
        };
    } catch (error) {
        console.error('Error fetching year range:', error);
        return { min: 1990, max: new Date().getFullYear() + 1 };
    }
}
