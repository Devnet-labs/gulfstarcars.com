'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, Trash2, User } from 'lucide-react';

interface SingleImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export function SingleImageUpload({ value, onChange }: SingleImageUploadProps) {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  const onRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-[#262626] group">
          <img
            src={value}
            alt="Profile"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <Trash2 className="h-6 w-6 text-red-400" />
          </button>
        </div>
      ) : (
        <div className="w-32 h-32 rounded-lg border-2 border-dashed border-[#404040] flex items-center justify-center bg-[#1A1A1A]">
          <User className="h-12 w-12 text-[#737373]" />
        </div>
      )}

      <CldUploadWidget
        onSuccess={onUpload}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          maxFiles: 1,
          folder: 'teamMembers',
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
          maxFileSize: 5000000, // 5MB
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="flex items-center gap-2 px-4 py-2 bg-[#141414] border border-[#262626] rounded-lg hover:border-[#D4AF37] transition-colors text-sm text-white"
          >
            <ImagePlus className="h-4 w-4" />
            {value ? 'Change Photo' : 'Upload Photo'}
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
