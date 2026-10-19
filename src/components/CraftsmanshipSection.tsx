import React from 'react';
import { ArrowRight, Sparkles, Scissors, Globe } from 'lucide-react';

interface CraftsmanshipSectionProps {
  onLearnMore?: () => void;
}

export const CraftsmanshipSection: React.FC<CraftsmanshipSectionProps> = ({ onLearnMore }) => {
  return (
    <section className="bg-[#FAF8F5] border-b border-[#E8E4DC] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#7A746B] mb-3">
            <span>Manifeste</span>
            <span aria-hidden="true">·</span>
            <span>La Philosophie d'Atelier</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#141414] tracking-tight leading-[1.15] [text-wrap:balance]">
            Le respect du geste artisanal, la pureté des matières et l'exigence des proportions.
          </h2>
          <p className="mt-4 text-[#59554E] text-base leading-relaxed font-light">
            Chez ATELIER, nous concevons des vêtements comme des architectures vivantes. Chaque pièce est le fruit d'une collaboration étroite avec des tisseurs et des façonniers héritiers de traditions séculaires en France, en Italie et en Écosse.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 pt-4">
          
          {/* Pillar 1 */}
          <div className="space-y-4 border-t border-[#D5CFBF] pt-6">
            <div className="text-xs font-mono text-[#8E887E] tabular-nums">01 / 03</div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#141414]" />
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#141414]">
                Filatures d'Exception
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#59554E] font-light leading-relaxed">
              Nous sélectionnons exclusivement des fibres nobles certifiées : cachemire peigné de Mongolie intérieure, soie de mûrier lyonnaise et serge de laine vierge Super 120's de Biella.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="space-y-4 border-t border-[#D5CFBF] pt-6">
            <div className="text-xs font-mono text-[#8E887E] tabular-nums">02 / 03</div>
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[#141414]" />
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#141414]">
                Coupe Architecturale
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#59554E] font-light leading-relaxed">
              Chaque patron est ajusté au millimètre pour offrir une ligne nette sans contraindre le corps. Emmanchures souples, tombé naturel et finitions invisibles cousues à la main.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="space-y-4 border-t border-[#D5CFBF] pt-6">
            <div className="text-xs font-mono text-[#8E887E] tabular-nums">03 / 03</div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#141414]" />
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#141414]">
                Production Raisonnée
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#59554E] font-light leading-relaxed">
              Pas de surproduction. Nos séries sont limitées et nos stocks gérés avec rigueur depuis notre atelier parisien pour garantir une longévité absolue à chaque création.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
