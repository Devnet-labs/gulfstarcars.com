---
description: How to add new content with multi-language support (i18n)
---

# Adding Translated Content Workflow

Follow this process whenever you need to add new text or components to the application to ensure they support all languages (English, Arabic, French, Spanish, Portuguese, Russian).

## 1. Identify Content
Identify the static text strings in your component (e.g., `components/MyNewFeature.tsx`).

## 2. Update English Translations (`messages/en.json`)
Add a new section or keys to `messages/en.json`. Use a hierarchical structure.

```json
// messages/en.json
{
  "myNewFeature": {
    "title": "New Feature Title",
    "description": "This is a description."
  }
}
```

## 3. Update Other Languages (CRITICAL STEP)
You **MUST** add the same keys to ALL other language files (`ar.json`, `fr.json`, `es.json`, `pt.json`, `ru.json`).
**Failure to do this will result in raw keys (e.g., `myNewFeature.title`) appearing in the UI for users of those languages.**

### Translation Strategy:
1.  **Arabic (`ar.json`)**: Translate fully using a translator. Remember RTL context.
2.  **Other Languages (`fr`, `es`, `pt`, `ru`)**: 
    - Translate values if possible.
    - **Edge Case:** If a translation is not immediately available, you MUST use the **English text** as a placeholder value. **DO NOT leave the key missing.**
    - Example (if French translation is missing):
      ```json
      "myNewFeature": {
        "title": "New Feature Title", // Kept in English temporarily
        "description": "This is a description."
      }
      ```

**Files to update:**
- `messages/ar.json` (Arabic)
- `messages/fr.json` (French)
- `messages/es.json` (Spanish)
- `messages/pt.json` (Portuguese)
- `messages/ru.json` (Russian)

## 4. Implement in Component
Use `useTranslations` hook to fetch the text.

```tsx
import { useTranslations } from 'next-intl';

export function MyNewFeature() {
  const t = useTranslations('myNewFeature');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

## 5. Verify (Mandatory)
Check that the text appears correctly in **ALL** supported languages. Do not assume if it works in English/Arabic it works everywhere.

- English: `http://localhost:3000/en`
- Arabic: `http://localhost:3000/ar` (Check RTL layout)
- French: `http://localhost:3000/fr` (Check for raw keys or English placeholders)
- Spanish: `http://localhost:3000/es`
- Portuguese: `http://localhost:3000/pt`
- Russian: `http://localhost:3000/ru`

## 6. Troubleshooting
- **Raw Keys (e.g., `myNewFeature.title`):** Correct keys are definitely missing in that specific language file. Add them immediately.
- **English Text in translation:** You likely used English as a placeholder. Replace with correct translation.
