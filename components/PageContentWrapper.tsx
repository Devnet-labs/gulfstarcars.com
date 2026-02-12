'use client';

import { usePathname } from '@/i18n/routing';

export function PageContentWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <main className={`min-h-screen bg-background text-foreground ${!isHome ? 'pt-24' : ''}`}>
            {children}
        </main>
    );
}
