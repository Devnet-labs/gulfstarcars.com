//!Backfill translations for existing cars
// Usage: npx tsx scripts/backfill-translations.ts

import { PrismaClient } from '@prisma/client';
import { TARGET_LOCALES, LOCALE_TO_DEEPL, getDeepLConfig } from '../lib/translate-config';

const prisma = new PrismaClient();
const { apiUrl: DEEPL_API_URL, apiKey: DEEPL_API_KEY } = getDeepLConfig();

async function translateText(text: string, targetLang: string): Promise<string | null> {
    if (!DEEPL_API_URL || !DEEPL_API_KEY) {
        console.warn('⚠️  DEEPL_API_KEY not set — skipping translation');
        return null;
    }

    try {
        const res = await fetch(DEEPL_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: [text],
                source_lang: 'EN',
                target_lang: targetLang,
            }),
        });

        if (!res.ok) {
            console.error(`DeepL error: ${res.status} ${res.statusText}`);
            return null;
        }

        const data = await res.json();
        return data.translations?.[0]?.text || null;
    } catch (error) {
        console.error('Translation error:', error);
        return null;
    }
}

async function backfillTranslations() {
    console.log('🚀 Starting translation backfill...\n');

    // Get all cars that have descriptions
    const cars = await prisma.car.findMany({
        where: {
            description: { not: '' },
        },
        select: {
            id: true,
            make: true,
            model: true,
            description: true,
        },
    });

    console.log(`📋 Found ${cars.length} cars to process\n`);

    for (const car of cars) {
        console.log(`\n🚗 ${car.make} ${car.model} (${car.id})`);

        for (const locale of TARGET_LOCALES) {
            // Check if translation already exists
            const existing = await (prisma as any).carTranslation.findFirst({
                where: { carId: car.id, locale },
            });

            if (existing?.status === 'COMPLETED') {
                console.log(`  ✅ ${locale}: Already translated`);
                continue;
            }

            const deeplLang = LOCALE_TO_DEEPL[locale];
            if (!deeplLang) {
                console.log(`  ⚠️  ${locale}: No DeepL mapping, skipping`);
                continue;
            }

            console.log(`  🔄 ${locale}: Translating...`);
            const translated = await translateText(car.description, deeplLang);

            if (translated) {
                await (prisma as any).carTranslation.upsert({
                    where: {
                        carId_locale: { carId: car.id, locale },
                    },
                    update: {
                        description: translated,
                        status: 'COMPLETED',
                    },
                    create: {
                        carId: car.id,
                        locale,
                        description: translated,
                        status: 'COMPLETED',
                    },
                });
                console.log(`  ✅ ${locale}: Done`);
            } else {
                await (prisma as any).carTranslation.upsert({
                    where: {
                        carId_locale: { carId: car.id, locale },
                    },
                    update: {
                        status: 'FAILED',
                    },
                    create: {
                        carId: car.id,
                        locale,
                        description: '',
                        status: 'FAILED',
                    },
                });
                console.log(`  ❌ ${locale}: Failed`);
            }

            // Rate limit: 200ms between requests
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    console.log('\n\n🎉 Backfill complete!');
    await prisma.$disconnect();
}

backfillTranslations().catch(console.error);
