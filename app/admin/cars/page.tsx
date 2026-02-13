import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Plus } from 'lucide-react';

export default async function AdminCarsPage() {
    const cars = await prisma.car.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            translations: {
                select: { locale: true, status: true },
            },
        },
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Cars</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {cars.length} {cars.length === 1 ? 'vehicle' : 'vehicles'} in inventory
                    </p>
                </div>
                <Link
                    href="/admin/cars/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                >
                    <Plus className="h-4 w-4" />
                    Add New Car
                </Link>
            </div>

            {/* Cars Grid */}
            {cars.length === 0 ? (
                <div className="rounded-xl border border-white/5 bg-card/40 backdrop-blur-xl p-12 text-center">
                    <p className="text-lg text-muted-foreground mb-4">No cars in inventory</p>
                    <Link
                        href="/admin/cars/new"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                        <Plus className="h-4 w-4" />
                        Add your first car
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {cars.map((car) => {
                        const translations = (car as any).translations || [];
                        const completedTranslations = translations.filter((t: any) => t.status === 'COMPLETED').length;
                        const failedTranslations = translations.filter((t: any) => t.status === 'FAILED').length;
                        const totalTranslations = 6;

                        return (
                            <div
                                key={car.id}
                                className="group rounded-xl border border-white/5 bg-card/40 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-primary/10"
                            >
                                {/* Image */}
                                <Link href={`/admin/cars/${car.id}`} className="block relative aspect-video bg-secondary overflow-hidden">
                                    {car.images && car.images.length > 0 ? (
                                        <img
                                            src={car.images[0]}
                                            alt={`${car.make} ${car.model}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            No Image
                                        </div>
                                    )}
                                    {/* Stock ID Badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className="inline-flex items-center rounded-md bg-primary/90 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-white ring-1 ring-inset ring-primary/20">
                                            {car.customId || 'N/A'}
                                        </span>
                                    </div>
                                    {/* Status Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className={`inline-flex items-center rounded-md backdrop-blur-sm px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${car.status === 'AVAILABLE'
                                                ? 'bg-green-400/90 text-white ring-green-400/20'
                                                : car.status === 'SOLD'
                                                    ? 'bg-red-400/90 text-white ring-red-400/20'
                                                    : 'bg-yellow-400/90 text-white ring-yellow-400/20'
                                            }`}>
                                            {car.status}
                                        </span>
                                    </div>
                                </Link>

                                {/* Content */}
                                <div className="p-5 space-y-4">
                                    {/* Title */}
                                    <Link href={`/admin/cars/${car.id}`} className="block group/title">
                                        <h3 className="text-lg font-bold text-foreground group-hover/title:text-primary transition-colors line-clamp-1">
                                            {car.make} {car.model}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {car.year} • {car.condition}
                                        </p>
                                    </Link>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-emerald-400">
                                            ${car.price.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Quick Specs */}
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span>{car.mileage ? `${(car.mileage / 1000).toFixed(0)}k km` : 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            <span>{car.fuelType || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{car.transmission || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                            </svg>
                                            <span>{car.colour || 'N/A'}</span>
                                        </div>
                                    </div>

                                    {/* Translation Status */}
                                    {translations.length > 0 && (
                                        <div className="pt-3 border-t border-white/5">
                                            <Link
                                                href={`/admin/cars/${car.id}/translations`}
                                                className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${completedTranslations === totalTranslations
                                                        ? 'text-green-400 hover:text-green-300'
                                                        : failedTranslations > 0
                                                            ? 'text-red-400 hover:text-red-300'
                                                            : 'text-yellow-400 hover:text-yellow-300'
                                                    }`}
                                            >
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                                </svg>
                                                {completedTranslations}/{totalTranslations} translations
                                            </Link>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2">
                                        <Link
                                            href={`/admin/cars/${car.id}`}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs font-medium transition-colors"
                                        >
                                            View Details
                                        </Link>
                                        <Link
                                            href={`/admin/cars/${car.id}/edit`}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary hover:bg-primary/90 text-xs font-medium text-primary-foreground transition-colors"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
