'use server';

import { prisma } from '@/lib/db';
import { Car } from '@prisma/client';

const LUXURY_BRANDS = [
    'Mercedes-Benz', 'Mercedes', 'BMW', 'Audi', 'Lexus', 'Porsche',
    'Land Rover', 'Range Rover', 'Bentley', 'Rolls-Royce',
    'Lamborghini', 'Ferrari', 'Maserati', 'Jaguar', 'Cadillac',
    'Tesla', 'Genesis', 'Infiniti', 'Acura'
];

interface LuxuryFilters {
    fuelType?: string[];
    transmission?: string[];
    vehicleType?: string[];
}

export async function getLuxuryCars(filters?: LuxuryFilters): Promise<Car[]> {
    try {
        const where: any = {
            OR: [
                // Luxury brands
                {
                    make: {
                        in: LUXURY_BRANDS,
                        mode: 'insensitive'
                    }
                },
                // OR high-end price
                {
                    price: {
                        gte: 50000
                    }
                }
            ],
            // Only new cars
            condition: {
                equals: 'new',
                mode: 'insensitive'
            },
            isActive: true
        };

        // Apply filters if provided
        if (filters?.fuelType && filters.fuelType.length > 0) {
            where.fuelType = {
                in: filters.fuelType,
                mode: 'insensitive'
            };
        }

        if (filters?.transmission && filters.transmission.length > 0) {
            where.transmission = {
                in: filters.transmission,
                mode: 'insensitive'
            };
        }

        if (filters?.vehicleType && filters.vehicleType.length > 0) {
            where.bodyType = {
                in: filters.vehicleType,
                mode: 'insensitive'
            };
        }

        const cars = await prisma.car.findMany({
            where,
            orderBy: {
                price: 'desc' // Show most expensive first
            },
            take: 50 // Limit results
        });

        return cars;
    } catch (error) {
        console.error('Error fetching luxury cars:', error);
        return [];
    }
}

export async function getLuxuryFilterOptions() {
    try {
        const cars = await prisma.car.findMany({
            where: {
                OR: [
                    {
                        make: {
                            in: LUXURY_BRANDS,
                            mode: 'insensitive'
                        }
                    },
                    {
                        price: {
                            gte: 50000
                        }
                    }
                ],
                condition: {
                    equals: 'new',
                    mode: 'insensitive'
                },
                isActive: true
            }
        });

        // Extract unique values with proper typing
        const fuelTypes = [...new Set(cars.map((car: any) => car.fuelType).filter((v: any): v is string => Boolean(v)))];
        const transmissions = [...new Set(cars.map((car: any) => car.transmission).filter((v: any): v is string => Boolean(v)))];
        const bodyTypes = [...new Set(cars.map((car: any) => car.bodyType).filter((v: any): v is string => Boolean(v)))];

        return {
            fuelTypes: fuelTypes.sort(),
            transmissions: transmissions.sort(),
            vehicleTypes: bodyTypes.sort()
        };
    } catch (error) {
        console.error('Error fetching filter options:', error);
        return {
            fuelTypes: [] as string[],
            transmissions: [] as string[],
            vehicleTypes: [] as string[]
        };
    }
}
