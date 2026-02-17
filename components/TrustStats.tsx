'use client';

import { motion } from 'framer-motion';
import { Users, Globe, Award, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function TrustStats() {
    const t = useTranslations('trustStats');

    const stats = [
        {
            label: t('delivered.label'),
            value: "25,000+",
            icon: TrendingUp,
            description: t('delivered.description')
        },
        {
            label: t('countries.label'),
            value: "100+",
            icon: Globe,
            description: t('countries.description')
        },
        {
            label: t('clients.label'),
            value: "4.8/5",
            icon: Users,
            description: t('clients.description')
        },
        {
            label: t('years.label'),
            value: "25+",
            icon: Award,
            description: t('years.description')
        }
    ];

    return (
        <section className="py-12 sm:py-24 bg-card/30 border-y border-white/5 relative overflow-hidden text-white">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-background/40 backdrop-blur-xl p-4 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-white/10 flex flex-col items-center text-center group hover:border-primary/30 transition-all duration-500"
                        >
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500">
                                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                            </div>
                            <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 tracking-tight">{stat.value}</div>
                            <div className="text-sm sm:text-lg font-semibold text-white/90 mb-1 sm:mb-2">{stat.label}</div>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2">
                                {stat.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
