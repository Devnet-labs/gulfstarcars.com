'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { ArrowLeft, Loader2, CheckCircle, XCircle, AlertTriangle, X, Car, Box, Eye } from 'lucide-react';
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
    const [status, setStatus] = useState(initialData?.status || 'AVAILABLE');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);

    const handleStatusChange = (newStatus: string) => {
        // If transitioning from SOLD to AVAILABLE, show confirmation
        if (status === 'SOLD' && newStatus === 'AVAILABLE') {
            setPendingStatus(newStatus);
            setShowConfirmModal(true);
            return;
        }

        // Automatic visibility logic: if SOLD or RESERVED, set to inactive
        if (newStatus === 'SOLD' || newStatus === 'RESERVED') {
            setIsActive(false);
        } else if (newStatus === 'AVAILABLE') {
            setIsActive(true);
        }

        setStatus(newStatus);
    };

    const confirmStatusChange = () => {
        if (pendingStatus) {
            setStatus(pendingStatus);
            setIsActive(true);
            setPendingStatus(null);
        }
        setShowConfirmModal(false);
    };

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
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/cars"
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all shadow-sm"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
                        <p className="text-sm text-slate-400 mt-1">Manage vehicle details and visibility</p>
                    </div>
                </div>
            </div>

            <form action={handleSubmit} className="space-y-8">
                {/* 1. PRIMARY STATUS & VISIBILITY */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-500 mb-2 block">
                            Vehicle Status
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'AVAILABLE', label: 'Available', color: 'bg-emerald-500', icon: CheckCircle },
                                { id: 'SOLD', label: 'Sold', color: 'bg-rose-500', icon: XCircle },
                                { id: 'RESERVED', label: 'Reserved', color: 'bg-amber-500', icon: AlertTriangle }
                            ].map((s) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => handleStatusChange(s.id)}
                                    className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 group ${status === s.id
                                        ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20'
                                        : 'bg-slate-900/40 border-white/5 hover:border-white/10'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg mb-2 ${status === s.id ? s.color : 'bg-white/5 text-slate-500'}`}>
                                        <s.icon className={`h-5 w-5 ${status === s.id ? 'text-white' : ''}`} />
                                    </div>
                                    <span className={`text-xs font-black uppercase tracking-widest ${status === s.id ? 'text-white' : 'text-slate-500'}`}>
                                        {s.label}
                                    </span>
                                    {status === s.id && (
                                        <div className="absolute top-2 right-2">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                        <input type="hidden" name="status" value={status} />
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-500 mb-2 block">
                            Public Visibility
                        </label>
                        <div className={`flex flex-col h-[calc(100%-2rem)] justify-center p-6 rounded-2xl border transition-all duration-300 ${isActive
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : 'bg-slate-800/20 border-white/5'
                            }`}>
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <span className={`text-sm font-bold block ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                                        {isActive ? 'Publicly Visible' : 'Inactive'}
                                    </span>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider leading-relaxed">
                                        {isActive ? 'Live on website' : 'Hidden from site'}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                    />
                                    <div className="w-12 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. VEHICLE IDENTITY */}
                <section className="p-8 rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                            <Car className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Vehicle Identity</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Make</label>
                            <input
                                name="make"
                                defaultValue={initialData?.make}
                                required
                                placeholder="e.g. Toyota"
                                className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-white focus:border-primary/50 transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Model</label>
                            <input
                                name="model"
                                defaultValue={initialData?.model}
                                required
                                placeholder="e.g. Land Cruiser"
                                className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-white focus:border-primary/50 transition-all outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Year</label>
                                <input
                                    name="year"
                                    type="number"
                                    defaultValue={initialData?.year}
                                    required
                                    className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-white outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Condition</label>
                                <select
                                    name="condition"
                                    defaultValue={initialData?.condition || 'New'}
                                    className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-white outline-none"
                                >
                                    <option value="New">New</option>
                                    <option value="Used">Used</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Price ($)</label>
                            <input
                                name="price"
                                type="number"
                                defaultValue={initialData?.price ?? ''}
                                placeholder="80000"
                                className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-white text-lg font-bold text-emerald-400 placeholder:text-slate-700 outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* 3. TECHNICAL SPECIFICATIONS */}
                <section className="p-8 rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Technical Specs</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Fuel Type</label>
                            <select name="fuelType" defaultValue={initialData?.fuelType || ''} className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-white outline-none">
                                <option value="">Select</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Electric">Electric</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Transmission</label>
                            <select name="transmission" defaultValue={initialData?.transmission || ''} className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-white outline-none">
                                <option value="">Select</option>
                                <option value="Automatic">Automatic</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Engine</label>
                            <input name="engineCapacity" defaultValue={initialData?.engineCapacity || ''} placeholder="e.g. 2.5L" className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-white outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Mileage (KM)</label>
                            <input name="mileage" type="number" defaultValue={initialData?.mileage || 0} className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-white outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Drive Type</label>
                            <select name="driveType" defaultValue={initialData?.driveType || ''} className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-white outline-none">
                                <option value="">Select</option>
                                <option value="2WD">2WD</option>
                                <option value="4WD">4WD</option>
                                <option value="AWD">AWD</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* 4. BODY & FEATURES */}
                <section className="p-8 rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                            <Box className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Body & Features</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Body Type</label>
                            <input name="bodyType" defaultValue={initialData?.bodyType || ''} placeholder="e.g. SUV" className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-white outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Steering</label>
                            <select name="steering" defaultValue={initialData?.steering || ''} className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-white outline-none">
                                <option value="">Select</option>
                                <option value="LHD">LHD</option>
                                <option value="RHD">RHD</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Colour</label>
                            <input name="colour" defaultValue={initialData?.colour || ''} placeholder="e.g. Black" className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-white outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Doors</label>
                            <input name="doors" type="number" defaultValue={initialData?.doors || ''} placeholder="4" className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-white outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Seats</label>
                            <input name="seats" type="number" defaultValue={initialData?.seats || ''} placeholder="5" className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-white outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Location/Port</label>
                            <input name="location" defaultValue={initialData?.location || ''} placeholder="e.g. Dubai" className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-white outline-none" />
                        </div>
                    </div>
                </section>

                {/* 5. MEDIA & DESCRIPTION */}
                <section className="p-8 rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                            <Eye className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Media & Details</h2>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Vehicle Images</label>
                        <ImageUpload
                            value={images}
                            onChange={(urls) => setImages(urls)}
                            onRemove={(url) => setImages(images.filter((img) => img !== url))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Full Description</label>
                        <textarea
                            name="description"
                            defaultValue={initialData?.description}
                            required
                            rows={6}
                            placeholder="Detailed features, history, and special options..."
                            className="w-full rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-white outline-none focus:border-primary/50 transition-all resize-none"
                        />
                    </div>
                </section>

                <div className="flex items-center justify-between p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl">
                    <div className="text-sm text-slate-400 font-medium">
                        Ensure all required fields marked with <span className="text-rose-500 font-bold">*</span> are completed.
                    </div>
                    <button
                        type="submit"
                        disabled={state.isLoading}
                        className="relative group px-10 py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center gap-3 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        {state.isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        <span className="relative">{initialData ? 'Update Vehicle' : 'Create Listing'}</span>
                    </button>
                </div>
            </form >

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden scale-in-center">
                        <div className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-500">
                                    <AlertTriangle className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Reactivate Listing?</h3>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-black mt-1">Status Transition</p>
                                </div>
                            </div>

                            <p className="text-slate-300 text-sm leading-relaxed mb-8">
                                This vehicle is currently marked as <span className="text-rose-400 font-bold">SOLD</span>. Are you sure you want to mark it as <span className="text-emerald-400 font-bold">AVAILABLE</span>?
                                <br /><br />
                                <span className="text-slate-500 italic">This will make the car visible on the public collection again.</span>
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 px-6 py-4 rounded-2xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 transition-colors text-xs uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmStatusChange}
                                    className="flex-1 px-6 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
                                >
                                    Yes, Reactivate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
