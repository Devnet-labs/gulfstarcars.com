const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const languages = [
    { code: 'en', name: 'English', nativeName: 'English', isDefault: true },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', isDefault: false },
    { code: 'fr', name: 'French', nativeName: 'Français', isDefault: false },
    { code: 'es', name: 'Spanish', nativeName: 'Español', isDefault: false },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', isDefault: false },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', isDefault: false },
    { code: 'zh', name: 'Chinese', nativeName: '中文', isDefault: false },
];

async function seedLanguages() {
    console.log('🌍 Seeding supported languages...\n');

    for (const lang of languages) {
        const result = await prisma.supportedLanguage.upsert({
            where: { code: lang.code },
            create: lang,
            update: {
                name: lang.name,
                nativeName: lang.nativeName,
                isDefault: lang.isDefault,
            },
        });
        console.log(`  ✅ ${result.code} → ${result.name} (${result.nativeName})${result.isDefault ? ' [DEFAULT]' : ''}`);
    }

    console.log(`\n🎉 Seeded ${languages.length} languages successfully!`);
}

seedLanguages()
    .catch((e) => {
        console.error('❌ Error seeding languages:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
