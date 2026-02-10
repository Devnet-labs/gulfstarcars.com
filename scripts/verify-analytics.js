const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAnalyticsStats() {
    try {
        console.log("Fetching analytics stats...");

        // 1. Total Visits
        console.log("1. Counting total visits...");
        const totalVisits = await prisma.visit.count();
        console.log("   - Total Visits:", totalVisits);

        // 2. Top Countries
        console.log("2. Fetching top countries...");
        const topCountriesRaw = await prisma.visit.groupBy({
            by: ['country'],
            _count: {
                country: true,
            },
            orderBy: {
                _count: {
                    country: 'desc',
                },
            },
            take: 5,
        });

        const topCountries = topCountriesRaw.map(item => ({
            country: item.country,
            count: item._count.country
        }));

        console.log("   - Top Countries:", topCountries);
        console.log("✅ Analytics queries successful.");

    } catch (error) {
        console.error("❌ Failed to fetch analytics stats:");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

getAnalyticsStats();
