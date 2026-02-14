'use server';

import Groq from 'groq-sdk';
import { TARGET_LOCALES } from './translate-config';

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

// Translatable car fields
export interface TranslatableCarFields {
    make: string;
    model: string;
    description: string;
    bodyType?: string | null;
    fuelType?: string | null;
    steering?: string | null;
    transmission?: string | null;
    engineCapacity?: string | null;
    colour?: string | null;
    driveType?: string | null;
    location?: string | null;
}

// Translation result for a single locale
export interface LocaleTranslation {
    make?: string;
    model?: string;
    description?: string;
    bodyType?: string;
    fuelType?: string;
    steering?: string;
    transmission?: string;
    engineCapacity?: string;
    colour?: string;
    driveType?: string;
    location?: string;
}

// Full translation response
export interface TranslationResponse {
    ar?: LocaleTranslation;
    es?: LocaleTranslation;
    fr?: LocaleTranslation;
    pt?: LocaleTranslation;
    ru?: LocaleTranslation;
    zh?: LocaleTranslation;
}

/**
 * Translate car fields to multiple languages using Groq API
 * Uses llama-3.3-70b-versatile for high-quality translations
 */
export async function translateWithGroq(
    fields: TranslatableCarFields,
    targetLocales: string[] = TARGET_LOCALES
): Promise<TranslationResponse> {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error('GROQ_API_KEY not configured');
    }

    // Build the system prompt
    const systemPrompt = `You are a professional translator for a VEHICLE EXPORT COMPANY. Your task is to translate car listing data so that international buyers (e.g. from Gulf markets, Europe, Asia) can read vehicle specs and descriptions in their language. The input is always a single vehicle listing: brand, model, description, and technical specifications.

INPUT FIELDS (what each field means):
- make: Vehicle manufacturer / brand (e.g. Toyota, BMW, Land Rover).
- model: Model name of the vehicle (e.g. Land Cruiser, X5, Range Rover).
- description: Full listing description – options, features, condition, appeal to buyers. Translate naturally for each language; keep a professional, export-ready tone.
- bodyType: Vehicle body style (e.g. SUV, Sedan, Hatchback, Pickup, Coupe). Use the standard term in the target language.
- fuelType: Fuel type (e.g. Petrol, Diesel, Hybrid, Electric).
- steering: Steering position – LHD (Left-Hand Drive) or RHD (Right-Hand Drive). Use the standard abbreviation or local term.
- transmission: Transmission type (e.g. Automatic, Manual).
- engineCapacity: Engine size (e.g. "3.5L V6", "2.0L"). Keep numbers and units unchanged; translate only if there is a local convention.
- colour: Exterior colour. Translate colour names naturally (e.g. White, Black, Pearl White, Silver).
- driveType: Drivetrain (2WD, 4WD, AWD). Use standard terms or local equivalents.
- location: Port or city where the vehicle is available for export (e.g. Dubai, Singapore). Keep well-known place names recognizable; transliterate if needed for the script.

TARGET LANGUAGES: Arabic (ar), Spanish (es), French (fr), Portuguese (pt), Russian (ru), Chinese (zh).

RULES:
1. Context: This is for vehicle export listings. Use professional, clear language suitable for car buyers and dealers.
2. ALWAYS include "make" and "model" in EVERY locale object. Never omit them.
3. Make and model:
   - Latin-script (es, fr, pt): Use the official or commonly used name in that language when it exists; otherwise keep the original. Do not leave blank.
   - Arabic (ar), Russian (ru), Chinese (zh): Transliterate so the brand and model are readable and correct in that script. Keep global brands recognizable. Never leave make or model empty.
4. Include every non-empty input field in the output. If a spec field (bodyType, fuelType, steering, transmission, engineCapacity, colour, driveType, location) is present in the input, include its translation in each locale. Omit only fields that are missing or null in the input (except make and model, which are always required).
5. Preserve technical values exactly: engine capacity (e.g. "3.5L V6"), drive type codes (2WD, 4WD, AWD), and similar. Do not convert units unless the target language has a strong convention.
6. Return STRICTLY valid JSON only. No explanations, comments, or markdown. No text before or after the JSON.

OUTPUT FORMAT (strict JSON). Every locale object MUST have make and model; include all other fields that appear in the input:
{
  "ar": { "make": "...", "model": "...", "description": "...", "bodyType": "...", "fuelType": "...", ... },
  "es": { "make": "...", "model": "...", "description": "...", "bodyType": "...", "fuelType": "...", ... },
  "fr": { "make": "...", "model": "...", "description": "...", "bodyType": "...", "fuelType": "...", ... },
  "pt": { "make": "...", "model": "...", "description": "...", "bodyType": "...", "fuelType": "...", ... },
  "ru": { "make": "...", "model": "...", "description": "...", "bodyType": "...", "fuelType": "...", ... },
  "zh": { "make": "...", "model": "...", "description": "...", "bodyType": "...", "fuelType": "...", ... }
}`;

    // Build user message with fields
    const userMessage = JSON.stringify(fields, null, 2);

    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage },
            ],
            temperature: 0,
            max_tokens: 8000,
            response_format: { type: 'json_object' },
        });

        const content = completion.choices[0]?.message?.content;

        if (!content) {
            throw new Error('No response from Groq API');
        }

        // Parse JSON response
        const translations: TranslationResponse = JSON.parse(content);

        // Validate that we got all expected locales
        const missingLocales = targetLocales.filter(locale => !translations[locale as keyof TranslationResponse]);
        if (missingLocales.length > 0) {
            console.warn(`Missing translations for locales: ${missingLocales.join(', ')}`);
        }

        return translations;
    } catch (error) {
        console.error('Groq translation error:', error);
        throw new Error(`Groq translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Translate a single field for a specific locale
 */
export async function translateSingleField(
    fieldName: string,
    fieldValue: string,
    targetLocale: string
): Promise<string> {
    const systemPrompt = `You are a professional automotive translator. Translate the following car specification field to ${targetLocale} language. 
    
Rules:
- Maintain luxury automotive tone
- Keep brand names unchanged
- Preserve technical values
- Return ONLY the translated text, no explanations

Field name: ${fieldName}`;

    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: fieldValue },
            ],
            temperature: 0,
            max_tokens: 1000,
        });

        return completion.choices[0]?.message?.content?.trim() || fieldValue;
    } catch (error) {
        console.error(`Single field translation error for ${fieldName}:`, error);
        return fieldValue; // Fallback to original
    }
}

/**
 * Check if Groq API is configured and working
 */
export async function checkGroqConfig(): Promise<{ isConfigured: boolean; error?: string }> {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return { isConfigured: false, error: 'GROQ_API_KEY not set in environment' };
    }

    try {
        // Test with a simple request
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 10,
        });

        if (completion.choices[0]) {
            return { isConfigured: true };
        }

        return { isConfigured: false, error: 'Invalid API response' };
    } catch (error) {
        return {
            isConfigured: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
