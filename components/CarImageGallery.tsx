'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { optimizeCloudinaryUrl, cloudinaryPresets } from '@/lib/cloudinary';

interface CarImageGalleryProps {
    images: string[];
    alt: string;
}

export function CarImageGallery({ images, alt }: CarImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center">
                <p className="text-muted-foreground">No images available</p>
            </div>
        );
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div
                className="relative aspect-video rounded-3xl overflow-hidden cursor-zoom-in group bg-secondary/50"
                onClick={() => setIsFullscreen(true)}
            >
                <Image
                    src={optimizeCloudinaryUrl(images[currentIndex], cloudinaryPresets.galleryMain)}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 80vw"
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                prevImage();
                            }}
                            className="bg-background/80 backdrop-blur-md p-2 rounded-full hover:bg-background transition-colors shadow-lg"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                            }}
                            className="bg-background/80 backdrop-blur-md p-2 rounded-full hover:bg-background transition-colors shadow-lg"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                )}

                {/* Counter */}
                <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative w-24 aspect-video rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${currentIndex === idx ? 'border-primary scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                        >
                            <Image
                                src={optimizeCloudinaryUrl(img, cloudinaryPresets.thumbnail)}
                                alt={`${alt} thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                                quality={60}
                                sizes="96px"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
                    >
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[101]"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        <div className="relative w-full h-[80vh] flex items-center justify-center p-4">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="relative w-full h-full max-w-6xl"
                            >
                                <Image
                                    src={optimizeCloudinaryUrl(images[currentIndex], cloudinaryPresets.fullscreen)}
                                    alt={alt}
                                    fill
                                    className="object-contain"
                                    quality={95}
                                    sizes="(max-width: 768px) 100vw, 90vw"
                                />
                            </motion.div>

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                    >
                                        <ChevronLeft className="w-8 h-8 text-white" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                    >
                                        <ChevronRight className="w-8 h-8 text-white" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails in Fullscreen */}
                        <div className="w-full max-w-4xl px-4 mt-8">
                            <div className="flex gap-3 overflow-x-auto justify-center pb-4 scrollbar-hide">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`relative w-20 aspect-video rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${currentIndex === idx ? 'border-primary scale-105' : 'border-transparent opacity-40 hover:opacity-80'
                                            }`}
                                    >
                                        <Image
                                            src={optimizeCloudinaryUrl(img, cloudinaryPresets.thumbnail)}
                                            alt={`${alt} thumbnail ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            quality={60}
                                            sizes="80px"
                                            loading="lazy"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
