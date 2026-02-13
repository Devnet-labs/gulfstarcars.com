import { PrismaClient } from '@prisma/client';
import { translateAllCarFields } from '../lib/translate';

const prisma = new PrismaClient();

async function backfillTranslations() {
    try {
        console.log('Starting translation backfill...');

        // Get all cars
        const cars = await prisma.car.findMany({
            include: {
                translations: true,
            },
        });

        console.log(`Found ${cars.length} cars to check.`);

        let successCount = 0;
        let failCount = 0;

        for (const car of cars) {
            console.log(`Processing car: ${car.make} ${car.model} (${car.id})`);

            try {
                // Determine if we need to re-translate
                // We re-translate if:
                // 1. No translations exist
                // 2. Existing translations are missing new fields (naive check: just re-run for simplicity as Groq is fast/cheap)

                await translateAllCarFields(car.id, {
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
                console.log(`  ✓ Translations updated for ${car.id}`);
                successCount++;

                // Rate limit to be safe (though Groq has high limits)
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                console.error(`  ✗ Failed to translate ${car.id}:`, error);
                failCount++;
            }
        }

        console.log('\nBackfill completed!');
        console.log(`Success: ${successCount}`);
        console.log(`Failed: ${failCount}`);

    } catch (error) {
        console.error('Backfill script error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

backfillTranslations();
