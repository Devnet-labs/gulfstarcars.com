'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Languages, Loader2, RefreshCw, Edit2, X, Check } from 'lucide-react';
import { translateCarAction, retryTranslationAction, updateTranslationLocale } from '@/lib/translate';
import type { TranslatableCarFields } from '@/lib/groq-translate';
import { TARGET_LOCALES } from '@/lib/translate-config';

const LOCALE_LABELS: Record<string, string> = {
    ar: 'Arabic',
    es: 'Spanish',
    fr: 'French',
    pt: 'Portuguese',
    ru: 'Russian',
    zh: 'Chinese',
};

type CarTranslationRow = {
    carId: string;
    locale: string;
    make: string | null;
    model: string | null;
    description: string | null;
    bodyType: string | null;
    fuelType: string | null;
    steering: string | null;
    transmission: string | null;
    engineCapacity: string | null;
    colour: string | null;
    driveType: string | null;
    location: string | null;
    status: string;
};

interface TranslationPanelProps {
    carId: string;
    translations: CarTranslationRow[];
    /** Source car make/model for placeholders and fallback in edit form */
    sourceMake?: string;
    sourceModel?: string;
}

const TRANSLATABLE_FIELD_KEYS: (keyof TranslatableCarFields)[] = [
    'make', 'model', 'description', 'bodyType', 'fuelType', 'steering',
    'transmission', 'engineCapacity', 'colour', 'driveType', 'location',
];

const FIELD_LABELS: Record<string, string> = {
    make: 'Make',
    model: 'Model',
    description: 'Description',
    bodyType: 'Body Type',
    fuelType: 'Fuel Type',
    steering: 'Steering',
    transmission: 'Transmission',
    engineCapacity: 'Engine Capacity',
    colour: 'Colour',
    driveType: 'Drive Type',
    location: 'Location',
};

const TRANSLATE_ALL_CONFIRM_MESSAGE =
    'This will call the translation API (GROQ) to translate this car into all 6 languages. API usage may incur token costs. Continue?';
const RETRY_CONFIRM_MESSAGE =
    'This will call the translation API to retry translation for this language. Continue?';

export default function TranslationPanel({ carId, translations, sourceMake = '', sourceModel = '' }: TranslationPanelProps) {
    const router = useRouter();
    const [translating, setTranslating] = useState(false);
    const [retryingLocale, setRetryingLocale] = useState<string | null>(null);
    const [editingLocale, setEditingLocale] = useState<string | null>(null);
    const [editSaving, setEditSaving] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);
    const [translateResults, setTranslateResults] = useState<Array<{ locale: string; success: boolean; error?: string }> | null>(null);

    const translationByLocale = Object.fromEntries(
        translations.map((t) => [t.locale, t])
    ) as Record<string, CarTranslationRow>;

    const handleTranslateAll = async () => {
        if (!confirm(TRANSLATE_ALL_CONFIRM_MESSAGE)) return;
        setTranslating(true);
        setTranslateResults(null);
        try {
            const results = await translateCarAction(carId);
            setTranslateResults(results);
            router.refresh();
        } catch (err) {
            setTranslateResults([
                { locale: 'all', success: false, error: err instanceof Error ? err.message : 'Translation failed' },
            ]);
        } finally {
            setTranslating(false);
        }
    };

    const handleRetry = async (locale: string) => {
        if (!confirm(RETRY_CONFIRM_MESSAGE)) return;
        setRetryingLocale(locale);
        try {
            await retryTranslationAction(carId, locale);
            router.refresh();
        } catch {
            router.refresh();
        } finally {
            setRetryingLocale(null);
        }
    };

    return (
        <div className="rounded-xl border border-white/5 bg-card/40 backdrop-blur-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Languages className="h-5 w-5 text-primary" />
                    Translations
                </h3>
                <button
                    type="button"
                    onClick={handleTranslateAll}
                    disabled={translating}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {translating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className="h-4 w-4" />
                    )}
                    {translating ? 'Translating…' : 'Translate all'}
                </button>
            </div>

            {translateResults && (
                <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10 text-sm">
                    {translateResults.every((r) => r.success) ? (
                        <p className="text-emerald-400">All locales translated successfully.</p>
                    ) : (
                        <ul className="space-y-1">
                            {translateResults.map((r) => (
                                <li key={r.locale} className={r.success ? 'text-emerald-400' : 'text-amber-400'}>
                                    {LOCALE_LABELS[r.locale] || r.locale}: {r.success ? 'OK' : r.error || 'Failed'}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10 text-left text-muted-foreground">
                            <th className="pb-2 pr-4">Language</th>
                            <th className="pb-2 pr-4">Status</th>
                            <th className="pb-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TARGET_LOCALES.map((locale) => {
                            const row = translationByLocale[locale];
                            const status = row?.status ?? 'PENDING';
                            const isRetrying = retryingLocale === locale;
                            const isEditing = editingLocale === locale;
                            return (
                                <React.Fragment key={locale}>
                                    <tr className="border-b border-white/5">
                                        <td className="py-3 pr-4 font-medium">{LOCALE_LABELS[locale] || locale}</td>
                                        <td className="py-3 pr-4">
                                            <span
                                                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    status === 'COMPLETED'
                                                        ? 'bg-emerald-500/20 text-emerald-400'
                                                        : status === 'FAILED'
                                                          ? 'bg-amber-500/20 text-amber-400'
                                                          : 'bg-slate-500/20 text-slate-400'
                                                }`}
                                            >
                                                {status === 'COMPLETED' ? 'Done' : status === 'FAILED' ? 'Failed' : 'Not translated'}
                                            </span>
                                        </td>
                                        <td className="py-3 flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleRetry(locale)}
                                                disabled={isRetrying}
                                                className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-white/10 hover:bg-white/5 text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
                                            >
                                                {isRetrying ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                                                Retry
                                            </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditError(null);
                                                setEditingLocale(isEditing ? null : locale);
                                            }}
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-white/10 hover:bg-white/5 text-xs font-medium transition-colors cursor-pointer"
                                        >
                                            <Edit2 className="h-3 w-3" />
                                            {isEditing ? 'Close' : 'Edit'}
                                        </button>
                                        </td>
                                    </tr>
                                    {isEditing ? (
                                        <tr key={`${locale}-form`}>
                                            <td colSpan={3} className="py-4">
                                                <EditTranslationForm
                                                    carId={carId}
                                                    locale={locale}
                                                    initial={row ?? null}
                                                    sourceMake={sourceMake}
                                                    sourceModel={sourceModel}
                                                    onSave={async (data) => {
                                                        setEditSaving(true);
                                                        setEditError(null);
                                                        const res = await updateTranslationLocale(carId, locale, data);
                                                        setEditSaving(false);
                                                        if (res.success) {
                                                            setEditingLocale(null);
                                                            router.refresh();
                                                        } else {
                                                            setEditError(res.error ?? 'Save failed');
                                                        }
                                                    }}
                                                    onCancel={() => setEditingLocale(null)}
                                                    saving={editSaving}
                                                    error={editError}
                                                />
                                            </td>
                                        </tr>
                                    ) : null}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

interface EditTranslationFormProps {
    carId: string;
    locale: string;
    initial: CarTranslationRow | null;
    sourceMake: string;
    sourceModel: string;
    onSave: (data: Partial<Record<keyof TranslatableCarFields, string | null>>) => Promise<void>;
    onCancel: () => void;
    saving: boolean;
    error: string | null;
}

function EditTranslationForm({ locale, initial, sourceMake, sourceModel, onSave, onCancel, saving, error }: EditTranslationFormProps) {
    const [form, setForm] = useState<Partial<Record<keyof TranslatableCarFields, string | null>>>(() => {
        const o: Partial<Record<keyof TranslatableCarFields, string | null>> = {};
        for (const key of TRANSLATABLE_FIELD_KEYS) {
            let val = initial?.[key as keyof CarTranslationRow] ?? null;
            if (key === 'make' && (val == null || val === '') && sourceMake) val = sourceMake;
            if (key === 'model' && (val == null || val === '') && sourceModel) val = sourceModel;
            o[key] = val;
        }
        return o;
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
            <p className="text-sm font-medium text-muted-foreground">
                Edit translation: {LOCALE_LABELS[locale] || locale}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TRANSLATABLE_FIELD_KEYS.map((key) => {
                    const placeholder = key === 'make' ? sourceMake : key === 'model' ? sourceModel : undefined;
                    return (
                        <div key={key} className="space-y-1">
                            <label htmlFor={`edit-${locale}-${key}`} className="text-xs font-medium text-muted-foreground block">
                                {FIELD_LABELS[key]}
                                {key === 'make' && sourceMake && (
                                    <span className="text-muted-foreground/70 font-normal ml-1">(source: {sourceMake})</span>
                                )}
                                {key === 'model' && sourceModel && (
                                    <span className="text-muted-foreground/70 font-normal ml-1">(source: {sourceModel})</span>
                                )}
                            </label>
                            {key === 'description' ? (
                                <textarea
                                    id={`edit-${locale}-${key}`}
                                    value={form[key] ?? ''}
                                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value || null }))}
                                    rows={3}
                                    placeholder={placeholder}
                                    className="w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm"
                                />
                            ) : (
                                <input
                                    id={`edit-${locale}-${key}`}
                                    type="text"
                                    value={form[key] ?? ''}
                                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value || null }))}
                                    placeholder={placeholder || undefined}
                                    className="w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            {error && <p className="text-sm text-amber-400">{error}</p>}
            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium disabled:opacity-50 cursor-pointer"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Save
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm font-medium cursor-pointer"
                >
                    <X className="h-4 w-4" />
                    Cancel
                </button>
            </div>
        </form>
    );
}
