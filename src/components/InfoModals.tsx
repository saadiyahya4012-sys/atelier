import React, { useState } from 'react';
import { X, CheckCircle, Truck, RotateCcw, Mail, Send, MapPin, Clock } from 'lucide-react';

interface InfoModalProps {
  type: 'delivery' | 'returns' | 'contact' | 'sizeGuide' | null;
  onClose: () => void;
}

export const InfoModals: React.FC<InfoModalProps> = ({ type, onClose }) => {
  const [contactSent, setContactSent] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'Conseil personnalisé',
    message: ''
  });

  if (!type) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#E8E4DC] shadow-2xl my-auto overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E8E4DC] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            {type === 'delivery' && <Truck className="w-5 h-5 text-[#141414]" />}
            {type === 'returns' && <RotateCcw className="w-5 h-5 text-[#141414]" />}
            {type === 'contact' && <Mail className="w-5 h-5 text-[#141414]" />}
            {type === 'sizeGuide' && <span className="font-mono text-sm font-bold">CM</span>}
            <h3 className="font-serif text-2xl font-normal text-[#141414] tracking-tight">
              {type === 'delivery' && 'Livraisons & Expéditions'}
              {type === 'returns' && 'Politique de Retours & Échanges'}
              {type === 'contact' && 'Contacter la Maison ATELIER'}
              {type === 'sizeGuide' && 'Guide des Tailles & Mensurations'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#7A746B] hover:text-[#141414] transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on type */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-6 text-xs text-[#59554E] leading-relaxed">
          
          {/* DELIVERY */}
          {type === 'delivery' && (
            <div className="space-y-6">
              <p className="text-sm text-[#141414]">
                Toutes nos créations sont préparées à la main dans notre atelier parisien, emballées sous papier de soie et livrées dans un coffret rigide écologique.
              </p>

              <div className="border border-[#E8E4DC] divide-y divide-[#E8E4DC] bg-white">
                <div className="p-4 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-[#141414] uppercase tracking-wider">Colissimo Recommandé (France & Monaco)</h4>
                    <p className="text-[11px] text-[#7A746B] mt-0.5">Délai : 48h ouvrées · Remise contre signature</p>
                  </div>
                  <span className="font-bold text-[#141414] shrink-0">15 DH (Offert dès 250 DH)</span>
                </div>

                <div className="p-4 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-[#141414] uppercase tracking-wider">Chronopost Express 24h</h4>
                    <p className="text-[11px] text-[#7A746B] mt-0.5">Commande passée avant 14h, livrée le lendemain avant 13h</p>
                  </div>
                  <span className="font-bold text-[#141414] shrink-0">25 DH</span>
                </div>

                <div className="p-4 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-[#141414] uppercase tracking-wider">Retrait en Boutique Atelier Paris</h4>
                    <p className="text-[11px] text-[#7A746B] mt-0.5">12 Rue de la Paix, 75001 Paris · Disponible en 2h avec essayage personnalisé</p>
                  </div>
                  <span className="font-bold text-[#2A5C34] shrink-0">Gratuit</span>
                </div>
              </div>
            </div>
          )}

          {/* RETURNS */}
          {type === 'returns' && (
            <div className="space-y-4">
              <p className="text-sm text-[#141414]">
                Vous disposez d'un délai de <strong>30 jours</strong> à compter de la réception de votre commande pour nous retourner une pièce qui ne vous conviendrait pas.
              </p>

              <div className="space-y-3 bg-white p-5 border border-[#E8E4DC]">
                <h4 className="font-semibold uppercase tracking-wider text-[#141414]">Comment effectuer un retour :</h4>
                <ol className="list-decimal pl-4 space-y-2 text-[#59554E]">
                  <li>Emballez la pièce non portée, non lavée, avec toutes ses étiquettes d'origine intactes.</li>
                  <li>Téléchargez et imprimez votre étiquette de retour prépayée depuis votre email de confirmation ou contactez notre conciergerie.</li>
                  <li>Déposez le colis dans un bureau de poste ou point relais sous 30 jours.</li>
                  <li>Le remboursement est effectué sous 3 à 5 jours ouvrés sur votre moyen de paiement d'origine.</li>
                </ol>
              </div>

              <p className="text-[11px] text-[#7A746B]">
                Les frais de premier retour sont intégralement offerts pour la France métropolitaine et les pays de l'Union Européenne.
              </p>
            </div>
          )}

          {/* SIZE GUIDE */}
          {type === 'sizeGuide' && (
            <div className="space-y-6">
              <p className="text-[#141414]">
                Nos créations taillent fidèlement. Mesurez-vous sans serrer le mètre ruban, directement sur le corps.
              </p>

              <div className="overflow-x-auto border border-[#E8E4DC] bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F2ECE1] border-b border-[#E8E4DC] text-[#141414] uppercase tracking-wider font-semibold">
                      <th className="p-3">Taille France</th>
                      <th className="p-3">Standard</th>
                      <th className="p-3">Tour de Poitrine</th>
                      <th className="p-3">Tour de Taille</th>
                      <th className="p-3">Tour de Bassin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E4DC] tabular-nums">
                    <tr><td className="p-3 font-semibold">34</td><td className="p-3">XS</td><td className="p-3">80-84 cm</td><td className="p-3">60-64 cm</td><td className="p-3">86-90 cm</td></tr>
                    <tr><td className="p-3 font-semibold">36</td><td className="p-3">S</td><td className="p-3">84-88 cm</td><td className="p-3">64-68 cm</td><td className="p-3">90-94 cm</td></tr>
                    <tr><td className="p-3 font-semibold">38</td><td className="p-3">M</td><td className="p-3">88-92 cm</td><td className="p-3">68-72 cm</td><td className="p-3">94-98 cm</td></tr>
                    <tr><td className="p-3 font-semibold">40</td><td className="p-3">L</td><td className="p-3">92-96 cm</td><td className="p-3">72-76 cm</td><td className="p-3">98-102 cm</td></tr>
                    <tr><td className="p-3 font-semibold">42</td><td className="p-3">XL</td><td className="p-3">96-100 cm</td><td className="p-3">76-80 cm</td><td className="p-3">102-106 cm</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CONTACT */}
          {type === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 border border-[#E8E4DC]">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#141414] uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Boutique & Salon Privé</span>
                  </div>
                  <p>12 Rue de la Paix, 75001 Paris</p>
                  <p className="text-[#7A746B]">Du Lundi au Samedi de 10h à 19h30</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#141414] uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Conciergerie Client</span>
                  </div>
                  <p>Téléphone : +33 (0)1 42 68 00 00</p>
                  <p className="text-[#7A746B]">Email : contact@atelier-paris.com</p>
                </div>
              </div>

              {contactSent ? (
                <div className="p-6 bg-[#1C2B1E] text-[#78D383] text-center space-y-2">
                  <CheckCircle className="w-8 h-8 mx-auto" />
                  <p className="text-sm font-semibold">Message transmis avec succès.</p>
                  <p className="text-xs text-[#A8E2B0]">Un conseiller de notre Maison vous répondra sous 24 heures ouvrées.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#141414] mb-1">Votre Nom *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs focus:outline-hidden focus:border-[#141414]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#141414] mb-1">Votre Email *</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs focus:outline-hidden focus:border-[#141414]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#141414] mb-1">Objet *</label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs focus:outline-hidden focus:border-[#141414]"
                    >
                      <option value="Conseil personnalisé">Conseil de style & Tailles</option>
                      <option value="Suivi de commande">Suivi de commande WooCommerce</option>
                      <option value="Prise de rendez-vous">Rendez-vous au salon privé Paris</option>
                      <option value="Autre demande">Autre demande</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#141414] mb-1">Votre Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Comment pouvons-nous vous assister ?"
                      className="w-full bg-white border border-[#DDD7CC] p-3 text-xs focus:outline-hidden focus:border-[#141414]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#141414] text-[#FAF8F5] py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Envoyer à la conciergerie
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
