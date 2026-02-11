'use client';

import { Link, usePathname } from '@/i18n/routing';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

export function Navbar() {
    const t = useTranslations('nav');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: t('home') },
        { href: '/cars', label: t('inventory') },
        { href: '/services', label: t('services') },
        { href: '/about', label: t('about') },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 left-0 right-0 z-[100] bg-[#0B0F19]/90 backdrop-blur-xl border-b border-white/5 py-4"
            >
                <div className="w-full px-6 md:px-10 flex items-center justify-between h-20">
                    {/* Left: Logo */}
                    <Link href="/" className="flex-shrink-0 block relative z-[70] flex items-center">
                        <div className="relative h-24 w-64 md:h-32 md:w-80 lg:h-40 lg:w-[450px] flex items-center justify-center">
                            <Image
                                src="/images/portfolio/logo/logo.png"
                                alt={t('brand')}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Center: Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1 bg-black/20 backdrop-blur-md p-1.5 rounded-full border border-white/10">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                        : 'text-white/80 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right: Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        <LanguageSwitcher />

                        <Link
                            href="/contact"
                            className="bg-white text-background px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:bg-gray-100 hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
                        >
                            {t('getQuote')}
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="lg:hidden flex items-center gap-3 z-50">
                        <LanguageSwitcher />
                        <button
                            className="p-2 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors"
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
                        initial={{ opacity: 0, y: '-100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-40 bg-background lg:hidden"
                    >
                        <div className="flex flex-col h-full pt-32 px-6 text-foreground">
                            <div className="flex flex-col space-y-2">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className={`block text-3xl font-bold py-4 border-b border-white/5 transition-colors ${pathname === link.href ? 'text-primary' : 'text-white hover:text-primary'
                                                }`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="pt-8"
                                >
                                    <Link
                                        href="/contact"
                                        className="block w-full text-center bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-all"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {t('getQuote')}
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
