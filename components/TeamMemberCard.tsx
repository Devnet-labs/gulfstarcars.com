'use client';

import { Linkedin, Mail, Globe } from 'lucide-react';
import { trackEvent } from '@/lib/trackEvent';
import * as Motion from '@/components/motion';

interface TeamMemberProps {
  name: string;
  position: string;
  bio?: string;
  image?: string;
  linkedIn?: string;
  email?: string;
  website?: string;
  index: number;
}

export function TeamMemberCard({ name, position, bio, image, linkedIn, email, website, index }: TeamMemberProps) {
  const handleSocialClick = (platform: string, url: string) => {
    trackEvent('team_social_click', { memberName: name, platform });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const hasBio = bio && bio.trim().length > 0;
  const hasSocial = linkedIn || email || website;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-8 h-full flex flex-col items-center text-center hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/5 transition-all duration-300">
        {/* Centered profile image - premium look */}
        <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-[#1A1A1A] mb-5 overflow-hidden border-2 border-[#262626] group-hover:border-[#D4AF37]/50 transition-colors duration-300 shrink-0 ring-2 ring-[#262626]/50">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover object-center" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[#D4AF37]">
              {name.charAt(0)}
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold text-white mb-1.5 tracking-tight">{name}</h3>
        <p className="text-sm font-medium text-[#D4AF37] mb-4">{position}</p>

        {hasBio && (
          <p className="text-sm text-[#A3A3A3] leading-relaxed grow max-w-sm">{bio}</p>
        )}

        {hasSocial && (
          <div className={`flex gap-3 mt-5 pt-5 border-t border-[#262626] w-full justify-center ${hasBio ? '' : 'mt-auto'}`}>
            {linkedIn && (
              <button
                onClick={() => handleSocialClick('linkedin', linkedIn)}
                className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 transition-colors cursor-pointer"
                aria-label={`${name} LinkedIn`}
              >
                <Linkedin className="w-5 h-5 text-[#0A66C2]" />
              </button>
            )}
            {email && (
              <button
                onClick={() => handleSocialClick('email', `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`)}
                className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
                aria-label={`Email ${name}`}
              >
                <Mail className="w-5 h-5 text-[#D4AF37]" />
              </button>
            )}
            {website && (
              <button
                onClick={() => handleSocialClick('website', website)}
                className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center hover:border-[#A3A3A3] hover:bg-[#A3A3A3]/10 transition-colors cursor-pointer"
                aria-label={`${name} Website`}
              >
                <Globe className="w-5 h-5 text-[#A3A3A3]" />
              </button>
            )}
          </div>
        )}
      </div>
    </Motion.div>
  );
}
