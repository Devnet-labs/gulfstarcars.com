'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, Trash2, Star } from 'lucide-react';
import { useCallback, useState } from 'react';

interface ImageUploadProps {
    onUpload: (url: string) => void;
    onRemove: (url: string) => void;
    onReorder?: (urls: string[]) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onUpload,
    onRemove,
    onReorder,
    value
}) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleUpload = useCallback((result: any) => {
        onUpload(result.info.secure_url);
    }, [onUpload]);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...value];
        const draggedImage = newImages[draggedIndex];
        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedImage);

        onReorder?.(newImages);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const setAsCover = (index: number) => {
        if (index === 0) return; // Already cover
        const newImages = [...value];
        const coverImage = newImages.splice(index, 1)[0];
        newImages.unshift(coverImage);
        onReorder?.(newImages);
    };

    return (
        <div>
            <div className="mb-2">
                <p className="text-sm text-[#A3A3A3] mb-1">
                    <Star className="inline h-3.5 w-3.5 text-[#D4AF37] mr-1" />
                    First image will be the cover image
                </p>
                <p className="text-xs text-[#737373]">
                    Drag to reorder or click "Set as Cover"
                </p>
            </div>
            <div className="mb-4 flex flex-wrap items-center gap-4">
                {value.map((url, index) => (
                    <div
                        key={url}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`relative w-[200px] h-[200px] rounded-md overflow-hidden border-2 cursor-move transition-all ${index === 0
                                ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20'
                                : 'border-[#404040] hover:border-[#D4AF37]/50'
                            } ${draggedIndex === index ? 'opacity-50' : 'opacity-100'}`}
                    >
                        {/* Cover Badge */}
                        {index === 0 && (
                            <div className="absolute top-2 left-2 z-10 bg-[#D4AF37] text-black px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                                <Star className="h-3 w-3 fill-current" />
                                Cover
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="absolute top-2 right-2 z-10 flex gap-2">
                            {index !== 0 && (
                                <button
                                    type="button"
                                    onClick={() => setAsCover(index)}
                                    className="bg-[#D4AF37] text-black hover:bg-[#C4A037] p-2 rounded-md transition-colors"
                                    title="Set as cover image"
                                >
                                    <Star className="h-4 w-4" />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => onRemove(url)}
                                className="bg-red-500 text-white hover:bg-red-600 p-2 rounded-md transition-colors"
                                title="Remove image"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Image Number Badge */}
                        <div className="absolute bottom-2 left-2 z-10 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold">
                            #{index + 1}
                        </div>

                        <img
                            src={url}
                            alt={`Car image ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget
                onSuccess={handleUpload}
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                    maxFiles: 30,
                    folder: 'carsUploads',
                }}
            >
                {({ open }) => {
                    const onClick = () => {
                        open();
                    };

                    return (
                        <button
                            type="button"
                            onClick={onClick}
                            className="relative flex flex-col items-center justify-center gap-4 py-8 border-2 border-dashed border-[#404040] rounded-lg hover:border-[#D4AF37] transition-all hover:bg-[#1A1A1A] w-full"
                        >
                            <ImagePlus className="h-8 w-8 text-[#A3A3A3]" />
                            <div className="text-sm font-semibold text-[#A3A3A3]">
                                Upload Images
                            </div>
                        </button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
}

export default ImageUpload;
export { ImageUpload };