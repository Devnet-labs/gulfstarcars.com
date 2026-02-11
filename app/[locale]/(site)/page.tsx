'use client';

import { useState, useRef, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CarCard } from "@/components/CarCard";
import { Features } from "@/components/Features";

import { getLatestCars } from '@/app/actions/getLatestCars';
import { Car } from '@prisma/client';
import { SkeletonGrid } from '@/components/SkeletonCarCard';
import { TrustStats } from '@/components/TrustStats';
import { Portfolio } from '@/components/Portfolio';
import { Testimonials } from '@/components/Testimonials';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  const router = useRouter();

  // --- Scroll Container Ref ---
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- LatestArrivals State ---
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);

  // --- Initial Data Fetching ---
  useEffect(() => {
    const initData = async () => {
      try {
        const latest = await getLatestCars();
        setFeaturedCars(latest);
        setLoadingCars(false);
      } catch (error) {
        console.error("Failed to load initial data", error);
        setLoadingCars(false);
      }
    };
    initData();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[600px] flex flex-col justify-center bg-background pt-24 pb-20">
        {/* Background Image with Gradient Overlay - Contained Overflow */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1563720360172-67b8f3dce741?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Car Fleet"
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container mx-auto relative z-10 px-6 md:px-12 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl space-y-8 pt-12"
          >
            <span className="inline-block text-primary font-bold tracking-wider text-sm uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 backdrop-blur-md">
              {t('hero.badge')}
            </span>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              {t('hero.title')} <br />
              <span className="text-primary">{t('hero.titleHighlight')}</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </motion.div>
        </div>


      </section>

      {/* --- CARS OF THE DAY --- */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  initial={{ rotate: -15, scale: 0.5 }}
                  whileInView={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <Sparkles className="h-8 w-8 text-primary" />
                </motion.div>
                <h2 className="text-4xl font-bold tracking-tight text-foreground">{t('carsOfDay.title')}</h2>
              </div>
              <p className="text-muted-foreground max-w-lg text-lg">
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
                  <div key={car.id} className="flex-none w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] snap-start">
                    <CarCard car={car} index={index} />
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link
                  href="/cars"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 group"
                >
                  {t('carsOfDay.viewAll')} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <TrustStats />
      <Portfolio />

      <Testimonials />
    </div>
  );
}
