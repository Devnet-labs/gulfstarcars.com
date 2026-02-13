'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { ArrowLeft, Loader2, Languages, CheckCircle, XCircle } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { useState, useEffect } from 'react';
import { checkTranslationConfig } from '@/lib/translate';

// We need to define the State type based on what our actions return
type State = {
    errors?: {
        make?: string[];
        brand?: string[];
        model?: string[];
        year?: string[];
        price?: string[];
        images?: string[];
        condition?: string[];
        description?: string[];
        fuelType?: string[];
        transmission?: string[];
        bodyType?: string[];
        steering?: string[];
        mileage?: string[];
        engineCapacity?: string[];
        colour?: string[];
        driveType?: string[];
        doors?: string[];
        seats?: string[];
        location?: string[];
    };
    message?: string | null;
    isLoading?: boolean;
};

interface CarFormProps {
    initialData?: {
        id: string;
        make: string;
        brand?: string | null;
        model: string;
        year: number;
        price: number;
        images: string[];
        condition: string;
        description: string;
        fuelType?: string | null;
        transmission?: string | null;
        bodyType?: string | null;
        steering?: string | null;
        mileage?: number | null;
        engineCapacity?: string | null;
        colour?: string | null;
        driveType?: string | null;
        doors?: number | null;
        seats?: number | null;
        location?: string | null;
    };
    action: (prevState: State, formData: FormData) => Promise<State>;
    title: string;
}

export default function CarForm({ initialData, action, title }: CarFormProps) {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction] = useActionState(action, initialState);
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [enableTranslations, setEnableTranslations] = useState(true);
    const [apiConfigured, setApiConfigured] = useState(false);
    const [checkingApi, setCheckingApi] = useState(true);

    // Check if DeepL API is configured
    useEffect(() => {
        checkTranslationConfig().then(result => {
            setApiConfigured(result.isConfigured);
            setEnableTranslations(result.isConfigured);
            setCheckingApi(false);
        });
    }, []);

    const handleSubmit = (formData: FormData) => {
        // Clear previous errors
        images.forEach(image => formData.append('images', image));
        // Add translation flag
        formData.append('enableTranslations', String(enableTranslations));
        // Ensure condition is sent if not explicitly in form
        if (!formData.has('condition') && initialData?.condition) {
            formData.append('condition', initialData.condition);
        }
        formAction(formData);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/cars" className="p-2 hover:bg-muted rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-3xl font-bold">{title}</h1>
            </div>

            <form action={handleSubmit} className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="make" className="text-sm font-medium">
                            Make
                        </label>
                        <input
                            name="make"
                            defaultValue={initialData?.make}
                            required
                            placeholder="e.g. Toyota"
                            className="w-full rounded-md border bg-background px-3 py-2"
                        />
                        {state.errors?.make && (
                            <p className="text-sm text-red-500">{state.errors.make}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="brand" className="text-sm font-medium">
                            Brand *
                        </label>
                        <input
                            name="brand"
                            defaultValue={initialData?.brand || ''}
                            placeholder="e.g. Toyota"
                            className="w-full rounded-md border bg-background px-3 py-2"
                        />
                        {state.errors?.brand && (
                            <p className="text-sm text-red-500">{state.errors.brand}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="model" className="text-sm font-medium">
                            Model
                        </label>
                        <input
                            name="model"
                            defaultValue={initialData?.model}
                            required
                            placeholder="e.g. Land Cruiser"
                            className="w-full rounded-md border bg-background px-3 py-2"
                        />
                        {state.errors?.model && (
                            <p className="text-sm text-red-500">{state.errors.model}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="year" className="text-sm font-medium">
                            Year
                        </label>
                        <input
                            name="year"
                            type="number"
                            defaultValue={initialData?.year}
                            required
                            placeholder="2024"
                            className="w-full rounded-md border bg-background px-3 py-2"
                        />
                        {state.errors?.year && (
                            <p className="text-sm text-red-500">{state.errors.year}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="price" className="text-sm font-medium">
                            Price ($)
                        </label>
                        <input
                            name="price"
                            type="number"
                            defaultValue={initialData?.price}
                            required
                            placeholder="80000"
                            className="w-full rounded-md border bg-background px-3 py-2"
                        />
                        {state.errors?.price && (
                            <p className="text-sm text-red-500">{state.errors.price}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="fuelType" className="text-sm font-medium">
                            Fuel Type
                        </label>
                        <select
                            name="fuelType"
                            defaultValue={initialData?.fuelType || ''}
                            className="w-full rounded-md border bg-background px-3 py-2"
                        >
                            <option value="">Select Fuel Type</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Electric">Electric</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="transmission" className="text-sm font-medium">
                            Transmission
                        </label>
                        <select
                            name="transmission"
                            defaultValue={initialData?.transmission || ''}
                            className="w-full rounded-md border bg-background px-3 py-2"
                        >
                            <option value="">Select Transmission</option>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="bodyType" className="text-sm font-medium">
                            Body Type
                        </label>
                        <input
                            name="bodyType"
                            defaultValue={initialData?.bodyType || ''}
                            placeholder="e.g. SUV, Sedan"
                            className="w-full rounded-md border bg-background px-3 py-2"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="steering" className="text-sm font-medium">
                            Steering
                        </label>
                        <select
                            name="steering"
                            defaultValue={initialData?.steering || ''}
                            className="w-full rounded-md border bg-background px-3 py-2"
                        >
                            <option value="">Select Steering</option>
                            <option value="LHD">LHD</option>
                            <option value="RHD">RHD</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="mileage" className="text-sm font-medium">
                            Mileage (km)
                        </label>
                        <input
                            name="mileage"
                            type="number"
                            defaultValue={initialData?.mileage || 0}
                            className="w-full rounded-md border bg-background px-3 py-2"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="condition" className="text-sm font-medium">
                            Condition
                        </label>
                        <select
                            name="condition"
                            defaultValue={initialData?.condition || 'New'}
                            className="w-full rounded-md border bg-background px-3 py-2"
                        >
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="engineCapacity" className="text-sm font-medium">
                            Engine Capacity
                        </label>
                        <input
                            name="engineCapacity"
                            defaultValue={initialData?.engineCapacity || ''}
                            placeholder="e.g. 2.5L, 3.0L"
                            className="w-full rounded-md border bg-background px-3 py-2"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="colour" className="text-sm font-medium">
                            Colour
                        </label>
                        <input
                            name="colour"
                            defaultValue={initialData?.colour || ''}
                            placeholder="e.g. White, Black, Silver"
                            className="w-full rounded-md border bg-background px-3 py-2"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="driveType" className="text-sm font-medium">
                            Drive Type
                        </label>
                        <select
                            name="driveType"
                            defaultValue={initialData?.driveType || ''}
                            className="w-full rounded-md border bg-background px-3 py-2"
                        >
                            <option value="">Select Drive Type</option>
                            <option value="2WD">2WD</option>
                            <option value="4WD">4WD</option>
                            <option value="AWD">AWD</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="location" className="text-sm font-medium">
                            Location/Port
                        </label>
                        <input
                            name="location"
                            defaultValue={initialData?.location || ''}
                            placeholder="e.g. Dubai, Singapore"
                            className="w-full rounded-md border bg-background px-3 py-2"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="doors" className="text-sm font-medium">
                            Doors
                        </label>
                        <select
                            name="doors"
                            defaultValue={initialData?.doors?.toString() || ''}
                            className="w-full rounded-md border bg-background px-3 py-2"
                        >
                            <option value="">Select Doors</option>
                            <option value="2">2</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="seats" className="text-sm font-medium">
                            Seats
                        </label>
                        <input
                            name="seats"
                            type="number"
                            defaultValue={initialData?.seats || ''}
                            placeholder="2-8"
                            min="2"
                            max="8"
                            className="w-full rounded-md border bg-background px-3 py-2"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium">
                        Car Images
                    </label>
                    <ImageUpload
                        value={images}
                        onChange={(urls) => setImages(urls)}
                        onRemove={(url) => setImages(images.filter((img) => img !== url))}
                    />
                    {state.errors?.images && (
                        <p className="text-sm text-red-500">{state.errors.images}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        name="description"
                        defaultValue={initialData?.description}
                        required
                        rows={4}
                        placeholder="Full options, leather interior..."
                        className="w-full rounded-md border bg-background px-3 py-2"
                    />
                    {state.errors?.description && (
                        <p className="text-sm text-red-500">{state.errors.description}</p>
                    )}
                </div>

                {/* Translation Options */}
                <div className="border border-white/10 rounded-lg p-4 space-y-3 bg-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Languages className="h-5 w-5 text-primary" />
                            <span className="text-sm font-semibold">Auto-Translation</span>
                        </div>
                        {checkingApi ? (
                            <span className="text-xs text-muted-foreground">Checking...</span>
                        ) : apiConfigured ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400">
                                <CheckCircle className="h-3.5 w-3.5" />
                                API Configured
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400">
                                <XCircle className="h-3.5 w-3.5" />
                                API Not Configured
                            </span>
                        )}
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={enableTranslations}
                            onChange={(e) => setEnableTranslations(e.target.checked)}
                            disabled={!apiConfigured}
                            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        />
                        <div className="flex-1">
                            <span className="text-sm font-medium">Enable automatic translations</span>
                            <p className="text-xs text-muted-foreground mt-1">
                                {apiConfigured
                                    ? "Translate description to 6 languages (ar, fr, es, pt, ru, zh) using DeepL API when saving"
                                    : "Add DEEPL_API_KEY to .env to enable translations"}
                            </p>
                        </div>
                    </label>
                </div>

                {state.message && (
                    <p className="text-sm text-red-500">{state.message}</p>
                )}

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={state.isLoading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-2 font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                        {state.isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {initialData ? 'Update Car' : 'Create Car listing'}
                    </button>
                </div>
            </form>
        </div>
    );
}
