import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, Search, RotateCcw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  currentCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  currentCategory,
  onSelectCategory,
  onSelectProduct,
  searchQuery,
  setSearchQuery
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'name'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { label: 'Toutes les créations', value: 'tous' },
    { label: 'Nouveautés', value: 'nouveautes' },
    { label: 'Femme', value: 'femme' },
    { label: 'Homme', value: 'homme' },
    { label: 'Accessoires', value: 'accessoires' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '36', '38', '40', '42', '44'];

  const filteredProducts = useMemo(() => {
    // Only published products
    let list = products.filter(p => p.status === 'publish');

    // Category
    if (currentCategory === 'nouveautes') {
      list = list.filter(p => p.featured || new Date(p.date_created).getTime() > Date.now() - 30 * 86400000);
    } else if (currentCategory && currentCategory !== 'tous' && currentCategory !== 'all') {
      const cat = currentCategory.toLowerCase();
      list = list.filter(p =>
        p.categories.some(c => c.slug.toLowerCase() === cat || c.name.toLowerCase() === cat)
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.material && p.material.toLowerCase().includes(q))
      );
    }

    // Size filter
    if (selectedSize !== 'all') {
      list = list.filter(p =>
        p.attributes.some(a =>
          a.name.toLowerCase().includes('taille') && a.options.includes(selectedSize)
        )
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
    }

    return list;
  }, [products, currentCategory, searchQuery, selectedSize, sortBy]);

  const resetFilters = () => {
    onSelectCategory('tous');
    setSelectedSize('all');
    setSearchQuery('');
    setSortBy('newest');
  };

  const hasActiveFilters = currentCategory !== 'tous' || selectedSize !== 'all' || searchQuery.trim() !== '';

  return (
    <section id="catalogue-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E4DC] pb-6 mb-8">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#7A746B] mb-2">
            Collection Permanente & Nouveautés
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#141414] tracking-tight">
            Le Vestiaire Atelier
          </h2>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => onSelectCategory(cat.value)}
              className={`px-4 py-2 text-xs uppercase tracking-wider transition-all cursor-pointer ${
                currentCategory === cat.value
                  ? 'bg-[#141414] text-[#FAF8F5] font-semibold'
                  : 'bg-white border border-[#E0DACE] text-[#59554E] hover:border-[#141414] hover:text-[#141414]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-[#F4F0E8] p-4 border border-[#E8E4DC]">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A746B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher manteau, soie, cuir, taille..."
            className="w-full bg-white border border-[#DDD7CC] pl-10 pr-4 py-2 text-xs text-[#141414] placeholder-[#8E887E] focus:outline-hidden focus:border-[#141414] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A746B] hover:text-[#141414] cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        {/* Controls: Size Filter & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#DDD7CC] text-xs font-medium uppercase tracking-wider text-[#4A4742] hover:border-[#141414] transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtres {selectedSize !== 'all' ? `(${selectedSize})` : ''}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#7A746B] hidden sm:inline">Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#DDD7CC] px-3 py-2 text-xs text-[#141414] focus:outline-hidden focus:border-[#141414] cursor-pointer uppercase tracking-wider"
            >
              <option value="newest">Nouveautés d'Atelier</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Alphabétique (A-Z)</option>
            </select>
          </div>

          {/* Reset Filters button if any active */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[11px] text-[#7A746B] hover:text-[#141414] underline underline-offset-4 cursor-pointer uppercase tracking-wider"
            >
              <RotateCcw className="w-3 h-3" />
              Réinitialiser
            </button>
          )}
        </div>

      </div>

      {/* Collapsible Size Sub-filter */}
      {showFilters && (
        <div className="mb-8 p-4 bg-white border border-[#E8E4DC] animate-in fade-in duration-150">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#141414] mb-3">
            Filtrer par taille disponible :
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSize('all')}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-all cursor-pointer ${
                selectedSize === 'all'
                  ? 'bg-[#141414] text-white font-semibold'
                  : 'bg-[#FAF8F5] border border-[#DDD7CC] text-[#59554E] hover:border-[#141414]'
              }`}
            >
              Toutes tailles
            </button>
            {sizes.map(sz => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`min-w-[40px] px-3 py-1.5 text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  selectedSize === sz
                    ? 'bg-[#141414] text-white font-semibold'
                    : 'bg-[#FAF8F5] border border-[#DDD7CC] text-[#59554E] hover:border-[#141414]'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Catalog Metric Count */}
      <div className="flex items-center justify-between text-xs text-[#7A746B] uppercase tracking-wider mb-6">
        <span>
          <strong className="text-[#141414] tabular-nums font-semibold">{filteredProducts.length}</strong> pièce{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
        </span>
        {currentCategory !== 'tous' && (
          <span>Catégorie active : <strong className="text-[#141414]">{currentCategory}</strong></span>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white border border-[#E8E4DC] p-8 max-w-lg mx-auto space-y-4">
          <p className="font-serif text-2xl text-[#141414]">Aucune pièce trouvée</p>
          <p className="text-xs text-[#7A746B] leading-relaxed">
            Aucun produit ne correspond à vos critères de recherche actuels.
          </p>
          <button
            onClick={resetFilters}
            className="inline-block bg-[#141414] text-[#FAF8F5] px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#2A2A2A] transition-colors cursor-pointer"
          >
            Afficher toutes les pièces
          </button>
        </div>
      )}

    </section>
  );
};
