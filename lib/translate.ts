'use server';

import { LOCALE_TO_DEEPL, TARGET_LOCALES, getDeepLConfig } from './translate-config';

/**
 * Translate text using DeepL API
 */
export async function translateText(
    text: string,
    targetLang: string
): Promise<{ translation: string; success: boolean; error?: string }> {
    const deeplLang = LOCALE_TO_DEEPL[targetLang];
    if (!deeplLang) {
        return { translation: '', success: false, error: `Unsupported locale: ${targetLang}` };
    }

    const config = getDeepLConfig();
    if (!config.isConfigured) {
        return { translation: '', success: false, error: 'DEEPL_API_KEY not configured' };
    }

    try {
        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${config.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: [text],
                source_lang: 'EN',
                target_lang: deeplLang,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`DeepL API error (${response.status}):`, errorBody);
            return {
                translation: '',
                success: false,
                error: `DeepL API returned ${response.status}`,
            };
        }

        const data = await response.json();
        const translatedText = data.translations?.[0]?.text;

        if (!translatedText) {
            return { translation: '', success: false, error: 'No translation returned from DeepL' };
        }

        return { translation: translatedText, success: true };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('DeepL translation error:', errorMsg);
        return { translation: '', success: false, error: errorMsg };
    }
}

/**
 * Check if DeepL API is configured
 */
export async function checkTranslationConfig(): Promise<{ isConfigured: boolean }> {
    const config = getDeepLConfig();
    return { isConfigured: config.isConfigured };
}

/**
 * Translate a car's description to all supported non-English locales.
 * Uses Promise.allSettled so one failure doesn't block others.
 * Returns results per locale for status tracking.
 */
export async function translateCarDescription(
    carId: string,
    description: string
): Promise<{ locale: string; success: boolean; error?: string }[]> {
    const { prisma } = await import('@/lib/db');

    const results = await Promise.allSettled(
        TARGET_LOCALES.map(async (locale) => {
            // Mark as PENDING before translating
            await prisma.carTranslation.upsert({
                where: { carId_locale: { carId, locale } },
                create: {
                    carId,
                    locale,
                    description: '',
                    status: 'PENDING',
                },
                update: {
                    status: 'PENDING',
                },
            });

            const result = await translateText(description, locale);

            if (result.success) {
                await prisma.carTranslation.upsert({
                    where: { carId_locale: { carId, locale } },
                    create: {
                        carId,
                        locale,
                        description: result.translation,
                        status: 'COMPLETED',
                    },
                    update: {
                        description: result.translation,
                        status: 'COMPLETED',
                    },
                });
                return { locale, success: true };
            } else {
                await prisma.carTranslation.upsert({
                    where: { carId_locale: { carId, locale } },
                    create: {
                        carId,
                        locale,
                        description: '',
                        status: 'FAILED',
                    },
                    update: {
                        status: 'FAILED',
                    },
                });
                return { locale, success: false, error: result.error };
            }
        })
    );

    return results.map((result, i) => {
        if (result.status === 'fulfilled') {
            return result.value;
        }
        return {
            locale: TARGET_LOCALES[i],
            success: false,
            error: result.reason?.message || 'Promise rejected',
        };
    });
}

/**
 * Retry translation for a single locale
 */
export async function retryTranslationAction(
    carId: string,
    locale: string
): Promise<{ success: boolean; error?: string }> {
    const { prisma } = await import('@/lib/db');

    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
        return { success: false, error: 'Car not found' };
    }

    const result = await translateText(car.description, locale);

    if (result.success) {
        await prisma.carTranslation.upsert({
            where: { carId_locale: { carId, locale } },
            create: {
                carId,
                locale,
                description: result.translation,
                status: 'COMPLETED',
            },
            update: {
                description: result.translation,
                status: 'COMPLETED',
            },
        });
        return { success: true };
    } else {
        await prisma.carTranslation.update({
            where: { carId_locale: { carId, locale } },
            data: { status: 'FAILED' },
        });
        return { success: false, error: result.error };
    }
}
