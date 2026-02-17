'use client';

import { useState, useRef, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Car } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CarCard } from "@/components/CarCard";

import { getLatestCars } from '@/app/actions/getLatestCars';
import { SkeletonGrid } from '@/components/SkeletonCarCard';
import { TrustStats } from '@/components/TrustStats';
import { Portfolio } from '@/components/Portfolio';
import { Testimonials } from '@/components/Testimonials';
import { useTranslations, useLocale } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  const locale = useLocale();
  const router = useRouter();

  // --- Scroll Container Ref ---
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- LatestArrivals State ---
  const [featuredCars, setFeaturedCars] = useState<any[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);

  // --- Initial Data Fetching ---
  useEffect(() => {
    const initData = async () => {
      try {
        const latest = await getLatestCars(locale);
        setFeaturedCars(latest);
        setLoadingCars(false);
      } catch (error) {
        console.error("Failed to load initial data", error);
        setLoadingCars(false);
      }
    };
    initData();
  }, [locale]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = locale === 'ar' ? 400 : -400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = locale === 'ar' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen min-h-screen flex flex-col justify-center bg-background pt-20 sm:pt-24 pb-0 overflow-hidden">
        {/* Background Video with Premium Overlays */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/images/placeholders/hero-car.png"
          >
            <source src="/video/Luxury_Drone_Footage.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/40 to-background/10 rtl:bg-gradient-to-l" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto relative z-10 px-4 sm:px-6 md:px-12 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl space-y-8 pt-12 md:-ms-8"
          >
            <span className="inline-block text-primary font-bold tracking-wider text-[10px] sm:text-xs md:text-sm uppercase bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-primary/20 backdrop-blur-md">
              {t('hero.badge')}
            </span>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              {t('hero.title')} <br />
              <span className="text-primary">{t('hero.titleHighlight')}</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* --- Hero Quick Actions (Discovery Bar) --- */}
        <div className="absolute bottom-6 sm:bottom-24 left-0 right-0 z-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex-1 sm:flex-none"
              >
                <Link
                  href="/cars"
                  className="group flex items-center justify-center gap-2 sm:gap-5 px-3 sm:px-5 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full transition-all duration-300 hover:border-primary/40 hover:bg-white/10 w-full"
                >
                  <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                  <span className="text-[10px] sm:text-sm font-bold text-white tracking-wide whitespace-nowrap">{t('cta.viewAllCars')}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/40 group-hover:text-primary group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-all shrink-0" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex-1 sm:flex-none"
              >
                <Link
                  href="/contact"
                  className="group flex items-center justify-center gap-2 sm:gap-5 px-3 sm:px-5 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full transition-all duration-300 hover:border-primary/40 hover:bg-white/10 w-full"
                >
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                  <span className="text-[10px] sm:text-sm font-bold text-white tracking-wide whitespace-nowrap">Product Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Newest Cars --- */}
      <section className="py-12 sm:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-8 sm:mb-12 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-2 sm:mb-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">{t('carsOfDay.title')}</h2>
              </div>
              <p className="text-muted-foreground max-w-lg text-sm sm:text-base md:text-lg">
                {t('carsOfDay.subtitle')}
              </p>
            </motion.div>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <button
                onClick={scrollLeft}
                className="p-3 rounded-full bg-white hover:bg-gray-100 shadow-md transition-all duration-300 hover:shadow-lg active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
              <button
                onClick={scrollRight}
                className="p-3 rounded-full bg-white hover:bg-gray-100 shadow-md transition-all duration-300 hover:shadow-lg active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            </motion.div>
          </div>

          {loadingCars ? (
            <SkeletonGrid count={4} />
          ) : featuredCars.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
              <p className="text-xl text-muted-foreground">{t('carsOfDay.noCars')}</p>
              <p className="text-sm text-muted-foreground mt-2">{t('carsOfDay.noCarsSubtitle')}</p>
            </div>
          ) : (
            <>
              {/* Horizontal Scroll Container */}
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {featuredCars.map((car, index) => (
                  <div key={car.id} className="flex-none w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] snap-start">
                    <CarCard car={car} index={index} />
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link
                  href="/cars"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 group"
                >
                  {t('carsOfDay.viewAll')} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Decorative Golden Separator */}
      <div className="container mx-auto px-4">
        <div className="h-px w-full max-w-4xl mx-auto bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <TrustStats />

      {/* Decorative Golden Separator */}
      <div className="container mx-auto px-4">
        <div className="h-px w-full max-w-4xl mx-auto bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <Portfolio />

      {/* Decorative Golden Separator */}
      <div className="container mx-auto px-4">
        <div className="h-px w-full max-w-4xl mx-auto bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <Testimonials />
    </div>
  );
}
