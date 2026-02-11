'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';

export default function ContactPage() {
    const t = useTranslations('contact');
    const tFooter = useTranslations('footer');

    const contactMethods = [
        {
            icon: MapPin,
            title: 'Location',
            content: <p className="text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: tFooter('address') }} />,
            delay: 0.1
        },
        {
            icon: Phone,
            title: 'Phone',
            content: (
                <div className="space-y-1 text-gray-400">
                    <p>{tFooter('phone')}</p>
                    <p>{tFooter('phone2')}</p>
                    <p>{tFooter('phone3')}</p>
                </div>
            ),
            delay: 0.2
        },
        {
            icon: Mail,
            title: 'Email',
            content: (
                <div className="space-y-4">
                    <div className="space-y-1 text-gray-400">
                        <p>{tFooter('emails.info')}</p>
                        <p>{tFooter('emails.exports')}</p>
                    </div>
                    <button
                        onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=info@gulfstarcars.com', '_blank')}
                        className="inline-flex items-center gap-2 bg-white/5 hover:bg-primary/20 text-white hover:text-primary px-6 py-2 rounded-xl transition-all font-semibold text-sm border border-white/10 hover:border-primary/30"
                    >
                        <span>Send Email</span>
                        <Mail className="w-4 h-4" />
                    </button>
                </div>
            ),
            delay: 0.3
        },
        {
            icon: MessageCircle,
            title: 'WhatsApp',
            content: (
                <div className="space-y-3">
                    <p className="text-gray-400">Chat with us directly</p>
                    <button
                        onClick={() => window.open('https://wa.me/971523479535', '_blank')}
                        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 py-2 rounded-xl transition-all font-semibold text-sm shadow-lg shadow-green-500/20"
                    >
                        <span>Chat Now</span>
                        <MessageCircle className="w-4 h-4" />
                    </button>
                </div>
            ),
            delay: 0.4,
            isWhatsApp: true
        }
    ];

    return (
        <div className="min-h-screen bg-[#0B0F19] pt-20 pb-12">
            {/* Header */}
            <section className="relative py-12 px-4 mb-8">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {contactMethods.map((method, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: method.delay }}
                            className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-primary/30 transition-all duration-300 group"
                        >
                            <div className="flex items-start gap-6">
                                <div className={`p-4 rounded-2xl ${method.isWhatsApp ? 'bg-[#25D366]/10 group-hover:bg-[#25D366]/20' : 'bg-primary/10 group-hover:bg-primary/20'} transition-colors duration-300`}>
                                    <method.icon className={`w-8 h-8 ${method.isWhatsApp ? 'text-[#25D366]' : 'text-primary'}`} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white">{method.title}</h3>
                                    {method.content}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
