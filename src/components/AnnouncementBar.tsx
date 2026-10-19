import React from 'react';
import { ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  onLearnMore?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onLearnMore }) => {
  return (
    <div className="bg-[#181818] text-[#E8E4DC] text-[12px] font-normal tracking-wider py-2.5 px-4 text-center border-b border-[#2A2A2A] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <span className="font-light">
          Livraison offerte dès 250 DH d'achat · Retours offerts sous 30 jours
        </span>
        {onLearnMore && (
          <button
            onClick={onLearnMore}
            className="hidden sm:inline-flex items-center gap-1 underline underline-offset-4 hover:text-white transition-colors cursor-pointer text-[11px] font-medium uppercase tracking-widest"
          >
            En savoir plus <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
