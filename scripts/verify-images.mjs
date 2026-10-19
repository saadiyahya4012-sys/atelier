/**
 * ATELIER - Vérification des images avant build
 * ---------------------------------------------------------------
 * Les images de la boutique sont stockées dans `public/images/` (dossier
 * `publicDir` de Vite). Vite copie ce dossier tel quel dans `dist/` lors du
 * build, ce qui garantit que les visuels sont bien présents sur Vercel.
 *
 * Ce script contrôle, avant chaque build :
 *   1. que chaque chemin `/images/xxx` référencé dans le code pointe vers un
 *      fichier réellement présent dans `public/images/` ;
 *   2. que le nom du fichier correspond exactement (casse comprise) ;
 *   3. que l'extension est bien une extension d'image connue ;
 *   4. qu'aucune référence ne pointe plus vers l'arborescence source
 *      (`/src/assets/...`), qui n'est jamais copiée dans `dist/`.
 *
 * Sortie : code 0 si tout est correct, code 1 sinon (build interrompu).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const PUBLIC_PREFIX = '/images/';

const SCAN_DIRS = ['src'];
const SCAN_FILES = ['server.ts', 'index.html'];
const VALID_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);

/** Collecte les fichiers texte à analyser. */
function collectFiles() {
  const files = [];

  for (const file of SCAN_FILES) {
    const full = path.join(ROOT, file);
    if (fs.existsSync(full)) files.push(full);
  }

  for (const dir of SCAN_DIRS) {
    const walk = (current) => {
      if (!fs.existsSync(current)) return;
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const full = path.join(current, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(ts|tsx|js|jsx|css|html)$/.test(entry.name)) files.push(full);
      }
    };
    walk(path.join(ROOT, dir));
  }

  return files;
}

const errors = [];
const referenced = new Set();

if (!fs.existsSync(IMAGES_DIR)) {
  console.error(`\n[images] Dossier introuvable : ${IMAGES_DIR}`);
  console.error('[images] Créez public/images/ et placez-y les visuels de la boutique.\n');
  process.exit(1);
}

const available = new Map();
for (const name of fs.readdirSync(IMAGES_DIR)) {
  if (!fs.statSync(path.join(IMAGES_DIR, name)).isFile()) continue;
  available.set(name, name.toLowerCase());
}

for (const file of collectFiles()) {
  const content = fs.readFileSync(file, 'utf-8');
  const relative = path.relative(ROOT, file).replace(/\\/g, '/');

  // 1. Référence obsolète vers l'arborescence source (jamais copiée dans dist/)
  if (/\/src\/assets\//.test(content)) {
    errors.push(`${relative} : référence "/src/assets/..." obsolète (non incluse dans le build).`);
  }

  // 2. Toutes les références /images/...
  const matches = content.matchAll(new RegExp(`${PUBLIC_PREFIX}[A-Za-z0-9._-]+`, 'g'));
  for (const match of matches) {
    const raw = match[0];
    const name = raw.slice(PUBLIC_PREFIX.length);

    // Exemple de saisie dans un formulaire : "/images/..." (placeholder)
    if (name.includes('...')) continue;

    referenced.add(name);

    if (!VALID_EXTENSIONS.has(path.extname(name).toLowerCase())) {
      errors.push(`${relative} : extension d'image invalide pour "${raw}".`);
      continue;
    }

    if (available.has(name)) continue; // correspondance exacte (casse comprise)

    const lower = name.toLowerCase();
    const actual = available.get(lower);
    if (actual) {
      errors.push(`${relative} : casse incorrecte — "${name}" n'existe pas, le fichier est "${actual}".`);
    } else {
      errors.push(`${relative} : image introuvable dans public/images/ — "${raw}".`);
    }
  }
}

const orphans = [...available.keys()].filter((name) => !referenced.has(name));

console.log(`[images] ${available.size} image(s) dans public/images/`);
console.log(`[images] ${referenced.size} image(s) référencée(s) dans le code`);

if (orphans.length > 0) {
  console.log(`[images] ${orphans.length} image(s) de réserve non référencée(s) : ${orphans.join(', ')}`);
}

if (errors.length > 0) {
  console.error('\n[images] ÉCHEC de la vérification des images :');
  for (const error of errors) console.error(`  ✗ ${error}`);
  console.error('');
  process.exit(1);
}

console.log('[images] ✓ Toutes les références d\'images sont valides et livrées par le build.\n');
