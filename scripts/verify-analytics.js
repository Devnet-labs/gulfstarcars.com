const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAnalyticsStats() {
    try {
        console.log("Fetching analytics stats...\n");

        // 1. Unique Visitors
        console.log("1. Counting unique visitors...");
        const uniqueVisitors = await prisma.visitor.count();
        console.log("   - Unique Visitors:", uniqueVisitors);

        // 2. Total PageViews
        console.log("2. Counting total pageviews...");
        const totalPageViews = await prisma.pageView.count();
        console.log("   - Total PageViews:", totalPageViews);

        // 3. Active Sessions (last 30 min)
        console.log("3. Counting active sessions...");
        const sessionCutoff = new Date(Date.now() - 30 * 60 * 1000);
        const activeSessions = await prisma.session.count({
            where: { lastActivityAt: { gte: sessionCutoff } },
        });
        console.log("   - Active Sessions:", activeSessions);

        // 4. Total Sessions
        console.log("4. Counting total sessions...");
        const totalSessions = await prisma.session.count();
        console.log("   - Total Sessions:", totalSessions);

        // 5. Top Countries
        console.log("5. Fetching top countries...");
        const topCountriesRaw = await prisma.visitor.groupBy({
            by: ['country'],
            _count: { country: true },
            orderBy: { _count: { country: 'desc' } },
            take: 5,
        });
        const topCountries = topCountriesRaw.map(item => ({
            country: item.country,
            count: item._count.country,
        }));
        console.log("   - Top Countries:", topCountries);

        // 6. Top Pages
        console.log("6. Fetching top pages...");
        const topPagesRaw = await prisma.pageView.groupBy({
            by: ['path'],
            _count: { path: true },
            orderBy: { _count: { path: 'desc' } },
            take: 5,
        });
        const topPages = topPagesRaw.map(item => ({
            path: item.path,
            count: item._count.path,
        }));
        console.log("   - Top Pages:", topPages);

        console.log("\n✅ Analytics queries successful.");

    } catch (error) {
        console.error("❌ Failed to fetch analytics stats:");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

getAnalyticsStats();
