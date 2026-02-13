'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { translateCarDescription, retryTranslationAction, checkTranslationConfig } from '@/lib/translate';

const carSchema = z.object({
    make: z.string().min(1, 'Make is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.coerce.number().min(1900, 'Year must be valid'),
    price: z.coerce.number().min(0, 'Price must be positive'),
    condition: z.string().min(1, 'Condition is required'),
    images: z.array(z.string()).min(1, 'At least one image is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    fuelType: z.string().optional(),
    transmission: z.string().optional(),
    bodyType: z.string().optional(),
    steering: z.string().optional(),
    mileage: z.coerce.number().optional(),
    engineCapacity: z.string().optional(),
    colour: z.string().optional(),
    driveType: z.string().optional(),
    doors: z.coerce.number().optional(),
    seats: z.coerce.number().optional(),
    location: z.string().optional(),
});

export async function createCar(prevState: any, formData: FormData) {
    const validatedFields = carSchema.safeParse({
        make: formData.get('make'),
        model: formData.get('model'),
        year: formData.get('year'),
        price: formData.get('price'),
        condition: formData.get('condition'),
        images: formData.getAll('images'),
        description: formData.get('description'),
        fuelType: formData.get('fuelType'),
        transmission: formData.get('transmission'),
        bodyType: formData.get('bodyType'),
        steering: formData.get('steering'),
        mileage: formData.get('mileage'),
        engineCapacity: formData.get('engineCapacity'),
        colour: formData.get('colour'),
        driveType: formData.get('driveType'),
        doors: formData.get('doors'),
        seats: formData.get('seats'),
        location: formData.get('location'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Car.',
        };
    }

    let carId: string;

    try {
        // Generate customId
        const lastCar = await prisma.car.findFirst({
            where: { customId: { startsWith: 'CE-' } },
            orderBy: { customId: 'desc' },
        });

        let nextId = 1001;
        if (lastCar && lastCar.customId) {
            const lastNumber = parseInt(lastCar.customId.split('-')[1]);
            if (!isNaN(lastNumber)) {
                nextId = lastNumber + 1;
            }
        }
        const customId = `CE-${nextId}`;

        const car = await prisma.car.create({
            data: {
                ...validatedFields.data,
                customId,
            },
        });
        carId = car.id;
    } catch (error) {
        console.error('CREATE_CAR_ERROR:', error);
        return {
            message: 'Database Error: Failed to Create Car.',
        };
    }

    // Optional translation: only if enabled via form
    const enableTranslations = formData.get('enableTranslations') === 'true';
    if (enableTranslations && validatedFields.data.description) {
        const config = await checkTranslationConfig();
        if (config.isConfigured) {
            translateCarDescription(carId, validatedFields.data.description).catch((err) => {
                console.error('TRANSLATION_ERROR:', err);
            });
        }
    }

    revalidatePath('/admin/cars');
    redirect('/admin/cars');
}

export async function updateCar(id: string, prevState: any, formData: FormData) {
    const validatedFields = carSchema.safeParse({
        make: formData.get('make'),
        model: formData.get('model'),
        year: formData.get('year'),
        price: formData.get('price'),
        condition: formData.get('condition'),
        images: formData.getAll('images'),
        description: formData.get('description'),
        fuelType: formData.get('fuelType'),
        transmission: formData.get('transmission'),
        bodyType: formData.get('bodyType'),
        steering: formData.get('steering'),
        mileage: formData.get('mileage'),
        engineCapacity: formData.get('engineCapacity'),
        colour: formData.get('colour'),
        driveType: formData.get('driveType'),
        doors: formData.get('doors'),
        seats: formData.get('seats'),
        location: formData.get('location'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Car.',
        };
    }

    try {
        // Fetch current car to check if description changed
        const existingCar = await prisma.car.findUnique({ where: { id } });

        await prisma.car.update({
            where: { id },
            data: validatedFields.data,
        });

        // Re-translate only if description changed AND enabled
        const enableTranslations = formData.get('enableTranslations') === 'true';
        const descriptionChanged = existingCar && existingCar.description !== validatedFields.data.description;

        if (enableTranslations && descriptionChanged && validatedFields.data.description) {
            const config = await checkTranslationConfig();
            if (config.isConfigured) {
                translateCarDescription(id, validatedFields.data.description).catch((err) => {
                    console.error('TRANSLATION_UPDATE_ERROR:', err);
                });
            }
        }
    } catch (error) {
        console.error('UPDATE_CAR_ERROR:', error);
        return {
            message: 'Database Error: Failed to Update Car.',
        };
    }

    revalidatePath('/admin/cars');
    redirect('/admin/cars');
}

export async function deleteCar(id: string) {
    try {
        await prisma.car.delete({
            where: { id },
        });
        revalidatePath('/admin/cars');
        return { message: 'Deleted Car.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Car.' };
    }
}

/**
 * Retry translation for a single car + locale combination
 */
export async function retryTranslation(carId: string, locale: string) {
    const result = await retryTranslationAction(carId, locale);
    revalidatePath('/admin/cars');
    return result;
}

/**
 * Retry all failed/missing translations for a specific car
 */
export async function retryAllTranslations(carId: string) {
    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
        return { success: false, error: 'Car not found' };
    }

    const results = await translateCarDescription(carId, car.description);
    revalidatePath('/admin/cars');
    return {
        success: results.every((r) => r.success),
        results,
    };
}

/**
 * Update a car translation manually (admin edit)
 */
export async function updateTranslation(carId: string, locale: string, description: string) {
    try {
        await prisma.carTranslation.upsert({
            where: { carId_locale: { carId, locale } },
            create: {
                carId,
                locale,
                description,
                status: 'COMPLETED',
            },
            update: {
                description,
                status: 'COMPLETED',
            },
        });
        revalidatePath('/admin/cars');
        return { success: true };
    } catch (error) {
        console.error('UPDATE_TRANSLATION_ERROR:', error);
        return { success: false, error: 'Failed to update translation' };
    }
}

