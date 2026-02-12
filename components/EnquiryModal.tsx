'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Car } from './CarCard';
import { z } from 'zod';

const enquirySchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

interface EnquiryModalProps {
    car?: Car;
    isOpen: boolean;
    onClose: () => void;
}

export function EnquiryModal({ car, isOpen, onClose }: EnquiryModalProps) {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Client-side validation
        const result = enquirySchema.safeParse(formData);
        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            result.error.issues.forEach((err: z.ZodIssue) => {
                if (err.path[0]) formattedErrors[err.path[0] as string] = err.message;
            });
            setErrors(formattedErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    carId: car?.id,
                    carCustomId: car?.customId,
                    carName: car ? `${car.year} ${car.make} ${car.model} (${car.customId || 'N/A'})` : 'General Enquiry',
                }),
            });

            if (!response.ok) throw new Error('Failed to submit enquiry');

            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setFormData({ name: '', email: '', message: '' });
            }, 2000);
        } catch (error) {
            console.error(error);
            setErrors({ form: 'Something went wrong. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-xl sm:rounded-2xl bg-background p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-border max-h-[90vh] overflow-y-auto">
                <div className="mb-4 flex items-start justify-between gap-2">
                    <h3 className="text-base sm:text-xl font-bold leading-tight">
                        {car ? `Enquire about ${car.make} ${car.model} (${car.customId || 'N/A'})` : 'Contact Us'}
                    </h3>
                    <button onClick={onClose} className="rounded-full p-1.5 sm:p-2 hover:bg-muted transition-colors flex-shrink-0">
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>

                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                        <div className="mb-3 sm:mb-4 rounded-full bg-green-100 p-2.5 sm:p-3 text-green-600 dark:bg-green-900/30">
                            <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-green-600">Enquiry Sent!</h4>
                        <p className="text-sm sm:text-base text-muted-foreground">We will get back to you shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                        <div>
                            <label htmlFor="name" className="mb-1 block text-xs sm:text-sm font-medium">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={`w-full rounded-lg border bg-background px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-primary/50 ${errors.name ? 'border-red-500' : 'border-input'}`}
                                placeholder="Your Name"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-1 block text-xs sm:text-sm font-medium">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={`w-full rounded-lg border bg-background px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-primary/50 ${errors.email ? 'border-red-500' : 'border-input'}`}
                                placeholder="your@email.com"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="message" className="mb-1 block text-xs sm:text-sm font-medium">Message</label>
                            <textarea
                                id="message"
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className={`w-full rounded-lg border bg-background px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-primary/50 ${errors.message ? 'border-red-500' : 'border-input'}`}
                                placeholder={car ? `I am interested in ${car.year} ${car.make} ${car.model} (ID: ${car.customId || 'N/A'})...` : "How can we help you?"}
                            />
                            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                        </div>

                        {errors.form && <p className="text-xs sm:text-sm text-red-500">{errors.form}</p>}

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full sm:w-auto rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {isSubmitting ? 'Sending...' : 'Send Request'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
