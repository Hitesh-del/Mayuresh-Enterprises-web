
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subcategories table
CREATE TABLE subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2) NOT NULL,
  discount_percent INTEGER DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_best_seller BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Banners table
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  badge TEXT,
  image TEXT NOT NULL,
  cta_text TEXT,
  cta_link TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  is_read BOOLEAN DEFAULT false,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID,
  status TEXT DEFAULT 'pending',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_charge NUMERIC(10,2) DEFAULT 0,
  grand_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image TEXT,
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID,
  user_name TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupons table
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT DEFAULT 'percentage',
  discount_value NUMERIC(10,2) NOT NULL,
  min_order_value NUMERIC(10,2) DEFAULT 0,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  expiry_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users profile extension (app_metadata for role)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create helper function to check admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Categories policies
CREATE POLICY "Categories select all" ON categories FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Categories admin all" ON categories FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Subcategories policies
CREATE POLICY "Subcategories select all" ON subcategories FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Subcategories admin all" ON subcategories FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Products policies
CREATE POLICY "Products select all" ON products FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Products admin all" ON products FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Banners policies
CREATE POLICY "Banners select active" ON banners FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Banners admin all" ON banners FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Notifications policies
CREATE POLICY "Notifications select own" ON notifications FOR SELECT TO authenticated USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Notifications admin all" ON notifications FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Orders policies
CREATE POLICY "Orders select own" ON orders FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Orders insert own" ON orders FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Orders admin all" ON orders FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Order items policies
CREATE POLICY "Order items select own" ON order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Order items insert own" ON order_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Order items admin all" ON order_items FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Reviews policies
CREATE POLICY "Reviews select all" ON reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Reviews insert auth" ON reviews FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Reviews admin all" ON reviews FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Coupons policies
CREATE POLICY "Coupons select all" ON coupons FOR SELECT TO anon, authenticated USING (is_active = true AND (expiry_date IS NULL OR expiry_date > NOW()));
CREATE POLICY "Coupons admin all" ON coupons FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- User profiles policies
CREATE POLICY "Profiles select own" ON user_profiles FOR SELECT TO authenticated USING (id = auth.uid() OR is_admin());
CREATE POLICY "Profiles insert own" ON user_profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Profiles update own" ON user_profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR is_admin()) WITH CHECK (id = auth.uid() OR is_admin());
