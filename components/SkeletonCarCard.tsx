'use client';

import { motion } from 'framer-motion';

export function SkeletonCarCard() {
    return (
        <div className="bg-card rounded-[16px] sm:rounded-[24px] overflow-hidden border border-white/5 shadow-md flex flex-col h-full relative">
            {/* Shimmer Effect Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear"
                    }}
                    className="h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
                />
            </div>

            {/* Image Section Skeleton */}
            <div className="relative aspect-[4/3] bg-secondary"></div>

            {/* Content Section Skeleton */}
            <div className="p-3 sm:p-6 flex flex-col flex-grow space-y-2 sm:space-y-4">
                <div className="flex justify-between items-start">
                    <div className="h-6 bg-white/5 rounded-md w-2/3"></div>
                    <div className="h-6 bg-white/5 rounded-md w-12"></div>
                </div>

                <div className="space-y-2">
                    <div className="h-4 bg-white/5 rounded-md w-full"></div>
                    <div className="h-4 bg-white/5 rounded-md w-5/6"></div>
                </div>

                {/* Specs Divider Skeleton */}
                <div className="flex items-center gap-2 sm:gap-4 py-2 sm:py-4 border-t border-white/5">
                    <div className="h-3 sm:h-4 bg-white/5 rounded-md w-12 sm:w-16"></div>
                    <div className="w-px h-3 bg-white/10"></div>
                    <div className="h-3 sm:h-4 bg-white/5 rounded-md w-12 sm:w-16"></div>
                    <div className="w-px h-3 bg-white/10"></div>
                    <div className="h-3 sm:h-4 bg-white/5 rounded-md w-12 sm:w-16"></div>
                </div>

                {/* Price and Buttons Skeleton */}
                <div className="mt-auto pt-2 sm:pt-4 space-y-2 sm:space-y-4">
                    <div>
                        <div className="h-2 sm:h-3 bg-white/5 rounded-md w-16 sm:w-20 mb-1 sm:mb-2"></div>
                        <div className="h-6 sm:h-8 bg-white/10 rounded-md w-24 sm:w-32"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="h-8 sm:h-12 bg-primary/20 rounded-lg sm:rounded-xl w-full"></div>
                        <div className="h-8 sm:h-12 bg-white/5 rounded-lg sm:rounded-xl w-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonHeader() {
    return (
        <div className="mb-6 space-y-2 animate-pulse">
            <div className="h-8 bg-white/10 rounded-md w-48"></div>
            <div className="h-4 bg-white/5 rounded-md w-64"></div>
        </div>
    );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCarCard key={i} />
            ))}
        </div>
    );
}
