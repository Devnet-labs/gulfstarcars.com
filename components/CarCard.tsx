'use client';

import { useState } from 'react';
import { EnquiryModal } from './EnquiryModal';
import { Fuel, Settings2, Box, MessageSquare, Zap, Compass } from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';


import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { optimizeCloudinaryUrl, cloudinaryPresets } from '@/lib/cloudinary';

export interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number | null;
    images: string[];
    description: string;
    fuelType?: string | null;
    transmission?: string | null;
    mileage?: number | null;
    colour?: string | null;
    driveType?: string | null;
    engineCapacity?: string | null;
    bodyType?: string | null;
    customId?: string | null;
}

interface CarCardProps {
    car: Car;
    index?: number;
}

export function CarCard({ car, index = 0 }: CarCardProps) {
    const t = useTranslations('carCard');
    const tEnums = useTranslations('carEnums');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    // Get translated fields (from CarTranslation or fallback to original)
    const translation = (car as any)?.translations?.[0];
    const tFields = {
        description: translation?.description || car.description,
        make: translation?.make || car.make,
        model: translation?.model || car.model,
        colour: translation?.colour || car.colour,
        fuelType: translation?.fuelType || car.fuelType,
        transmission: translation?.transmission || car.transmission,
        driveType: translation?.driveType || car.driveType,
        engineCapacity: translation?.engineCapacity || car.engineCapacity,
        bodyType: translation?.bodyType || (car as any).bodyType,
    };

    const handleCardClick = () => {
        router.push(`/cars/${car.id}`);
    };

    return (
        <>
            <div
                onClick={handleCardClick}
                className="group bg-card rounded-[16px] sm:rounded-[24px] overflow-hidden border border-white/5 shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full cursor-pointer hover:-translate-y-2"
            >
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    <img
                        src={optimizeCloudinaryUrl(car.images[0] || '/placeholder-car.png', cloudinaryPresets.cardImage)}
                        alt={`${tFields.make} ${tFields.model}`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading={index < 6 ? 'eager' : 'lazy'}
                    />
                    <div
                        className="absolute top-2 start-2 sm:top-4 sm:start-4 bg-background/90 backdrop-blur-md text-foreground text-[10px] font-extrabold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full uppercase tracking-wider shadow-sm z-10 border border-white/5"
                    >
                        {car.customId ? `${t('stkId')}: ${car.customId}` : t('exportReady')}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-3 sm:p-6 flex flex-col flex-grow">
                    <div className="mb-2 sm:mb-4">
                        <div className="flex justify-between items-start mb-1 sm:mb-2">
                            <h3 className="text-sm sm:text-lg font-bold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">{tFields.make} {tFields.model}</h3>
                            <span className="bg-secondary text-muted-foreground text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-white/5">{car.year}</span>
                        </div>
                        <p className="text-[10px] sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2 leading-relaxed">{tFields.description}</p>
                    </div>

                    {/* Specs Divider */}
                    {(tFields.fuelType || tFields.transmission || tFields.bodyType) && (
                        <div className="flex items-center gap-2 sm:gap-4 py-2 sm:py-4 border-t border-white/5 mb-2 sm:mb-4">
                            {tFields.fuelType && (
                                <>
                                    <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground font-medium">
                                        <Fuel className="w-3 h-3 sm:w-3.5 sm:h-3.5 me-1 sm:me-1.5 text-primary" /> {tFields.fuelType}
                                    </div>
                                    {(tFields.transmission || tFields.bodyType) && <div className="w-px h-3 bg-white/10"></div>}
                                </>
                            )}
                            {tFields.transmission && (
                                <>
                                    <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground font-medium">
                                        <Settings2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 me-1 sm:me-1.5 text-primary" /> {tFields.transmission}
                                    </div>
                                    {tFields.bodyType && <div className="w-px h-3 bg-white/10"></div>}
                                </>
                            )}
                            {tFields.bodyType && (
                                <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground font-medium">
                                    <Box className="w-3 h-3 sm:w-3.5 sm:h-3.5 me-1 sm:me-1.5 text-primary" /> {tFields.bodyType || (car.bodyType ? tEnums(`bodyType.${car.bodyType}`) : '')}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mb-4">
                        <button
                            onClick={handleCardClick}
                            className="text-[10px] sm:text-xs text-primary/80 hover:text-primary font-bold uppercase tracking-widest transition-colors flex items-center gap-1 group/link"
                        >
                            <span>{t('viewFullSpecs')}</span>
                            <span className="transition-transform group-hover/link:translate-x-1">→</span>
                        </button>
                    </div>

                    {/* Price */}
                    <div className="mt-auto pt-2 sm:pt-4">
                        <div className="mb-2 sm:mb-4">
                            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5">{t('exportPrice')}</p>
                            {car.price ? (
                                <p className="text-lg sm:text-2xl font-bold text-accent">
                                    ${car.price.toLocaleString()}
                                </p>
                            ) : (
                                <p className="text-sm sm:text-lg font-bold text-accent">
                                    {t('priceOnRequest')}
                                </p>
                            )}
                        </div>

                        {/* Action Buttons Row */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsModalOpen(true);
                                }}
                                className="flex items-center justify-center gap-1.5 sm:gap-2 bg-primary hover:bg-primary/90 text-white px-2 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 font-semibold text-[10px] sm:text-sm group/btn active:scale-95"
                            >
                                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover/btn:scale-110" />
                                <span>{t('enquiry')}</span>
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const priceInfo = car.price ? ` listed at $${car.price.toLocaleString()}` : '';
                                    const message = encodeURIComponent(`Hi! I'm interested in the ${car.year} ${car.make} ${car.model} (ID: ${car.customId || 'N/A'})${priceInfo}`);
                                    window.open(`https://wa.me/+971523479535?text=${message}`, '_blank');
                                }}
                                className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-2 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 font-semibold text-[10px] sm:text-sm group/btn active:scale-95"
                            >
                                <WhatsAppIcon className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover/btn:scale-110" />
                                <span>{t('whatsapp')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <EnquiryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                car={car}
            />
        </>
    );
}
