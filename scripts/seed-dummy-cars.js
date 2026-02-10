const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const dummyCars = [
    {
        make: 'Toyota',
        model: 'Land Cruiser 300',
        year: 2024,
        price: 85000,
        description: 'New model Toyota Land Cruiser 300 series. Top of the line luxury SUV.',
        condition: 'New',
        bodyType: 'SUV',
        fuelType: 'Diesel',
        mileage: 0,
        transmission: 'Automatic',
        engineCapacity: '3.3L',
        status: 'AVAILABLE',
        location: 'Dubai Port'
    },
    {
        make: 'Mercedes-Benz',
        model: 'G63 AMG',
        year: 2023,
        price: 210000,
        description: 'Brabus tuned Mercedes G63 AMG. High performance luxury off-roader.',
        condition: 'Used',
        bodyType: 'SUV',
        fuelType: 'Petrol',
        mileage: 5000,
        transmission: 'Automatic',
        engineCapacity: '4.0L V8',
        status: 'AVAILABLE',
        location: 'Ras Al Khor'
    },
    {
        make: 'Lexus',
        model: 'LX600',
        year: 2024,
        price: 135000,
        description: 'Lexus LX600 VIP Edition. The pinnacle of Japanese luxury.',
        condition: 'New',
        bodyType: 'SUV',
        fuelType: 'Petrol',
        mileage: 0,
        transmission: 'Automatic',
        engineCapacity: '3.5L V6',
        status: 'AVAILABLE',
        location: 'Dubai Port'
    },
    {
        make: 'Nissan',
        model: 'Patrol Nismo',
        year: 2023,
        price: 95000,
        description: 'Nissan Patrol Nismo Edition. Sporty and powerful SUV.',
        condition: 'New',
        bodyType: 'SUV',
        fuelType: 'Petrol',
        mileage: 0,
        transmission: 'Automatic',
        engineCapacity: '5.6L V8',
        status: 'RESERVED',
        location: 'Dubai Automarket'
    },
    {
        make: 'Range Rover',
        model: 'Autobiography',
        year: 2024,
        price: 185000,
        description: 'All-new Range Rover Autobiography. Luxury redefined.',
        condition: 'New',
        bodyType: 'SUV',
        fuelType: 'Petrol',
        mileage: 0,
        transmission: 'Automatic',
        engineCapacity: '4.4L V8',
        status: 'AVAILABLE',
        location: 'Dubai Port'
    },
    {
        make: 'BMW',
        model: 'X7 M60i',
        year: 2023,
        price: 115000,
        description: 'BMW X7 M60i. Ultimate driving machine in an SUV form.',
        condition: 'Used',
        bodyType: 'SUV',
        fuelType: 'Petrol',
        mileage: 12000,
        transmission: 'Automatic',
        engineCapacity: '4.4L V8',
        status: 'AVAILABLE',
        location: 'Ras Al Khor'
    },
    {
        make: 'Audi',
        model: 'RSQ8',
        year: 2023,
        price: 145000,
        description: 'Audi RSQ8. High performance SUV with RS race DNA.',
        condition: 'New',
        bodyType: 'SUV',
        fuelType: 'Petrol',
        mileage: 0,
        transmission: 'Automatic',
        engineCapacity: '4.0L V8',
        status: 'AVAILABLE',
        location: 'Dubai Port'
    },
    {
        make: 'Porsche',
        model: 'Cayenne Turbo GT',
        year: 2024,
        price: 230000,
        description: 'Porsche Cayenne Turbo GT. The fastest SUV on the Nürburgring.',
        condition: 'New',
        bodyType: 'SUV',
        fuelType: 'Petrol',
        mileage: 0,
        transmission: 'Automatic',
        engineCapacity: '4.0L V8',
        status: 'AVAILABLE',
        location: 'Dubai Port'
    },
    {
        make: 'Mercedes-Benz',
        model: 'S580 Maybach',
        year: 2023,
        price: 250000,
        description: 'Mercedes-Benz S580 Maybach. Unmatched luxury and comfort.',
        condition: 'New',
        bodyType: 'Luxury Sedan',
        fuelType: 'Petrol/Hybrid',
        mileage: 0,
        transmission: 'Automatic',
        engineCapacity: '4.0L V8',
        status: 'AVAILABLE',
        location: 'Dubai Port'
    },
    {
        make: 'Rolls-Royce',
        model: 'Cullinan',
        year: 2022,
        price: 450000,
        description: 'Rolls-Royce Cullinan. Effortless everywhere.',
        condition: 'Used',
        bodyType: 'SUV',
        fuelType: 'Petrol',
        mileage: 8000,
        transmission: 'Automatic',
        engineCapacity: '6.75L V12',
        status: 'AVAILABLE',
        location: 'Dubai Marina'
    }
];

async function seed() {
    console.log('Starting seed...');

    // Get last stock ID number from backfill logic or just start high
    // CE-1001, CE-1002 etc.
    const lastCar = await prisma.car.findFirst({
        where: { customId: { startsWith: 'GS-' } },
        orderBy: { customId: 'desc' }
    });

    let nextId = 1001;
    if (lastCar && lastCar.customId) {
        const currentId = parseInt(lastCar.customId.split('-')[1]);
        if (!isNaN(currentId)) {
            nextId = currentId + 1;
        }
    }

    for (const car of dummyCars) {
        const stockId = `GS-${nextId++}`;
        await prisma.car.create({
            data: {
                ...car,
                customId: stockId,
                images: ['https://images.unsplash.com/photo-1563720360172-67b8f3dce741?auto=format&fit=crop&w=800&q=80'] // Placeholder luxury car fleet image
            }
        });
        console.log(`Created car: ${car.make} ${car.model} with ID ${stockId}`);
    }

    console.log('Seed completed successfully!');
    await prisma.$disconnect();
}

seed().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
