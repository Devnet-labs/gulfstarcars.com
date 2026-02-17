'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Client-side exception:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center p-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-[#151B2B] p-8 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                        <AlertTriangle className="w-10 h-10 text-primary" />
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                        Something went wrong
                    </h1>

                    <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">
                        We encountered an unexpected issue while loading the page. Please try refreshing or return to the home page.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                            onClick={() => reset()}
                            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary/20"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Try Again
                        </button>

                        <Link
                            href="/"
                            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-xl font-bold transition-all border border-white/10"
                        >
                            <Home className="w-4 h-4" />
                            Home Page
                        </Link>
                    </div>

                    {error.digest && (
                        <p className="mt-8 text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
