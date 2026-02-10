'use client';

import { useEffect, useRef } from 'react';

export function Analytics() {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        // Track visit once per session/mount
        fetch('/api/track-visit', { method: 'POST' })
            .catch(err => console.error('Failed to track visit', err));
    }, []);

    return null;
}
