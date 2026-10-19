import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onOurStory: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onOurStory }) => {
  return (
    <section className="relative overflow-hidden bg-[#F5F2EB] border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
          
          {/* Left Column: Editorial Presentation */}
          <div className="lg:col-span-5 flex flex-col justify-between order-2 lg:order-1">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#7A746B]">
                <span>Maison de Couture</span>
                <span aria-hidden="true">·</span>
                <span>Automne-Hiver 2026</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl xl:text-6xl font-normal leading-[1.08] tracking-tight text-[#141414] [text-wrap:balance]">
                L'Épure Intemporelle & Matières Nobles.
              </h1>

              <p className="text-[#59554E] text-base sm:text-lg font-light leading-relaxed max-w-xl">
                Des coupes architecturales sculptées dans les étoffes les plus précieuses d'Italie, de France et d'Écosse. Une garde-robe sobre, pensée pour traverser le temps avec grâce.
              </p>
            </div>

            <div className="pt-8 sm:pt-12 space-y-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onExplore}
                  className="inline-flex items-center justify-center gap-3 bg-[#141414] text-[#FAF8F5] px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#2A2A2A] transition-all duration-200 shadow-sm cursor-pointer"
                >
                  Découvrir la Collection
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onOurStory}
                  className="inline-flex items-center justify-center gap-2 border border-[#C5BFB3] text-[#2C2925] px-7 py-4 text-xs font-medium uppercase tracking-[0.16em] hover:border-[#141414] hover:text-[#141414] transition-colors cursor-pointer"
                >
                  <Compass className="w-4 h-4 stroke-[1.5]" />
                  L'Artisanat d'Atelier
                </button>
              </div>

              {/* Editorial Trust Markers */}
              <div className="pt-6 border-t border-[#E2DDD3] grid grid-cols-3 gap-4 text-left">
                <div>
                  <span className="block font-serif text-xl sm:text-2xl font-medium text-[#141414] tabular-nums">100%</span>
                  <span className="block text-[11px] text-[#7A746B] uppercase tracking-wider mt-0.5">Filatures Nobles</span>
                </div>
                <div>
                  <span className="block font-serif text-xl sm:text-2xl font-medium text-[#141414] tabular-nums">12 Rue</span>
                  <span className="block text-[11px] text-[#7A746B] uppercase tracking-wider mt-0.5">De la Paix, Paris</span>
                </div>
                <div>
                  <span className="block font-serif text-xl sm:text-2xl font-medium text-[#141414] tabular-nums">30 Jours</span>
                  <span className="block text-[11px] text-[#7A746B] uppercase tracking-wider mt-0.5">Retours Gratuits</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Campaign Photography */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative aspect-[4/3] lg:aspect-[16/11] w-full overflow-hidden bg-[#E7E2D8]">
              <img
                src="/src/assets/images/hero_boutique_interior_1792325142001.jpg"
                alt="Intérieur de la boutique Maison ATELIER - Architecture épurée et vestiaire d'exception"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02] transition-transform duration-700 hover:scale-[1.01]"
              />
              <div className="absolute bottom-4 right-4 bg-[#FAF8F5]/90 backdrop-blur-sm px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-[#141414] border border-[#E8E4DC]">
                Nouvelle Campagne Éditoriale
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
