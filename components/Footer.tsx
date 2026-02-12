'use client';

import { Link } from '@/i18n/routing';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight, ShieldCheck, Globe, Clock, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function Footer() {
    const t = useTranslations('footer');

    const usefulLinks = [
        { key: 'about', label: t('links.about') },
        { key: 'inventory', label: t('links.inventory') },
        { key: 'services', label: t('links.services') },
        { key: 'contact', label: t('links.contact') },
        { key: 'faq', label: t('links.faq') }
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative bg-[#0B0F19] text-white pt-32 pb-12 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                {/* Upper Footer: Branding & Quick Connect */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                    <div className="lg:col-span-5 space-y-10">
                        <Link href="/" className="inline-flex items-center gap-5 group">
                            <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-3xl bg-white/5 p-1.5 border border-white/10 group-hover:border-primary/40 group-hover:bg-white/10 transition-all duration-700 shadow-2xl">
                                <Image
                                    src="/images/portfolio/logo/logo.png"
                                    alt={t('brand')}
                                    fill
                                    className="object-contain p-3 group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 rounded-3xl bg-primary/5 blur-xl group-hover:bg-primary/20 transition-all duration-700 -z-10" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl md:text-3xl font-extrabold tracking-tighter uppercase leading-none">
                                    {t('brand')}
                                </span>
                                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary mt-2">
                                    {t('slogan')}
                                </span>
                            </div>
                        </Link>

                        <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                            {t('description')}
                        </p>

                        <div className="flex items-center gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <Link key={i} href="#" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-primary hover:border-primary hover:scale-110 shadow-lg hover:shadow-primary/25 transition-all duration-500 group">
                                    <Icon className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-12">
                        {/* Column: Links */}
                        <div className="space-y-10">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                                {t('usefulLinks')}
                            </h3>
                            <ul className="space-y-5">
                                {usefulLinks.map((item) => (
                                    <li key={item.key}>
                                        <Link
                                            href={`/${item.key === 'inventory' ? 'cars' : item.key}`}
                                            className="text-gray-400 hover:text-white transition-all flex items-center group text-base font-semibold"
                                        >
                                            <span className="w-0 h-px bg-primary group-hover:w-6 transition-all duration-500 mr-0 group-hover:mr-4 opacity-0 group-hover:opacity-100" />
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column: Contact Details  */}
                        <div className="space-y-10">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                                {t('contactInfo')}
                            </h3>
                            <div className="space-y-8">
                                <div className="flex gap-5 group cursor-pointer">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
                                        <Mail className="h-5 w-5 text-gray-500 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-white/50 uppercase tracking-wider">{t('emailLabel')}</p>
                                        <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{t('emails.info')}</p>
                                    </div>
                                </div>

                                <div className="flex gap-5 group cursor-pointer">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
                                        <Phone className="h-5 w-5 text-gray-500 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-white/50 uppercase tracking-wider">{t('phoneLabel')}</p>
                                        <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{t('phone')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Bottom Bar: Copyright & Terms */}
                <div className="flex flex-col lg:row-reverse lg:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-8 text-[13px] font-bold uppercase tracking-widest text-gray-500">
                            <Link href="/privacy" className="hover:text-white transition-colors">{t('privacy')}</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">{t('terms')}</Link>
                        </div>
                        <button
                            onClick={scrollToTop}
                            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-500 shadow-xl"
                        >
                            <ChevronUp className="w-5 h-5 text-white" />
                        </button>
                    </div>
                    <div className="text-center lg:text-left space-y-2">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
                            &copy; {new Date().getFullYear()} {t('copyright')}
                        </p>
                        <p className="text-[10px] text-gray-700 uppercase tracking-[0.1em] font-medium">
                            {t('tagline')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
