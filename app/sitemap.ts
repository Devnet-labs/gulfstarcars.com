import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { siteConfig } from '@/lib/metadata';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = siteConfig.url;
    const languages = siteConfig.languages;

    // Static pages
    const staticPages = ['', '/cars', '/about', '/faq', '/contact', '/luxury'];

    // Generate URLs for all languages
    const staticUrls: MetadataRoute.Sitemap = [];

    for (const lang of languages) {
        for (const page of staticPages) {
            staticUrls.push({
                url: `${baseUrl}/${lang}${page}`,
                lastModified: new Date(),
                changeFrequency: page === '' ? 'daily' : 'weekly',
                priority: page === '' ? 1 : 0.8,
            });
        }
    }

    // Get all cars from database
    let carUrls: MetadataRoute.Sitemap = [];
    try {
        const cars = await prisma.car.findMany({
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
