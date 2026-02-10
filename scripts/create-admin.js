const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];
    const password = process.argv[3];
    const name = process.argv[4] || 'Admin';

    if (!email || !password) {
        console.log('❌ Usage: node scripts/create-admin.js <email> <password> [name]');
        console.log('Example: node scripts/create-admin.js admin@test.com mypassword123 "Admin User"');
        process.exit(1);
    }

    // Basic check for environment
    if (!process.env.DATABASE_URL) {
        console.warn('⚠️  Warning: DATABASE_URL not found in environment.');
    }

    try {
        console.log(`⏳ Attempting to create/update admin: ${email}...`);

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                name: name
            },
            create: {
                email,
                password: hashedPassword,
                name: name
            }
        });

        console.log('✅ Success! Admin user created/updated:');
        console.log(`   - Email: ${user.email}`);
        console.log(`   - Name : ${user.name}`);
    } catch (error) {
        console.error('❌ Error creating admin user:');
        console.error(error.message);
        if (error.code === 'P1001') {
            console.error('   Hint: Could not connect to database. Check your DATABASE_URL and internet connection.');
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
