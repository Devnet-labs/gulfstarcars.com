'use client';

import { useState, useTransition } from 'react';
import { Eye, EyeOff, Trash2, Loader2 } from 'lucide-react';
import { toggleCarVisibility, deleteCar } from '@/app/admin/cars/actions';
import { toast } from 'sonner';

interface CarActionsProps {
    carId: string;
    initialIsActive: boolean;
}

export default function CarActions({ carId, initialIsActive }: CarActionsProps) {
    const [isActive, setIsActive] = useState(initialIsActive);
    const [isPending, startTransition] = useTransition();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleToggleVisibility = async () => {
        startTransition(async () => {
            const result = await toggleCarVisibility(carId, !isActive);
            if (result.success) {
                setIsActive(!isActive);
                toast.success(`Car is now ${!isActive ? 'visible' : 'hidden'}`);
            } else {
                toast.error(result.error || 'Failed to toggle visibility');
            }
        });
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deleteCar(carId);
            if (result.message === 'Deleted Car.') {
                toast.success('Car deleted successfully');
            } else {
                toast.error(result.message || 'Failed to delete car');
                setIsDeleting(false);
            }
        } catch (error) {
            toast.error('An error occurred while deleting the car');
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            <button
                onClick={handleToggleVisibility}
                disabled={isPending || isDeleting}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-xs font-medium ${isActive
                        ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10'
                        : 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400 hover:bg-yellow-500/10'
                    } disabled:opacity-50`}
                title={isActive ? 'Hide from users' : 'Show to users'}
            >
                {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : isActive ? (
                    <>
                        <Eye className="h-4 w-4" />
                        <span>Visible</span>
                    </>
                ) : (
                    <>
                        <EyeOff className="h-4 w-4" />
                        <span>Hidden</span>
                    </>
                )}
            </button>

            <button
                onClick={handleDelete}
                disabled={isPending || isDeleting}
                className="inline-flex items-center justify-center p-2 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50"
                title="Delete Car"
            >
                {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Trash2 className="h-4 w-4" />
                )}
            </button>
        </div>
    );
}
