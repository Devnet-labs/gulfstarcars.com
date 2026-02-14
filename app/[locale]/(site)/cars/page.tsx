'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [isMobile, setIsMobile] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = isMobile ? 10 : 30;
    const locale = useLocale();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Filter options
    const [filterOptions, setFilterOptions] = useState({
        makes: [] as { make: string; count: number }[],
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
        make: [] as string[],
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
                locations: options.locations,
                makes: options.makes || []
            });
        };
        fetchOptions();

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Body scroll lock
    useEffect(() => {
        if (showFilters && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showFilters, isMobile]);

    // Fetch cars when filters change
    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);
            const filteredCars = await getFilteredCars(selectedFilters, locale);
            setCars(filteredCars);
            setCurrentPage(1); // Reset to first page on filter change
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
        selectedFilters.location.length > 0 ||
        selectedFilters.make.length > 0;

    const activeFilterCount =
        selectedFilters.fuelType.length +
        selectedFilters.transmission.length +
        selectedFilters.vehicleType.length +
        selectedFilters.colour.length +
        selectedFilters.driveType.length +
        selectedFilters.engineCapacity.length +
        selectedFilters.location.length +
        selectedFilters.make.length;

    // Pagination Logic
    const totalPages = Math.ceil(cars.length / itemsPerPage);
    const paginatedCars = cars.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        if (typeof window !== 'undefined') {
            const carGrid = document.querySelector('.car-results-section');
            if (carGrid) {
                carGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    // Helper to get responsive page numbers
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const delta = isMobile ? 1 : 2; // Number of pages either side of current

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        // Always show first page
        pages.push(1);

        if (currentPage > delta + 2) {
            pages.push('...');
        }

        const start = Math.max(2, currentPage - delta);
        const end = Math.min(totalPages - 1, currentPage + delta);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - (delta + 1)) {
            pages.push('...');
        }

        // Always show last page
        pages.push(totalPages);

        return pages;
    };

    const t = useTranslations('cars');
    const tCommon = useTranslations('common');

    return (
        <div className="min-h-screen bg-[#0B0F19] pt-16 sm:pt-20">
            {/* Main Content */}
            <section className="py-6 sm:py-12">
                <div className="container mx-auto px-4">
                    {/* Make Selector - Sticky top on desktop */}
                    {filterOptions.makes.length > 0 && (
                        <div className="mb-8 sm:mb-20 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sticky top-16 sm:top-20 z-30 bg-[#0B0F19]/90 backdrop-blur-xl pt-4 sm:pt-6 border-b border-white/5">
                            <div className="flex gap-2.5 sm:gap-4 min-w-max pb-2">
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
                            {/* Fixed Mobile Filter Button */}
                            <div className="lg:hidden fixed bottom-6 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
                                <button
                                    onClick={() => setShowFilters(true)}
                                    className="pointer-events-auto flex items-center gap-2 bg-primary text-white rounded-full px-6 py-3 shadow-2xl shadow-primary/40 active:scale-95 transition-all group border-2 border-white/40"
                                >
                                    <div className="p-1 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform">
                                        <Filter className="h-4 w-4" />
                                    </div>
                                    <span className="font-bold uppercase tracking-widest text-sm">
                                        {t('filterTitle')}
                                        {hasActiveFilters && (
                                            <span className="ms-2 bg-white text-primary text-[10px] px-2 py-0.5 rounded-full inline-flex items-center justify-center min-w-[20px] h-[20px]">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                    </span>
                                </button>
                            </div>

                            {/* Sidebar Filters Container / Mobile Drawer */}
                            <div
                                className={`
                                    ${showFilters
                                        ? 'fixed inset-0 z-[110] lg:relative lg:inset-auto lg:z-30 block animate-in fade-in slide-in-from-bottom-5 duration-500'
                                        : 'hidden lg:block'
                                    } 
                                    sticky top-48 lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto custom-scrollbar
                                `}
                            >
                                {/* Mobile Backdrop */}
                                {showFilters && (
                                    <div
                                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm -z-10"
                                        onClick={() => setShowFilters(false)}
                                    />
                                )}

                                <div className="h-full lg:h-auto overflow-y-auto lg:overflow-visible bg-card/30 backdrop-blur-2xl lg:rounded-3xl border lg:border-white/10 p-5 sm:p-7 shadow-2xl relative group mb-4 m-4 lg:m-0 rounded-[30px] sm:rounded-[40px] border-white/20">
                                    {/* Glassmorphism accent */}
                                    <div className="absolute top-0 inset-e-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 transition-colors group-hover:bg-primary/10" />

                                    <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-white/10">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="p-1.5 sm:p-2 bg-white/5 rounded-lg border border-white/10">
                                                <Filter className="h-3.5 w-3.5 sm:h-4 sm:h-4 text-slate-400" />
                                            </div>
                                            <h3 className="text-xl font-black text-white tracking-tight uppercase text-[10px] sm:text-[12px] tracking-[0.2em]">{t('filterTitle')}</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {hasActiveFilters && (
                                                <button
                                                    onClick={clearFilters}
                                                    className="group/clear text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20"
                                                >
                                                    <RotateCcw className="h-3 w-3 group-hover/clear:rotate-[-45deg] transition-transform" />
                                                    {t('clearAll')}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setShowFilters(false)}
                                                className="lg:hidden p-2 bg-white/5 rounded-full border border-white/10 text-slate-400 hover:text-white"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-8 pe-2 custom-scrollbar">
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

                                    {/* Footer count indicator / Mobile Action */}
                                    <div className="mt-8 pt-6 border-t border-white/5">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Filters</span>
                                            <span className="text-[10px] font-black text-primary px-2 py-0.5 rounded-md bg-primary/10">{activeFilterCount}</span>
                                        </div>

                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className="lg:hidden w-full py-4 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Sparkles className="h-4 w-4" />
                                            {t('vehiclesFound', { count: cars.length })}
                                        </button>
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
                                    <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 px-1 sm:px-2">
                                        <div>
                                            <div className="inline-flex items-center gap-2 mb-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary animate-pulse" />
                                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-primary">Active Selection</span>
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                                                {t('vehiclesFound', { count: cars.length })}
                                            </h2>
                                            <p className="text-slate-500 text-sm sm:text-base font-medium mt-1">{t('foundSubtitle')}</p>
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
                                        <>
                                            <motion.div
                                                layout
                                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                                            >
                                                <AnimatePresence mode="popLayout">
                                                    {paginatedCars.map((car, index) => (
                                                        <CarCard key={car.id} car={car} index={index} />
                                                    ))}
                                                </AnimatePresence>
                                            </motion.div>

                                            {/* Pagination */}
                                            {totalPages > 1 && (
                                                <div className="mt-16 flex justify-center items-center gap-2">
                                                    <button
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        className="px-4 sm:px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all text-sm sm:text-base whitespace-nowrap"
                                                    >
                                                        {tCommon('previous')}
                                                    </button>
                                                    <div className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-2">
                                                        {getPageNumbers().map((page, i) => (
                                                            page === '...' ? (
                                                                <span key={`ellipsis-${i}`} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-slate-500 font-bold">
                                                                    ...
                                                                </span>
                                                            ) : (
                                                                <button
                                                                    key={page}
                                                                    onClick={() => handlePageChange(page as number)}
                                                                    className={`min-w-[40px] h-10 sm:min-w-[48px] sm:h-12 px-2 rounded-xl border font-bold transition-all ${currentPage === page
                                                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
                                                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                                                        }`}
                                                                >
                                                                    {page}
                                                                </button>
                                                            )
                                                        ))}
                                                    </div>
                                                    <button
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        className="px-4 sm:px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all text-sm sm:text-base whitespace-nowrap"
                                                    >
                                                        {tCommon('next')}
                                                    </button>
                                                </div>
                                            )}
                                        </>
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
                [dir="rtl"] .mask-fade-right {
                    -webkit-mask-image: linear-gradient(to left, black 85%, transparent 100%);
                    mask-image: linear-gradient(to left, black 85%, transparent 100%);
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
                                    <span className={`ms-3 text-sm font-medium transition-colors ${selected.includes(option) ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
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
