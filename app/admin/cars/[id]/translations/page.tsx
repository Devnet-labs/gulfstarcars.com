'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Languages, RefreshCw, Save, ArrowLeft, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { retryTranslation, retryAllTranslations, updateTranslation } from '@/app/admin/cars/actions';

interface Translation {
    id: string;
    carId: string;
    locale: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface CarData {
    id: string;
    make: string;
    model: string;
    year: number;
    description: string;
}

const LANGUAGE_NAMES: Record<string, string> = {
    ar: 'العربية (Arabic)',
    fr: 'Français (French)',
    es: 'Español (Spanish)',
    pt: 'Português (Portuguese)',
    ru: 'Русский (Russian)',
    zh: '中文 (Chinese)',
};

const TARGET_LOCALES = ['ar', 'fr', 'es', 'pt', 'ru', 'zh'];

export default function TranslationEditorPage() {
    const params = useParams();
    const router = useRouter();
    const carId = params.id as string;

    const [car, setCar] = useState<CarData | null>(null);
    const [translations, setTranslations] = useState<Translation[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingLocale, setEditingLocale] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const [saving, setSaving] = useState(false);
    const [retrying, setRetrying] = useState<string | null>(null);
    const [retryingAll, setRetryingAll] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch(`/api/admin/translations/${carId}`);
            if (res.ok) {
                const data = await res.json();
                setCar(data.car);
                setTranslations(data.translations);
            }
        } catch (error) {
            console.error('Error fetching translations:', error);
        } finally {
            setLoading(false);
        }
    }, [carId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRetry = async (locale: string) => {
        setRetrying(locale);
        try {
            await retryTranslation(carId, locale);
            await fetchData();
        } catch (error) {
            console.error('Retry failed:', error);
        } finally {
            setRetrying(null);
        }
    };

    const handleRetryAll = async () => {
        setRetryingAll(true);
        try {
            await retryAllTranslations(carId);
            await fetchData();
        } catch (error) {
            console.error('Retry all failed:', error);
        } finally {
            setRetryingAll(false);
        }
    };

    const handleSave = async (locale: string) => {
        setSaving(true);
        try {
            await updateTranslation(carId, locale, editText);
            setEditingLocale(null);
            await fetchData();
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setSaving(false);
        }
    };

    const startEditing = (locale: string, currentText: string) => {
        setEditingLocale(locale);
        setEditText(currentText);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
            case 'FAILED': return <XCircle className="h-4 w-4 text-red-400" />;
            case 'PENDING': return <Clock className="h-4 w-4 text-yellow-400 animate-pulse" />;
            default: return <AlertTriangle className="h-4 w-4 text-gray-400" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            COMPLETED: 'bg-green-400/10 text-green-400 ring-green-400/20',
            FAILED: 'bg-red-400/10 text-red-400 ring-red-400/20',
            PENDING: 'bg-yellow-400/10 text-yellow-400 ring-yellow-400/20',
        };
        return styles[status] || 'bg-gray-400/10 text-gray-400 ring-gray-400/20';
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-64 bg-white/5 rounded animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground">Car not found</p>
                <button onClick={() => router.push('/admin/cars')} className="mt-4 text-primary hover:underline cursor-pointer">
                    Back to Cars
                </button>
            </div>
        );
    }

    const completedCount = translations.filter(t => t.status === 'COMPLETED').length;
    const failedCount = translations.filter(t => t.status === 'FAILED').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <button
                        onClick={() => router.push('/admin/cars')}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Cars
                    </button>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Languages className="h-6 w-6 text-primary" />
                        Translations — {car.year} {car.make} {car.model}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {completedCount}/{TARGET_LOCALES.length} completed
                        {failedCount > 0 && <span className="text-red-400 ml-2">• {failedCount} failed</span>}
                    </p>
                </div>
                <button
                    onClick={handleRetryAll}
                    disabled={retryingAll}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                    <RefreshCw className={`h-4 w-4 ${retryingAll ? 'animate-spin' : ''}`} />
                    {retryingAll ? 'Translating...' : 'Translate All'}
                </button>
            </div>

            {/* Original Description */}
            <div className="rounded-xl border border-white/5 bg-card/40 backdrop-blur-xl p-5">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Original (English)</h3>
                <p className="text-foreground whitespace-pre-line text-sm leading-relaxed">{car.description}</p>
            </div>

            {/* Translation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {TARGET_LOCALES.map(locale => {
                    const translation = translations.find(t => t.locale === locale);
                    const isEditing = editingLocale === locale;
                    const isRetrying = retrying === locale;

                    return (
                        <div
                            key={locale}
                            className="rounded-xl border border-white/5 bg-card/40 backdrop-blur-xl overflow-hidden transition-all hover:border-white/10"
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold uppercase tracking-wider text-foreground">{locale}</span>
                                    <span className="text-xs text-muted-foreground">{LANGUAGE_NAMES[locale]}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {translation ? (
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${getStatusBadge(translation.status)}`}>
                                            {getStatusIcon(translation.status)}
                                            {translation.status}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-gray-400/10 text-gray-400 ring-1 ring-inset ring-gray-400/20">
                                            <AlertTriangle className="h-3 w-3" />
                                            Missing
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-4">
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            rows={5}
                                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            dir={locale === 'ar' ? 'rtl' : 'ltr'}
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setEditingLocale(null)}
                                                className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleSave(locale)}
                                                disabled={saving}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
                                            >
                                                <Save className="h-3 w-3" />
                                                {saving ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p
                                            className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4 leading-relaxed min-h-[4rem]"
                                            dir={locale === 'ar' ? 'rtl' : 'ltr'}
                                        >
                                            {translation?.description || 'No translation available'}
                                        </p>
                                        <div className="flex justify-end gap-2 mt-3">
                                            {translation?.description && (
                                                <button
                                                    onClick={() => startEditing(locale, translation.description)}
                                                    className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleRetry(locale)}
                                                disabled={isRetrying}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary hover:text-primary-foreground hover:bg-primary rounded-lg border border-primary/30 hover:border-primary transition-colors cursor-pointer disabled:opacity-50"
                                            >
                                                <RefreshCw className={`h-3 w-3 ${isRetrying ? 'animate-spin' : ''}`} />
                                                {isRetrying ? 'Translating...' : 'Translate'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
