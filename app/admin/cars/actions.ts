'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { translateAllCarFields, retryTranslationAction, checkTranslationConfig, updateTranslationField } from '@/lib/translate';

const carSchema = z.object({
    make: z.string().min(1, 'Make is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.coerce.number().min(1900, 'Year must be valid'),
    price: z.preprocess((val) => (val === '' || val === null ? undefined : val), z.coerce.number().min(0, 'Price must be positive').optional().nullable()),
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
    isActive: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(true),
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
                price: validatedFields.data.price ?? null,
                customId,
            } as any,
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
    if (enableTranslations) {
        const config = await checkTranslationConfig();
        if (config.isConfigured) {
            // Translate all fields using Groq
            translateAllCarFields(carId, {
                make: validatedFields.data.make,
                model: validatedFields.data.model,
                description: validatedFields.data.description,
                bodyType: validatedFields.data.bodyType || null,
                fuelType: validatedFields.data.fuelType || null,
                steering: validatedFields.data.steering || null,
                transmission: validatedFields.data.transmission || null,
                engineCapacity: validatedFields.data.engineCapacity || null,
                colour: validatedFields.data.colour || null,
                driveType: validatedFields.data.driveType || null,
                location: validatedFields.data.location || null,
            }).catch((err) => {
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
        isActive: formData.get('isActive') === 'true',
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
            data: {
                ...validatedFields.data,
                price: validatedFields.data.price ?? null,
            } as any,
        });

        // Re-translate only if description changed AND enabled
        const enableTranslations = formData.get('enableTranslations') === 'true';
        const descriptionChanged = existingCar && existingCar.description !== validatedFields.data.description;

        if (enableTranslations && descriptionChanged && validatedFields.data.description) {
            const config = await checkTranslationConfig();
            if (config.isConfigured) {
                translateAllCarFields(id, {
                    make: validatedFields.data.make,
                    model: validatedFields.data.model,
                    description: validatedFields.data.description,
                    bodyType: validatedFields.data.bodyType || null,
                    fuelType: validatedFields.data.fuelType || null,
                    steering: validatedFields.data.steering || null,
                    transmission: validatedFields.data.transmission || null,
                    engineCapacity: validatedFields.data.engineCapacity || null,
                    colour: validatedFields.data.colour || null,
                    driveType: validatedFields.data.driveType || null,
                    location: validatedFields.data.location || null,
                }).catch((err: any) => {
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

    const results = await translateAllCarFields(carId, {
        make: car.make,
        model: car.model,
        description: car.description,
        bodyType: car.bodyType,
        fuelType: car.fuelType,
        steering: car.steering,
        transmission: car.transmission,
        engineCapacity: car.engineCapacity,
        colour: car.colour,
        driveType: car.driveType,
        location: car.location,
    });
    revalidatePath('/admin/cars');
    return {
        success: results.every((r: any) => r.success),
        results,
    };
}

/**
 * Update a car translation manually (admin edit)
 */
export async function updateTranslation(carId: string, locale: string, field: string, value: string) {
    try {
        const updateData: any = {};
        updateData[field] = value;
        updateData.status = 'COMPLETED';

        await prisma.carTranslation.upsert({
            where: { carId_locale: { carId, locale } },
            create: {
                carId,
                locale,
                [field]: value,
                status: 'COMPLETED',
            },
            update: updateData,
        });
        revalidatePath('/admin/cars');
        return { success: true };
    } catch (error) {
        console.error('UPDATE_TRANSLATION_ERROR:', error);
        return { success: false, error: 'Failed to update translation' };
    }
}

/**
 * Toggle car visibility (active/inactive)
 */
export async function toggleCarVisibility(id: string, isActive: boolean) {
    try {
        await prisma.car.update({
            where: { id },
            data: { isActive },
        });
        revalidatePath('/admin/cars');
        revalidatePath('/cars');
        return { success: true };
    } catch (error) {
        console.error('TOGGLE_VISIBILITY_ERROR:', error);
        return { success: false, error: 'Failed to toggle visibility' };
    }
}

