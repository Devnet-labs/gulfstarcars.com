'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, MessageCircle } from 'lucide-react';
import { EnquiryModal } from '@/components/EnquiryModal';
import { Car } from '@/components/CarCard';

import { useTranslations } from 'next-intl';

interface DetailClientActionsProps {
    car: Car;
}

export function DetailClientActions({ car }: DetailClientActionsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const t = useTranslations('cars.carDetails');

    const handleWhatsApp = () => {
        const message = encodeURIComponent(`Hi! I'm interested in the ${car.year} ${car.make} ${car.model} (ID: ${car.customId || 'N/A'}) listed at $${car.price.toLocaleString()}. Please provide more details.`);
        window.open(`https://wa.me/+919019721662?text=${message}`, '_blank');
    };

    return (
        <>
            <div className="space-y-2.5 sm:space-y-3">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-primary hover:bg-primary/90 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold transition-all shadow-xl shadow-primary/20"
                >
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t('enquire')}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleWhatsApp}
                    className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold transition-all shadow-xl shadow-green-500/20"
                >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t('whatsapp')}
                </motion.button>
            </div>

            <EnquiryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                car={car}
            />
        </>
    );
}
