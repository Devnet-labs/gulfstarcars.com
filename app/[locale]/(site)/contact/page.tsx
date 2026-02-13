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
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block text-primary font-bold tracking-[0.2em] text-[10px] uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 mb-6">
                            Connect With Us
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            {t('title')}
                        </h1>
                        <p className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- MAIN CONTENT SECTION --- */}
            <section className="pb-24 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="space-y-16">

                        {/* CONTACT INFO GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="space-y-10"
                            >
                                {/* Offices */}
                                <div className="space-y-6">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                                        <Globe className="w-4 h-4" />
                                        Our Offices
                                    </h2>

                                    <div className="grid gap-6">
                                        {/* Dubai Branch */}
                                        <div className="bg-white/5 border border-white/10 p-7 rounded-[2rem] hover:border-primary/40 transition-all group">
                                            <div className="flex gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                                    <MapPin className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="font-bold text-lg">Dubai Branch (Primary)</h3>
                                                    <p className="text-sm text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: tFooter('addressDubai') }} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ajman Branch */}
                                        <div className="bg-white/5 border border-white/10 p-7 rounded-[2rem] hover:border-primary/20 transition-all opacity-80 hover:opacity-100">
                                            <div className="flex gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                    <MapPin className="w-5 h-5 text-gray-500" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="font-bold text-lg text-white/80">Ajman Free Zone Office</h3>
                                                    <p className="text-sm text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: tFooter('address') }} />
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
                                className="space-y-10"
                            >
                                {/* Quick Connect */}
                                <div className="space-y-6">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                                        <Send className="w-4 h-4" />
                                        Quick Connect
                                    </h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Call Us</p>
                                                <a href={`tel:${tFooter('phone')}`} className="text-base font-bold hover:text-primary transition-colors">{tFooter('phone')}</a>
                                            </div>
                                            <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Email Us</p>
                                                <a
                                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${tFooter('emails.info')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-base font-bold hover:text-primary transition-colors"
                                                >
                                                    {tFooter('emails.info')}
                                                </a>
                                            </div>
                                            <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>
                                        <a
                                            href="https://wa.me/971523479535"
                                            target="_blank"
                                            className="flex items-center justify-between bg-green-500/10 border border-green-500/20 p-8 rounded-[2rem] hover:bg-green-500/20 transition-all group mt-2"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
                                                    <MessageCircle className="w-6 h-6 text-green-500" />
                                                </div>
                                                <div>
                                                    <p className="text-green-500 font-bold text-xs mb-1">Available Now</p>
                                                    <h3 className="text-lg font-bold">WhatsApp Support</h3>
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                                                <Send className="w-4 h-4" />
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
            <section className="py-24 relative overflow-hidden border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                                {t('mapTitle')}
                            </h2>
                            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
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
                        <div className="absolute top-8 left-8 z-10 bg-background/80 backdrop-blur-md border border-white/10 p-6 rounded-3xl hidden md:block max-w-xs">
                            <h3 className="font-bold text-lg mb-2">Dubai Showroom</h3>
                            <p className="text-sm text-gray-400 mb-4">Visit our main export hub in DUCAMZ, Dubai.</p>
                            <a
                                href="https://maps.google.com/?q=DUCAMZ+Dubai"
                                target="_blank"
                                className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline"
                            >
                                Get Directions <Globe className="w-4 h-4" />
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
