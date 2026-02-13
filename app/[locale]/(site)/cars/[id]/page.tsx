import { getCarById } from '@/app/actions/getCarById';
import { notFound } from 'next/navigation';
import { CarImageGallery } from '@/components/CarImageGallery';
import { ProductViewTracker } from '@/components/ProductViewTracker';
import { Fuel, Settings2, Gauge, Shield, Calendar, Users, DoorOpen, Zap, Paintbrush, Globe, Box, Reply } from 'lucide-react';
import Link from 'next/link';
import { DetailClientActions } from './ClientComponents';
import { getTranslations, getLocale } from 'next-intl/server';

interface CarDetailPageProps {
    params: Promise<{ id: string }>;
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
        brand: translation?.brand || (car as any)?.brand,
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

    if (!car) {
        notFound();
    }

    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-8 sm:pb-16 bg-[#0B0F19]">
            <ProductViewTracker carId={car.id} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Navigation Breadcrumb */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 overflow-x-auto">
                    <Link href="/" className="hover:text-primary transition-colors whitespace-nowrap">{t('breadcrumb.home')}</Link>
                    <span>/</span>
                    <Link href="/cars" className="hover:text-primary transition-colors whitespace-nowrap">{t('breadcrumb.inventory')}</Link>
                    <span>/</span>
                    <span className="text-foreground font-medium truncate">{tFields.brand} {tFields.make} {tFields.model}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
                    {/* Left Column: Gallery & Description */}
                    <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                        <CarImageGallery images={car.images} alt={`${tFields.brand} ${tFields.make} ${tFields.model}`} />

                        <div className="bg-card/50 backdrop-blur-sm rounded-2xl sm:rounded-[32px] p-4 sm:p-6 md:p-8 border border-white/5 shadow-2xl">
                            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground tracking-tight">{t('description')}</h2>
                            <div className="prose prose-invert max-w-none text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                                {tFields.description}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Key Details & Actions */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-card rounded-2xl sm:rounded-[32px] p-4 sm:p-6 md:p-8 border border-white/5 shadow-2xl lg:sticky lg:top-24">
                            <div className="mb-6 sm:mb-8">
                                <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-2">
                                    <span className="px-2 sm:px-3 py-1 bg-primary text-white text-[9px] sm:text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-primary/20 border border-white/10">
                                        {t('stockId')}: {car.customId || 'N/A'}
                                    </span>
                                    <span className="px-2 sm:px-3 py-1 bg-primary/10 text-primary text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider">
                                        {tEnums(`condition.${car.condition}`)}
                                    </span>
                                    <span className="px-2 sm:px-3 py-1 bg-green-500/10 text-green-500 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider">
                                        {tEnums(`status.${car.status}`)}
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{car.year} {tFields.brand} {tFields.make} {tFields.model}</h1>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl sm:text-4xl font-black text-accent">${car.price.toLocaleString()}</span>
                                    <span className="text-muted-foreground font-medium text-xs sm:text-sm">{t('exportPrice')}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                                <DetailInfoItem icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />} label={tSpecs('year')} value={car.year.toString()} />
                                <DetailInfoItem icon={<Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />} label={tSpecs('mileage')} value={`${car.mileage?.toLocaleString() || '0'} ${tSpecs('km')}`} />
                                <DetailInfoItem icon={<Fuel className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />} label={tSpecs('fuelType')} value={tFields.fuelType || tEnums('fuelType.Petrol')} />
                                <DetailInfoItem icon={<Settings2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />} label={tSpecs('transmission')} value={tFields.transmission || tEnums('transmission.Automatic')} />
                            </div>

                            <DetailClientActions car={car as any} />

                            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/5 space-y-3 sm:space-y-4">
                                <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                                    <span>{t('verifiedReport')}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                                    <span>{t('globalExport')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Specifications Section */}
                <div className="mt-8 sm:mt-12 lg:mt-16 bg-card/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl lg:rounded-[40px] p-4 sm:p-6 md:p-8 lg:p-12 border border-white/5 shadow-2xl">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 lg:mb-10 text-center tracking-tight">{t('techSpecs')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-x-12 lg:gap-y-8">
                        <SpecItem icon={<Zap />} label={tSpecs('engineCapacity')} value={car.engineCapacity} />
                        <SpecItem icon={<Paintbrush />} label={tSpecs('colour')} value={car.colour} />
                        <SpecItem icon={<Settings2 />} label={tSpecs('driveType')} value={car.driveType ? tEnums(`driveType.${car.driveType}`) : undefined} />
                        <SpecItem icon={<Box />} label={tSpecs('bodyType')} value={car.bodyType ? tEnums(`bodyType.${car.bodyType}`) : undefined} />
                        <SpecItem icon={<Reply />} label={tSpecs('steering')} value={car.steering ? tEnums(`steering.${car.steering}`) : undefined} />
                        <SpecItem icon={<DoorOpen />} label={tSpecs('doors')} value={car.doors?.toString()} />
                        <SpecItem icon={<Users />} label={tSpecs('seats')} value={car.seats?.toString()} />
                        <SpecItem icon={<Fuel />} label={tSpecs('location')} value={car.location} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailInfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="bg-secondary/30 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 transition-colors hover:bg-secondary/50">
            <div className="mb-1.5 sm:mb-2">{icon}</div>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">{label}</p>
            <p className="text-xs sm:text-sm font-bold text-foreground truncate">{value}</p>
        </div>
    );
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-white/5 transition-all">
            <div className="mt-0.5 sm:mt-1 text-primary flex-shrink-0">{icon}</div>
            <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">{label}</p>
                <p className="text-sm sm:text-base font-bold text-foreground break-words">{value}</p>
            </div>
        </div>
    );
}
