/**
 * ATELIER — Vercel Serverless Function (entrée de l'API)
 * ---------------------------------------------------------------
 * Toute l'API Express vit dans `server.ts` afin que le développement local
 * (`npm run dev`) et la production (Vercel) exécutent exactement le même code.
 *
 * Ce fichier n'est qu'un adaptateur : Vercel invoque la fonction avec
 * (req, res) — c'est le format natif d'une application Express — et l'API
 * est donc routée par la même pile de middlewares qu'en local.
 *
 * Le routage vers cette fonction est assuré par `vercel.json` :
 *   { "source": "/api/:path*", "destination": "/api", "transforms": [...] }
 * Le transform `request.path` restore le chemin d'origine (`/api/...`) dans
 * l'URL runtime, de sorte qu'Express retrouve les routes déclarées dans
 * `server.ts` (app.post('/api/stripe/create-checkout-session', ...)).
 *
 * La clé secrète Stripe n'est jamais exposée au navigateur : elle est lue
 * côté serveur via `process.env.STRIPE_SECRET_KEY` (variable d'environnement
 * Vercel). Le front ne reçoit que la clé publiable via `/api/stripe/config`.
 */

import { app } from '../server.ts';

/**
 * Normalise le chemin reçu par la fonction pour qu'Express route toujours la
 * requête, y compris si la plateforme livre le chemin de destination
 * (`/api`) au lieu du chemin d'origine.
 */
function normalizeApiPath(req: any): void {
  try {
    const url: string = typeof req?.url === 'string' ? req.url : '/';
    const [pathname, search = ''] = url.split('?');

    if (!pathname.startsWith('/api')) {
      // Préfixe /api absent : on le restaure.
      req.url = `/api${pathname}${search ? `?${search}` : ''}`;
      return;
    }

    if (pathname === '/api' || pathname === '/api/') {
      // Repli : le chemin d'origine a été transmis en query param par le rewrite.
      const params = new URLSearchParams(search);
      const original = params.get('path');
      if (original) {
        params.delete('path');
        const rest = params.toString();
        req.url = `/api/${original.replace(/^\/+/, '')}${rest ? `?${rest}` : ''}`;
      }
    }
  } catch {
    // Une normalisation en échec ne doit jamais empêcher la requête.
  }
}

export default function handler(req: any, res: any) {
  normalizeApiPath(req);
  return app(req, res);
}
