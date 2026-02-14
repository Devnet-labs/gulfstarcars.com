'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

function ToastContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const message = searchParams.get('message');
        console.log('ToastHandler message:', message);
        if (message) {
            if (message === 'created') {
                console.log('Showing creation toast');
                toast.success('Car created successfully', {
                    description: 'The new vehicle has been added to the inventory.',
                });
            } else if (message === 'updated') {
                console.log('Showing update toast');
                toast.success('Car updated successfully', {
                    description: 'Changes have been saved to the vehicle record.',
                });
            }

            // Remove the message from URL without adding to history
            const params = new URLSearchParams(searchParams.toString());
            params.delete('message');
            const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
            console.log('Cleaning URL to:', newUrl);
            window.history.replaceState(null, '', newUrl);
        }
    }, [searchParams, pathname]);

    return null;
}

export function ToastHandler() {
    return (
        <Suspense fallback={null}>
            <ToastContent />
        </Suspense>
    );
}
