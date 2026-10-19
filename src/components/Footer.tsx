import React, { useState } from 'react';
import { ArrowRight, Check, MapPin, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onOpenDelivery: () => void;
  onOpenReturns: () => void;
  onOpenContact: () => void;
  onOpenSizeGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDelivery,
  onOpenReturns,
  onOpenContact,
  onOpenSizeGuide
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSent(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSent(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#121212] text-[#E8E4DC] border-t border-[#242424] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-[#242424]">
          
          {/* Brand & Boutique Info */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-3xl font-medium tracking-[0.25em] text-white uppercase block">
              ATELIER
            </span>
            <p className="text-xs text-[#9E988D] leading-relaxed max-w-sm font-light">
              Prêt-à-porter de luxe et maroquinerie d'exception. Conception architecturale, étoffes d'Italie et de France, coupe intemporelle.
            </p>
            
            <div className="pt-2 space-y-2 text-xs text-[#8E887E]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5BFB3]" />
                <span>12 Rue de la Paix, 75001 Paris, France</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5BFB3]" />
                <span>+33 (0)1 42 68 00 00</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C5BFB3]" />
                <span>contact@atelier-paris.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#9E988D]">
              <li><span className="hover:text-white transition-colors cursor-pointer">Vestiaire Femme</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Vestiaire Homme</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Souliers & Bottines</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Maroquinerie Fine</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Capsule Automne-Hiver</span></li>
            </ul>
          </div>

          {/* Column 3: Services & Client Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
              Service Client
            </h4>
            <ul className="space-y-2 text-xs text-[#9E988D]">
              <li>
                <button onClick={onOpenDelivery} className="hover:text-white transition-colors cursor-pointer text-left">
                  Livraison & Délais
                </button>
              </li>
              <li>
                <button onClick={onOpenReturns} className="hover:text-white transition-colors cursor-pointer text-left">
                  Retours & Échanges sous 30j
                </button>
              </li>
              <li>
                <button onClick={onOpenSizeGuide} className="hover:text-white transition-colors cursor-pointer text-left">
                  Guide des Tailles
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-white transition-colors cursor-pointer text-left">
                  Prendre Rendez-vous
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
              La Gazette de l'Atelier
            </h4>
            <p className="text-xs text-[#9E988D] font-light leading-relaxed">
              Recevez nos invitations aux présentations privées et nos lancements de séries limitées.
            </p>

            {newsletterSent ? (
              <div className="p-3 bg-[#1C2B1E] border border-[#2E5433] text-xs text-[#78D383] flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Bienvenue dans le cercle ATELIER.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    className="w-full bg-[#1C1C1C] border border-[#333333] px-3 py-2 text-xs text-white placeholder-[#777777] focus:outline-hidden focus:border-white transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-white text-[#141414] hover:bg-[#EAE6DE] transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="S'inscrire à la newsletter"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="block text-[10px] text-[#777777]">
                  Désinscription possible à tout moment. Données protégées.
                </span>
              </form>
            )}

            {/* Social Networks */}
            <div className="pt-2">
              <span className="block text-[10px] uppercase tracking-[0.16em] text-[#7A746B] mb-2 font-medium">
                Suivez la Maison
              </span>
              <div className="flex items-center gap-4 text-xs text-[#C5BFB3]">
                <a
                  href="#instagram"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-white transition-colors"
                  title="Instagram ATELIER Paris"
                >
                  Instagram
                </a>
                <span aria-hidden="true" className="text-[#444]">·</span>
                <a
                  href="#pinterest"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-white transition-colors"
                  title="Pinterest Moodboards & Lookbook"
                >
                  Pinterest
                </a>
                <span aria-hidden="true" className="text-[#444]">·</span>
                <a
                  href="#linkedin"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-white transition-colors"
                  title="LinkedIn Maison ATELIER"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7A746B]">
          <div className="flex items-center gap-2">
            <span>© 2026 ATELIER Paris. Tous droits réservés.</span>
            <span aria-hidden="true">·</span>
            <span>Architecture Headless WooCommerce & React</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onOpenDelivery} className="hover:text-white transition-colors">Livraison</button>
            <button onClick={onOpenReturns} className="hover:text-white transition-colors">Retours</button>
            <button onClick={onOpenContact} className="hover:text-white transition-colors">Contact</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
