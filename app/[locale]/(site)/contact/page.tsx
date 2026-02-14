'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, MessageCircle, Send, Clock, Globe } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
    const t = useTranslations('contact');
    const tFooter = useTranslations('footer');
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setSubmitted(true);
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white">
            {/* --- HERO SECTION --- */}
            <section className="relative py-12 sm:py-16 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                            {t('title')}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- MAIN CONTENT SECTION --- */}
            <section className="pb-12 sm:pb-24 px-4 sm:px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="space-y-16 mt-10">

                        {/* CONTACT INFO GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="space-y-12"
                            >
                                {/* Offices */}
                                <div className="space-y-8">
                                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary flex items-center justify-center gap-3 mb-12">
                                        <Globe className="w-4 h-4" />
                                        {t('officesTitle')}
                                    </h2>
                                    <div className="grid gap-6">
                                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-[3rem] hover:border-primary/40 transition-all group shadow-2xl relative overflow-hidden">
                                            <div className="absolute top-0 inset-e-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
                                            <div className="flex gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                                                    <MapPin className="w-6 h-6 text-primary" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="font-bold text-xl sm:text-2xl text-white tracking-tight">{t('dubaiBranch')}</h3>
                                                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: tFooter('addressDubai') }} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-[3rem] hover:border-primary/40 transition-all group shadow-2xl relative overflow-hidden">
                                            <div className="absolute top-0 inset-e-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
                                            <div className="flex gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                                                    <MapPin className="w-6 h-6 text-primary" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="font-bold text-xl sm:text-2xl text-white tracking-tight">{t('ajmanOffice')}</h3>
                                                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: tFooter('address') }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="space-y-12"
                            >
                                {/* Quick Connect */}
                                <div className="space-y-8">
                                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary flex items-center justify-center gap-3 mb-12">
                                        <Send className="w-4 h-4" />
                                        {t('quickConnect')}
                                    </h2>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-primary/30 transition-all duration-300">
                                            <div className="space-y-1">
                                                <p className="text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-hover:text-primary/60 transition-colors">{t('callUs')}</p>
                                                <a href={`tel:${tFooter('phone')}`} className="text-xl sm:text-2xl font-bold text-white hover:text-primary transition-colors tracking-tight" dir="ltr">{tFooter('phone')}</a>
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                                                <Phone className="w-5 h-5 text-primary" />
                                            </div>
                                        </div>

                                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-primary/30 transition-all duration-300">
                                            <div className="space-y-1">
                                                <p className="text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-hover:text-primary/60 transition-colors">{t('emailUs')}</p>
                                                <a
                                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${tFooter('emails.info')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xl sm:text-2xl font-bold text-white hover:text-primary transition-colors tracking-tight"
                                                >
                                                    {tFooter('emails.info')}
                                                </a>
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                                                <Mail className="w-5 h-5 text-primary" />
                                            </div>
                                        </div>

                                        <a
                                            href="https://wa.me/971523479535"
                                            target="_blank"
                                            className="flex items-center justify-between bg-green-500/5 backdrop-blur-xl border border-green-500/10 p-10 rounded-[3rem] hover:bg-green-500/10 hover:border-green-500/30 transition-all group mt-4 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 inset-e-0 w-32 h-32 bg-green-500/5 blur-3xl -z-10 group-hover:bg-green-500/10 transition-colors" />
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                    <MessageCircle className="w-8 h-8 text-green-500" />
                                                </div>
                                                <div>
                                                    <p className="text-green-500 font-black text-[10px] sm:text-xs uppercase tracking-widest mb-1 opacity-80">{t('availableNow')}</p>
                                                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{t('whatsAppSupport')}</h3>
                                                </div>
                                            </div>
                                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white scale-90 group-hover:scale-100 group-hover:rotate-[-12deg] transition-all duration-500 shadow-xl shadow-green-500/20">
                                                <Send className="w-5 h-5" />
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- MAP SECTION --- */}
            <section className="py-12 sm:py-24 relative overflow-hidden border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                                {t('mapTitle')}
                            </h2>
                            <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
                                {t('mapSubtitle')}
                            </p>
                            <div className="flex justify-center pt-2">
                                <div className="h-0.5 w-12 bg-primary rounded-full" />
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative"
                    >
                        {/* Map Overlay for context */}
                        <div className="absolute top-8 inset-s-8 z-10 bg-background/80 backdrop-blur-md border border-white/10 p-6 rounded-3xl hidden md:block max-w-xs">
                            <h3 className="font-bold text-lg mb-2">{t('dubaiBranch')}</h3>
                            <p className="text-sm text-gray-400 mb-4">{t('mapSubtitle')}</p>
                            <a
                                href="https://maps.google.com/?q=DUCAMZ+Dubai"
                                target="_blank"
                                className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline"
                            >
                                {t('getDirections')} <Globe className="w-4 h-4" />
                            </a>
                        </div>

                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14441.74502506842!2d55.36709605!3d25.18846005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f67a2de940b07%3A0xc3f10f4438318db4!2sDUCAMZ!5e0!3m2!1sen!2sae!4v1700000000000"
                            width="100%"
                            height="600"
                            style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
