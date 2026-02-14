'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function BackButton() {
    const router = useRouter();
    const t = useTranslations('cars.carDetails');

    return (
        <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-slate-400 hover:text-primary transition-all mb-6 sm:mb-8"
        >
            <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-black uppercase tracking-widest">{t('backToSelection')}</span>
        </motion.button>
    );
}
