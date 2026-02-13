'use client';

import { Linkedin, Mail, Globe } from 'lucide-react';
import { trackEvent } from '@/lib/trackEvent';
import * as Motion from '@/components/motion';

interface TeamMemberProps {
  name: string;
  position: string;
  bio: string;
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

  return (
    <Motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-6 h-full flex flex-col hover:border-[#D4AF37] transition-all duration-300">
        <div className="w-24 h-24 rounded-lg bg-[#1A1A1A] mb-4 overflow-hidden border border-[#262626]">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[#D4AF37]">
              {name.charAt(0)}
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
        <p className="text-sm text-[#D4AF37] mb-3 font-medium">{position}</p>
        <p className="text-sm text-[#A3A3A3] leading-relaxed flex-grow">{bio}</p>

        <div className="flex gap-3 mt-4 pt-4 border-t border-[#262626] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {linkedIn && (
            <button
              onClick={() => handleSocialClick('linkedin', linkedIn)}
              className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#262626] flex items-center justify-center hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 transition-colors"
              aria-label={`${name} LinkedIn`}
            >
              <Linkedin className="w-4 h-4 text-[#0A66C2]" />
            </button>
          )}
          {email && (
            <button
              onClick={() => handleSocialClick('email', `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`)}
              className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#262626] flex items-center justify-center hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
              aria-label={`Email ${name}`}
            >
              <Mail className="w-4 h-4 text-[#D4AF37]" />
            </button>
          )}
          {website && (
            <button
              onClick={() => handleSocialClick('website', website)}
              className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#262626] flex items-center justify-center hover:border-[#A3A3A3] hover:bg-[#A3A3A3]/10 transition-colors"
              aria-label={`${name} Website`}
            >
              <Globe className="w-4 h-4 text-[#A3A3A3]" />
            </button>
          )}
        </div>
      </div>
    </Motion.div>
  );
}
