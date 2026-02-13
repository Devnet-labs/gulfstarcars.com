import Link from 'next/link';
import { Car } from 'lucide-react';

// This handles 404s outside of the [locale] group
export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-6 text-white font-sans">
            <div className="max-w-md w-full text-center space-y-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 shadow-2xl">
                <Car className="w-16 h-16 text-primary mx-auto mb-6 opacity-80" />
                <h2 className="text-4xl font-bold tracking-tight">404</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                    The page you are looking for doesn't exist.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
