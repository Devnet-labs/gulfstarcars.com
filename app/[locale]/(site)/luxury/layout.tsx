import { generateListingMetadata } from '@/lib/metadata';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.luxury' });

    return generateListingMetadata({
        title: t('title'),
        description: t('description'),
        locale,
        path: '/luxury',
    });
}

export default function LuxuryLayout({ children }: { children: React.ReactNode }) {
    return children;
}
