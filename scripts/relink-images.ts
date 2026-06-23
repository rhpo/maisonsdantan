/**
 * RECOVERY: re-point DB image columns at files already in Supabase Storage.
 *
 * `migrate:db` wipes/regenerates product & shooting ids but does NOT touch
 * Storage. So the webp files uploaded by a previous `migrate:uploads` are still
 * in the `media` bucket under  products/{oldProductId}/shootings/{oldId}.webp ,
 * while the fresh DB rows point at `src:` placeholders.
 *
 * Both the Storage product folders and the current DB products follow the same
 * database.json order, so sorting each ascending lines them up 1:1. For each
 * product we hand its folder's webp files to that product's shooting rows, then
 * set every model's thumbnail to its first shooting image.
 *
 * Safe: only UPDATES image columns, deletes nothing, and can be re-run.
 *
 * Usage:  pnpm migrate:relink
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf-8');
  for (const line of env.split('\n')) {
    const [k, ...v] = line.split('=');
    if (k && !k.startsWith('#')) process.env[k.trim()] = v.join('=').trim();
  }
}

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = 'media';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

type Entry = { name: string };

async function listAll(prefix: string): Promise<string[]> {
  const out: string[] = [];
  const PAGE = 1000;
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await db.storage
      .from(BUCKET)
      .list(prefix, { limit: PAGE, offset });
    if (error) throw new Error(`list ${prefix}: ${error.message}`);
    const entries = (data ?? []) as Entry[];
    out.push(...entries.map((e) => e.name));
    if (entries.length < PAGE) break;
  }
  return out;
}

async function main() {
  console.log('🔗 Relinking DB image columns to existing Storage files...\n');

  // 1. Storage product folders (named by old product id), sorted numerically.
  const folderNames = (await listAll('products')).filter((n) => /^\d+$/.test(n));
  const storageFolders = folderNames
    .map(Number)
    .sort((a, b) => a - b)
    .map(String);
  console.log(`→ Storage product folders found: ${storageFolders.length}`);

  // 2. Current DB products in id order, with their models & shootings.
  const { data: products, error } = await db
    .from('products')
    .select('id, models(id, shootings(id))')
    .order('id', { ascending: true });
  if (error) throw error;
  const dbProducts = (products ?? []) as {
    id: number;
    models: { id: number; shootings: { id: string }[] }[];
  }[];
  console.log(`→ DB products: ${dbProducts.length}`);

  if (storageFolders.length !== dbProducts.length) {
    console.warn(
      `⚠ Count mismatch (storage ${storageFolders.length} vs db ${dbProducts.length}).` +
        ` Pairing the first ${Math.min(storageFolders.length, dbProducts.length)} by order.`
    );
  }

  const pairs = Math.min(storageFolders.length, dbProducts.length);
  let shootingUpdates = 0;
  let modelUpdates = 0;
  let emptyFolders = 0;

  for (let i = 0; i < pairs; i++) {
    const folder = storageFolders[i];
    const product = dbProducts[i];

    // webp files in this product's folder
    const files = (await listAll(`products/${folder}/shootings`))
      .filter((n) => n.endsWith('.webp'))
      .sort()
      .map((n) => `products/${folder}/shootings/${n}`);

    if (files.length === 0) {
      emptyFolders++;
      continue;
    }

    // flatten this product's shooting rows (stable: by model order)
    const shootings = product.models.flatMap((m) =>
      m.shootings.map((s) => ({ shootingId: s.id, modelId: m.id }))
    );

    // assign files to shooting rows (cycle if fewer files than rows)
    for (let j = 0; j < shootings.length; j++) {
      const image = files[j] ?? files[j % files.length];
      const { error: e } = await db
        .from('shootings')
        .update({ image })
        .eq('id', shootings[j].shootingId);
      if (!e) shootingUpdates++;
    }

    // model thumbnail = first file of that model's first shooting
    for (const m of product.models) {
      const first = m.shootings[0];
      if (!first) continue;
      const idx = shootings.findIndex((s) => s.shootingId === first.shootingId);
      const image = files[idx] ?? files[idx % files.length] ?? files[0];
      const { error: e } = await db.from('models').update({ image }).eq('id', m.id);
      if (!e) modelUpdates++;
    }

    process.stdout.write(`  paired ${i + 1}/${pairs}\r`);
  }

  console.log(
    `\n  ✓ ${shootingUpdates} shootings relinked, ${modelUpdates} model thumbnails set` +
      (emptyFolders ? `, ${emptyFolders} empty folders skipped` : '')
  );
  console.log('\n✅ Done. Reload the site — product images should be back.');
}

main().catch((e) => {
  console.error('\nFatal:', e);
  process.exit(1);
});
