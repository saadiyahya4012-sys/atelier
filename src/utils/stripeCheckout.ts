/**
 * ATELIER — Client du paiement Stripe Checkout
 * ---------------------------------------------------------------
 * Point d'entrée unique pour la création d'une session Stripe Checkout.
 *
 * Le serveur (`/api/stripe/create-checkout-session`) valide le panier et les
 * prix, crée la session Stripe et renvoie son URL de redirection. Ce module
 * se contente de normaliser les erreurs afin que l'interface affiche un
 * message exploitable au lieu de rester silencieuse (ou d'afficher une page
 * HTML 404 renvoyée par le CDN).
 */

export interface StripeCheckoutItem {
  product_id: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface StripeCheckoutCustomer {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address_1?: string;
  city?: string;
  postcode?: string;
  country?: string;
}

export interface StripeCheckoutPayload {
  items: StripeCheckoutItem[];
  billing?: StripeCheckoutCustomer;
  shipping?: StripeCheckoutCustomer;
  shipping_method?: string;
  notes?: string;
}

export interface StripeCheckoutResult {
  success: boolean;
  url: string;
  sessionId?: string;
  orderId?: number;
  orderNumber?: string;
  simulated?: boolean;
  message?: string;
}

const CHECKOUT_ENDPOINT = '/api/stripe/create-checkout-session';

/**
 * Crée une session Stripe Checkout côté serveur et retourne l'URL de
 * redirection. Lève une Error avec un message lisible en cas d'échec.
 */
export async function createCheckoutSession(payload: StripeCheckoutPayload): Promise<StripeCheckoutResult> {
  let response: Response;

  try {
    response = await fetch(CHECKOUT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (networkError: any) {
    throw new Error(
      'Impossible de contacter le service de paiement Stripe. Vérifiez votre connexion internet puis réessayez.'
    );
  }

  // Le backend peut répondre avec du JSON, mais une API absente renvoie
  // souvent une page HTML (404 du CDN) : on parse donc en texto puis en JSON.
  const rawBody = await response.text();
  let data: any = null;
  try {
    data = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        "Service de paiement introuvable (404 sur /api/stripe/create-checkout-session). L'API backend n'est pas déployée sur Vercel."
      );
    }
    throw new Error(
      (data && data.error) ||
      `Le service de paiement a renvoyé une erreur ${response.status}. Réessayez dans quelques instants.`
    );
  }

  if (!data || !data.url) {
    throw new Error(
      "Le service de paiement n'a pas renvoyé de lien de redirection Stripe. Réessayez dans quelques instants."
    );
  }

  return data as StripeCheckoutResult;
}
