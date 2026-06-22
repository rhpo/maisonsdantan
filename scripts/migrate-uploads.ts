/**
 * Uploads shooting images from server/products/ to Supabase Storage.
 * Shootings in DB have image = 'src:{old_pid}/{old_mid}/{old_sid}' placeholders
 * written by migrate-db.ts. This script resolves each to the local file:
 *   server/products/{old_pid}/shootings/{old_mid}/{old_sid}.jpg
 * then uploads to the 'media' bucket and patches the DB row.
 * Finally, each model gets its thumbnail set to its first uploaded shooting.
 *
 * Usage:
 *   pnpm migrate:db   (first — stores placeholders)
 *   pnpm migrate:uploads
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
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
const SERVER_ROOT = path.resolve(__dirname, '../../../server');

function resolveLocalPath(placeholder: string): string | null {
  // placeholder format: 'src:{old_pid}/{old_mid}/{old_sid}'
  if (!placeholder.startsWith('src:')) return null;
  const parts = placeholder.slice(4).split('/');
  if (parts.length !== 3) return null;
  const [pid, mid, sid] = parts;
  return path.join(SERVER_ROOT, 'products', pid, 'shootings', mid, sid + '.jpg');
}

async function processAndUpload(localPath: string, storagePath: string): Promise<boolean> {
  try {
    const buffer = fs.readFileSync(localPath);
    const processed = await sharp(buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const { error } = await db.storage.from(BUCKET).upload(storagePath, processed, {
      contentType: 'image/webp',
      upsert: true
    });

    if (error) {
      console.error(`  ✗ ${storagePath}: ${error.message}`);
      return false;
    }
    return true;
  } catch (e: unknown) {
    console.error(`  ✗ ${localPath}: ${e instanceof Error ? e.message : e}`);
    return false;
  }
}

async function uploadShootings() {
  const { data: shootings, error } = await db
    .from('shootings')
    .select('id, image, model_id');

  if (error || !shootings) throw new Error('Cannot fetch shootings: ' + error?.message);

  const { data: models } = await db.from('models').select('id, product_id');
  const modelProductMap = new Map(
    (models ?? []).map((m: { id: number; product_id: number }) => [m.id, m.product_id])
  );

  const pending = (shootings as { id: string; image: string; model_id: number }[]).filter(
    s => s.image.startsWith('src:')
  );

  console.log(`→ Uploading ${pending.length} shooting images (${shootings.length - pending.length} already done)...`);

  let ok = 0, fail = 0, missing = 0;
  const CONCURRENCY = 3;

  for (let i = 0; i < pending.length; i += CONCURRENCY) {
    const batch = pending.slice(i, i + CONCURRENCY);

    await Promise.allSettled(
      batch.map(async shooting => {
        const localPath = resolveLocalPath(shooting.image);
        if (!localPath || !fs.existsSync(localPath)) {
          missing++;
          return;
        }

        const productId = modelProductMap.get(shooting.model_id);
        const storagePath = `products/${productId}/shootings/${shooting.id}.webp`;
        const uploaded = await processAndUpload(localPath, storagePath);

        if (uploaded) {
          await db.from('shootings').update({ image: storagePath }).eq('id', shooting.id);
          ok++;
        } else {
          fail++;
        }
      })
    );

    process.stdout.write(`  ${ok} ok  ${fail} fail  ${missing} missing  (${i + batch.length}/${pending.length})\r`);
  }

  console.log(`  ✓ ${ok} uploaded  ${fail} failed  ${missing} missing                           `);
  return ok;
}

async function patchModelThumbnails() {
  console.log('\n→ Setting model thumbnails from first shooting...');

  const { data: models } = await db.from('models').select('id, product_id, image');
  if (!models) return;

  const needsPatch = (models as { id: number; image: string }[]).filter(
    m => !m.image || !m.image.startsWith('products/')
  );

  let updated = 0;
  const CONCURRENCY = 20;

  for (let i = 0; i < needsPatch.length; i += CONCURRENCY) {
    const batch = needsPatch.slice(i, i + CONCURRENCY);
    await Promise.allSettled(
      batch.map(async model => {
        const { data: first } = await db
          .from('shootings')
          .select('image')
          .eq('model_id', model.id)
          .like('image', 'products/%')
          .limit(1)
          .maybeSingle();

        if (first?.image) {
          await db.from('models').update({ image: first.image }).eq('id', model.id);
          updated++;
        }
      })
    );
  }

  console.log(`  ✓ ${updated}/${needsPatch.length} model thumbnails set`);
}

async function main() {
  console.log('🚀 Starting upload migration...\n');
  console.log(`Products dir: ${path.join(SERVER_ROOT, 'products')}`);
  console.log(`Bucket: ${SUPABASE_URL} → ${BUCKET}\n`);

  const uploaded = await uploadShootings();
  if (uploaded > 0) {
    await patchModelThumbnails();
  } else {
    console.log('\n→ No new uploads — checking model thumbnails anyway...');
    await patchModelThumbnails();
  }

  console.log('\n✅ Done.');
}

main().catch(e => {
  console.error('\nFatal:', e);
  process.exit(1);
});
