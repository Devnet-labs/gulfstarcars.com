import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/metadata';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api', '/_next', '/login'],
            },
        ],
        sitemap: `${siteConfig.url}/sitemap.xml`,
    };
}
