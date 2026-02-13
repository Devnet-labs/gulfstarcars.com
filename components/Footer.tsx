'use client';

import { Link } from '@/i18n/routing';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight, ShieldCheck, Globe, Clock, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
        <footer className="relative bg-[#0B0F19] text-white py-12 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
                <div className="absolute -top-24 -start-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-24 -end-24 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-[95%] mx-auto px-6 md:px-12 relative z-10">
                {/* Upper Footer: Branding & Quick Connect */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Column 1: Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-flex items-center group">
                            <div className="relative h-24 w-64 transition-all duration-700">
                                <img
                                    src="/images/portfolio/logo/logo.png"
                                    alt={t('brand')}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 -ms-6"
                                />
                            </div>
                        </Link>

                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            {t('description')}
                        </p>

                        <div className="flex items-center gap-3">
                            {[
                                { Icon: Facebook, href: 'https://www.facebook.com/people/GULF-STAR-Automotive/61587500704497/' },
                                { Icon: Twitter, href: '#' }
                            ].map(({ Icon, href }, i) => (
                                <Link key={i} href={href} target="_blank" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-primary hover:border-primary hover:scale-110 shadow-lg hover:shadow-primary/25 transition-all duration-500 group">
                                    <Icon className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Links */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                            {t('usefulLinks')}
                        </h3>
                        <ul className="space-y-3">
                            {usefulLinks.map((item) => (
                                <li key={item.key}>
                                    <Link
                                        href={`/${item.key === 'inventory' ? 'cars' : item.key}`}
                                        className="text-gray-400 hover:text-white transition-all flex items-center group text-sm font-semibold"
                                    >
                                        <span className="w-0 h-px bg-primary group-hover:w-4 transition-all duration-500 me-0 group-hover:me-2 opacity-0 group-hover:opacity-100" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Locations */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                            {t('addressLabel')}
                        </h3>
                        <div className="space-y-6">
                            {/* Dubai Address */}
                            <div className="flex gap-3 group cursor-pointer">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                    <MapPin className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Dubai Branch</p>
                                    <p className="text-xs font-bold text-white group-hover:text-primary transition-colors leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: t.raw('addressDubai') }}
                                    />
                                </div>
                            </div>

                            {/* Ajman Address */}
                            <div className="flex gap-3 group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <MapPin className="h-3.5 w-3.5 text-gray-500 group-hover:text-primary transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Ajman Office</p>
                                    <p className="text-xs font-bold text-white/70 group-hover:text-primary transition-colors leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: t.raw('address') }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Connect */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                            {t('contactInfo')}
                        </h3>
                        <div className="space-y-6">
                            {/* Email */}
                            <div className="flex gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500 shrink-0">
                                    <Mail className="h-3.5 w-3.5 text-gray-500 group-hover:text-primary transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">{t('emailLabel')}</p>
                                    <div className="flex flex-col gap-1">
                                        <a
                                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${t('emails.info')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-bold text-white hover:text-primary transition-colors block"
                                        >
                                            {t('emails.info')}
                                        </a>
                                        <a
                                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${t('emails.sales')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-bold text-white hover:text-primary transition-colors block"
                                        >
                                            {t('emails.sales')}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Phones */}
                            <div className="flex gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500 shrink-0">
                                    <Phone className="h-3.5 w-3.5 text-gray-500 group-hover:text-primary transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">{t('phoneLabel')}</p>
                                    <div className="flex flex-col gap-1">
                                        <a href={`tel:${t('phone')}`} className="text-xs font-bold text-white hover:text-primary transition-colors">{t('phone')}</a>
                                        <a href={`tel:${t('phone2')}`} className="text-xs font-bold text-white hover:text-primary transition-colors">{t('phone2')}</a>
                                        <a href={`tel:${t('phone3')}`} className="text-xs font-bold text-white hover:text-primary transition-colors">{t('phone3')}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Bottom Bar: Copyright & Terms */}
                <div className="flex flex-col lg:row-reverse lg:flex-row justify-between items-center gap-6 border-t border-white/5 pt-6 mt-0">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                            <Link href="/privacy" className="hover:text-white transition-colors">{t('privacy')}</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">{t('terms')}</Link>
                        </div>
                        <button
                            onClick={scrollToTop}
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-500 shadow-xl"
                        >
                            <ChevronUp className="w-4 h-4 text-white" />
                        </button>
                    </div>
                    <div className="text-center lg:text-start space-y-1">
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                            &copy; {new Date().getFullYear()} {t('copyright')}
                        </p>
                        <p className="text-[9px] text-gray-700 uppercase tracking-[0.1em] font-medium">
                            {t('tagline')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
