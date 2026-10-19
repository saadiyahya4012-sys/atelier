import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, CreditCard, Loader2 } from 'lucide-react';
import { formatPrice } from '../utils/currency';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingCost,
    total,
    discount,
    promoCode,
    applyPromoCode,
    removePromoCode,
    freeShippingThreshold,
    clearCart
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState('');

  const handleDirectStripeCheckout = async () => {
    if (items.length === 0) return;
    setIsStripeLoading(true);
    setStripeError('');

    try {
      const payload = {
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor
        }))
      };

      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la redirection vers Stripe Checkout.');
      }

      clearCart();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setStripeError(err.message || 'Erreur Stripe');
      setIsStripeLoading(false);
    }
  };

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const ok = applyPromoCode(inputCode);
    if (!ok) {
      setCodeError('Code non reconnu (Astuce : essayez ATELIER10)');
    } else {
      setCodeError('');
      setInputCode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#E8E4DC] flex flex-col shadow-2xl">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#E8E4DC] flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-normal text-[#141414] tracking-tight">
                Votre Panier
              </h2>
              <span className="text-xs text-[#7A746B] uppercase tracking-wider">
                {items.length} article{items.length > 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#7A746B] hover:text-[#141414] transition-colors cursor-pointer"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Strip */}
          <div className="bg-[#F2ECE1] p-4 border-b border-[#E8E4DC]">
            <div className="flex items-center justify-between text-xs text-[#4A4742] mb-2 font-medium">
              {amountToFreeShipping === 0 ? (
                <span className="text-[#2A5C34] font-semibold">
                  Félicitations ! Vous bénéficiez de la livraison offerte.
                </span>
              ) : (
                <span>
                  Plus que <strong className="text-[#141414] tabular-nums">{formatPrice(amountToFreeShipping)}</strong> pour la livraison offerte
                </span>
              )}
              <span className="text-[11px] text-[#7A746B] tabular-nums">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#DDD6C7] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#141414] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#E8E4DC]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <span className="font-serif text-xl text-[#7A746B]">Votre panier est vide</span>
                <p className="text-xs text-[#8E887E] max-w-xs leading-relaxed">
                  Découvrez nos collections intemporelles et ajoutez vos pièces d'exception.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#141414] text-[#FAF8F5] px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                >
                  Continuer les achats
                </button>
              </div>
            ) : (
              items.map(item => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]?.src || '/src/assets/images/prod_cashmere_overcoat_1792324545026.jpg'}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover bg-[#EFECE6] border border-[#E8E4DC] shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-semibold text-[#141414] tracking-tight leading-tight">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#9E988D] hover:text-[#963E3E] transition-colors cursor-pointer p-1"
                          title="Supprimer du panier"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#7A746B] mt-1 space-x-2">
                        <span>Taille : <strong className="text-[#141414]">{item.selectedSize}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Couleur : <strong className="text-[#141414]">{item.selectedColor}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#DDD7CC] bg-white h-7">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-full text-xs font-bold hover:bg-[#F5F2EB] text-[#4A4742] transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-semibold tabular-nums text-[#141414]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-full text-xs font-bold hover:bg-[#F5F2EB] text-[#4A4742] transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Total for this line item */}
                      <span className="text-xs font-semibold text-[#141414] tabular-nums">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Promo and Totals */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E8E4DC] bg-[#FAF8F5] space-y-4">
              
              {/* Promo Code Input */}
              {promoCode ? (
                <div className="flex items-center justify-between bg-[#EFECE6] px-3 py-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#2A5C34] font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Privilège 10% appliqué ({promoCode})</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-[11px] text-[#7A746B] hover:text-[#963E3E] underline cursor-pointer"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCode} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => {
                        setInputCode(e.target.value);
                        setCodeError('');
                      }}
                      placeholder="Code privilège (ex: ATELIER10)"
                      className="flex-1 bg-white border border-[#DDD7CC] px-3 py-1.5 text-xs text-[#141414] uppercase focus:outline-hidden focus:border-[#141414]"
                    />
                    <button
                      type="submit"
                      className="bg-[#141414] text-[#FAF8F5] px-4 py-1.5 text-xs uppercase tracking-wider font-semibold hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                    >
                      Appliquer
                    </button>
                  </div>
                  {codeError && <p className="text-[11px] text-[#963E3E]">{codeError}</p>}
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#59554E] pt-2">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="tabular-nums font-medium text-[#141414]">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#2A5C34]">
                    <span>Remise privilège (-10%)</span>
                    <span className="tabular-nums font-semibold">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Livraison estimée</span>
                  <span className="tabular-nums">
                    {shippingCost === 0 ? <strong className="text-[#2A5C34]">Offerte</strong> : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="border-t border-[#E8E4DC] pt-2 flex justify-between text-base font-semibold text-[#141414]">
                  <span>Total estimé TTC</span>
                  <span className="tabular-nums text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Direct Stripe Checkout Button */}
              <button
                onClick={handleDirectStripeCheckout}
                disabled={isStripeLoading}
                className="w-full bg-[#141414] text-[#FAF8F5] py-3.5 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#2A2A2A] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isStripeLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Redirection Stripe Checkout...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Payer avec Stripe Checkout (Test)</span>
                  </>
                )}
              </button>

              {/* Checkout Form Modal trigger */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full bg-white border border-[#DDD7CC] text-[#141414] py-3 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#F5F2EB] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>Finaliser la commande (Options & Adresse)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {stripeError && (
                <p className="text-[11px] text-[#963E3E] text-center">{stripeError}</p>
              )}

              <div className="flex flex-col items-center justify-center gap-1 text-[10px] text-[#7A746B] text-center">
                <div className="flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2A5C34]" />
                  <span>Stripe Test Mode · Carte test : 4242 4242 4242 4242</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-[#8E887E]">
                  <ShieldCheck className="w-3 h-3 text-[#2A5C34]" />
                  <span>Passerelle sécurisée conforme PCI-DSS</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
