'use client';

import { useState, useEffect } from 'react';
import { Car } from '@prisma/client';
import { CarCard } from '@/components/CarCard';
import { getFilteredCars, getInventoryFilterOptions } from '@/app/actions/getFilteredCars';
import { ChevronDown, Filter, X, LayoutGrid, Check, Search, RotateCcw, Sparkles } from 'lucide-react';
import { SkeletonGrid, SkeletonHeader } from '@/components/SkeletonCarCard';
import { useTranslations, useLocale } from 'next-intl';

export default function CarsPage() {
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const locale = useLocale();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Filter options
    const [filterOptions, setFilterOptions] = useState({
        makes: [] as { name: string; count: number }[],
        fuelTypes: [] as string[],
        transmissions: [] as string[],
        vehicleTypes: [] as string[],
        colours: [] as string[],
        driveTypes: [] as string[],
        engineCapacities: [] as string[],
        locations: [] as string[],
        makes: [] as { make: string; count: number }[]
    });

    // Selected filters
    const [selectedFilters, setSelectedFilters] = useState({
        make: [] as string[],
        fuelType: [] as string[],
        transmission: [] as string[],
        vehicleType: [] as string[],
        colour: [] as string[],
        driveType: [] as string[],
        engineCapacity: [] as string[],
        location: [] as string[],
        make: [] as string[]
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
                locations: options.locations,
                makes: options.makes || []
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

    const handleFilterChange = (category: 'fuelType' | 'transmission' | 'vehicleType' | 'colour' | 'driveType' | 'engineCapacity' | 'location' | 'make', value: string) => {
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
            make: [],
            fuelType: [],
            transmission: [],
            vehicleType: [],
            colour: [],
            driveType: [],
            engineCapacity: [],
            location: [],
            make: []
        });
    };

    const hasActiveFilters =
        selectedFilters.fuelType.length > 0 ||
        selectedFilters.transmission.length > 0 ||
        selectedFilters.vehicleType.length > 0 ||
        selectedFilters.colour.length > 0 ||
        selectedFilters.driveType.length > 0 ||
        selectedFilters.engineCapacity.length > 0 ||
        selectedFilters.location.length > 0 ||
        selectedFilters.make.length > 0;

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
            <section className="py-8 sm:py-12">
                <div className="container mx-auto px-4">
                    {/* Make Selector */}
                    {filterOptions.makes.length > 0 && (
                        <div className="mb-8 sm:mb-12 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                            <div className="flex gap-3 sm:gap-4 min-w-max">
                                {filterOptions.makes.map(({ make, count }) => {
                                    const isSelected = selectedFilters.make.includes(make);
                                    return (
                                        <button
                                            key={make}
                                            onClick={() => handleFilterChange('make', make)}
                                            className={`
                                                group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border transition-all duration-300
                                                ${isSelected
                                                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25 scale-105'
                                                    : 'bg-card border-white/5 text-muted-foreground hover:border-white/20 hover:bg-white/5 hover:-translate-y-1'
                                                }
                                            `}
                                        >
                                            <span className={`text-sm sm:text-base font-bold ${isSelected ? 'text-white' : 'text-foreground group-hover:text-primary transition-colors'}`}>
                                                {make}
                                            </span>
                                            <span className={`
                                                text-xs font-bold px-2 py-0.5 rounded-full
                                                ${isSelected
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-white/5 text-muted-foreground'
                                                }
                                            `}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filter Sidebar */}
                        <div className="lg:w-80 flex-shrink-0">
                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden w-full flex items-center justify-between bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 mb-4 shadow-xl text-white group active:scale-[0.98] transition-all"
                            >
                                <span className="flex items-center gap-3 font-bold">
                                    <div className="p-2 bg-primary/20 rounded-lg">
                                        <Filter className="h-5 w-5 text-primary" />
                                    </div>
                                    {t('filterTitle')}
                                    {hasActiveFilters && (
                                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                                            {selectedFilters.fuelType.length + selectedFilters.transmission.length + selectedFilters.vehicleType.length + selectedFilters.colour.length + selectedFilters.driveType.length + selectedFilters.engineCapacity.length + selectedFilters.location.length + selectedFilters.make.length}
                                        </span>
                                    )}
                                </span>
                                <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform duration-500 ${showFilters ? 'rotate-180 text-primary' : ''}`} />
                            </button>

                            {/* Sidebar Filters Container */}
                            <div className={`${showFilters ? 'block animate-in fade-in slide-in-from-top-4 duration-500' : 'hidden'} lg:block sticky top-32`}>
                                <div className="bg-card/30 backdrop-blur-2xl rounded-3xl border border-white/10 p-7 shadow-2xl relative overflow-hidden group">
                                    {/* Glassmorphism accent */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 transition-colors group-hover:bg-primary/10" />

                                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                                                <Filter className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <h3 className="text-xl font-black text-white tracking-tight uppercase text-[12px] tracking-[0.2em]">{t('filterTitle')}</h3>
                                        </div>
                                        {hasActiveFilters && (
                                            <button
                                                onClick={clearFilters}
                                                className="group/clear text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20"
                                            >
                                                <RotateCcw className="h-3 w-3 group-hover/clear:rotate-[-45deg] transition-transform" />
                                                {t('clearAll')}
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                        {/* Filter Sections */}
                                        <FilterSection
                                            title={t('filters.fuelType')}
                                            options={filterOptions.fuelTypes}
                                            selected={selectedFilters.fuelType}
                                            onChange={(v) => handleFilterChange('fuelType', v)}
                                        />

                                        <FilterSection
                                            title={t('filters.transmission')}
                                            options={filterOptions.transmissions}
                                            selected={selectedFilters.transmission}
                                            onChange={(v) => handleFilterChange('transmission', v)}
                                        />

                                        <FilterSection
                                            title={t('filters.bodyType')}
                                            options={filterOptions.vehicleTypes}
                                            selected={selectedFilters.vehicleType}
                                            onChange={(v) => handleFilterChange('vehicleType', v)}
                                        />

                                        <FilterSection
                                            title={t('specs.colour')}
                                            options={filterOptions.colours}
                                            selected={selectedFilters.colour}
                                            onChange={(v) => handleFilterChange('colour', v)}
                                        />

                                        <FilterSection
                                            title={t('specs.driveType')}
                                            options={filterOptions.driveTypes}
                                            selected={selectedFilters.driveType}
                                            onChange={(v) => handleFilterChange('driveType', v)}
                                        />

                                        <FilterSection
                                            title={t('specs.engineCapacity')}
                                            options={filterOptions.engineCapacities}
                                            selected={selectedFilters.engineCapacity}
                                            onChange={(v) => handleFilterChange('engineCapacity', v)}
                                        />

                                        <FilterSection
                                            title={t('specs.location')}
                                            options={filterOptions.locations}
                                            selected={selectedFilters.location}
                                            onChange={(v) => handleFilterChange('location', v)}
                                        />
                                    </div>

                                    {/* Footer count indicator */}
                                    <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Filters</span>
                                        <span className="text-[10px] font-black text-primary px-2 py-0.5 rounded-md bg-primary/10">{activeFilterCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Car Grid Content */}
                        <div className="flex-1 car-results-section min-w-0">
                            {loading ? (
                                <div className="space-y-8">
                                    <SkeletonHeader />
                                    <SkeletonGrid count={6} />
                                </div>
                            ) : (
                                <>
                                    <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-2">
                                        <div>
                                            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Live Inventory</span>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                                {t('vehiclesFound', { count: cars.length })}
                                            </h2>
                                            <p className="text-slate-500 font-medium mt-1">{t('foundSubtitle')}</p>
                                        </div>

                                        <div className="h-14 flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl px-5 text-slate-400 group focus-within:border-primary/50 transition-all">
                                            <Search className="h-5 w-5 group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Search in results..."
                                                className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-slate-600 text-white"
                                            />
                                        </div>
                                    </div>

                                    {cars.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-32 bg-white/[0.02] rounded-[40px] border border-dashed border-white/10 px-8"
                                        >
                                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                                                <RotateCcw className="h-10 w-10 text-slate-600" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-3">{t('noCars')}</h3>
                                            <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium">{t('noCarsSubtitle')}</p>
                                            {hasActiveFilters && (
                                                <button
                                                    onClick={clearFilters}
                                                    className="px-10 py-4 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 active:scale-95"
                                                >
                                                    {t('clearFilters')}
                                                </button>
                                            )}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            layout
                                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                                        >
                                            <AnimatePresence mode="popLayout">
                                                {cars.map((car, index) => (
                                                    <CarCard key={car.id} car={car} index={index} />
                                                ))}
                                            </AnimatePresence>
                                        </motion.div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .mask-fade-right {
                    -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
                    mask-image: linear-gradient(to right, black 85%, transparent 100%);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}

function FilterSection({ title, options, selected, onChange }: {
    title: string;
    options: string[];
    selected: string[];
    onChange: (val: string) => void
}) {
    const [isOpen, setIsOpen] = useState(true);

    if (options.length === 0) return null;

    return (
        <div className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between mb-4 group/btn"
            >
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover/btn:text-slate-300 transition-colors">
                    {title}
                </h4>
                <ChevronDown className={`h-3 w-3 text-slate-600 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-3">
                            {options.map(option => (
                                <label
                                    key={option}
                                    className="flex items-center group cursor-pointer"
                                >
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(option)}
                                            onChange={() => onChange(option)}
                                            className="appearance-none w-5 h-5 bg-white/5 border border-white/10 rounded-lg checked:bg-primary checked:border-primary transition-all duration-300"
                                        />
                                        <Check className={`absolute h-3 w-3 text-white transition-all scale-0 ${selected.includes(option) ? 'scale-100' : 'scale-0'}`} />
                                    </div>
                                    <span className={`ml-3 text-sm font-medium transition-colors ${selected.includes(option) ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                        {option}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
