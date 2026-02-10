const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const luxuryCar = await prisma.car.findFirst({
        where: {
            OR: [
                { make: { contains: 'Toyota', mode: 'insensitive' } },
                { price: { gte: 50000 } }
            ]
        }
    });

    if (luxuryCar) {
        console.log('Found luxury car:', luxuryCar.make, luxuryCar.model);
        await prisma.car.update({
            where: { id: luxuryCar.id },
            data: {
                fuelType: 'Petrol',
                transmission: 'Automatic',
                bodyType: 'SUV',
                steering: 'LHD',
                mileage: 0
            }
        });
        console.log('Updated car with filter specs.');
    } else {
        console.log('No luxury car found to update.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
