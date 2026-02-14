'use client';

import { useState, useTransition } from 'react';
import { Eye, EyeOff, Trash2, Loader2, AlertTriangle, X } from 'lucide-react';
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleToggleVisibility = async () => {
        startTransition(async () => {
            try {
                const result = await toggleCarVisibility(carId, !isActive);
                if (result.success) {
                    setIsActive(!isActive);
                    toast.success(`Car is now ${!isActive ? 'visible' : 'inactive'}`, {
                        description: `The visibility status has been updated successfully.`,
                    });
                } else {
                    toast.error(result.error || 'Failed to toggle visibility');
                }
            } catch (error) {
                toast.error('An unexpected error occurred');
            }
        });
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteCar(carId);
            if (result.message === 'Deleted Car.') {
                toast.success('Car deleted successfully');
                setShowDeleteModal(false);
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
                    : 'border-slate-500/20 bg-slate-500/5 text-slate-400 hover:bg-slate-500/10'
                    } disabled:opacity-50`}
                title={isActive ? 'Deactivate Listing' : 'Activate Listing'}
            >
                {isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                ) : isActive ? (
                    <>
                        <Eye className="h-3 w-3" />
                        <span>Visible</span>
                    </>
                ) : (
                    <>
                        <EyeOff className="h-3 w-3" />
                        <span>Inactive</span>
                    </>
                )}
            </button>

            <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isPending || isDeleting}
                className="inline-flex items-center justify-center p-2 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50"
                title="Delete Car"
            >
                <Trash2 className="h-3 w-3" />
            </button>

            {/* Custom Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md rounded-2xl bg-[#0F172A] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                                        <AlertTriangle className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Confirm Deletion</h3>
                                </div>
                                <button
                                    onClick={() => !isDeleting && setShowDeleteModal(false)}
                                    className="rounded-full p-1 hover:bg-white/10 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                                    disabled={isDeleting}
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    Are you sure you want to delete this car? This action is permanent and cannot be undone. All associated data will be removed.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        disabled={isDeleting}
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 font-semibold hover:bg-white/5 transition-colors text-sm disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-500 transition-colors text-sm shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            'Delete Permanently'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
