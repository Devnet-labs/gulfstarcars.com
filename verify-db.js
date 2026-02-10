
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const cars = await prisma.car.findMany();
        console.log('Cars in DB:', cars.length);
        if (cars.length > 0) {
            console.log('First car:', cars[0]);
        } else {
            console.log('No cars found in DB.');
        }
    } catch (e) {
        console.error('Error fetching cars:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
