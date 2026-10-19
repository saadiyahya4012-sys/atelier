import React from 'react';
import { XCircle, ArrowLeft, ShoppingBag, ShieldAlert, MessageSquare } from 'lucide-react';

interface CheckoutCancelProps {
  onReturnToCart: () => void;
  onExploreCatalog: () => void;
}

export const CheckoutCancel: React.FC<CheckoutCancelProps> = ({
  onReturnToCart,
  onExploreCatalog
}) => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center antialiased">
      <div className="w-full max-w-xl bg-white border border-[#E8E4DC] p-6 sm:p-10 shadow-xl space-y-8">
        
        {/* Brand Accent */}
        <div className="text-center space-y-2 border-b border-[#E8E4DC] pb-6">
          <span className="font-serif text-2xl tracking-[0.25em] uppercase font-medium text-[#141414]">
            ATELIER
          </span>
          <p className="text-[11px] uppercase tracking-widest text-[#7A746B]">
            Maison de Prêt-à-Porter & Haute Confection
          </p>
        </div>

        {/* Cancellation Message */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-[#8A4F2A]/10 text-[#8A4F2A] rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] border border-[#DDD7CC] text-[11px] font-semibold uppercase tracking-wider text-[#6A665E]">
            <ShieldAlert className="w-3.5 h-3.5 text-[#8A4F2A]" />
            <span>Paiement Non Finalisé · Mode Test</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#141414] pt-2">
            La transaction a été interrompue
          </h1>
          <p className="text-xs sm:text-sm text-[#59554E] max-w-md mx-auto leading-relaxed">
            Vous avez annulé la procédure de paiement Stripe. Rassurez-vous : <strong>aucun débit n'a été effectué</strong> et le contenu de votre sélection a été conservé.
          </p>
        </div>

        {/* Help box */}
        <div className="bg-[#FAF8F5] border border-[#E8E4DC] p-5 text-xs text-[#59554E] space-y-2">
          <p className="font-semibold uppercase tracking-wider text-[#141414] text-[11px]">
            Besoin d'aide pour tester votre paiement ?
          </p>
          <p>
            Pour tester avec succès la passerelle Stripe en environnement de test, vous pouvez renseigner le numéro de carte de test universel :
          </p>
          <div className="p-3 bg-white border border-[#DDD7CC] font-mono text-center text-xs font-semibold text-[#141414] tracking-widest">
            4242 4242 4242 4242 &nbsp;·&nbsp; MM/AA &nbsp;·&nbsp; CVC: 123
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
          <button
            onClick={onReturnToCart}
            className="flex-1 bg-[#141414] text-[#FAF8F5] py-3.5 px-6 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Reprendre la Commande</span>
          </button>

          <button
            onClick={onExploreCatalog}
            className="flex-1 bg-white border border-[#DDD7CC] text-[#141414] py-3.5 px-6 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#F5F2EB] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Catalogue</span>
          </button>
        </div>

      </div>
    </div>
  );
};
