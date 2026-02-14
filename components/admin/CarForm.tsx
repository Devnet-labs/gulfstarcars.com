'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { useState } from 'react';

// We need to define the State type based on what our actions return
type State = {
    errors?: {
        make?: string[];
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
        isActive?: string[];
        status?: string[];
    };
    message?: string | null;
    isLoading?: boolean;
};

interface CarFormProps {
    initialData?: {
        id: string;
        make: string;
        model: string;
        year: number;
        price: number | null;
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
        isActive?: boolean;
        status?: string;
        makeAr?: string | null;
        modelAr?: string | null;
        descriptionAr?: string | null;
    };
    action: (prevState: State, formData: FormData) => Promise<State>;
    title: string;
}

export default function CarForm({ initialData, action, title }: CarFormProps) {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction] = useActionState(action, initialState);
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

    const handleSubmit = (formData: FormData) => {
        // Clear previous errors
        images.forEach(image => formData.append('images', image));
        // Add visibility flag
        formData.append('isActive', String(isActive));
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
                            Make <span className="text-red-500">*</span>
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
                        <label htmlFor="model" className="text-sm font-medium">
                            Model <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="model"
                            defaultValue={initialData?.model}
                            required
                            placeholder="e.g. Land Cruiser"
                            className="w-full rounded-md border bg-background px-3 py-2"
                        />
                        {
                            state.errors?.model && (
                                <p className="text-sm text-red-500">{state.errors.model}</p>
                            )
                        }
                    </div >
                </div >

                {/* Visibility Toggle */}
                < div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/10" >
                    <div className="flex items-center gap-2 text-primary">
                        {isActive ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        <div>
                            <span className="text-sm font-semibold">{isActive ? 'Publicly Visible' : 'Hidden from Users'}</span>
                            <p className="text-xs text-muted-foreground">Toggle whether this car is live on the website.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div >

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="year" className="text-sm font-medium">
                            Year <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="year"
                            type="number"
                            defaultValue={initialData?.year}
                            required
                            placeholder="2024"
                            className="w-full rounded-md border bg-background px-3 py-2"
                        />
                        {
                            state.errors?.year && (
                                <p className="text-sm text-red-500">{state.errors.year}</p>
                            )
                        }
                    </div >
                    <div className="space-y-2">
                        <label htmlFor="price" className="text-sm font-medium">
                            Price ($)
                        </label>
                        <input
                            name="price"
                            type="number"
                            defaultValue={initialData?.price ?? ''}
                            placeholder="80000"
                            className="w-full rounded-md border bg-background px-3 py-2"
                        />
                        {state.errors?.price && (
                            <p className="text-sm text-red-500">{state.errors.price}</p>
                        )}
                    </div>
                </div >

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
                            Condition <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="condition"
                            defaultValue={initialData?.condition || 'New'}
                            className="w-full rounded-md border bg-background px-3 py-2"
                        >
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                        </select>
                    </div >
                </div >

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="status" className="text-sm font-medium">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="status"
                            defaultValue={initialData?.status || 'AVAILABLE'}
                            className="w-full rounded-md border bg-background px-3 py-2"
                        >
                            <option value="AVAILABLE">Available</option>
                            <option value="SOLD">Sold</option>
                            <option value="RESERVED">Reserved</option>
                        </select>
                        {state.errors?.status && (
                            <p className="text-sm text-red-500">{state.errors.status}</p>
                        )}
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
                        Car Images <span className="text-red-500">*</span>
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
                        Description <span className="text-red-500">*</span>
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



                {
                    state.message && (
                        <p className="text-sm text-red-500">{state.message}</p>
                    )
                }

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
            </form >
        </div >
    );
}
