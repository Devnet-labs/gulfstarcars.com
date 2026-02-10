'use client';

import { useEffect, useState } from 'react';

interface FormattedDateProps {
    date: Date | string | number;
    showTime?: boolean;
}

export function FormattedDate({ date, showTime = false }: FormattedDateProps) {
    const [formatted, setFormatted] = useState<string>('');

    useEffect(() => {
        const d = new Date(date);
        if (showTime) {
            setFormatted(d.toLocaleString());
        } else {
            setFormatted(d.toLocaleDateString());
        }
    }, [date, showTime]);

    // Return a fragment or span to avoid hydration mismatch by initially rendering nothing or a placeholder
    // then updating with the client-side local string.
    return <span title={new Date(date).toISOString()}>{formatted}</span>;
}
