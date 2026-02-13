import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Car, Home } from 'lucide-react';

export default function NotFound() {
    const t = useTranslations('notFound');

    return (
        <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden flex items-center justify-center p-6">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />

            <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
                {/* Large 404 Header */}
                <div className="relative">
                    <h1 className="text-[12rem] sm:text-[18rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary/80 to-transparent opacity-20 select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center translate-y-8 sm:translate-y-12">
                        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
                            <Car className="w-16 h-16 sm:w-20 sm:h-20 text-primary mx-auto mb-6 animate-bounce" />
                            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
                                {t('title')}
                            </h2>
                            <p className="text-muted-foreground text-sm sm:text-lg max-w-md mx-auto leading-relaxed">
                                {t('subtitle')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-24 sm:pt-32 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group"
                    >
                        <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                        {t('backHome')}
                    </Link>
                    <Link
                        href="/cars"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-md text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all group"
                    >
                        <Car className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        {t('browseInventory')}
                    </Link>
                </div>

                {/* Return Link Simple */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-primary/60 hover:text-primary transition-colors text-sm font-medium pt-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t('backHome')}
                </Link>
            </div>
        </div>
    );
}
