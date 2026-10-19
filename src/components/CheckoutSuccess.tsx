import React, { useEffect, useState } from 'react';
import { CheckCircle2, Package, ShieldCheck, ArrowRight, Printer, Home, ShoppingBag, ExternalLink, Loader2 } from 'lucide-react';
import { formatPrice } from '../utils/currency';
import { Order } from '../types';

interface CheckoutSuccessProps {
  onReturnToStore: () => void;
  onExploreCatalog: () => void;
}

export const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({
  onReturnToStore,
  onExploreCatalog
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');
  const [isTestMode, setIsTestMode] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('session_id') || '';
    const orderId = params.get('order_id') || '';
    setSessionId(sid);

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/stripe/session/${sid}?order_id=${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            setOrder(data.order);
          }
        }
      } catch (e) {
        console.warn('Erreur chargement session Stripe', e);
      } finally {
        setLoading(false);
      }
    };

    if (sid || orderId) {
      fetchSession();
    } else {
      setLoading(false);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center antialiased">
      <div className="w-full max-w-2xl bg-white border border-[#E8E4DC] p-6 sm:p-10 shadow-xl space-y-8">
        
        {/* Luxury Top Brand Accent */}
        <div className="text-center space-y-2 border-b border-[#E8E4DC] pb-6">
          <span className="font-serif text-2xl tracking-[0.25em] uppercase font-medium text-[#141414]">
            ATELIER
          </span>
          <p className="text-[11px] uppercase tracking-widest text-[#7A746B]">
            Maison de Prêt-à-Porter & Haute Confection
          </p>
        </div>

        {/* Confirmation Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-[#2A5C34]/10 text-[#2A5C34] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F2EDE2] border border-[#DDD7CC] text-[11px] font-semibold uppercase tracking-wider text-[#141414]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2A5C34]" />
            <span>Paiement Stripe Réussi (Mode Test)</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#141414] pt-2">
            Merci pour votre commande
          </h1>
          <p className="text-xs sm:text-sm text-[#59554E] max-w-md mx-auto leading-relaxed">
            Votre paiement en <strong>Mode Test Stripe</strong> a été confirmé avec succès. Vos pièces d'exception sont désormais réservées dans nos ateliers.
          </p>
        </div>

        {/* Test Card Verification Strip */}
        <div className="bg-[#FAF8F5] border border-[#E0DACE] p-4 text-xs space-y-1.5">
          <div className="flex items-center justify-between font-semibold uppercase tracking-wider text-[11px] text-[#141414]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2A5C34] animate-pulse" />
              Règlement Sécurisé Stripe Checkout
            </span>
            <span className="font-mono text-[#7A746B]">Environnement Test</span>
          </div>
          <div className="text-[11px] text-[#6A665E] flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#E8E4DC]">
            <span>Carte de test utilisée : <strong className="font-mono text-[#141414]">4242 •••• •••• 4242</strong></span>
            {sessionId && (
              <span className="font-mono text-[10px] text-[#8A847A] truncate max-w-[200px]" title={sessionId}>
                Session: {sessionId}
              </span>
            )}
          </div>
        </div>

        {/* Order Details Receipt */}
        {order ? (
          <div className="space-y-4 border border-[#E8E4DC] p-5 bg-[#FAF8F5]">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3 text-xs uppercase tracking-wider font-semibold text-[#141414]">
              <span>Commande n° {order.number}</span>
              <span className="text-[#2A5C34]">En préparation</span>
            </div>

            {/* Line items */}
            <div className="divide-y divide-[#E8E4DC] max-h-48 overflow-y-auto pr-1">
              {order.line_items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-10 h-12 object-cover border border-[#DDD7CC] bg-white" />
                    )}
                    <div>
                      <p className="font-medium text-[#141414] leading-tight">{item.name}</p>
                      <p className="text-[11px] text-[#7A746B]">{item.size} · {item.color} (x{item.quantity})</p>
                    </div>
                  </div>
                  <span className="font-semibold tabular-nums text-[#141414]">
                    {formatPrice(item.total)}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing recap */}
            <div className="border-t border-[#E8E4DC] pt-3 space-y-1.5 text-xs text-[#59554E]">
              <div className="flex justify-between">
                <span>Sous-total articles</span>
                <span className="tabular-nums font-semibold text-[#141414]">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison ({order.shipping_method})</span>
                <span className="tabular-nums text-[#141414]">
                  {order.shipping_total === 0 ? <strong className="text-[#2A5C34]">Offerte</strong> : formatPrice(order.shipping_total)}
                </span>
              </div>
              <div className="border-t border-[#E8E4DC] pt-2 flex justify-between font-bold text-sm text-[#141414]">
                <span>Total réglé TTC</span>
                <span className="tabular-nums text-base">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Destination */}
            <div className="pt-2 border-t border-[#E8E4DC] text-[11px] text-[#7A746B]">
              <p className="font-semibold text-[#141414] uppercase tracking-wider mb-0.5">Destinataire & Expédition</p>
              <p>{order.shipping.first_name} {order.shipping.last_name} — {order.shipping.address_1}, {order.shipping.postcode} {order.shipping.city}, {order.shipping.country}</p>
              <p>Notification de suivi envoyée à : <strong>{order.billing.email}</strong></p>
            </div>
          </div>
        ) : loading ? (
          <div className="p-8 text-center text-xs text-[#7A746B] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Récupération des données de commande...</span>
          </div>
        ) : (
          <div className="p-6 bg-[#FAF8F5] border border-[#E8E4DC] text-center text-xs text-[#7A746B]">
            Votre paiement a été validé. Référence session : <strong className="font-mono text-[#141414]">{sessionId || 'cs_test_session'}</strong>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
          <button
            onClick={onReturnToStore}
            className="flex-1 bg-[#141414] text-[#FAF8F5] py-3.5 px-6 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Retour à l'Accueil</span>
          </button>

          <button
            onClick={onExploreCatalog}
            className="flex-1 bg-white border border-[#DDD7CC] text-[#141414] py-3.5 px-6 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#F5F2EB] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Continuer les Achats</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-transparent border border-[#DDD7CC] text-[#59554E] hover:text-[#141414] hover:border-[#141414] py-3.5 px-4 text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            title="Imprimer le reçu de commande"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>

        {/* Security and contact note */}
        <p className="text-[10px] text-center text-[#8A847A] leading-tight">
          Paiement sécurisé crypté de bout en bout conforme aux normes PCI-DSS Niveau 1. Conciergerie ATELIER joignable à conciergerie@atelier-paris.com.
        </p>

      </div>
    </div>
  );
};
