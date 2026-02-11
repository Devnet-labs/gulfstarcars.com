'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
    const t = useTranslations('contact');
    const tFooter = useTranslations('footer');
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formState);
        alert(t('success'));
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] pt-24 pb-20">
            {/* Header */}
            <section className="relative py-20 px-4 mb-12">
                <div className="absolute inset-0 bg-primary/5 pattern-grid-lg opacity-20" />
                <div className="container mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            {t('title')}
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            {t('subtitle')}
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-12"
                    >
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-white">
                                {tFooter('contactInfo')}
                            </h2>

                            {/* Address */}
                            <div className="flex items-start gap-6 group">
                                <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-primary/20 transition-colors duration-300">
                                    <MapPin className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Location</h3>
                                    <p className="text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: tFooter('address') }} />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-6 group">
                                <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-primary/20 transition-colors duration-300">
                                    <Phone className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Phone</h3>
                                    <div className="space-y-1 text-gray-400">
                                        <p>{tFooter('phone')}</p>
                                        <p>{tFooter('phone2')}</p>
                                        <p>{tFooter('phone3')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-6 group">
                                <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-primary/20 transition-colors duration-300">
                                    <Mail className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
                                    <div className="space-y-1 text-gray-400">
                                        <p>{tFooter('emails.info')}</p>
                                        <p>{tFooter('emails.exports')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    {t('name')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder={t('name')}
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    {t('email')}
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder={t('email')}
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    {t('message')}
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                                    placeholder={t('message')}
                                    value={formState.message}
                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group"
                            >
                                <span>{t('send')}</span>
                                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
