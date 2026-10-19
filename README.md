<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/33615eeb-b5c2-46ab-b6fa-f8bad1e8f584

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Architecture

| Composant | Emplacement | Rôle |
| --- | --- | --- |
| Front-end (React + Vite) | `src/` | Boutique, panier, checkout, dashboard admin |
| API Express | `server.ts` | Toutes les routes `/api/...` (catalogue, commandes, Stripe, admin) |
| Function Vercel | `api/index.ts` | Expose l'application Express `server.ts` en Serverless Function |
| Routage Vercel | `vercel.json` | `/api/*` → Function, autres routes → `index.html` (SPA) |

- **En local** : `npm run dev` démarre `server.ts` (Express + Vite en middleware) sur `http://localhost:3000`.
- **Sur Vercel** : le front est buildé par Vite (`dist/`, servi par le CDN) et l'API est
  invoquée en Serverless Function. `server.ts` est alors importé (et non exécuté) :
  aucun `app.listen()` n'est appelé.

## Déploiement Vercel

1. **Framework Preset** : `Vite` — **Build Command** : `npm run build` — **Output Directory** : `dist`
   (Root Directory : racine du dépôt).
2. **Variables d'environnement** (Project Settings → Environment Variables, Production + Preview) :
   `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `APP_URL`, et si besoin
   `STRIPE_WEBHOOK_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`,
   `WC_URL`, `WC_CONSUMER_KEY`, `WC_CONSUMER_SECRET`.
   ⚠️ La clé secrète Stripe vit uniquement côté serveur : elle n'est jamais renvoyée au
   navigateur (`/api/stripe/config` ne renvoie que la clé publiable).
3. **Webhook Stripe** (optionnel) : `https://atelier-sigma-pink.vercel.app/api/stripe/webhook`.
4. Vérifier l'API : `GET https://atelier-sigma-pink.vercel.app/api/health` doit répondre
   `{"status":"ok", ...}`.

