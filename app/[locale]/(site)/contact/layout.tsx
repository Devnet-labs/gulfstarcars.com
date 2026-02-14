import { generateMetadata as generateMeta } from '@/lib/metadata';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.contact' });

    return generateMeta({
        title: t('title'),
        description: t('description'),
        url: `/${locale}/contact`,
        locale,
    });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
