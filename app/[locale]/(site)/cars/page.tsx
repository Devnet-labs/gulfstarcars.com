'use client';

import { useState, useEffect } from 'react';
import { Car } from '@prisma/client';
import { CarCard } from '@/components/CarCard';
import { getFilteredCars, getInventoryFilterOptions } from '@/app/actions/getFilteredCars';
import { ChevronDown, Filter, X, Sparkles, LayoutGrid } from 'lucide-react';
import { SkeletonGrid, SkeletonHeader } from '@/components/SkeletonCarCard';
import { useTranslations, useLocale } from 'next-intl';

export default function CarsPage() {
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const locale = useLocale();

    // Filter options
    const [filterOptions, setFilterOptions] = useState({
        fuelTypes: [] as string[],
        transmissions: [] as string[],
        vehicleTypes: [] as string[],
        colours: [] as string[],
        driveTypes: [] as string[],
        engineCapacities: [] as string[],
        locations: [] as string[]
    });

    // Selected filters
    const [selectedFilters, setSelectedFilters] = useState({
        fuelType: [] as string[],
        transmission: [] as string[],
        vehicleType: [] as string[],
        colour: [] as string[],
        driveType: [] as string[],
        engineCapacity: [] as string[],
        location: [] as string[]
    });

    // Fetch filter options on mount
    useEffect(() => {
        const fetchOptions = async () => {
            const options = await getInventoryFilterOptions();
            setFilterOptions({
                fuelTypes: options.fuelTypes,
                transmissions: options.transmissions,
                vehicleTypes: options.vehicleTypes,
                colours: options.colours,
                driveTypes: options.driveTypes,
                engineCapacities: options.engineCapacities,
                locations: options.locations
            });
        };
        fetchOptions();
    }, []);

    // Fetch cars when filters change
    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);
            const filteredCars = await getFilteredCars(selectedFilters, locale);
            setCars(filteredCars);
            setLoading(false);

            // Scroll to car grid when filters change to ensure images load
            if (typeof window !== 'undefined') {
                const carGrid = document.querySelector('.car-results-section');
                if (carGrid) {
                    carGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        };
        fetchCars();
    }, [selectedFilters, locale]);

    const handleFilterChange = (category: 'fuelType' | 'transmission' | 'vehicleType' | 'colour' | 'driveType' | 'engineCapacity' | 'location', value: string) => {
        setSelectedFilters(prev => {
            const current = prev[category];
            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [category]: updated };
        });
    };

    const clearFilters = () => {
        setSelectedFilters({
            fuelType: [],
            transmission: [],
            vehicleType: [],
            colour: [],
            driveType: [],
            engineCapacity: [],
            location: []
        });
    };

    const hasActiveFilters =
        selectedFilters.fuelType.length > 0 ||
        selectedFilters.transmission.length > 0 ||
        selectedFilters.vehicleType.length > 0 ||
        selectedFilters.colour.length > 0 ||
        selectedFilters.driveType.length > 0 ||
        selectedFilters.engineCapacity.length > 0 ||
        selectedFilters.location.length > 0;

    const t = useTranslations('cars');

    return (
        <div className="min-h-screen bg-[#0B0F19] pt-20">
            {/* Header Section */}
            <section className="bg-[#0B0F19] border-b border-white/5 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="transform hover:scale-110 transition-transform">
                                        <LayoutGrid className="h-8 w-8 text-primary" />
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">{t('pageTitle')}</h1>
                                </div>
                                <p className="text-xl text-gray-400 max-w-2xl">
                                    {t('subtitle')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filter Sidebar */}
                        <div className="lg:w-80 flex-shrink-0">
                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden w-full flex items-center justify-between bg-card border border-white/5 rounded-xl px-4 py-3 mb-4 shadow-sm text-white"
                            >
                                <span className="flex items-center gap-2 font-semibold">
                                    <Filter className="h-5 w-5" />
                                    {t('filterTitle')}
                                    {hasActiveFilters && (
                                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                                            {selectedFilters.fuelType.length + selectedFilters.transmission.length + selectedFilters.vehicleType.length + selectedFilters.colour.length + selectedFilters.driveType.length + selectedFilters.engineCapacity.length + selectedFilters.location.length}
                                        </span>
                                    )}
                                </span>
                                <ChevronDown className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>


                            {/* Filters */}
                            <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-card rounded-2xl border border-white/5 p-6 shadow-sm sticky top-24`}>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-white">{t('filterTitle')}</h3>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-sm text-primary hover:underline flex items-center gap-1"
                                        >
                                            <X className="h-4 w-4" />
                                            {t('clearAll')}
                                        </button>
                                    )}
                                </div>

                                {/* Fuel Type */}
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-3 text-gray-300">{t('filters.fuelType')}</h4>
                                    <div className="space-y-2">
                                        {filterOptions.fuelTypes.length > 0 ? filterOptions.fuelTypes.map(fuel => (
                                            <label key={fuel} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.fuelType.includes(fuel)}
                                                    onChange={() => handleFilterChange('fuelType', fuel)}
                                                    className="w-4 h-4 text-primary border-white/20 rounded focus:ring-primary bg-white/5"
                                                />
                                                <span className="text-sm text-gray-400">{fuel}</span>
                                            </label>
                                        )) : <p className="text-xs text-gray-500 italic">No options available</p>}
                                    </div>
                                </div>

                                {/* Transmission */}
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-3 text-gray-300">{t('filters.transmission')}</h4>
                                    <div className="space-y-2">
                                        {filterOptions.transmissions.length > 0 ? filterOptions.transmissions.map(trans => (
                                            <label key={trans} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.transmission.includes(trans)}
                                                    onChange={() => handleFilterChange('transmission', trans)}
                                                    className="w-4 h-4 text-primary border-white/20 rounded focus:ring-primary bg-white/5"
                                                />
                                                <span className="text-sm text-gray-400">{trans}</span>
                                            </label>
                                        )) : <p className="text-xs text-gray-500 italic">No options available</p>}
                                    </div>
                                </div>

                                {/* Vehicle Type */}
                                <div>
                                    <h4 className="font-semibold mb-3 text-gray-300">{t('filters.bodyType')}</h4>
                                    <div className="space-y-2">
                                        {filterOptions.vehicleTypes.length > 0 ? filterOptions.vehicleTypes.map(type => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.vehicleType.includes(type)}
                                                    onChange={() => handleFilterChange('vehicleType', type)}
                                                    className="w-4 h-4 text-primary border-white/20 rounded focus:ring-primary bg-white/5"
                                                />
                                                <span className="text-sm text-gray-400">{type}</span>
                                            </label>
                                        )) : <p className="text-xs text-gray-500 italic">No options available</p>}
                                    </div>
                                </div>

                                {/* Colour */}
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-3 text-gray-300">{t('specs.colour')}</h4>
                                    <div className="space-y-2">
                                        {filterOptions.colours.length > 0 ? filterOptions.colours.map(colour => (
                                            <label key={colour} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.colour.includes(colour)}
                                                    onChange={() => handleFilterChange('colour', colour)}
                                                    className="w-4 h-4 text-primary border-white/20 rounded focus:ring-primary bg-white/5"
                                                />
                                                <span className="text-sm text-gray-400">{colour}</span>
                                            </label>
                                        )) : <p className="text-xs text-gray-500 italic">No options available</p>}
                                    </div>
                                </div>

                                {/* Drive Type */}
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-3 text-gray-300">{t('specs.driveType')}</h4>
                                    <div className="space-y-2">
                                        {filterOptions.driveTypes.length > 0 ? filterOptions.driveTypes.map(drive => (
                                            <label key={drive} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.driveType.includes(drive)}
                                                    onChange={() => handleFilterChange('driveType', drive)}
                                                    className="w-4 h-4 text-primary border-white/20 rounded focus:ring-primary bg-white/5"
                                                />
                                                <span className="text-sm text-gray-400">{drive}</span>
                                            </label>
                                        )) : <p className="text-xs text-gray-500 italic">No options available</p>}
                                    </div>
                                </div>

                                {/* Engine Capacity */}
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-3 text-gray-300">{t('specs.engineCapacity')}</h4>
                                    <div className="space-y-2">
                                        {filterOptions.engineCapacities.length > 0 ? filterOptions.engineCapacities.map(engine => (
                                            <label key={engine} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.engineCapacity.includes(engine)}
                                                    onChange={() => handleFilterChange('engineCapacity', engine)}
                                                    className="w-4 h-4 text-primary border-white/20 rounded focus:ring-primary bg-white/5"
                                                />
                                                <span className="text-sm text-gray-400">{engine}</span>
                                            </label>
                                        )) : <p className="text-xs text-gray-500 italic">No options available</p>}
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <h4 className="font-semibold mb-3 text-gray-300">{t('specs.location')}</h4>
                                    <div className="space-y-2">
                                        {filterOptions.locations.length > 0 ? filterOptions.locations.map(loc => (
                                            <label key={loc} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.location.includes(loc)}
                                                    onChange={() => handleFilterChange('location', loc)}
                                                    className="w-4 h-4 text-primary border-white/20 rounded focus:ring-primary bg-white/5"
                                                />
                                                <span className="text-sm text-gray-400">{loc}</span>
                                            </label>
                                        )) : <p className="text-xs text-gray-500 italic">No options available</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Car Grid */}
                        <div className="flex-1 car-results-section">
                            {loading ? (
                                <>
                                    <SkeletonHeader />
                                    <SkeletonGrid count={6} />
                                </>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-white">
                                            {t('vehiclesFound', { count: cars.length })}
                                        </h2>
                                        <p className="text-gray-400 mt-1">{t('foundSubtitle')}</p>
                                    </div>

                                    {cars.length === 0 ? (
                                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                            <p className="text-xl text-gray-400">{t('noCars')}</p>
                                            <p className="text-sm text-gray-500 mt-2">{t('noCarsSubtitle')}</p>
                                            {hasActiveFilters && (
                                                <button
                                                    onClick={clearFilters}
                                                    className="mt-4 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                                                >
                                                    {t('clearFilters')}
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                                            {cars.map((car, index) => (
                                                <CarCard key={car.id} car={car} index={index} />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
