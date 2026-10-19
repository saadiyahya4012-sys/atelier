/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, Order } from './types';
import { INITIAL_PRODUCTS } from './data/seedProducts';
import { CartProvider } from './context/CartContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryCircleNav } from './components/CategoryCircleNav';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CraftsmanshipSection } from './components/CraftsmanshipSection';
import { Footer } from './components/Footer';
import { InfoModals } from './components/InfoModals';
import { AdminDashboard } from './components/AdminDashboard';
import { NewCollectionSection } from './components/NewCollectionSection';
import { CheckoutSuccess } from './components/CheckoutSuccess';
import { CheckoutCancel } from './components/CheckoutCancel';
import { Search } from 'lucide-react';

export default function App() {
  const getInitialView = (): 'store' | 'admin' | 'checkout-success' | 'checkout-cancel' => {
    const path = window.location.pathname;
    if (path.startsWith('/admin') || window.location.hash === '#admin') return 'admin';
    if (path.startsWith('/checkout/success')) return 'checkout-success';
    if (path.startsWith('/checkout/cancel')) return 'checkout-cancel';
    return 'store';
  };

  const [view, setView] = useState<'store' | 'admin' | 'checkout-success' | 'checkout-cancel'>(getInitialView);

  const [products, setProducts] = useState<Product[]>(() => {
    // Initial fallback using seed products filtered by publish
    return INITIAL_PRODUCTS.filter(p => p.status === 'publish');
  });

  const [currentCategory, setCurrentCategory] = useState<string>('tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<'delivery' | 'returns' | 'contact' | 'sizeGuide' | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Synchronize route history
  useEffect(() => {
    const handlePopState = () => {
      setView(getInitialView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (target: 'store' | 'admin' | 'checkout-success' | 'checkout-cancel') => {
    setView(target);
    if (target === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (target === 'checkout-success') {
      window.history.pushState({}, '', '/checkout/success');
    } else if (target === 'checkout-cancel') {
      window.history.pushState({}, '', '/checkout/cancel');
    } else {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch public products from API
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setProducts(data.data);
        }
      }
    } catch (e) {
      console.warn('Backend API initializing or unreachable, using local store', e);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSelectCategory = (cat: string) => {
    if (cat === 'accueil') {
      setCurrentCategory('tous');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (cat === 'nouveautes') {
      setCurrentCategory('nouveautes');
      const newColEl = document.getElementById('nouvelle-collection');
      if (newColEl) {
        newColEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setCurrentCategory(cat);
    const catalogEl = document.getElementById('catalogue-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <CartProvider>
      {view === 'admin' ? (
        <AdminDashboard
          onBackToStore={() => navigateTo('store')}
          onRefreshCatalog={fetchProducts}
        />
      ) : view === 'checkout-success' ? (
        <CheckoutSuccess
          onReturnToStore={() => navigateTo('store')}
          onExploreCatalog={() => {
            navigateTo('store');
            setTimeout(() => {
              const el = document.getElementById('catalogue-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />
      ) : view === 'checkout-cancel' ? (
        <CheckoutCancel
          onReturnToCart={() => {
            navigateTo('store');
          }}
          onExploreCatalog={() => {
            navigateTo('store');
            setTimeout(() => {
              const el = document.getElementById('catalogue-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />
      ) : (
        <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#141414] antialiased">
          
          {/* Top Announcement Bar */}
          <AnnouncementBar onLearnMore={() => setActiveInfoModal('delivery')} />

          {/* 3-Zone Header Contract */}
          <Header
            currentCategory={currentCategory}
            onSelectCategory={handleSelectCategory}
            onOpenSearch={() => setIsSearchModalOpen(true)}
          />

          {/* Main Storefront Body */}
          <main className="flex-1">
            
            {/* Campaign Hero with High-Fashion Editorial Imagery */}
            <Hero
              onExplore={() => {
                const el = document.getElementById('catalogue-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOurStory={() => {
                const el = document.getElementById('manifeste-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Circular Category Universes Navigation */}
            <CategoryCircleNav
              currentCategory={currentCategory}
              onSelectCategory={handleSelectCategory}
            />

            {/* Section Nouvelle Collection */}
            <NewCollectionSection
              products={products}
              onSelectProduct={setSelectedProduct}
              onExploreFull={() => {
                setCurrentCategory('tous');
                const el = document.getElementById('catalogue-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Product Catalogue & Filtering System */}
            <ProductGrid
              products={products}
              currentCategory={currentCategory}
              onSelectCategory={setCurrentCategory}
              onSelectProduct={setSelectedProduct}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            {/* Brand Storytelling & Craftsmanship Manifesto */}
            <div id="manifeste-section">
              <CraftsmanshipSection onLearnMore={() => setActiveInfoModal('contact')} />
            </div>

          </main>

          {/* Footer with legal links & concierge address */}
          <Footer
            onOpenDelivery={() => setActiveInfoModal('delivery')}
            onOpenReturns={() => setActiveInfoModal('returns')}
            onOpenContact={() => setActiveInfoModal('contact')}
            onOpenSizeGuide={() => setActiveInfoModal('sizeGuide')}
          />

          {/* Contiguous Product Detail Modal (PDP) */}
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onOpenSizeGuide={() => setActiveInfoModal('sizeGuide')}
          />

          {/* Slide-over Cart Drawer */}
          <CartDrawer
            onProceedToCheckout={() => setIsCheckoutOpen(true)}
          />

          {/* Multi-step Checkout Modal with WooCommerce Bridge */}
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            onOrderSuccess={() => {
              fetchProducts(); // Refresh products to reflect inventory update
            }}
          />

          {/* Client Information Modals (Delivery, Returns, Size Guide, Contact) */}
          <InfoModals
            type={activeInfoModal}
            onClose={() => setActiveInfoModal(null)}
          />

          {/* Quick Search Overlay Modal */}
          {isSearchModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-24 p-4 animate-in fade-in duration-150">
              <div className="w-full max-w-xl bg-white border border-[#E8E4DC] p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#141414]">
                    <Search className="w-4 h-4" />
                    <span>Rechercher une pièce ATELIER</span>
                  </div>
                  <button
                    onClick={() => setIsSearchModalOpen(false)}
                    className="text-xs text-[#7A746B] hover:text-[#141414] cursor-pointer"
                  >
                    Fermer (ESC)
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tapez un mot-clé (manteau, soie, cachemire, bottines)..."
                    className="w-full bg-[#FAF8F5] border border-[#DDD7CC] px-4 py-3 text-sm text-[#141414] placeholder-[#8E887E] focus:outline-hidden focus:border-[#141414]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setIsSearchModalOpen(false);
                        const el = document.getElementById('catalogue-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-[#7A746B] pt-2">
                  <span>Appuyez sur Entrée pour filtrer le catalogue</span>
                  <button
                    onClick={() => {
                      setIsSearchModalOpen(false);
                      const el = document.getElementById('catalogue-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-[#141414] text-white px-4 py-1.5 uppercase font-semibold text-[11px] tracking-wider"
                  >
                    Voir les résultats
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </CartProvider>
  );
}
