import { Metadata } from 'next';

export const siteConfig = {
    name: 'Gulf Star Cars',
    description: 'Premium car export service from UAE to worldwide destinations. Quality vehicles, competitive prices, and reliable global shipping.',
    url: 'https://gulfstarcars.com',
    ogImage: '/images/og-image.jpg',
    keywords: [
        'car export',
        'UAE car export',
        'international car shipping',
        'luxury cars UAE',
        'used cars export',
        'car export service',
        'Dubai car export',
        'global car shipping',
        'export vehicles',
        'car dealership UAE'
    ],
    languages: ['en', 'fr', 'pt', 'es', 'ru', 'ar'],
    defaultLanguage: 'en',
};

export function generateMetadata({
    title,
    description,
    image,
    url,
    type = 'website',
    locale = 'en',
}: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    locale?: string;
}): Metadata {
    const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
    const metaDescription = description || siteConfig.description;
    const metaImage = image || siteConfig.ogImage;
    const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;

    return {
        title: metaTitle,
        description: metaDescription,
        keywords: siteConfig.keywords,
        authors: [{ name: siteConfig.name }],
        creator: siteConfig.name,
        publisher: siteConfig.name,
        metadataBase: new URL(siteConfig.url),
        alternates: {
            canonical: metaUrl,
            languages: {
                'en': '/en',
                'fr': '/fr',
                'pt': '/pt',
                'es': '/es',
                'ru': '/ru',
                'ar': '/ar',
            },
        },
        openGraph: {
            type,
            locale,
            url: metaUrl,
            title: metaTitle,
            description: metaDescription,
            siteName: siteConfig.name,
            images: [
                {
                    url: metaImage,
                    width: 1200,
                    height: 630,
                    alt: metaTitle,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images: [metaImage],
            creator: '@gulfstarcars',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        icons: {
            icon: '/icon.png',
            shortcut: '/icon.png',
            apple: '/icon.png',
        },
    };
}

export function generateCarMetadata(car: {
    make: string;
    model: string;
    year: number;
    price: number | null;
    description: string;
    images: string[];
    id: string;
    locale?: string;
}) {
    const title = `${car.year} ${car.make} ${car.model}`;
    const priceTag = car.price ? ` Export Price: $${car.price.toLocaleString()}` : '';
    const description = `${car.description.substring(0, 155)}...${priceTag}`;
    const image = car.images[0] || siteConfig.ogImage;
    const url = `/cars/${car.id}`;

    return generateMetadata({
        title,
        description,
        image,
        url,
        type: 'article',
        locale: car.locale || 'en',
    });
}

export function generateStructuredData(type: 'Organization' | 'Product', data: any) {
    if (type === 'Organization') {
        return {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: siteConfig.name,
            url: siteConfig.url,
            logo: `${siteConfig.url}/images/portfolio/logo/logo.png`,
            description: siteConfig.description,
            address: {
                '@type': 'PostalAddress',
                addressCountry: 'AE',
                addressRegion: 'Dubai',
            },
            contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+971-XX-XXX-XXXX',
                contactType: 'Customer Service',
            },
            sameAs: [
                'https://www.facebook.com/gulfstarcars',
                'https://www.instagram.com/gulfstarcars',
                'https://twitter.com/gulfstarcars',
            ],
        };
    }

    if (type === 'Product' && data) {
        return {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: `${data.year} ${data.make} ${data.model}`,
            description: data.description,
            image: data.images,
            brand: {
                '@type': 'Brand',
                name: data.make,
            },
            offers: {
                '@type': 'Offer',
                price: data.price || undefined,
                priceCurrency: data.price ? 'USD' : undefined,
                availability: 'https://schema.org/InStock',
                url: `${siteConfig.url}/cars/${data.id}`,
            },
            vehicleConfiguration: data.transmission || 'Automatic',
            fuelType: data.fuelType || 'Petrol',
            mileageFromOdometer: {
                '@type': 'QuantitativeValue',
                value: data.mileage || 0,
                unitCode: 'KMT',
            },
            productionDate: data.year.toString(),
            color: data.colour,
        };
    }

    return null;
}
