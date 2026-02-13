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
    brand?: string | null;
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
    brand?: string;
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
    const systemPrompt = `You are a professional automotive translation engine.

Translate all provided car listing fields into these languages:
- Arabic (ar)
- Spanish (es)
- French (fr)
- Portuguese (pt)
- Russian (ru)
- Chinese (zh)

CRITICAL RULES:
1. Maintain luxury automotive tone
2. Keep brand names (make/model) UNCHANGED or transliterate if necessary
3. Translate descriptive terms naturally for each language
4. Preserve technical values exactly (e.g., "3.5L V6" stays "3.5L V6")
5. Return STRICTLY valid JSON only
6. Do NOT include explanations, comments, or markdown
7. If a field is empty/null in input, omit it from output

OUTPUT FORMAT (strict JSON):
{
  "ar": { "make": "...", "model": "...", "description": "...", ... },
  "es": { "make": "...", "model": "...", "description": "...", ... },
  "fr": { "make": "...", "model": "...", "description": "...", ... },
  "pt": { "make": "...", "model": "...", "description": "...", ... },
  "ru": { "make": "...", "model": "...", "description": "...", ... },
  "zh": { "make": "...", "model": "...", "description": "...", ... }
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
