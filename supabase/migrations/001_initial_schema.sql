-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE products (
  id         BIGSERIAL    PRIMARY KEY,
  name       TEXT         NOT NULL,
  description TEXT        NOT NULL DEFAULT '',
  category   TEXT         NOT NULL CHECK (category IN ('living', 'child', 'kitchen', 'room')),
  shape      TEXT         NOT NULL CHECK (shape IN ('pattern', 'pano')),
  orders_count INTEGER    NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MODELS (color/pattern variants of a product)
-- ============================================================
CREATE TABLE models (
  id         BIGSERIAL   PRIMARY KEY,
  product_id BIGINT      NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  image      TEXT        NOT NULL DEFAULT ''
);

-- ============================================================
-- SHOOTINGS (staged room photos of a model)
-- ============================================================
CREATE TABLE shootings (
  id         TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  model_id   BIGINT      NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  image      TEXT        NOT NULL DEFAULT ''
);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE orders (
  id         BIGSERIAL   PRIMARY KEY,
  cart       JSONB       NOT NULL DEFAULT '[]',
  info       JSONB       NOT NULL DEFAULT '{}',
  read       BOOLEAN     NOT NULL DEFAULT FALSE,
  pending    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MESSAGES (contact form)
-- ============================================================
CREATE TABLE messages (
  id         BIGSERIAL   PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  phone      TEXT        NOT NULL DEFAULT '',
  message    TEXT        NOT NULL,
  read       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ADMIN USERS
-- ============================================================
CREATE TABLE admin_users (
  id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT        NOT NULL UNIQUE,
  display_name TEXT        NOT NULL DEFAULT '',
  photo_url    TEXT,
  status       TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('authorized', 'pending')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ACTIVITY LOGS
-- ============================================================
CREATE TABLE logs (
  id         BIGSERIAL   PRIMARY KEY,
  user_id    UUID        REFERENCES admin_users(id) ON DELETE SET NULL,
  user_name  TEXT        NOT NULL DEFAULT '',
  action     TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- HELPER FUNCTION: increment orders_count
-- ============================================================
CREATE OR REPLACE FUNCTION increment_orders_count(product_id BIGINT)
RETURNS void AS $$
  UPDATE products SET orders_count = orders_count + 1 WHERE id = product_id;
$$ LANGUAGE sql;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE models      ENABLE ROW LEVEL SECURITY;
ALTER TABLE shootings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs        ENABLE ROW LEVEL SECURITY;

-- Public catalog: read-only
CREATE POLICY "products_public_read"  ON products  FOR SELECT USING (true);
CREATE POLICY "models_public_read"    ON models    FOR SELECT USING (true);
CREATE POLICY "shootings_public_read" ON shootings FOR SELECT USING (true);

-- Orders: anyone can place an order
CREATE POLICY "orders_public_insert" ON orders FOR INSERT WITH CHECK (true);

-- Messages: anyone can send a message
CREATE POLICY "messages_public_insert" ON messages FOR INSERT WITH CHECK (true);

-- All other mutations go through the service-role client (bypasses RLS).
-- Admin users table: admins can read their own record
CREATE POLICY "admin_users_self_read" ON admin_users FOR SELECT USING (auth.uid() = id);

-- ============================================================
-- STORAGE BUCKET (run in Supabase dashboard or CLI)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
-- CREATE POLICY "media_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'media');
-- CREATE POLICY "media_service_write" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
