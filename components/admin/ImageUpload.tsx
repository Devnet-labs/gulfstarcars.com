'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useCallback } from 'react';

interface ImageUploadProps {
    onUpload: (url: string) => void;
    onRemove: (url: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onUpload,
    onRemove,
    value
}) => {
    const handleUpload = useCallback((result: any) => {
        onUpload(result.info.secure_url);
    }, [onUpload]);

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden border">
                        <div className="z-10 absolute top-2 right-2">
                            <button
                                type="button"
                                onClick={() => onRemove(url)}
                                className="bg-red-500 text-white hover:bg-red-600 p-2 rounded-md transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                        <img
                            src={url}
                            alt="Car image"
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