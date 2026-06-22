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

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const dbPath = path.resolve(__dirname, '../../..', 'server/database.json');
const source = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

type OldShooting = { id: string | number; image: unknown };
type OldModel = { id: number; name: string; image: unknown; shootings: OldShooting[] };
type OldProduct = {
  id: number;
  name: string;
  description: string;
  category: string;
  shape: string;
  orders: number;
  date: string;
  models: OldModel[];
};

function extractImage(img: unknown): string {
  if (typeof img === 'string') return img;
  if (img && typeof img === 'object') {
    const o = img as Record<string, string>;
    return o.tempFilePath ?? o.path ?? o.url ?? '';
  }
  return '';
}

async function clearTables() {
  console.log('→ Clearing existing data...');
  await db.from('shootings').delete().not('id', 'is', null);
  await db.from('models').delete().gt('id', 0);
  await db.from('products').delete().gt('id', 0);
  await db.from('orders').delete().gt('id', 0);
  await db.from('messages').delete().gt('id', 0);
  await db.from('logs').delete().gt('id', 0);
  console.log('  ✓ Done\n');
}

async function migrateProducts() {
  const products = source.products as OldProduct[];
  console.log(`→ Migrating ${products.length} products, models & shootings (batched)...`);

  // Step 1: batch-insert products (100 at a time), map old id → new id by index
  const productIdMap = new Map<number, number>();
  const PRODUCT_BATCH = 100;

  for (let i = 0; i < products.length; i += PRODUCT_BATCH) {
    const batch = products.slice(i, i + PRODUCT_BATCH);
    const { data, error } = await db
      .from('products')
      .insert(
        batch.map(p => ({
          name: p.name,
          description: p.description ?? '',
          category: p.category === 'bedroom' ? 'room' : p.category,
          shape: p.shape,
          orders_count: p.orders ?? 0,
          created_at: p.date ? new Date(p.date).toISOString() : new Date().toISOString()
        }))
      )
      .select('id');

    if (error) {
      console.error(`  ✗ Products batch ${i}–${i + batch.length}:`, error.message);
      continue;
    }

    for (let j = 0; j < batch.length; j++) {
      productIdMap.set(batch[j].id, (data as { id: number }[])[j].id);
    }
    process.stdout.write(`  ✓ Products ${i + 1}–${i + batch.length}\r`);
  }
  console.log(`  ✓ ${productIdMap.size}/${products.length} products inserted       `);

  // Step 2: collect all model rows (carry old IDs so uploads can find source files)
  type ModelEntry = {
    row: { product_id: number; name: string; image: string };
    oldPid: number;
    oldMid: number;
    shootings: OldShooting[];
  };
  const modelEntries: ModelEntry[] = [];

  for (const p of products) {
    const newProductId = productIdMap.get(p.id);
    if (newProductId === undefined) continue;
    for (const m of p.models ?? []) {
      modelEntries.push({
        row: { product_id: newProductId, name: m.name, image: '' },
        oldPid: p.id,
        oldMid: m.id,
        shootings: m.shootings ?? []
      });
    }
  }

  // Step 3: batch-insert all models, preserve insert order to get IDs back
  const newModelIds: number[] = [];
  const MODEL_BATCH = 500;

  for (let i = 0; i < modelEntries.length; i += MODEL_BATCH) {
    const batch = modelEntries.slice(i, i + MODEL_BATCH);
    const { data, error } = await db
      .from('models')
      .insert(batch.map(e => e.row))
      .select('id');

    if (error) throw new Error(`Models batch failed: ${error.message}`);
    newModelIds.push(...(data as { id: number }[]).map(r => r.id));
  }
  console.log(`  ✓ ${newModelIds.length} models inserted`);

  // Step 4: build shooting rows — fresh UUID per shooting (fixes collision)
  // Store placeholder 'src:{old_pid}/{old_mid}/{old_sid}' so migrate:uploads can find the file
  const shootingRows: Array<{ id: string; model_id: number; image: string }> = [];

  for (let i = 0; i < modelEntries.length; i++) {
    const modelId = newModelIds[i];
    const { oldPid, oldMid, shootings } = modelEntries[i];
    for (const s of shootings) {
      shootingRows.push({
        id: crypto.randomUUID(),
        model_id: modelId,
        image: `src:${oldPid}/${oldMid}/${s.id}`
      });
    }
  }

  // Step 5: batch-insert all shootings
  const SHOOTING_BATCH = 500;
  for (let i = 0; i < shootingRows.length; i += SHOOTING_BATCH) {
    const batch = shootingRows.slice(i, i + SHOOTING_BATCH);
    const { error } = await db.from('shootings').insert(batch);
    if (error) throw new Error(`Shootings batch failed: ${error.message}`);
  }
  console.log(`  ✓ ${shootingRows.length} shootings inserted`);
}

async function migrateOrders() {
  // Handle both flat array and {completed, pending} object
  const allOrders: unknown[] = Array.isArray(source.orders)
    ? source.orders
    : [...(source.orders?.completed ?? []), ...(source.orders?.pending ?? [])];

  if (allOrders.length === 0) {
    console.log('\n→ No orders found');
    return;
  }
  console.log(`\n→ Migrating ${allOrders.length} orders...`);

  const rows = allOrders.map((o: unknown) => {
    const order = o as Record<string, unknown>;
    return {
      cart: order.cart ?? [],
      info: order.info ?? {},
      read: order.read ?? false,
      pending: order.pending ?? true,
      created_at: order.date ? new Date(order.date as string).toISOString() : new Date().toISOString()
    };
  });

  const { error } = await db.from('orders').insert(rows);
  if (error) console.error('  ✗ Orders:', error.message);
  else console.log(`  ✓ ${rows.length} orders inserted`);
}

async function migrateMessages() {
  const messages: unknown[] = Array.isArray(source.messages) ? source.messages : [];
  if (messages.length === 0) {
    console.log('\n→ No messages found');
    return;
  }
  console.log(`\n→ Migrating ${messages.length} messages...`);

  const rows = messages.map((m: unknown) => {
    const msg = m as Record<string, unknown>;
    return {
      name: msg.name,
      email: msg.email,
      phone: msg.phone ?? '',
      message: msg.message,
      read: msg.read ?? false,
      created_at: msg.date ? new Date(msg.date as string).toISOString() : new Date().toISOString()
    };
  });

  const { error } = await db.from('messages').insert(rows);
  if (error) console.error('  ✗ Messages:', error.message);
  else console.log(`  ✓ ${rows.length} messages inserted`);
}

async function migrateLogs() {
  const logs: unknown[] = Array.isArray(source.logs) ? source.logs : [];
  if (logs.length === 0) {
    console.log('\n→ No logs found');
    return;
  }
  console.log(`\n→ Migrating ${logs.length} logs...`);

  const rows = logs.map((l: unknown) => {
    const log = l as Record<string, unknown>;
    const user = log.user as Record<string, string> | undefined;
    return {
      user_id: null,
      user_name: user?.displayName ?? 'Unknown',
      action: log.action,
      created_at: log.date ? new Date(log.date as string).toISOString() : new Date().toISOString()
    };
  });

  const { error } = await db.from('logs').insert(rows);
  if (error) console.error('  ✗ Logs:', error.message);
  else console.log(`  ✓ ${rows.length} logs inserted`);
}

async function main() {
  console.log('🚀 Starting migration (batched)...\n');
  console.log(`Source: ${dbPath}`);
  console.log(`Target: ${SUPABASE_URL}\n`);

  await clearTables();
  await migrateProducts();
  await migrateOrders();
  await migrateMessages();
  await migrateLogs();

  console.log('\n✅ Migration complete.');
}

main().catch(e => {
  console.error('\nFatal:', e);
  process.exit(1);
});
