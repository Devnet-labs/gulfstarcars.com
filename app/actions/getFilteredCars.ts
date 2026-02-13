'use server';

import { prisma } from '@/lib/db';
import { Car } from '@prisma/client';

interface InventoryFilters {
    make?: string[];
    fuelType?: string[];
    transmission?: string[];
    vehicleType?: string[];
    colour?: string[];
    driveType?: string[];
    engineCapacity?: string[];
    location?: string[];
    make?: string[];
}

export async function getFilteredCars(filters?: InventoryFilters, locale?: string) {
    try {
        const where: any = {
            isActive: true
        };

        // Apply filters if provided
        if (filters?.make && filters.make.length > 0) {
            where.make = {
                in: filters.make,
                mode: 'insensitive'
            };
        }

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

        if (filters?.colour && filters.colour.length > 0) {
            where.colour = {
                in: filters.colour,
                mode: 'insensitive'
            };
        }

        if (filters?.driveType && filters.driveType.length > 0) {
            where.driveType = {
                in: filters.driveType,
                mode: 'insensitive'
            };
        }

        if (filters?.engineCapacity && filters.engineCapacity.length > 0) {
            where.engineCapacity = {
                in: filters.engineCapacity,
                mode: 'insensitive'
            };
        }

        if (filters?.location && filters.location.length > 0) {
            where.location = {
                in: filters.location,
                mode: 'insensitive'
            };
        }

        if (filters?.make && filters.make.length > 0) {
            where.make = {
                in: filters.make,
                mode: 'insensitive'
            };
        }

        const cars = await prisma.car.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                translations: locale && locale !== 'en'
                    ? { where: { locale, status: 'COMPLETED' } }
                    : false,
            },
        });

        return cars;
    } catch (error) {
        console.error('Error fetching filtered cars:', error);
        return [];
    }
}

export async function getInventoryFilterOptions() {
    try {
        const cars = await prisma.car.findMany({
            where: { isActive: true },
            select: {
                make: true,
                fuelType: true,
                transmission: true,
                bodyType: true,
                colour: true,
                driveType: true,
                engineCapacity: true,
                location: true,
            }
        });

        // Calculate make counts
        const makeCounts = cars.reduce((acc: any, car: any) => {
            if (car.make) {
                acc[car.make] = (acc[car.make] || 0) + 1;
            }
            return acc;
        }, {});

        const makes = Object.entries(makeCounts)
            .map(([make, count]) => ({ make, count: count as number }))
            .sort((a, b) => b.count - a.count);

        // Extract unique values with proper typing
        const fuelTypes = [...new Set(cars.map((car: any) => car.fuelType).filter((v: any): v is string => Boolean(v)))];
        const transmissions = [...new Set(cars.map((car: any) => car.transmission).filter((v: any): v is string => Boolean(v)))];
        const bodyTypes = [...new Set(cars.map((car: any) => car.bodyType).filter((v: any): v is string => Boolean(v)))];
        const colours = [...new Set(cars.map((car: any) => car.colour).filter((v: any): v is string => Boolean(v)))];
        const driveTypes = [...new Set(cars.map((car: any) => car.driveType).filter((v: any): v is string => Boolean(v)))];
        const engineCapacities = [...new Set(cars.map((car: any) => car.engineCapacity).filter((v: any): v is string => Boolean(v)))];
        const locations = [...new Set(cars.map((car: any) => car.location).filter((v: any): v is string => Boolean(v)))];

        return {
            makes,
            fuelTypes: fuelTypes.sort(),
            transmissions: transmissions.sort(),
            vehicleTypes: bodyTypes.sort(),
            colours: colours.sort(),
            driveTypes: driveTypes.sort(),
            engineCapacities: engineCapacities.sort(),
            locations: locations.sort()
        };
    } catch (error) {
        console.error('Error fetching inventory filter options:', error);
        return {
            makes: [],
            fuelTypes: [] as string[],
            transmissions: [] as string[],
            vehicleTypes: [] as string[],
            colours: [] as string[],
            driveTypes: [] as string[],
            engineCapacities: [] as string[],
            locations: [] as string[]
        };
    }
}
