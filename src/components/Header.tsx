import React, { useState } from 'react';
import { ShoppingBag, Search, ShieldCheck, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  currentCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  onOpenSearch
}) => {
  const { totalCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Accueil', value: 'accueil' },
    { label: 'Accessoires', value: 'accessoires' },
    { label: 'Nouveautés', value: 'nouveautes' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E4DC] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single element Brand wordmark */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-[#141414] hover:opacity-70 transition-opacity"
            aria-label="Ouvrir le menu de navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => {
              onSelectCategory('accueil');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex flex-col items-start text-left cursor-pointer"
          >
            <span className="font-serif text-2xl sm:text-3xl font-medium tracking-[0.25em] text-[#141414] uppercase leading-none">
              ATELIER
            </span>
          </button>
        </div>

        {/* Zone 2: Balanced clean nav links */}
        <nav className="hidden md:flex items-center gap-10 lg:gap-12 text-[13px] font-medium tracking-[0.14em] uppercase text-[#4A4742]">
          {navLinks.map(link => {
            const isActive = currentCategory === link.value || (link.value === 'accueil' && currentCategory === 'tous');
            return (
              <button
                key={link.value}
                onClick={() => onSelectCategory(link.value)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
                  isActive ? 'text-[#141414] font-semibold' : 'hover:text-[#141414]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#141414]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action cluster (Search & Cart ONLY) */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#4A4742] hover:text-[#141414] transition-colors cursor-pointer"
            aria-label="Rechercher un vêtement"
            title="Rechercher"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>

          {/* Cart toggle */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#141414] hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-2"
            aria-label="Voir le panier"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
            <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider">
              Panier
            </span>
            {totalCount > 0 && (
              <span className="bg-[#141414] text-[#FAF8F5] text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center tabular-nums">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E4DC] bg-[#FAF8F5] px-6 py-6 space-y-4 animate-in fade-in duration-200">
          <div className="space-y-3">
            {navLinks.map(link => (
              <button
                key={link.value}
                onClick={() => {
                  onSelectCategory(link.value);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left py-2 text-sm uppercase tracking-widest ${
                  currentCategory === link.value ? 'font-bold text-[#141414]' : 'text-[#6A665E]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
