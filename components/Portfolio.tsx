'use client';

import { motion } from 'framer-motion';
import { ExternalLink, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

const portfolioImages = {
    item1: "/images/portfolio/delivery-1.png",
    item2: "/images/portfolio/delivery-2.png",
    item3: "/images/portfolio/delivery-3.png"
};

export function Portfolio() {
    const t = useTranslations('portfolio');
    const items = ['item1', 'item2', 'item3'] as const;

    return (
        <section className="py-16 sm:py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 sm:mb-20"
                >
                    <span className="text-primary font-bold tracking-widest text-sm uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 backdrop-blur-md mb-6 inline-block">
                        {t('badge')}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 sm:mb-6">
                        {t('title')} <br />
                        <span className="text-primary">{t('titleHighlight')}</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed px-4">
                        {t('subtitle')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">
                    {items.map((key, idx) => (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group relative overflow-hidden rounded-[24px] sm:rounded-[32px] aspect-[4/5] border border-white/10"
                        >
                            <img
                                src={portfolioImages[key]}
                                alt={t(`items.${key}.title`)}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-8 transform translate-y-2 sm:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    <MapPin className="h-4 w-4" />
                                    {t(`items.${key}.location`)}
                                </div>
                                <h3 className="text-base sm:text-2xl font-bold text-white mb-1 sm:mb-2 line-clamp-1">{t(`items.${key}.title`)}</h3>
                                <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                    {t(`items.${key}.category`)}
                                </p>
                            </div>

                            <div className="absolute top-6 end-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
                                <ExternalLink className="h-5 w-5 text-white" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
