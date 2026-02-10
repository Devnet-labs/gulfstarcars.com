'use client';

import { Link } from '@/i18n/routing';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Footer() {
    const t = useTranslations('footer');

    const usefulLinks = [
        { key: 'about', label: t('links.about') },
        { key: 'inventory', label: t('links.inventory') },
        { key: 'services', label: t('links.services') },
        { key: 'contact', label: t('links.contact') },
        { key: 'faq', label: t('links.faq') }
    ];

    return (
        <footer className="bg-[#0f172a] text-white pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold tracking-tight text-white">
                                Gulfstarscars<span className="text-primary"></span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {t('description')}
                        </p>
                        <div className="flex space-x-4 pt-2">
                            {/* Social Icons */}
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <Link key={i} href="#" className="bg-white/5 p-3 rounded-full hover:bg-primary transition-all duration-300">
                                    <Icon className="h-4 w-4 text-white" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Useful Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-8 relative inline-block">
                            {t('usefulLinks')}
                            <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            {usefulLinks.map((item) => (
                                <li key={item.key}>
                                    <Link href={`/${item.key === 'inventory' ? 'cars' : item.key}`} className="text-gray-400 hover:text-primary transition-colors flex items-center group">
                                        <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-8 relative inline-block">
                            {t('contactInfo')}
                            <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary rounded-full"></span>
                        </h3>
                        <ul className="space-y-6">
                            <li className="flex items-start space-x-4">
                                <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                                <span className="text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: t('address') }} />
                            </li>
                            <li className="flex items-center space-x-4">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-gray-400 text-sm font-medium">+971 50 123 4567</span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-gray-400 text-sm">info@gulfstarscars.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-8 relative inline-block">
                            {t('newLaunches')}
                            <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary rounded-full"></span>
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">{t('subscribeText')}</p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder={t('emailPlaceholder')}
                                className="w-full bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-primary transition-colors text-sm placeholder:text-gray-600"
                            />
                            <button className="w-full bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-600/20">
                                {t('subscribeButton')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} {t('copyright')}</p>
                    <div className="flex space-x-8 text-sm text-gray-400">
                        <Link href="/privacy" className="hover:text-white transition-colors">{t('privacyPolicy')}</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">{t('termsConditions')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
