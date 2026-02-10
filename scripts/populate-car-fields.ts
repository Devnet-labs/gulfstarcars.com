import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const engineCapacities = ['1.5L', '2.0L', '2.5L', '3.0L', '3.5L', '4.0L', '5.0L'];
const colours = ['White', 'Black', 'Silver', 'Grey', 'Blue', 'Red', 'Green', 'Brown'];
const driveTypes = ['2WD', '4WD', 'AWD'];
const locations = ['Dubai', 'Tokyo', 'Singapore', 'Hong Kong', 'Bangkok'];

async function populateCarFields() {
    try {
        // Get all cars
        const cars = await prisma.car.findMany();

        console.log(`Found ${cars.length} cars to update...`);

        for (const car of cars) {
            // Generate random values
            const randomEngine = engineCapacities[Math.floor(Math.random() * engineCapacities.length)];
            const randomColour = colours[Math.floor(Math.random() * colours.length)];
            const randomDrive = driveTypes[Math.floor(Math.random() * driveTypes.length)];
            const randomDoors = Math.random() > 0.5 ? 4 : 2;
            const randomSeats = randomDoors === 4 ? 5 : 2;
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];

            // Update the car
            await prisma.car.update({
                where: { id: car.id },
                data: {
                    engineCapacity: randomEngine,
                    colour: randomColour,
                    driveType: randomDrive,
                    doors: randomDoors,
                    seats: randomSeats,
                    location: randomLocation,
                },
            });

            console.log(`✓ Updated ${car.make} ${car.model} (${car.year})`);
        }

        console.log('\n✅ All cars updated successfully!');
    } catch (error) {
        console.error('Error updating cars:', error);
    } finally {
        await prisma.$disconnect();
    }
}

populateCarFields();
