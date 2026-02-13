import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ArrowLeft, Edit, Trash2, Eye, Languages, MapPin, Calendar, DollarSign, Gauge, Fuel, Settings2, Car, Palette, Compass, Reply, Box, Users, DoorOpen } from 'lucide-react';
import Image from 'next/image';
import DeleteCarButton from '@/components/admin/DeleteCarButton';
import { FormattedDate } from '@/components/FormattedDate';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminCarDetailPage({ params }: PageProps) {
    const { id } = await params;

    const car = await prisma.car.findUnique({
        where: { id },
        include: {
            translations: {
                select: { locale: true, status: true },
            },
        },
    });

    if (!car) {
        notFound();
    }

    const translationStats = car.translations || [];
    const completedTranslations = translationStats.filter((t: any) => t.status === 'COMPLETED').length;
    const totalTranslations = 6;

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Link
                        href="/admin/cars"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Cars
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {car.year} {car.make} {car.model}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Stock ID: <span className="font-mono font-bold text-primary">{car.customId || 'N/A'}</span>
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link
                        href={`/cars/${car.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                        <Eye className="h-4 w-4" />
                        View on Site
                    </Link>
                    <Link
                        href={`/admin/cars/${car.id}/translations`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                        <Languages className="h-4 w-4" />
                        Translations ({completedTranslations}/{totalTranslations})
                    </Link>
                    <Link
                        href={`/admin/cars/${car.id}/edit`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-colors text-sm font-medium text-primary-foreground"
                    >
                        <Edit className="h-4 w-4" />
                        Edit
                    </Link>
                    <DeleteCarButton id={car.id} />
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Images & Description */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Images */}
                    <div className="rounded-xl border border-white/5 bg-card/40 backdrop-blur-xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Images</h3>
                        {car.images && car.images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {car.images.map((image, index) => (
                                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-secondary group">
                                        <Image
                                            src={image}
                                            alt={`${car.make} ${car.model} - Image ${index + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <Car className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No images available</p>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="rounded-xl border border-white/5 bg-card/40 backdrop-blur-xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Description</h3>
                        <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                            {car.description || 'No description provided.'}
                        </p>
                    </div>
                </div>

                {/* Right Column - Specs & Info */}
                <div className="space-y-6">
                    {/* Pricing & Status */}
                    <div className="rounded-xl border border-white/5 bg-card/40 backdrop-blur-xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Pricing & Status</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-white/5">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Price
                                </span>
                                <span className="text-xl font-bold text-emerald-400">
                                    ${car.price.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-white/5">
                                <span className="text-sm text-muted-foreground">Condition</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${car.condition === 'New'
                                        ? 'bg-blue-400/10 text-blue-400'
                                        : 'bg-orange-400/10 text-orange-400'
                                    }`}>
                                    {car.condition}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${car.status === 'AVAILABLE'
                                        ? 'bg-green-400/10 text-green-400'
                                        : car.status === 'SOLD'
                                            ? 'bg-red-400/10 text-red-400'
                                            : 'bg-yellow-400/10 text-yellow-400'
                                    }`}>
                                    {car.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Technical Specs */}
                    <div className="rounded-xl border border-white/5 bg-card/40 backdrop-blur-xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Technical Specs</h3>
                        <div className="space-y-3">
                            <SpecRow icon={<Gauge className="h-4 w-4" />} label="Mileage" value={car.mileage ? `${car.mileage.toLocaleString()} km` : undefined} />
                            <SpecRow icon={<Fuel className="h-4 w-4" />} label="Fuel Type" value={car.fuelType} />
                            <SpecRow icon={<Settings2 className="h-4 w-4" />} label="Transmission" value={car.transmission} />
                            <SpecRow icon={<Car className="h-4 w-4" />} label="Engine" value={car.engineCapacity} />
                            <SpecRow icon={<Compass className="h-4 w-4" />} label="Drive Type" value={car.driveType} />
                            <SpecRow icon={<Reply className="h-4 w-4" />} label="Steering" value={car.steering} />
                            <SpecRow icon={<Box className="h-4 w-4" />} label="Body Type" value={car.bodyType} />
                            <SpecRow icon={<Palette className="h-4 w-4" />} label="Color" value={car.colour} />
                            <SpecRow icon={<DoorOpen className="h-4 w-4" />} label="Doors" value={car.doors?.toString()} />
                            <SpecRow icon={<Users className="h-4 w-4" />} label="Seats" value={car.seats?.toString()} />
                            <SpecRow icon={<MapPin className="h-4 w-4" />} label="Location" value={car.location} />
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="rounded-xl border border-white/5 bg-card/40 backdrop-blur-xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Metadata</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Created
                                </span>
                                <span className="font-medium">
                                    <FormattedDate date={car.createdAt} />
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Languages className="h-4 w-4" />
                                    Translations
                                </span>
                                <span className="font-medium">
                                    {completedTranslations}/{totalTranslations}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SpecRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
                {icon}
                {label}
            </span>
            <span className="text-sm font-medium">
                {value || <span className="text-muted-foreground/50">Not specified</span>}
            </span>
        </div>
    );
}
