'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Menu, X, ArrowLeft, Car } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

export function Navbar() {
    const t = useTranslations('nav');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === '/';
    const showBackButton = !isHome;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Force solid background if not on home page
    const showSolid = isScrolled || !isHome;

    const handleBack = () => {
        router.back();
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${showSolid
                    ? 'bg-background/80 backdrop-blur-xl shadow-lg border-b border-white/5 py-3'
                    : 'bg-transparent py-4'
                    }`}
            >
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* Left: Back Button or Logo */}
                    <div className="flex items-center gap-4">
                        {showBackButton && (
                            <button
                                onClick={handleBack}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-semibold text-sm ${showSolid
                                    ? 'bg-secondary hover:bg-white/10 text-foreground'
                                    : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'
                                    }`}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">{t('back')}</span>
                            </button>
                        )}

                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="text-2xl font-bold tracking-tight transition-colors text-foreground">
                                {t('brand')}<span className="text-primary"></span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Right Side */}
                    <div className="hidden md:flex items-center gap-3">
                        <LanguageSwitcher />

                        <Link
                            href="/cars"
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-semibold text-sm ${pathname === '/cars'
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : showSolid
                                    ? 'bg-secondary hover:bg-white/10 text-foreground'
                                    : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'
                                }`}
                        >
                            <Car className="h-4 w-4" />
                            {t('viewAllCars')}
                        </Link>

                        <Link
                            href="/contact"
                            className={`px-5 py-2.5 rounded-xl transition-all duration-300 font-semibold text-sm ${pathname === '/contact'
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : showSolid
                                    ? 'text-foreground/80 hover:text-primary'
                                    : 'text-white/90 hover:text-white'
                                }`}
                        >
                            {t('contact')}
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden flex items-center gap-2">
                        <LanguageSwitcher />
                        <button
                            className={`p-2 rounded-lg transition-colors ${showSolid ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                                }`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-40 bg-white md:hidden"
                    >
                        <div className="flex flex-col h-full pt-24 px-6 text-gray-900">
                            <div className="flex flex-col space-y-4">
                                {showBackButton && (
                                    <button
                                        onClick={() => {
                                            handleBack();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 text-left px-5 py-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold transition-all"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                        {t('goBack')}
                                    </button>
                                )}

                                <Link
                                    href="/cars"
                                    className="flex items-center gap-3 px-5 py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 transition-all"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Car className="h-5 w-5" />
                                    {t('viewAllCars')}
                                </Link>

                                <Link
                                    href="/contact"
                                    className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-4"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t('contact')}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
