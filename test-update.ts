
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Get a car to update
    const car = await prisma.car.findFirst();
    if (!car) {
        console.error('No car found');
        return;
    }

    console.log('Updating car:', car.id, car.make, car.model);

    try {
        // Mock data similar to what updateCar produces
        const updateData = {
            make: 'Toyota',
            model: 'Camry',
            year: 2024,
            price: 55000,
            condition: 'New',
            images: [
                "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            ],
            description: 'This is a test update description that is long enough.',
            fuelType: 'Petrol',
            transmission: 'Automatic',
            bodyType: 'Sedan',
            steering: 'LHD',
            mileage: 100,
            engineCapacity: '2.5L',
            colour: 'White',
            driveType: 'FWD',
            doors: 4,
            seats: 5,
            location: 'Dubai',
            isActive: true,
        };

        const updatedCar = await prisma.car.update({
            where: { id: car.id },
            data: {
                ...updateData,
                price: updateData.price ?? null,
            } as any,
        });

        console.log('Update successful:', updatedCar.id);
    } catch (error) {
        console.error('Update failed:', error);
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
