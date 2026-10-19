import React, { useState } from 'react';
import { Product } from '../types';
import { X, Check, Shield, Truck, RotateCcw, ChevronDown, ChevronUp, Ruler, CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import { createCheckoutSession } from '../utils/stripeCheckout';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenSizeGuide
}) => {
  if (!product) return null;

  const { addToCart } = useCart();

  // Find size options
  const sizeAttr = product.attributes.find(a => a.name.toLowerCase().includes('taille'));
  const sizeOptions = sizeAttr ? sizeAttr.options : ['Unique'];

  // Find color options
  const colorAttr = product.attributes.find(a => a.name.toLowerCase().includes('couleur'));
  const colorOptions = colorAttr ? colorAttr.options : ['Standard'];

  const [selectedSize, setSelectedSize] = useState(sizeOptions[0] || 'Unique');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState('');
  const [activeAccordion, setActiveAccordion] = useState<string | null>('composition');

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 1500);
  };

  const handleInstantStripeBuy = async () => {
    if (product.stock_quantity <= 0) return;
    setIsStripeLoading(true);
    setStripeError('');

    try {
      const payload = {
        items: [
          {
            product_id: product.id,
            quantity: quantity,
            size: selectedSize,
            color: selectedColor
          }
        ]
      };

      const data = await createCheckoutSession(payload);
      window.location.href = data.url;
    } catch (err: any) {
      setStripeError(err.message || 'Échec d\'initialisation Stripe.');
      setIsStripeLoading(false);
    }
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const getColorClass = (colorName: string) => {
    const lower = colorName.toLowerCase();
    if (lower.includes('noir')) return 'bg-black text-white';
    if (lower.includes('camel') || lower.includes('cognac')) return 'bg-[#C19A6B] text-white';
    if (lower.includes('ivoire') || lower.includes('craie')) return 'bg-[#FDFBF7] border border-gray-300 text-black';
    if (lower.includes('crème') || lower.includes('avoine')) return 'bg-[#F5F2EB] border border-gray-300 text-black';
    if (lower.includes('espresso') || lower.includes('châtaigne')) return 'bg-[#3D2314] text-white';
    if (lower.includes('gris') || lower.includes('ardoise') || lower.includes('anthracite')) return 'bg-[#555555] text-white';
    if (lower.includes('bleu')) return 'bg-[#1A2849] text-white';
    return 'bg-[#E5E0D8] text-black';
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Gallery images list (using product images or rich detail fallback views)
  const galleryImages = product.images.length > 1
    ? product.images
    : [
        product.images[0] || { id: 1, src: '/images/prod_cashmere_overcoat_1792324545026.jpg', alt: product.name },
        { id: 2, src: '/images/prod_silk_blouse_1792324546779.jpg', alt: 'Vue portée éditoriale' },
        { id: 3, src: '/images/cat_nouveautes_fabric_1792324525877.jpg', alt: 'Détail de matière et tissage' }
      ];

  const currentImage = galleryImages[activeImageIndex] || galleryImages[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#FAF8F5] border border-[#E8E4DC] shadow-2xl my-auto overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#141414] hover:opacity-60 transition-opacity bg-[#FAF8F5]/80 backdrop-blur-xs rounded-full cursor-pointer"
          aria-label="Fermer la vue produit"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          
          {/* Left Column: Interactive Product Photo Gallery */}
          <div className="md:col-span-6 bg-[#F0ECE1] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8E4DC] p-4 sm:p-6">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE7DE] shadow-xs">
              <img
                src={currentImage.src}
                alt={currentImage.alt || product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.on_sale && (
                <span className="absolute top-4 left-4 bg-[#141414] text-[#FAF8F5] text-[10px] uppercase font-bold tracking-widest px-3 py-1">
                  Privilège Atelier
                </span>
              )}
            </div>

            {/* Thumbnail switcher */}
            <div className="flex items-center gap-2 pt-3 justify-center">
              {galleryImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-16 border overflow-hidden transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#141414] ring-1 ring-[#141414] opacity-100'
                      : 'border-[#DDD7CC] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.alt || `Vue ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-[#FAF8F5]">
            <div className="space-y-4">
              
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[#7A746B]">
                <span>{product.categories[0]?.name || 'Prêt-à-Porter'}</span>
                <span className="font-mono text-[11px] text-[#A8A297]">{product.sku}</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#141414] tracking-tight [text-wrap:balance]">
                {product.name}
              </h2>

              {/* Price & Stock */}
              <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
                <div className="flex items-baseline gap-3 tabular-nums">
                  <span className="text-2xl font-semibold text-[#141414]">
                    {formatPrice(product.price)}
                  </span>
                  {product.on_sale && product.regular_price > product.price && (
                    <span className="text-sm text-[#9E988D] line-through">
                      {formatPrice(product.regular_price)}
                    </span>
                  )}
                </div>

                <div className="text-xs">
                  {product.stock_quantity > 0 ? (
                    <span className="text-[#3D6B42] font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3D6B42]" />
                      En stock ({product.stock_quantity} pièces)
                    </span>
                  ) : (
                    <span className="text-[#963E3E] font-medium">Épuisé</span>
                  )}
                </div>
              </div>

              {/* Short Description */}
              <p className="text-sm text-[#59554E] font-light leading-relaxed">
                {product.description || product.short_description}
              </p>

              {/* Size Selector */}
              {sizeOptions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#141414]">
                      Taille sélectionnée : <span className="font-normal text-[#59554E]">{selectedSize}</span>
                    </span>
                    <button
                      onClick={onOpenSizeGuide}
                      className="inline-flex items-center gap-1 text-[11px] text-[#7A746B] hover:text-[#141414] underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      <Ruler className="w-3 h-3" />
                      Guide des tailles
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map(sz => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-[44px] h-11 px-3 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-[#141414] text-[#FAF8F5]'
                            : 'bg-white border border-[#D5CFBF] text-[#2C2925] hover:border-[#141414]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {colorOptions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#141414] block">
                    Coloris : <span className="font-normal text-[#59554E]">{selectedColor}</span>
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {colorOptions.map(clr => (
                      <button
                        key={clr}
                        onClick={() => setSelectedColor(clr)}
                        className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                          selectedColor === clr
                            ? 'border-[#141414] bg-[#EFECE6]'
                            : 'border-[#DDD8CD] bg-white hover:border-[#8E877B]'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full inline-block ${getColorClass(clr)}`} />
                        <span>{clr}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add to Cart button */}
              <div className="pt-4 flex items-center gap-3">
                <div className="flex items-center border border-[#D5CFBF] bg-white h-12">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full text-sm font-semibold hover:bg-[#F5F2EB] transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="w-10 h-full text-sm font-semibold hover:bg-[#F5F2EB] transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className={`flex-1 h-12 px-6 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    addedSuccess
                      ? 'bg-[#2A5C34] text-white'
                      : 'bg-[#141414] text-[#FAF8F5] hover:bg-[#2A2A2A]'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      Ajouté au Panier
                    </>
                  ) : product.stock_quantity === 0 ? (
                    'Rupture de Stock'
                  ) : (
                    'Ajouter au Panier'
                  )}
                </button>
              </div>

              {/* Direct Stripe Checkout Test Purchase Button */}
              <div className="space-y-1.5">
                <button
                  onClick={handleInstantStripeBuy}
                  disabled={product.stock_quantity === 0 || isStripeLoading}
                  className="w-full h-12 px-6 bg-[#FAF8F5] text-[#141414] border border-[#141414] text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#141414] hover:text-[#FAF8F5] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isStripeLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Redirection vers Stripe Checkout...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Acheter avec Stripe (Mode Test) · {formatPrice(product.price * quantity)}</span>
                    </>
                  )}
                </button>

                {stripeError && (
                  <p className="text-[11px] text-[#963E3E] text-center">{stripeError}</p>
                )}

                <div className="flex items-center justify-center gap-2 text-[10px] text-[#7A746B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2A5C34]" />
                  <span>Stripe Test Mode : Carte test <strong>4242 4242 4242 4242</strong></span>
                </div>
              </div>

              {/* Assurance Trust Strip */}
              <div className="pt-4 grid grid-cols-3 gap-2 border-t border-[#E8E4DC] text-center text-[11px] text-[#6A665E]">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-[#141414]" />
                  <span>Livraison Offerte dès 250 DH</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-[#141414]" />
                  <span>Retours sous 30 Jours</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#2A5C34]" />
                  <span>Stripe Test Sécurisé</span>
                </div>
              </div>

              {/* Accordion Sections */}
              <div className="pt-4 divide-y divide-[#E8E4DC] border-t border-[#E8E4DC]">
                
                {/* 1. Composition & Origine */}
                <div>
                  <button
                    onClick={() => toggleAccordion('composition')}
                    className="w-full py-3 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#141414] cursor-pointer"
                  >
                    <span>Matières Nobles & Origine</span>
                    {activeAccordion === 'composition' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {activeAccordion === 'composition' && (
                    <div className="pb-4 text-xs text-[#59554E] space-y-1.5 leading-relaxed font-light">
                      <p><strong>Matière :</strong> {product.material || 'Tissage d\'exception sélectionné en Italie'}</p>
                      <p><strong>Atelier de confection :</strong> {product.origin || 'Façonné dans nos ateliers partenaires'}</p>
                      <p>Fibre naturelle certifiée, traçabilité intégrale de la filature au produit fini.</p>
                    </div>
                  )}
                </div>

                {/* 2. Coupe & Conseils */}
                <div>
                  <button
                    onClick={() => toggleAccordion('coupe')}
                    className="w-full py-3 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#141414] cursor-pointer"
                  >
                    <span>Coupe & Conseils de Style</span>
                    {activeAccordion === 'coupe' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {activeAccordion === 'coupe' && (
                    <div className="pb-4 text-xs text-[#59554E] space-y-1.5 leading-relaxed font-light">
                      <p>Coupe ajustée mais naturelle. Nous vous recommandons de commander votre taille habituelle.</p>
                      <p>Le mannequin mesure 1,78m et porte une taille 38.</p>
                    </div>
                  )}
                </div>

                {/* 3. Entretien d'exception */}
                <div>
                  <button
                    onClick={() => toggleAccordion('entretien')}
                    className="w-full py-3 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#141414] cursor-pointer"
                  >
                    <span>Conseils d'Entretien</span>
                    {activeAccordion === 'entretien' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {activeAccordion === 'entretien' && (
                    <div className="pb-4 text-xs text-[#59554E] space-y-1.5 leading-relaxed font-light">
                      <p>Nettoyage à sec spécialisé recommandé pour préserver la douceur et la structure des fibres.</p>
                      <p>Repassage doux à la vapeur sur l'envers ou suspendre dans une pièce humide.</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
