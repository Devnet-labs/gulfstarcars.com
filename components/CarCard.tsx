'use client';

import Image from 'next/image';
import { useState } from 'react';
import { EnquiryModal } from './EnquiryModal';
import { Fuel, Settings2, Gauge, MessageSquare, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { optimizeCloudinaryUrl, cloudinaryPresets } from '@/lib/cloudinary';

export interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    images: string[];
    description: string;
    fuelType?: string | null;
    transmission?: string | null;
    mileage?: number | null;
    colour?: string | null;
    driveType?: string | null;
    engineCapacity?: string | null;
    customId?: string | null;
}

interface CarCardProps {
    car: Car;
    index?: number;
}

export function CarCard({ car, index = 0 }: CarCardProps) {
    const t = useTranslations('carCard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/cars/${car.id}`);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={index < 6 ? { opacity: 1, y: 0 } : undefined}
                whileInView={index >= 6 ? { opacity: 1, y: 0 } : undefined}
                viewport={{ once: true, margin: "0px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={handleCardClick}
                className="group bg-card rounded-[24px] overflow-hidden border border-white/5 shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full cursor-pointer"
            >
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    <Image
                        src={optimizeCloudinaryUrl(car.images[0] || '/placeholder-car.png', cloudinaryPresets.cardImage)}
                        alt={`${car.make} ${car.model}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={85}
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFhMWExYSIvPjwvc3ZnPg=="
                        priority={index < 6}
                        loading={index < 6 ? 'eager' : 'lazy'}
                        unoptimized={false}
                    />
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.1) + 0.3 }}
                        className="absolute top-4 left-4 bg-background/90 backdrop-blur-md text-foreground text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm z-10 border border-white/5"
                    >
                        {car.customId ? `${t('stkId')}: ${car.customId}` : t('exportReady')}
                    </motion.div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">{car.make} {car.model}</h3>
                            <span className="bg-secondary text-muted-foreground text-xs font-bold px-2 py-1 rounded-md border border-white/5">{car.year}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{car.description}</p>
                    </div>

                    {/* Specs Divider */}
                    <div className="flex items-center gap-4 py-4 border-t border-white/5 mb-4">
                        <div className="flex items-center text-xs text-muted-foreground font-medium">
                            <Fuel className="w-3.5 h-3.5 mr-1.5 text-primary" /> {car.fuelType || t('petrol')}
                        </div>
                        <div className="w-px h-3 bg-white/10"></div>
                        <div className="flex items-center text-xs text-muted-foreground font-medium">
                            <Settings2 className="w-3.5 h-3.5 mr-1.5 text-primary" /> {car.transmission || t('auto')}
                        </div>
                        <div className="w-px h-3 bg-white/10"></div>
                        <div className="flex items-center text-xs text-muted-foreground font-medium">
                            <Gauge className="w-3.5 h-3.5 mr-1.5 text-primary" /> {car.mileage?.toLocaleString() || '0'} km
                        </div>
                    </div>

                    {/* Additional Specs */}
                    {(car.colour || car.driveType || car.engineCapacity) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {car.colour && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-muted-foreground border border-white/5">
                                    {car.colour}
                                </span>
                            )}
                            {car.driveType && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-muted-foreground border border-white/5">
                                    {car.driveType}
                                </span>
                            )}
                            {car.engineCapacity && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-muted-foreground border border-white/5">
                                    {car.engineCapacity}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Price */}
                    <div className="mt-auto pt-4">
                        <div className="mb-4">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">{t('exportPrice')}</p>
                            <p className="text-2xl font-bold text-accent">${car.price.toLocaleString()}</p>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsModalOpen(true);
                                }}
                                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 font-semibold text-sm group/btn"
                            >
                                <MessageSquare className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                                <span>{t('enquiry')}</span>
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const message = encodeURIComponent(`Hi! I'm interested in the ${car.year} ${car.make} ${car.model} (ID: ${car.customId || 'N/A'}) listed at $${car.price.toLocaleString()}`);
                                    window.open(`https://wa.me/+919019721662?text=${message}`, '_blank');
                                }}
                                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-4 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 font-semibold text-sm group/btn"
                            >
                                <MessageCircle className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                                <span>{t('whatsapp')}</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <EnquiryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                car={car}
            />
        </>
    );
}
