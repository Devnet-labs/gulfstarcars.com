'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from '@/i18n/routing';

export function Analytics() {
    const pathname = usePathname();
    const lastTrackedPath = useRef<string | null>(null);

    useEffect(() => {
        // Prevent double-tracking the same path in the same session
        if (lastTrackedPath.current === pathname) return;
        lastTrackedPath.current = pathname;

        // Track visit on page change — credentials: 'include' ensures
        // the httpOnly visitor_id cookie is sent and received
        fetch('/api/track-visit', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                path: pathname,
                referer: document.referrer || null,
            }),
        }).catch((err) => console.error('Failed to track visit', err));
    }, [pathname]);

    return null;
}
