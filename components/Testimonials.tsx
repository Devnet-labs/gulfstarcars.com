'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Testimonials() {
    const t = useTranslations('testimonials');
    const items = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] as const;

    return (
        <section className="py-16 sm:py-32 bg-card/20 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <span className="text-primary font-bold tracking-widest text-sm uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 backdrop-blur-md mb-6 inline-block">
                        {t('badge')}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                        {t('title')} <span className="text-primary">{t('titleHighlight')}</span>
                    </h2>
                </motion.div>

                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
                    {items.map((key, idx) => (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="flex-none w-[calc(85%-16px)] snap-start bg-background/60 backdrop-blur-2xl p-6 sm:p-10 rounded-[24px] sm:rounded-[32px] border border-white/10 relative group hover:border-primary/40 transition-all duration-500 md:w-full"
                        >
                            <Quote className="absolute top-8 end-8 h-12 w-12 text-primary/10 group-hover:text-primary/20 transition-colors" />

                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                ))}
                            </div>

                            <p className="text-base sm:text-lg text-slate-300 mb-8 italic leading-relaxed">
                                "{t(`items.${key}.content`)}"
                            </p>

                            <div className="border-t border-white/5 pt-6">
                                <div className="font-bold text-white text-xl mb-1">{t(`items.${key}.name`)}</div>
                                <div className="text-primary text-sm font-medium">{t(`items.${key}.role`)}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
