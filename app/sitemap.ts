import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { siteConfig } from '@/lib/metadata';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.url;
    const languages = siteConfig.languages;

    // Static pages with their relative priorities
    const staticPages = [
        { path: '', priority: 1.0, changeFrequency: 'daily' as const },
        { path: '/cars', priority: 0.9, changeFrequency: 'daily' as const },
        { path: '/luxury', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
        { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
        { path: '/faq', priority: 0.6, changeFrequency: 'monthly' as const },
    ];

    // Generate URLs for all languages
    const staticUrls: MetadataRoute.Sitemap = [];

    for (const lang of languages) {
        for (const page of staticPages) {
            staticUrls.push({
                url: `${baseUrl}/${lang}${page.path}`,
                lastModified: new Date(),
                changeFrequency: page.changeFrequency,
                priority: page.priority,
            });
        }
    }

    // Get all active cars from database
    let carUrls: MetadataRoute.Sitemap = [];
    try {
        const cars = await prisma.car.findMany({
            where: { isActive: true },
            select: {
                id: true,
                updatedAt: true,
            },
        });

        carUrls = cars.flatMap((car: { id: string; updatedAt: Date }) =>
            languages.map((lang) => ({
                url: `${baseUrl}/${lang}/cars/${car.id}`,
                lastModified: car.updatedAt,
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }))
        );
    } catch (error) {
        console.error('Error fetching cars for sitemap:', error);
    }

    return [...staticUrls, ...carUrls];
}
