'use client';

import { MessageCircle, Facebook } from 'lucide-react';
import { useState } from 'react';

export function FloatingContactButtons() {
    const [isHovered, setIsHovered] = useState<string | null>(null);

    // Replace with your actual contact details
    const whatsappNumber = '+971523479535'; // Format: country code + number (no + or spaces)
    const facebookUrl = 'https://www.facebook.com/people/GULF-STAR-Automotive/61587500704497/';

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent('Hello! I would like to enquire about your cars for export.');
        window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
    };

    const handleFacebookClick = () => {
        window.open(facebookUrl, '_blank');
    };

    return (
        <div className="fixed bottom-12 right-6 z-50 flex flex-col gap-3">
            {/* WhatsApp Button */}
            <button
                onClick={handleWhatsAppClick}
                onMouseEnter={() => setIsHovered('whatsapp')}
                onMouseLeave={() => setIsHovered(null)}
                className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 overflow-visible"
                aria-label="Chat on WhatsApp"
            >
                <div className="absolute inset-0 rounded-full bg-green-500 animate-pulse opacity-20 group-hover:opacity-0 transition-opacity" />
                <MessageCircle className="w-6 h-6 text-white" />

                {/* Tooltip */}
                <span
                    className={`absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-300 ${isHovered === 'whatsapp'
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-2 pointer-events-none'
                        }`}
                >
                    Chat on WhatsApp
                    <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></span>
                </span>

                {/* Pulse animation */}
                <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></span>
            </button>

            {/* Facebook Button */}
            <button
                onClick={handleFacebookClick}
                onMouseEnter={() => setIsHovered('facebook')}
                onMouseLeave={() => setIsHovered(null)}
                className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Visit our Facebook page"
            >
                <Facebook className="w-6 h-6 text-white fill-white" />

                {/* Tooltip */}
                <span
                    className={`absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-300 ${isHovered === 'facebook'
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-2 pointer-events-none'
                        }`}
                >
                    Follow on Facebook
                    <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></span>
                </span>
            </button>
        </div>
    );
}
