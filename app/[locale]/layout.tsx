import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const dmSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-dm-sans",
    weight: ["400", "500", "700"],
});

import { generateMetadata as generateMeta, generateStructuredData, siteConfig } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    return generateMeta({
        title: 'Premium Car Export Service from UAE',
        description: 'Export quality vehicles worldwide from UAE. Competitive prices, reliable shipping, and exceptional service.',
        locale,
    });
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!['en', 'fr', 'pt', 'es', 'ru', 'ar'].includes(locale)) {
        notFound();
    }

    const messages = await getMessages();
    const isRtl = locale === 'ar';

    return (
        <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(generateStructuredData('Organization', null)),
                    }}
                />
            </head>
            <body className={`${dmSans.variable} font-sans antialiased bg-[#0B0F19] text-white`}>
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
