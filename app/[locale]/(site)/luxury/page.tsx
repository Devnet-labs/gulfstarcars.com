'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car } from '@prisma/client';
import { CarCard } from '@/components/CarCard';
import { getLuxuryCars, getLuxuryFilterOptions } from '@/app/actions/getLuxuryCars';
import { ChevronDown, Filter, X, Sparkles } from 'lucide-react';
import { SkeletonGrid, SkeletonHeader } from '@/components/SkeletonCarCard';

export default function LuxuryPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filter options
    const [filterOptions, setFilterOptions] = useState({
        fuelTypes: [] as string[],
        transmissions: [] as string[],
        vehicleTypes: [] as string[]
    });

    // Selected filters
    const [selectedFilters, setSelectedFilters] = useState({
        fuelType: [] as string[],
        transmission: [] as string[],
        vehicleType: [] as string[]
    });

    // Fetch filter options on mount
    useEffect(() => {
        const fetchOptions = async () => {
            const options = await getLuxuryFilterOptions();
            setFilterOptions({
                fuelTypes: options.fuelTypes,
                transmissions: options.transmissions,
                vehicleTypes: options.vehicleTypes
            });
        };
        fetchOptions();
    }, []);

    // Fetch cars when filters change
    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);
            const luxuryCars = await getLuxuryCars(selectedFilters);
            setCars(luxuryCars);
            setLoading(false);
        };
        fetchCars();
    }, [selectedFilters]);

    const handleFilterChange = (category: 'fuelType' | 'transmission' | 'vehicleType', value: string) => {
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
            vehicleType: []
        });
    };

    const hasActiveFilters =
        selectedFilters.fuelType.length > 0 ||
        selectedFilters.transmission.length > 0 ||
        selectedFilters.vehicleType.length > 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary via-primary/90 to-accent py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=1600')] bg-cover bg-center opacity-10" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center text-white">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className="flex items-center justify-center gap-3 mb-4"
                        >
                            <Sparkles className="h-10 w-10 text-accent-foreground" />
                            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Luxury Cars Lounge</h1>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-xl text-white/90 max-w-2xl mx-auto"
                        >
                            Explore our premium collection of brand new luxury vehicles from the world's finest manufacturers
                        </motion.p>
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
                                className="lg:hidden w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 shadow-sm"
                            >
                                <span className="flex items-center gap-2 font-semibold">
                                    <Filter className="h-5 w-5" />
                                    Filters
                                    {hasActiveFilters && (
                                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                                            {selectedFilters.fuelType.length + selectedFilters.transmission.length + selectedFilters.vehicleType.length}
                                        </span>
                                    )}
                                </span>
                                <ChevronDown className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Filters */}
                            <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24`}>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold">Filters</h3>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-sm text-primary hover:underline flex items-center gap-1"
                                        >
                                            <X className="h-4 w-4" />
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                {/* Fuel Type */}
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-3 text-gray-700">Fuel Type</h4>
                                    <div className="space-y-2">
                                        {filterOptions.fuelTypes.length > 0 ? filterOptions.fuelTypes.map(fuel => (
                                            <label key={fuel} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.fuelType.includes(fuel)}
                                                    onChange={() => handleFilterChange('fuelType', fuel)}
                                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                                />
                                                <span className="text-sm text-gray-700">{fuel}</span>
                                            </label>
                                        )) : <p className="text-xs text-gray-500 italic">No options available</p>}
                                    </div>
                                </div>

                                {/* Transmission */}
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-3 text-gray-700">Transmission</h4>
                                    <div className="space-y-2">
                                        {filterOptions.transmissions.length > 0 ? filterOptions.transmissions.map(trans => (
                                            <label key={trans} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.transmission.includes(trans)}
                                                    onChange={() => handleFilterChange('transmission', trans)}
                                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                                />
                                                <span className="text-sm text-gray-700">{trans}</span>
                                            </label>
                                        )) : <p className="text-xs text-gray-500 italic">No options available</p>}
                                    </div>
                                </div>

                                {/* Vehicle Type */}
                                <div>
                                    <h4 className="font-semibold mb-3 text-gray-700">Vehicle Type</h4>
                                    <div className="space-y-2">
                                        {filterOptions.vehicleTypes.length > 0 ? filterOptions.vehicleTypes.map(type => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.vehicleType.includes(type)}
                                                    onChange={() => handleFilterChange('vehicleType', type)}
                                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                                />
                                                <span className="text-sm text-gray-700">{type}</span>
                                            </label>
                                        )) : <p className="text-xs text-gray-500 italic">No options available</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Car Grid */}
                        <div className="flex-1">
                            {loading ? (
                                <>
                                    <SkeletonHeader />
                                    <SkeletonGrid count={6} />
                                </>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {`${cars.length} Luxury Vehicles`}
                                        </h2>
                                        <p className="text-gray-600 mt-1">Premium vehicles ready for immediate export</p>
                                    </div>

                                    {cars.length === 0 ? (
                                        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                                            <p className="text-xl text-gray-600">No luxury vehicles match your filters.</p>
                                            <p className="text-sm text-gray-500 mt-2">Try adjusting your filter criteria.</p>
                                            {hasActiveFilters && (
                                                <button
                                                    onClick={clearFilters}
                                                    className="mt-4 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                                                >
                                                    Clear Filters
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
