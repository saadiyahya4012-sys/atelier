import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Sparkles, Send, Loader2, Building, Mail, Phone, User } from 'lucide-react';

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoRequestModal: React.FC<DemoRequestModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    preferred_date: '',
    demo_type: 'Présentation Privée de la Collection',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.email) {
      setErrorMessage('Veuillez renseigner votre prénom, nom et adresse email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/demo-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la transmission de votre demande.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      company: '',
      preferred_date: '',
      demo_type: 'Présentation Privée de la Collection',
      message: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#FAF8F5] border border-[#E8E4DC] shadow-2xl my-auto overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E8E4DC] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#141414]" />
            <span className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-[#141414]">
              Demander une Démonstration
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#7A746B] hover:text-[#141414] transition-colors cursor-pointer"
            aria-label="Fermer la fenêtre"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          /* Confirmation State */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-[#2A5C34]/10 text-[#2A5C34] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-normal text-[#141414]">
                Demande transmise avec succès
              </h3>
              <p className="text-xs uppercase tracking-widest text-[#7A746B]">
                Conciergerie Privée ATELIER
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#59554E] leading-relaxed max-w-md mx-auto">
              Merci, <strong>{formData.first_name} {formData.last_name}</strong>. Notre équipe a bien pris en compte votre souhait pour : <em>« {formData.demo_type} »</em>. Un conseiller dédié prendra contact avec vous à l'adresse <strong>{formData.email}</strong> dans les 24 heures pour convenir des modalités.
            </p>

            <div className="pt-2">
              <button
                onClick={handleReset}
                className="bg-[#141414] text-[#FAF8F5] px-8 py-3 text-xs uppercase font-semibold tracking-widest hover:bg-[#2A2A2A] transition-colors cursor-pointer"
              >
                Fermer et Poursuivre la Navigation
              </button>
            </div>
          </div>
        ) : (
          /* Demo Request Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[80vh] overflow-y-auto">
            
            <p className="text-xs text-[#6A665E] leading-relaxed">
              Bénéficiez d'une présentation privée de notre univers couture, de nos matières d'exception ou d'une visite guidée de nos solutions sur-mesure.
            </p>

            {errorMessage && (
              <div className="p-3 bg-[#FBF0F0] border border-[#E8C2C2] text-xs text-[#963E3E] font-medium">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#59554E] mb-1">
                  Prénom *
                </label>
                <div className="relative">
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
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#59554E] mb-1">
                  Nom *
                </label>
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
                <label className="block text-[11px] uppercase tracking-wider text-[#59554E] mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="camille@example.com"
                  className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs text-[#141414] focus:outline-hidden focus:border-[#141414]"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#59554E] mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs text-[#141414] focus:outline-hidden focus:border-[#141414]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#59554E] mb-1">
                  Entreprise / Maison (Optionnel)
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Maison de Mode, Cabinet, etc."
                  className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs text-[#141414] focus:outline-hidden focus:border-[#141414]"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#59554E] mb-1">
                  Créneau Souhaité
                </label>
                <input
                  type="text"
                  name="preferred_date"
                  value={formData.preferred_date}
                  onChange={handleChange}
                  placeholder="Ex: Semaine prochaine après 15h"
                  className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs text-[#141414] focus:outline-hidden focus:border-[#141414]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#59554E] mb-1">
                Type de Démonstration Souhaitée
              </label>
              <select
                name="demo_type"
                value={formData.demo_type}
                onChange={handleChange}
                className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs text-[#141414] focus:outline-hidden focus:border-[#141414]"
              >
                <option value="Présentation Privée de la Collection">Présentation Privée de la Collection (Prêt-à-Porter & Accessoires)</option>
                <option value="Démonstration E-Commerce & Paiement Stripe">Démonstration E-Commerce & Passerelle Stripe Test</option>
                <option value="Rendez-vous VIP Sur-Mesure">Rendez-vous VIP Styliste & Sur-Mesure</option>
                <option value="Partenariat B2B & Distribution">Partenariat B2B & Distribution</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#59554E] mb-1">
                Message ou Besoins Particuliers
              </label>
              <textarea
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                placeholder="Précisez votre demande, vos pièces d'intérêt ou le format de démonstration souhaité..."
                className="w-full bg-white border border-[#DDD7CC] p-3 text-xs text-[#141414] focus:outline-hidden focus:border-[#141414]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#141414] text-[#FAF8F5] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#2A2A2A] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmission en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer ma Demande de Démo</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-center text-[#8A847A]">
              Vos données personnelles sont traitées dans le strict respect de la confidentialité par la Maison ATELIER.
            </p>

          </form>
        )}

      </div>
    </div>
  );
};
