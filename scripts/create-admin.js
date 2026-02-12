const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    const email = process.argv[2] || 'admin@gulfstarcars.com';
    const password = process.argv[3] || 'admin123';

    if (!email || !password) {
        console.log('Usage: node scripts/create-admin.js <email> <password>');
        process.exit(1);
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
            },
            create: {
                email,
                password: hashedPassword,
                name: 'Admin',
            },
        });

        console.log(`✅ Admin user created/updated:`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${password}`);
    } catch (e) {
        console.error('❌ Failed to create admin user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
