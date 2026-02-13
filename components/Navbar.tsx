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
        { href: '/contact', label: t('contact') },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4 }}
                className={`fixed top-0 left-0 right-0 z-[100] bg-[#0A0A0A]/95 backdrop-blur-md border-b transition-all duration-300 ${isScrolled ? 'border-[#262626]' : 'border-transparent'
                    }`}
            >
                {/* Gold accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

                <div className="w-full pl-0 pr-4 sm:px-6 md:px-8 lg:px-16 max-w-[100vw] py-0">
                    <div className={`relative flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 py-0 ${isScrolled ? 'h-20 sm:h-24 lg:h-24' : 'h-24 sm:h-28 lg:h-32'}
                        `}>
                        {/* Logo — full height, zero padding so no top/bottom gap */}
                        <Link href="/" className="flex items-center h-full min-w-0 shrink cursor-pointer p-0 m-0">
                            <motion.div
                                animate={{ scale: isScrolled ? 0.9 : 1 }}
                                transition={{ duration: 0.3 }}
                                className="relative h-full w-[400px] sm:w-[440px] md:w-[500px] lg:w-[600px] xl:w-[680px] shrink-0 p-0 m-0 block leading-[0]"
                            >
                                <Image
                                    src="/images/portfolio/logo/logo.png"
                                    alt={t('brand')}
                                    fill
                                    className="object-contain object-left"
                                    priority
                                    sizes="(max-width: 640px) 400px, (max-width: 768px) 440px, (max-width: 1024px) 500px, (max-width: 1280px) 600px, 680px"
                                />
                            </motion.div>
                        </Link>

                        {/* Desktop Navigation - Centered (lg and up), horizontal row */}
                        <div className="hidden lg:flex flex-row items-center gap-6 xl:gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none lg:pointer-events-auto">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`relative text-base font-medium tracking-wide transition-colors duration-200 group cursor-pointer whitespace-nowrap ${isActive ? 'text-[#D4AF37]' : 'text-[#A3A3A3] hover:text-white'
                                            }`}
                                    >
                                        {link.label}
                                        <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#D4AF37] transition-all duration-200 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                                            }`} />
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-auto">
                            <LanguageSwitcher />

                            <Link
                                href="/contact"
                                className="hidden lg:inline-flex bg-[#D4AF37] hover:bg-[#C19B2E] text-black px-4 xl:px-5 py-2.5 rounded-lg text-base font-medium transition-all duration-200 active:scale-95 cursor-pointer"
                            >
                                {t('getQuote')}
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                type="button"
                                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 -mr-1 text-[#A3A3A3] hover:text-[#D4AF37] transition-colors cursor-pointer touch-manipulation"
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu - full width on xs, panel on sm+ */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-[320px] sm:w-80 bg-[#0A0A0A] border-l border-[#262626] shadow-2xl lg:hidden"
                    >
                        <div className="flex flex-col h-full">
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#262626]">
                                <span className="text-base sm:text-lg font-semibold text-white">Menu</span>
                                <button
                                    type="button"
                                    aria-label="Close menu"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-[#A3A3A3] hover:text-[#D4AF37] transition-colors cursor-pointer touch-manipulation"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Mobile Links */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain">
                                <div className="space-y-0.5">
                                    {navLinks.map((link, index) => (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={link.href}
                                                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer touch-manipulation ${pathname === link.href
                                                    ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                                                    : 'text-[#A3A3A3] hover:bg-[#141414] hover:text-white'
                                                    }`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {link.label}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="mt-6"
                                >
                                    <Link
                                        href="/contact"
                                        className="block w-full text-center bg-[#D4AF37] hover:bg-[#C19B2E] text-black px-5 py-3 rounded-lg font-medium transition-all active:scale-95 cursor-pointer"
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

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 sm:bg-black/20 backdrop-blur-sm z-40 lg:hidden cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-hidden
                    />
                )}
            </AnimatePresence>
        </>
    );
}
