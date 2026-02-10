const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LUXURY_BRANDS = [
    'Mercedes-Benz', 'Mercedes', 'BMW', 'Audi', 'Lexus', 'Porsche',
    'Land Rover', 'Range Rover', 'Bentley', 'Rolls-Royce',
    'Lamborghini', 'Ferrari', 'Maserati', 'Jaguar', 'Cadillac',
    'Tesla', 'Genesis', 'Infiniti', 'Acura'
];

async function main() {
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
            }
        },
        select: {
            make: true,
            price: true,
            condition: true,
            fuelType: true,
            transmission: true,
            bodyType: true
        }
    });

    console.log('Total cars found:', cars.length);
    cars.forEach(car => {
        console.log(`Car: ${car.make}, Price: ${car.price}, Condition: ${car.condition}, Fuel: ${car.fuelType}, Trans: ${car.transmission}`);
    });

    const fuelTypes = [...new Set(cars.map((car) => car.fuelType).filter((v) => Boolean(v)))];
    const transmissions = [...new Set(cars.map((car) => car.transmission).filter((v) => Boolean(v)))];
    const bodyTypes = [...new Set(cars.map((car) => car.bodyType).filter((v) => Boolean(v)))];

    console.log('Filter Options:', {
        fuelTypes,
        transmissions,
        bodyTypes
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
