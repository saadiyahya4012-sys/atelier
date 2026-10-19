import React, { useState } from 'react';
import { Product } from '../types';
import { Eye, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [isQuickAdding, setIsQuickAdding] = useState(false);

  const primaryCategory = product.categories[0]?.name || 'Prêt-à-Porter';
  const defaultSize = product.attributes.find(a => a.name.toLowerCase().includes('taille'))?.options[0] || 'Unique';
  const defaultColor = product.attributes.find(a => a.name.toLowerCase().includes('couleur'))?.options[0] || 'Standard';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsQuickAdding(true);
    addToCart(product, defaultSize, defaultColor, 1);
    setTimeout(() => {
      setIsQuickAdding(false);
    }, 800);
  };

  const imageSrc = product.images[0]?.src || '/src/assets/images/product_wool_coat_1792259932706.jpg';

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col cursor-pointer bg-[#FAF8F5] transition-all duration-300 hover:-translate-y-1"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F0ECE1] border border-[#E8E4DC]/80">
        {!imageError ? (
          <img
            src={imageSrc}
            alt={product.images[0]?.alt || product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#ECE7DE] text-[#6A665E]">
            <span className="font-serif text-lg font-medium text-[#141414]">{product.name}</span>
            <span className="text-xs uppercase tracking-wider mt-1">{primaryCategory}</span>
          </div>
        )}

        {/* Discreet Promotional / Exclusivity Badge */}
        {product.on_sale && product.regular_price > product.price ? (
          <div className="absolute top-3 left-3 bg-[#141414] text-[#FAF8F5] text-[10px] font-semibold uppercase tracking-[0.14em] px-2.5 py-1 shadow-xs">
            Privilège -{Math.round(((product.regular_price - product.price) / product.regular_price) * 100)}%
          </div>
        ) : product.featured ? (
          <div className="absolute top-3 left-3 bg-[#FAF8F5]/95 text-[#141414] text-[10px] font-semibold uppercase tracking-[0.14em] px-2.5 py-1 border border-[#E8E4DC] shadow-xs">
            Nouveauté
          </div>
        ) : null}

        {product.stock_quantity > 0 && product.stock_quantity <= 4 && (
          <div className="absolute top-3 right-3 bg-[#FAF8F5]/95 backdrop-blur-xs text-[#8A4F2A] text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 border border-[#E2DDD3]">
            {product.stock_quantity} restante{product.stock_quantity > 1 ? 's' : ''}
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-between gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex-1 bg-[#FAF8F5] text-[#141414] py-2 text-[11px] font-semibold uppercase tracking-wider hover:bg-white transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Découvrir
          </button>
          <button
            onClick={handleQuickAdd}
            disabled={product.stock_quantity === 0}
            className="flex-1 bg-[#141414] text-[#FAF8F5] py-2 text-[11px] font-semibold uppercase tracking-wider hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            {isQuickAdding ? 'Ajouté' : 'Ajouter'}
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="pt-3.5 pb-2 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[#847E74]">
          <div className="flex items-center gap-2">
            <span>{primaryCategory}</span>
            {product.material && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate max-w-[130px]">{product.material.split(',')[0]}</span>
              </>
            )}
          </div>
        </div>

        <h3 className="text-[14px] sm:text-[15px] font-medium text-[#141414] tracking-tight group-hover:text-[#4A4742] transition-colors line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-[14px] sm:text-[15px] font-semibold text-[#141414]">
              {formatPrice(product.price)}
            </span>
            {product.on_sale && product.regular_price > product.price && (
              <span className="text-xs text-[#9E988D] line-through font-normal">
                {formatPrice(product.regular_price)}
              </span>
            )}
          </div>

          {/* Color Dots count */}
          {product.attributes.find(a => a.name.toLowerCase().includes('couleur'))?.options && (
            <div className="flex items-center gap-1 text-[11px] text-[#7A746B]">
              <span>{product.attributes.find(a => a.name.toLowerCase().includes('couleur'))?.options.length} coloris</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
