import { getCarById } from '@/app/actions/getCarById';
import { notFound } from 'next/navigation';
import { CarImageGallery } from '@/components/CarImageGallery';
import { ProductViewTracker } from '@/components/ProductViewTracker';
import { Fuel, Settings2, Box, Shield, Calendar, Users, DoorOpen, Zap, Paintbrush, Globe, Reply } from 'lucide-react';
import Link from 'next/link';
import { DetailClientActions } from './ClientComponents';
import { getTranslations, getLocale } from 'next-intl/server';
import { BackButton } from '@/components/BackButton';
import { generateCarMetadata, generateStructuredData } from '@/lib/metadata';

interface CarDetailPageProps {
    params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: CarDetailPageProps) {
    const { id, locale } = await params;
    const car = await getCarById(id, locale);

    if (!car || !car.isActive) {
        return {
            title: 'Car Not Found',
            description: 'The requested vehicle is not available.',
        };
    }

    // Get translated fields for metadata
    const translation = (car as any)?.translations?.[0];
    const make = translation?.make || car.make;
    const model = translation?.model || car.model;
    const description = translation?.description || car.description;

    return generateCarMetadata({
        make,
        model,
        year: car.year,
        price: car.price,
        description,
        images: car.images,
        id: car.id,
        locale,
    });
}


export default async function CarDetailPage({ params }: CarDetailPageProps) {
    const { id } = await params;
    const locale = await getLocale();
    const car = await getCarById(id, locale);
    const t = await getTranslations('cars.carDetails');
    const tSpecs = await getTranslations('cars.specs');
    const tEnums = await getTranslations('carEnums');

    // Get translated fields (from CarTranslation or fallback to original)
    const translation = (car as any)?.translations?.[0];
    const tFields = {
        description: translation?.description || car?.description,
        make: translation?.make || car?.make,
        model: translation?.model || car?.model,
        bodyType: translation?.bodyType || car?.bodyType,
        fuelType: translation?.fuelType || car?.fuelType,
        steering: translation?.steering || car?.steering,
        transmission: translation?.transmission || car?.transmission,
        engineCapacity: translation?.engineCapacity || car?.engineCapacity,
        colour: translation?.colour || car?.colour,
        driveType: translation?.driveType || car?.driveType,
        location: translation?.location || car?.location,
    };

    if (!car || !car.isActive) {
        notFound();
    }

    const hasTechSpecs = [
        tFields.engineCapacity,
        tFields.colour,
        tFields.driveType,
        tFields.bodyType,
        car.bodyType,
        tFields.steering,
        car.steering,
        car.doors,
        car.seats,
        tFields.location
    ].some(v => v !== null && v !== undefined && v !== '');

    return (
        <div className="min-h-screen pt-16 sm:pt-20 pb-8 bg-[#0B0F19]">
            <ProductViewTracker carId={car.id} />
            <div className="container mx-auto px-4 sm:px-6">
                <BackButton />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-12">
                    {/* Left Column: Gallery & Description */}
                    <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                        <CarImageGallery images={car.images} alt={`${tFields.make} ${tFields.model}`} />

                        <div className="bg-card/50 backdrop-blur-sm rounded-2xl sm:rounded-[32px] p-5 sm:p-8 border border-white/5 shadow-2xl">
                            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground tracking-tight">{t('description')}</h2>
                            <div className="prose prose-invert max-w-none text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                                {tFields.description}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Key Details & Actions */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-card rounded-2xl sm:rounded-[32px] p-5 sm:p-8 border border-white/5 shadow-2xl lg:sticky lg:top-20">
                            <div className="mb-6 sm:mb-8">
                                <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-2">
                                    <span className="px-2.5 sm:px-3 py-1 bg-primary text-white text-[10px] sm:text-[11px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-primary/20 border border-white/10">
                                        {t('stockId')}: {car.customId || 'N/A'}
                                    </span>
                                    <span className="px-2.5 sm:px-3 py-1 bg-primary/10 text-primary text-[11px] sm:text-xs font-bold rounded-full uppercase tracking-wider">
                                        {tEnums(`condition.${car.condition}`)}
                                    </span>
                                    <span className="px-2.5 sm:px-3 py-1 bg-green-500/10 text-green-500 text-[11px] sm:text-xs font-bold rounded-full uppercase tracking-wider">
                                        {tEnums(`status.${car.status}`)}
                                    </span>
                                </div>
                                <h1 className="text-[28px] sm:text-3xl font-black text-white mb-2 leading-tight tracking-tight">{car.year} {tFields.make} {tFields.model}</h1>
                                <div className="space-y-1">
                                    <span className="text-muted-foreground font-medium text-xs sm:text-sm block uppercase tracking-wider">{t('exportPrice')}</span>
                                    <div className="flex items-baseline gap-2">
                                        {car.price ? (
                                            <span className="text-3xl sm:text-4xl font-black text-accent">
                                                ${car.price.toLocaleString()}
                                            </span>
                                        ) : (
                                            <span className="text-xl sm:text-2xl font-black text-accent">
                                                {t('priceOnRequest')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                                <DetailInfoItem icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />} label={tSpecs('year')} value={car.year.toString()} />
                                {tFields.bodyType && <DetailInfoItem icon={<Box className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />} label={tSpecs('bodyType')} value={tFields.bodyType || (car.bodyType ? tEnums(`bodyType.${car.bodyType}`) : '')} />}
                                {tFields.fuelType && <DetailInfoItem icon={<Fuel className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />} label={tSpecs('fuelType')} value={tFields.fuelType} />}
                                {tFields.transmission && <DetailInfoItem icon={<Settings2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />} label={tSpecs('transmission')} value={tFields.transmission} />}
                            </div>

                            <DetailClientActions car={car} />

                            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/5 space-y-4">
                                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400">
                                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                                    <span className="font-medium">{t('verifiedReport')}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400">
                                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                                    <span className="font-medium">{t('globalExport')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Specifications Section */}
                {hasTechSpecs && (
                    <div className="mt-6 sm:mt-12 bg-card/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl lg:rounded-[40px] p-6 sm:p-12 border border-white/5 shadow-2xl">
                        <h2 className="text-xl sm:text-3xl font-bold mb-6 sm:mb-10 text-center tracking-tight">{t('techSpecs')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-x-12 lg:gap-y-8">
                            <SpecItem icon={<Zap />} label={tSpecs('engineCapacity')} value={tFields.engineCapacity} />
                            <SpecItem icon={<Paintbrush />} label={tSpecs('colour')} value={tFields.colour} />
                            <SpecItem icon={<Settings2 />} label={tSpecs('driveType')} value={tFields.driveType || (car.driveType ? tEnums(`driveType.${car.driveType}`) : undefined)} />
                            <SpecItem icon={<Box />} label={tSpecs('bodyType')} value={tFields.bodyType || (car.bodyType ? tEnums(`bodyType.${car.bodyType}`) : undefined)} />
                            <SpecItem icon={<Reply />} label={tSpecs('steering')} value={tFields.steering || (car.steering ? tEnums(`steering.${car.steering}`) : undefined)} />
                            <SpecItem icon={<DoorOpen />} label={tSpecs('doors')} value={car.doors?.toString()} />
                            <SpecItem icon={<Users />} label={tSpecs('seats')} value={car.seats?.toString()} />
                            <SpecItem icon={<Fuel />} label={tSpecs('location')} value={tFields.location} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function DetailInfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="bg-white/[0.03] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 transition-colors hover:bg-white/[0.05]">
            <div className="mb-2 sm:mb-2.5">{icon}</div>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-slate-500 font-black mb-1 leading-none">{label}</p>
            <p className="text-sm sm:text-base font-bold text-white truncate">{value}</p>
        </div>
    );
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-white/5 transition-all group">
            <div className="mt-1 text-primary flex-shrink-0 p-2.5 bg-primary/5 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
            <div className="min-w-0">
                <p className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-500 mb-1 font-black">{label}</p>
                <p className="text-base sm:text-lg font-bold text-white break-words">{value}</p>
            </div>
        </div>
    );
}
