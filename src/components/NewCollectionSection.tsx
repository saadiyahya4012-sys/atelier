import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface NewCollectionSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onExploreFull: () => void;
}

export const NewCollectionSection: React.FC<NewCollectionSectionProps> = ({
  products,
  onSelectProduct,
  onExploreFull,
}) => {
  // Select featured or newly created products (first 4 published items)
  const newArrivals = products
    .filter(p => p.status === 'publish')
    .slice(0, 4);

  if (newArrivals.length === 0) return null;

  return (
    <section id="nouvelle-collection" className="bg-[#FAF8F5] border-b border-[#E8E4DC] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#7A746B]">
              <Sparkles className="w-3.5 h-3.5 text-[#141414]" />
              <span>Capsule Exclusive</span>
              <span aria-hidden="true">·</span>
              <span>Série Limitée</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#141414] tracking-tight leading-tight [text-wrap:balance]">
              Nouvelle Collection Automne-Hiver
            </h2>
            <p className="text-sm sm:text-base text-[#59554E] font-light leading-relaxed">
              Des silhouettes pures façonnées à partir de serges de laine vierge et de soies drapées. Une sélection confidentielle pensée pour sublimer l'allure quotidienne.
            </p>
          </div>

          <button
            onClick={onExploreFull}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#141414] hover:text-[#4A4742] transition-colors pb-1 border-b border-[#141414] self-start md:self-end cursor-pointer group"
          >
            <span>Voir toute la collection</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4-Item Curated Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>

        {/* Editorial Lookbook Banner */}
        <div className="mt-16 bg-[#F4EFE6] border border-[#E8E4DC] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#7A746B] block">
              L'Élégance du Drapé
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#141414] tracking-tight">
              « Chaque vêtement doit respirer avec la personne qui le porte. »
            </h3>
            <p className="text-xs sm:text-sm text-[#59554E] leading-relaxed font-light max-w-2xl">
              Nos manteaux en cachemire et chemises de soie sont conçus sans entoilage rigide superflu, laissant la matière exprimer toute sa noblesse et sa fluidité naturelle.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <button
              onClick={onExploreFull}
              className="bg-[#141414] text-[#FAF8F5] px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#2A2A2A] transition-colors cursor-pointer shadow-sm"
            >
              Explorer le Lookbook
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
