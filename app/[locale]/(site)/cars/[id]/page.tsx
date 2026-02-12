import { getCarById } from '@/app/actions/getCarById';
import { notFound } from 'next/navigation';
import { CarImageGallery } from '@/components/CarImageGallery';
import { Fuel, Settings2, Gauge, Shield, Calendar, Users, DoorOpen, Zap, Paintbrush, Globe, Box, Reply } from 'lucide-react';
import Link from 'next/link';
import { DetailClientActions } from './ClientComponents';
import { getTranslations } from 'next-intl/server';

interface CarDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
    const { id } = await params;
    const car = await getCarById(id);
    const t = await getTranslations('cars.carDetails');
    const tSpecs = await getTranslations('cars.specs');

    if (!car) {
        notFound();
    }

    return (
        <div className="min-h-screen pt-24 pb-16 bg-[#0B0F19]">
            <div className="container mx-auto px-4">
                {/* Navigation Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/" className="hover:text-primary transition-colors">{t('breadcrumb.home')}</Link>
                    <span>/</span>
                    <Link href="/cars" className="hover:text-primary transition-colors">{t('breadcrumb.inventory')}</Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">{car.make} {car.model}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Gallery & Description */}
                    <div className="lg:col-span-8 space-y-8">
                        <CarImageGallery images={car.images} alt={`${car.make} ${car.model}`} />

                        <div className="bg-card/50 backdrop-blur-sm rounded-[32px] p-8 border border-white/5 shadow-2xl">
                            <h2 className="text-2xl font-bold mb-6 text-foreground tracking-tight">{t('description')}</h2>
                            <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                                {car.description}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Key Details & Actions */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-card rounded-[32px] p-8 border border-white/5 shadow-2xl sticky top-24">
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-primary/20 border border-white/10">
                                        {t('stockId')}: {car.customId || 'N/A'}
                                    </span>
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                                        {car.condition}
                                    </span>
                                    <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full uppercase tracking-wider">
                                        {car.status}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">{car.year} {car.make} {car.model}</h1>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-accent">${car.price.toLocaleString()}</span>
                                    <span className="text-muted-foreground font-medium text-sm">{t('exportPrice')}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <DetailInfoItem icon={<Calendar className="w-5 h-5 text-primary" />} label={tSpecs('year')} value={car.year.toString()} />
                                <DetailInfoItem icon={<Gauge className="w-5 h-5 text-primary" />} label={tSpecs('mileage')} value={`${car.mileage?.toLocaleString() || '0'} ${tSpecs('km')}`} />
                                <DetailInfoItem icon={<Fuel className="w-5 h-5 text-primary" />} label={tSpecs('fuelType')} value={car.fuelType || 'Petrol'} />
                                <DetailInfoItem icon={<Settings2 className="w-5 h-5 text-primary" />} label={tSpecs('transmission')} value={car.transmission || 'Auto'} />
                            </div>

                            <DetailClientActions car={car} />

                            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Shield className="w-5 h-5 text-green-500" />
                                    <span>{t('verifiedReport')}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Globe className="w-5 h-5 text-blue-500" />
                                    <span>{t('globalExport')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Specifications Section */}
                <div className="mt-16 bg-card/50 backdrop-blur-sm rounded-[40px] p-8 md:p-12 border border-white/5 shadow-2xl">
                    <h2 className="text-3xl font-bold mb-10 text-center tracking-tight">{t('techSpecs')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8">
                        <SpecItem icon={<Zap />} label={tSpecs('engineCapacity')} value={car.engineCapacity} />
                        <SpecItem icon={<Paintbrush />} label={tSpecs('colour')} value={car.colour} />
                        <SpecItem icon={<Settings2 />} label={tSpecs('driveType')} value={car.driveType} />
                        <SpecItem icon={<Box />} label={tSpecs('bodyType')} value={car.bodyType} />
                        <SpecItem icon={<Reply />} label={tSpecs('steering')} value={car.steering} />
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
        <div className="bg-secondary/30 p-4 rounded-2xl border border-white/5 transition-colors hover:bg-secondary/50">
            <div className="mb-2">{icon}</div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">{label}</p>
            <p className="text-sm font-bold text-foreground">{value}</p>
        </div>
    );
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all">
            <div className="mt-1 text-primary">{icon}</div>
            <div>
                <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                <p className="font-bold text-foreground">{value}</p>
            </div>
        </div>
    );
}
