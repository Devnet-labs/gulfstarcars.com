'use client';

import { Trash2 } from 'lucide-react';
import { deleteCar } from '@/app/admin/cars/actions';
import { useTransition } from 'react';

export default function DeleteCarButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        if (confirm('Are you sure you want to delete this car?')) {
            startTransition(async () => {
                await deleteCar(id);
            });
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 hover:bg-muted rounded text-red-600 disabled:opacity-50"
            title="Delete Car"
        >
            <Trash2 className="h-4 w-4" />
        </button>
    );
}
