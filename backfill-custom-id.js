const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function backfill() {
    try {
        const cars = await prisma.car.findMany({
            where: {
                customId: null
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        console.log(`Found ${cars.length} cars to backfill.`);

        for (let i = 0; i < cars.length; i++) {
            const nextId = 1001 + i;
            const customId = `CE-${nextId}`;

            await prisma.car.update({
                where: { id: cars[i].id },
                data: { customId }
            });
            console.log(`Updated car ${cars[i].id} with customId ${customId}`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

backfill();
