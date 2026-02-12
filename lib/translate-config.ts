// Translation configuration constants
// This file is NOT a server action file, so it can export non-function values

export const LOCALE_TO_DEEPL: Record<string, string> = {
    ar: 'AR',
    fr: 'FR',
    es: 'ES',
    pt: 'PT-BR',
    ru: 'RU',
    zh: 'ZH',
};

// All non-English locales we support
export const TARGET_LOCALES = Object.keys(LOCALE_TO_DEEPL);

// DeepL API configuration
export const getDeepLConfig = () => ({
    apiUrl: process.env.DEEPL_API_FREE === 'true'
        ? 'https://api-free.deepl.com/v2/translate'
        : 'https://api.deepl.com/v2/translate',
    apiKey: process.env.DEEPL_API_KEY || '',
    isConfigured: Boolean(process.env.DEEPL_API_KEY),
});
