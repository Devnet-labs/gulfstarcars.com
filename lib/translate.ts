'use server';

import { prisma } from './db';
import { LOCALE_TO_DEEPL, TARGET_LOCALES, getDeepLConfig } from './translate-config';
import { translateWithGroq, TranslatableCarFields, checkGroqConfig } from './groq-translate';

/**
 * Check translation configuration (Groq or DeepL)
 */
export async function checkTranslationConfig(): Promise<{
    isConfigured: boolean;
    service: 'groq' | 'deepl' | 'none';
    error?: string;
}> {
    // Check Groq first (primary)
    const groqCheck = await checkGroqConfig();
    if (groqCheck.isConfigured) {
        return { isConfigured: true, service: 'groq' };
    }

    // Check DeepL (fallback)
    const deeplConfig = getDeepLConfig();
    if (deeplConfig.isConfigured) {
        return { isConfigured: true, service: 'deepl' };
    }

    return {
        isConfigured: false,
        service: 'none',
        error: 'Neither GROQ_API_KEY nor DEEPL_API_KEY configured'
    };
}

/**
 * Translate car fields using Groq API (all 11 fields to 6 languages in one call)
 * Falls back to DeepL if Groq fails
 */
export async function translateAllCarFields(
    carId: string,
    fields: TranslatableCarFields
): Promise<Array<{ locale: string; success: boolean; error?: string }>> {
    const results: Array<{ locale: string; success: boolean; error?: string }> = [];

    try {
        // Try Groq first (primary service)
        console.log('🚀 Attempting translation with Groq...');
        const translations = await translateWithGroq(fields, TARGET_LOCALES);

        // Store each locale's translation
        for (const locale of TARGET_LOCALES) {
            const localeTranslation = translations[locale as keyof typeof translations];

            if (!localeTranslation) {
                console.warn(`Missing translation for locale: ${locale}`);
                results.push({ locale, success: false, error: 'Missing translation in Groq response' });
                continue;
            }

            try {
                await prisma.carTranslation.upsert({
                    where: { carId_locale: { carId, locale } },
                    create: {
                        carId,
                        locale,
                        make: localeTranslation.make || null,
                        brand: localeTranslation.brand || null,
                        model: localeTranslation.model || null,
                        description: localeTranslation.description || null,
                        bodyType: localeTranslation.bodyType || null,
                        fuelType: localeTranslation.fuelType || null,
                        steering: localeTranslation.steering || null,
                        transmission: localeTranslation.transmission || null,
                        engineCapacity: localeTranslation.engineCapacity || null,
                        colour: localeTranslation.colour || null,
                        driveType: localeTranslation.driveType || null,
                        location: localeTranslation.location || null,
                        status: 'COMPLETED',
                    },
                    update: {
                        make: localeTranslation.make || null,
                        brand: localeTranslation.brand || null,
                        model: localeTranslation.model || null,
                        description: localeTranslation.description || null,
                        bodyType: localeTranslation.bodyType || null,
                        fuelType: localeTranslation.fuelType || null,
                        steering: localeTranslation.steering || null,
                        transmission: localeTranslation.transmission || null,
                        engineCapacity: localeTranslation.engineCapacity || null,
                        colour: localeTranslation.colour || null,
                        driveType: localeTranslation.driveType || null,
                        location: localeTranslation.location || null,
                        status: 'COMPLETED',
                    },
                });

                results.push({ locale, success: true });
                console.log(`✅ Saved ${locale} translation`);
            } catch (dbError) {
                console.error(`Database error for ${locale}:`, dbError);
                results.push({ locale, success: false, error: 'Database save failed' });
            }
        }

        return results;
    } catch (groqError) {
        console.error('❌ Groq translation failed:', groqError);

        // Fallback to DeepL for description only
        const deeplConfig = getDeepLConfig();
        if (deeplConfig.isConfigured && fields.description) {
            console.log('🔄 Falling back to DeepL for description translation...');
            return await translateDescriptionWithDeepL(carId, fields.description);
        }

        // Mark all as failed if no fallback
        return TARGET_LOCALES.map(locale => ({
            locale,
            success: false,
            error: 'Groq failed and no DeepL fallback available',
        }));
    }
}

/**
 * DeepL fallback for description only (legacy support)
 */
async function translateDescriptionWithDeepL(
    carId: string,
    description: string
): Promise<Array<{ locale: string; success: boolean; error?: string }>> {
    const results: Array<{ locale: string; success: boolean; error?: string }> = [];
    const config = getDeepLConfig();

    for (const locale of TARGET_LOCALES) {
        const deeplLang = LOCALE_TO_DEEPL[locale];
        if (!deeplLang) continue;

        try {
            const response = await fetch(config.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `DeepL-Auth-Key ${config.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: [description],
                    source_lang: 'EN',
                    target_lang: deeplLang,
                }),
            });

            if (!response.ok) {
                throw new Error(`DeepL API returned ${response.status}`);
            }

            const data = await response.json();
            const translatedText = data.translations?.[0]?.text;

            if (translatedText) {
                await prisma.carTranslation.upsert({
                    where: { carId_locale: { carId, locale } },
                    create: {
                        carId,
                        locale,
                        description: translatedText,
                        status: 'COMPLETED',
                    },
                    update: {
                        description: translatedText,
                        status: 'COMPLETED',
                    },
                });

                results.push({ locale, success: true });
            } else {
                results.push({ locale, success: false, error: 'No translation from DeepL' });
            }
        } catch (error) {
            console.error(`DeepL error for ${locale}:`, error);
            results.push({
                locale,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    return results;
}

/**
 * Retry translation for a single locale
 */
export async function retryTranslationAction(
    carId: string,
    locale: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const car = await prisma.car.findUnique({ where: { id: carId } });
        if (!car) {
            return { success: false, error: 'Car not found' };
        }

        // Build fields object
        const fields: TranslatableCarFields = {
            make: car.make,
            model: car.model,
            description: car.description,
            bodyType: car.bodyType,
            fuelType: car.fuelType,
            steering: car.steering,
            transmission: car.transmission,
            engineCapacity: car.engineCapacity,
            colour: car.colour,
            driveType: car.driveType,
            location: car.location,
        };

        // Translate using Groq
        const translations = await translateWithGroq(fields, [locale]);
        const localeTranslation = translations[locale as keyof typeof translations];

        if (!localeTranslation) {
            return { success: false, error: 'Translation failed' };
        }

        await prisma.carTranslation.upsert({
            where: { carId_locale: { carId, locale } },
            create: {
                carId,
                locale,
                make: localeTranslation.make || null,
                brand: localeTranslation.brand || null,
                model: localeTranslation.model || null,
                description: localeTranslation.description || null,
                bodyType: localeTranslation.bodyType || null,
                fuelType: localeTranslation.fuelType || null,
                steering: localeTranslation.steering || null,
                transmission: localeTranslation.transmission || null,
                engineCapacity: localeTranslation.engineCapacity || null,
                colour: localeTranslation.colour || null,
                driveType: localeTranslation.driveType || null,
                location: localeTranslation.location || null,
                status: 'COMPLETED',
            },
            update: {
                make: localeTranslation.make || null,
                brand: localeTranslation.brand || null,
                model: localeTranslation.model || null,
                description: localeTranslation.description || null,
                bodyType: localeTranslation.bodyType || null,
                fuelType: localeTranslation.fuelType || null,
                steering: localeTranslation.steering || null,
                transmission: localeTranslation.transmission || null,
                engineCapacity: localeTranslation.engineCapacity || null,
                colour: localeTranslation.colour || null,
                driveType: localeTranslation.driveType || null,
                location: localeTranslation.location || null,
                status: 'COMPLETED',
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Retry translation error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Update a single translation field manually (admin edit)
 */
export async function updateTranslationField(
    carId: string,
    locale: string,
    fieldName: keyof TranslatableCarFields,
    value: string | null
): Promise<{ success: boolean; error?: string }> {
    try {
        const updateData: any = {};
        updateData[fieldName] = value;

        await prisma.carTranslation.upsert({
            where: { carId_locale: { carId, locale } },
            create: {
                carId,
                locale,
                [fieldName]: value,
                status: 'COMPLETED',
            },
            update: updateData,
        });

        return { success: true };
    } catch (error) {
        console.error('Update translation field error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
