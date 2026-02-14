'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

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
    status: z.string().default('AVAILABLE'),
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
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Car.',
        };
    }

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

        // Logic: if status is SOLD or RESERVED, isActive should be false
        let isActive = validatedFields.data.isActive;
        if (validatedFields.data.status === 'SOLD' || validatedFields.data.status === 'RESERVED') {
            isActive = false;
        }

        const car = await prisma.car.create({
            data: {
                ...validatedFields.data,
                isActive,
                price: validatedFields.data.price ?? null,
                customId,
            } as any,
        });

        revalidatePath('/admin/cars');
        revalidatePath('/admin/cars/inventory');
        revalidatePath(`/admin/cars/${car.id}`);
        redirect(`/admin/cars/${car.id}?message=created`);
    } catch (error) {
        console.error('CREATE_CAR_ERROR:', error);
        return {
            message: 'Database Error: Failed to Create Car.',
        };
    }
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
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Car.',
        };
    }

    try {
        // Logic: if status is SOLD or RESERVED, isActive should be false
        let isActive = validatedFields.data.isActive;
        if (validatedFields.data.status === 'SOLD' || validatedFields.data.status === 'RESERVED') {
            isActive = false;
        }

        await prisma.car.update({
            where: { id },
            data: {
                ...validatedFields.data,
                isActive,
                price: validatedFields.data.price ?? null,
            } as any,
        });

        revalidatePath('/admin/cars');
        revalidatePath('/admin/cars/inventory');
        revalidatePath(`/admin/cars/${id}`);
        redirect(`/admin/cars/${id}?message=updated`);
    } catch (error) {
        console.error('UPDATE_CAR_ERROR extended:', error);
        return {
            message: `Database Error: Failed to Update Car. Details: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
}

export async function deleteCar(id: string) {
    try {
        await prisma.car.delete({
            where: { id },
        });
        revalidatePath('/admin/cars');
        revalidatePath('/admin/cars/inventory');
        return { message: 'Deleted Car.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Car.' };
    }
}

/**
 * Toggle car visibility (active/inactive)
 */
export async function toggleCarVisibility(id: string, isActive: boolean) {
    try {
        await prisma.car.update({
            where: { id },
            data: { isActive } as Record<string, unknown>,
        });
        revalidatePath('/admin/cars');
        revalidatePath('/admin/cars/inventory');
        revalidatePath('/cars');
        return { success: true };
    } catch (error) {
        console.error('TOGGLE_VISIBILITY_ERROR:', error);
        return { success: false, error: 'Failed to toggle visibility' };
    }
}

