import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Order } from '../types';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Building2, Wallet, ArrowLeft, Loader2 } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import { createCheckoutSession } from '../utils/stripeCheckout';
import { VisaLogo, MastercardLogo } from './icons/PaymentLogos';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const { items, subtotal, shippingCost, total, discount, clearCart } = useCart();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address_1: '',
    city: '',
    postcode: '',
    country: 'France',
    shipping_method: 'Colissimo 48h Recommandé',
    payment_method: 'wc_stripe',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.address_1 || !formData.city || !formData.postcode) {
      setErrorMessage('Veuillez compléter tous les champs d\'adresse obligatoires.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (formData.payment_method === 'wc_stripe') {
        // Stripe Checkout Test Mode flow
        const stripePayload = {
          items: items.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor
          })),
          billing: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            address_1: formData.address_1,
            city: formData.city,
            postcode: formData.postcode,
            country: formData.country
          },
          shipping: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            address_1: formData.address_1,
            city: formData.city,
            postcode: formData.postcode,
            country: formData.country
          },
          shipping_method: formData.shipping_method,
          notes: formData.notes
        };

        const data = await createCheckoutSession(stripePayload);

        clearCart();
        window.location.href = data.url;
        return;
      }

      // Fallback standard order creation for BACS / COD
      const payload = {
        billing: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          address_1: formData.address_1,
          city: formData.city,
          postcode: formData.postcode,
          country: formData.country
        },
        shipping: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          address_1: formData.address_1,
          city: formData.city,
          postcode: formData.postcode,
          country: formData.country
        },
        shipping_method: formData.shipping_method,
        payment_method: formData.payment_method,
        payment_method_title:
          formData.payment_method === 'bacs'
            ? 'Virement Bancaire Immédiat'
            : 'Paiement à la Livraison Atelier',
        notes: formData.notes,
        line_items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor
        }))
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la validation de la commande.');
      }

      setConfirmedOrder(data.order);
      clearCart();
      onOrderSuccess(data.order);
    } catch (error: any) {
      setErrorMessage(error.message || 'Une erreur est survenue lors de la validation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#E8E4DC] shadow-2xl my-auto overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E8E4DC] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl font-medium tracking-tight text-[#141414]">
              {confirmedOrder ? 'Confirmation de Commande' : 'Finalisation de la Commande'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#7A746B] hover:text-[#141414] transition-colors cursor-pointer"
            aria-label="Fermer la fenêtre de commande"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          /* Confirmation Success Screen */
          <div className="p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto">
            <div className="w-16 h-16 bg-[#2A5C34]/10 text-[#2A5C34] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-3xl font-normal text-[#141414]">
                Merci, {confirmedOrder.billing.first_name}.
              </h3>
              <p className="text-xs uppercase tracking-widest text-[#7A746B]">
                Commande n° <strong className="text-[#141414] font-mono">{confirmedOrder.number}</strong>
              </p>
            </div>

            <p className="text-sm text-[#59554E] leading-relaxed">
              Votre commande a été transmise avec succès à l'Atelier. Un email récapitulatif détaillé vous a été envoyé à l'adresse <strong>{confirmedOrder.billing.email}</strong>.
            </p>

            <div className="bg-white border border-[#E8E4DC] p-6 text-left text-xs space-y-3">
              <div className="flex justify-between border-b border-[#E8E4DC] pb-2 font-semibold uppercase tracking-wider text-[#141414]">
                <span>Adresse de livraison</span>
                <span>Total réglé</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#59554E]">
                  {confirmedOrder.shipping.address_1}, {confirmedOrder.shipping.postcode} {confirmedOrder.shipping.city}
                </span>
                <span className="font-bold text-[#141414] text-sm tabular-nums">
                  {formatPrice(confirmedOrder.total)} TTC
                </span>
              </div>
              <div className="pt-2 text-[11px] text-[#7A746B]">
                Mode de règlement : {confirmedOrder.payment_method_title}
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onClose}
                className="bg-[#141414] text-[#FAF8F5] px-8 py-3.5 text-xs uppercase font-semibold tracking-widest hover:bg-[#2A2A2A] transition-colors cursor-pointer"
              >
                Retourner à la boutique
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
            
            {/* Left 7 cols: Form inputs */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
              
              {errorMessage && (
                <div className="p-3 bg-[#FBF0F0] border border-[#E8C2C2] text-xs text-[#963E3E] font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Step 1: Customer Contact */}
              <div className="space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#141414] border-b border-[#E8E4DC] pb-2">
                  01. Vos Coordonnées & Adresse de Livraison
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#59554E] mb-1">Prénom *</label>
                    <input
                      type="text"
                      name="first_name"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="Camille"
                      className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs text-[#141414] focus:outline-hidden focus:border-[#141414]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#59554E] mb-1">Nom *</label>
                    <input
                      type="text"
                      name="last_name"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Laurent"
                      className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs text-[#141414] focus:outline-hidden focus:border-[#141414]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#59554E] mb-1">Email de confirmation *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="camille.laurent@example.com"
                      className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs text-[#141414] focus:outline-hidden focus:border-[#141414]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#59554E] mb-1">Téléphone *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+33 6 12 34 56 78"
                      className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs text-[#141414] focus:outline-hidden focus:border-[#141414]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#59554E] mb-1">Adresse postale complète *</label>
                  <input
                    type="text"
                    name="address_1"
                    required
                    value={formData.address_1}
                    onChange={handleChange}
                    placeholder="14 Rue de Rivoli, Apt 3B"
                    className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs text-[#141414] focus:outline-hidden focus:border-[#141414]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#59554E] mb-1">Code Postal *</label>
                    <input
                      type="text"
                      name="postcode"
                      required
                      value={formData.postcode}
                      onChange={handleChange}
                      placeholder="75001"
                      className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs text-[#141414] focus:outline-hidden focus:border-[#141414]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#59554E] mb-1">Ville *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Paris"
                      className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs text-[#141414] focus:outline-hidden focus:border-[#141414]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#59554E] mb-1">Pays *</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full bg-white border border-[#DDD7CC] px-2 py-2 text-xs text-[#141414] focus:outline-hidden focus:border-[#141414]"
                    >
                      <option value="France">France</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Suisse">Suisse</option>
                      <option value="Luxembourg">Luxembourg</option>
                      <option value="Italie">Italie</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping method */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#141414] border-b border-[#E8E4DC] pb-2">
                  02. Mode de Livraison
                </div>

                <div className="space-y-2">
                  <label className={`flex items-center justify-between p-3 border cursor-pointer transition-colors ${
                    formData.shipping_method === 'Colissimo 48h Recommandé' ? 'border-[#141414] bg-white' : 'border-[#DDD7CC] bg-[#F7F4EC]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping_method"
                        value="Colissimo 48h Recommandé"
                        checked={formData.shipping_method === 'Colissimo 48h Recommandé'}
                        onChange={handleChange}
                      />
                      <div className="text-xs">
                        <span className="font-semibold block text-[#141414]">Colissimo Recommandé (48h)</span>
                        <span className="text-[11px] text-[#7A746B]">Remise en main propre contre signature</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#141414] tabular-nums">
                      {subtotal >= 250 ? 'Offert' : '15 DH'}
                    </span>
                  </label>

                  <label className={`flex items-center justify-between p-3 border cursor-pointer transition-colors ${
                    formData.shipping_method === 'Express Chronopost 24h' ? 'border-[#141414] bg-white' : 'border-[#DDD7CC] bg-[#F7F4EC]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping_method"
                        value="Express Chronopost 24h"
                        checked={formData.shipping_method === 'Express Chronopost 24h'}
                        onChange={handleChange}
                      />
                      <div className="text-xs">
                        <span className="font-semibold block text-[#141414]">Chronopost Express (24h)</span>
                        <span className="text-[11px] text-[#7A746B]">Livraison le lendemain avant 13h</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#141414] tabular-nums">25 DH</span>
                  </label>

                  <label className={`flex items-center justify-between p-3 border cursor-pointer transition-colors ${
                    formData.shipping_method === 'Retrait en Boutique Atelier Paris' ? 'border-[#141414] bg-white' : 'border-[#DDD7CC] bg-[#F7F4EC]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping_method"
                        value="Retrait en Boutique Atelier Paris"
                        checked={formData.shipping_method === 'Retrait en Boutique Atelier Paris'}
                        onChange={handleChange}
                      />
                      <div className="text-xs">
                        <span className="font-semibold block text-[#141414]">Retrait en Boutique (12 Rue de la Paix, Paris)</span>
                        <span className="text-[11px] text-[#7A746B]">Disponible sous 2 heures avec préparation sur cintre</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#2A5C34]">Gratuit</span>
                  </label>
                </div>
              </div>

              {/* Step 3: Payment method */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#141414] border-b border-[#E8E4DC] pb-2">
                  03. Paiement Sécurisé WooCommerce
                </div>

                <div className="space-y-2">
                  <label className={`flex items-center justify-between gap-3 p-3 border cursor-pointer transition-colors ${
                    formData.payment_method === 'wc_stripe' ? 'border-[#141414] bg-white shadow-2xs' : 'border-[#DDD7CC] bg-[#F7F4EC] hover:bg-[#F2EDE2]'
                  }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="radio"
                        name="payment_method"
                        value="wc_stripe"
                        checked={formData.payment_method === 'wc_stripe'}
                        onChange={handleChange}
                        className="cursor-pointer accent-[#141414]"
                      />
                      <div className="flex items-center gap-2 min-w-0">
                        <CreditCard className="w-4 h-4 text-[#141414] shrink-0" />
                        <span className="text-xs font-semibold text-[#141414] truncate">Carte Bancaire Sécurisée</span>
                      </div>
                    </div>
                    {/* Official Payment Brand Logos */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0" aria-label="Cartes acceptées : Visa, Mastercard">
                      <div 
                        className="h-6 px-1.5 py-0.5 bg-white border border-[#DDD7CC] rounded-xs flex items-center justify-center shadow-2xs"
                        title="Carte Visa acceptée"
                      >
                        <VisaLogo className="h-3 sm:h-3.5 w-auto" />
                      </div>
                      <div 
                        className="h-6 px-1.5 py-0.5 bg-white border border-[#DDD7CC] rounded-xs flex items-center justify-center shadow-2xs"
                        title="Carte Mastercard acceptée"
                      >
                        <MastercardLogo className="h-3.5 sm:h-4 w-auto" />
                      </div>
                    </div>
                  </label>

                  {/* Stripe Test Mode Info Panel */}
                  {formData.payment_method === 'wc_stripe' && (
                    <div className="p-3 bg-[#FAF8F5] border border-[#DDD7CC] text-xs space-y-1.5 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between font-semibold text-[11px] uppercase tracking-wider text-[#141414]">
                        <span className="flex items-center gap-1.5 text-[#2A5C34]">
                          <span className="w-2 h-2 rounded-full bg-[#2A5C34] animate-pulse" />
                          Passerelle Stripe Test Mode
                        </span>
                        <span className="text-[#7A746B] text-[10px] font-normal">Paiement sécurisé de test</span>
                      </div>
                      <p className="text-[11px] text-[#59554E]">
                        Vous pouvez tester le paiement sans aucun débit réel à l'aide de la carte de test Stripe officielle :
                      </p>
                      <div className="p-2 bg-white border border-[#DDD7CC] flex items-center justify-between font-mono text-[11px] text-[#141414]">
                        <span>4242&nbsp;4242&nbsp;4242&nbsp;4242</span>
                        <span className="text-[#7A746B]">Exp: MM/AA · CVC: 123</span>
                      </div>
                    </div>
                  )}

                  <label className={`flex items-center justify-between p-3 border cursor-pointer transition-colors ${
                    formData.payment_method === 'bacs' ? 'border-[#141414] bg-white' : 'border-[#DDD7CC] bg-[#F7F4EC]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        value="bacs"
                        checked={formData.payment_method === 'bacs'}
                        onChange={handleChange}
                      />
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#141414]" />
                        <span className="text-xs font-semibold text-[#141414]">Virement Bancaire Immédiat</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#7A746B]">IBAN / SEPA</span>
                  </label>

                  <label className={`flex items-center justify-between p-3 border cursor-pointer transition-colors ${
                    formData.payment_method === 'cod' ? 'border-[#141414] bg-white' : 'border-[#DDD7CC] bg-[#F7F4EC]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        value="cod"
                        checked={formData.payment_method === 'cod'}
                        onChange={handleChange}
                      />
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-[#141414]" />
                        <span className="text-xs font-semibold text-[#141414]">Paiement à la Livraison</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#7A746B]">Règlement au coursier</span>
                  </label>
                </div>

                {/* Transparent Security Disclaimer */}
                <div className="bg-[#EFECE6] p-3 border border-[#DDD7CC] text-[11px] text-[#6A665E] space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#141414]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Sécurité & Confidentialité des Données</span>
                  </div>
                  <p>
                    Les transactions et la création des commandes sont gérées via les routes serveur sécurisées WooCommerce REST. Aucun numéro de carte bancaire n'est stocké dans cette interface.
                  </p>
                </div>
              </div>

            </div>

            {/* Right 5 cols: Order Summary */}
            <div className="lg:col-span-5 bg-[#F2EDE2] p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-[#E8E4DC] flex flex-col justify-between space-y-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#141414] border-b border-[#E0DACE] pb-2 mb-4">
                  Récapitulatif ({items.length} article{items.length > 1 ? 's' : ''})
                </div>

                <div className="max-h-56 overflow-y-auto space-y-3 pr-2 divide-y divide-[#E0DACE]">
                  {items.map(item => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]?.src}
                          alt={item.product.name}
                          className="w-12 h-14 object-cover bg-white border border-[#DDD7CC]"
                        />
                        <div>
                          <p className="font-semibold text-[#141414] leading-tight">{item.product.name}</p>
                          <p className="text-[11px] text-[#7A746B]">{item.selectedSize} · {item.selectedColor} (x{item.quantity})</p>
                        </div>
                      </div>
                      <span className="font-semibold tabular-nums text-[#141414]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-4 border-t border-[#E0DACE] space-y-2 text-xs text-[#59554E]">
                  <div className="flex justify-between">
                    <span>Sous-total articles</span>
                    <span className="tabular-nums font-semibold text-[#141414]">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#2A5C34] font-semibold">
                      <span>Remise privilège</span>
                      <span className="tabular-nums">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Frais d'expédition</span>
                    <span className="tabular-nums text-[#141414]">
                      {shippingCost === 0 ? <strong className="text-[#2A5C34]">Offerte</strong> : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-[#E0DACE] flex justify-between text-base font-bold text-[#141414]">
                    <span>Total à régler TTC</span>
                    <span className="tabular-nums text-xl">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full bg-[#141414] text-[#FAF8F5] py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#2A2A2A] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {formData.payment_method === 'wc_stripe'
                        ? 'Redirection vers Stripe Checkout...'
                        : 'Validation de la commande...'}
                    </>
                  ) : formData.payment_method === 'wc_stripe' ? (
                    `Payer avec Stripe Checkout (Test) · ${formatPrice(total)}`
                  ) : (
                    `Confirmer la Commande · ${formatPrice(total)}`
                  )}
                </button>

                <p className="text-[10px] text-center text-[#7A746B] leading-tight">
                  En validant votre commande, vous acceptez les Conditions Générales de Vente de la Maison ATELIER.
                </p>
              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
};
