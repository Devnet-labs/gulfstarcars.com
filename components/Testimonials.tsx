'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Testimonials() {
    const t = useTranslations('testimonials');
    const items = ['item1', 'item2', 'item3'] as const;

    return (
        <section className="py-32 bg-card/20 relative overflow-hidden">
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
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {t('title')} <span className="text-primary">{t('titleHighlight')}</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {items.map((key, idx) => (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-background/60 backdrop-blur-2xl p-10 rounded-[32px] border border-white/10 relative group hover:border-primary/40 transition-all duration-500"
                        >
                            <Quote className="absolute top-8 right-8 h-12 w-12 text-primary/10 group-hover:text-primary/20 transition-colors" />

                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                ))}
                            </div>

                            <p className="text-lg text-slate-300 mb-8 italic leading-relaxed">
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
