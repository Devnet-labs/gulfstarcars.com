'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FAQPage() {
    const t = useTranslations('faq');
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const questions = Array.from({ length: 9 }, (_, i) => ({
        question: t(`questions.q${i + 1}.question`),
        answer: t(`questions.q${i + 1}.answer`),
    }));

    return (
        <div className="min-h-screen pt-16 sm:pt-20 pb-16 bg-[#0B0F19]">
            <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12 sm:mb-16 pt-8 sm:pt-12"
                >
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6">
                        {t('pageTitle')}
                    </h1>
                    <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </motion.div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {questions.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-[#D4AF37]/30 transition-all"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left group"
                                >
                                    <span className="text-base sm:text-lg font-semibold text-white group-hover:text-[#D4AF37] transition-colors pr-4">
                                        {item.question}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex-shrink-0"
                                    >
                                        <ChevronDown className="w-5 h-5 text-[#D4AF37]" />
                                    </motion.div>
                                </button>

                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: isOpen ? 'auto' : 0,
                                        opacity: isOpen ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-5 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-white/5 pt-4">
                                        {item.answer}
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 sm:mt-16 text-center bg-gradient-to-r from-[#D4AF37]/10 to-[#C19B2E]/10 border border-[#D4AF37]/20 rounded-xl p-8 sm:p-10"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Still have questions?
                    </h2>
                    <p className="text-slate-400 mb-6">
                        Our team is here to help you with any inquiries about vehicle export services.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center justify-center bg-[#D4AF37] hover:bg-[#C19B2E] text-black px-8 py-3 rounded-lg font-semibold transition-all active:scale-95"
                    >
                        Contact Us
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
