-- =========================================================================
-- DATABASE SCHEMA — KEJAGAN MART (SUPABASE POSTGRESQL 16+)
-- Marketplace Khusus Se-Desa Kejagan dengan Verifikasi KYC & Cloudflare R2
-- =========================================================================

-- 1. ENUM TYPES
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin', 'superadmin');
CREATE TYPE kyc_status AS ENUM ('draft', 'pending', 'verified', 'rejected');
CREATE TYPE order_status AS ENUM ('pending_confirmation', 'confirmed', 'packing', 'out_for_delivery', 'ready_for_pickup', 'completed', 'cancelled');
CREATE TYPE delivery_method AS ENUM ('delivery_to_home', 'pickup_at_store');
CREATE TYPE payment_method AS ENUM ('cod_cash', 'qris_store');

-- 2. VILLAGE CONFIGURATION (Dikelola Superadmin / Kepala Desa)
CREATE TABLE IF NOT EXISTS village_config (
    id SERIAL PRIMARY KEY,
    village_name VARCHAR(100) NOT NULL DEFAULT 'Desa Kejagan',
    district_name VARCHAR(100) NOT NULL DEFAULT 'Trowulan',
    regency_name VARCHAR(100) NOT NULL DEFAULT 'Mojokerto',
    province_name VARCHAR(100) NOT NULL DEFAULT 'Jawa Timur',
    admin_contact_wa VARCHAR(20) NOT NULL DEFAULT '6281234567890',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inisialisasi data desa pertama kali
INSERT INTO village_config (village_name, district_name, regency_name, province_name, admin_contact_wa)
VALUES ('Desa Kejagan', 'Trowulan', 'Mojokerto', 'Jawa Timur', '6281234567890')
ON CONFLICT DO NOTHING;

-- 3. DUSUNS MASTER TABLE (CRUD Dinamis Superadmin)
CREATE TABLE IF NOT EXISTS dusuns (
    id SERIAL PRIMARY KEY,
    village_id INT REFERENCES village_config(id) ON DELETE CASCADE,
    dusun_name VARCHAR(100) NOT NULL UNIQUE,
    rt_list VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed dusun awal
INSERT INTO dusuns (dusun_name, rt_list)
VALUES 
    ('Dusun Krajan', 'RT 01 s/d RT 04'),
    ('Dusun Kulon', 'RT 05 s/d RT 08')
ON CONFLICT (dusun_name) DO NOTHING;

-- 4. PROFILES TABLE (Warga & Admin)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE, -- Khusus login Admin/Superadmin (Username + Password)
    nik VARCHAR(16) UNIQUE, -- Wajib untuk Pembeli & Penjual
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE, -- Login Pembeli & Penjual via No WA + Password
    dusun_id INT REFERENCES dusuns(id) ON DELETE SET NULL,
    dusun_name VARCHAR(50),
    rt VARCHAR(5),
    rw VARCHAR(5),
    address_detail TEXT,
    role user_role DEFAULT 'buyer' NOT NULL,
    kyc_status kyc_status DEFAULT 'draft' NOT NULL,
    ktp_image_url TEXT, -- Private bucket Supabase (AES-256)
    house_image_url TEXT, -- Private bucket Supabase (AES-256)
    selfie_blink_image_url TEXT, -- Private bucket Supabase (AES-256)
    kyc_rejection_reason TEXT,
    verified_by UUID REFERENCES profiles(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SHOPS TABLE (Toko Warga)
CREATE TABLE IF NOT EXISTS shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    shop_name VARCHAR(100) NOT NULL,
    shop_slug VARCHAR(120) UNIQUE NOT NULL,
    shop_photo_url TEXT, -- Cloudflare R2 CDN URL
    description TEXT,
    whatsapp_number VARCHAR(20) NOT NULL,
    qris_image_url TEXT, -- Cloudflare R2 CDN URL
    dusun_id INT REFERENCES dusuns(id) ON DELETE SET NULL,
    dusun_name VARCHAR(50),
    rt VARCHAR(5) NOT NULL,
    rw VARCHAR(5) NOT NULL,
    default_delivery_fee DECIMAL(10, 2) DEFAULT 3000.00 CHECK (default_delivery_fee >= 0),
    free_delivery_same_dusun BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRODUCT CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(60) UNIQUE NOT NULL,
    icon_name VARCHAR(50) DEFAULT 'package'
);

INSERT INTO categories (name, slug, icon_name)
VALUES 
    ('Sembako', 'sembako', 'wheat'),
    ('Makanan & Jajan', 'makanan', 'utensils'),
    ('Hasil Tani & Kebun', 'tani', 'sprout'),
    ('Jasa & Kerajinan', 'jasa', 'hammer')
ON CONFLICT (slug) DO NOTHING;

-- 7. PRODUCTS TABLE (Shopee Style Grid)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
    stock INT DEFAULT 1 CHECK (stock >= 0),
    rating_avg DECIMAL(3, 2) DEFAULT 5.00,
    total_sold INT DEFAULT 0,
    images TEXT[] DEFAULT '{}', -- Cloudflare R2 CDN URLs (WebP)
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDERS TABLE (Post-Order Seller Delivery Fee)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code VARCHAR(30) UNIQUE NOT NULL,
    buyer_id UUID NOT NULL REFERENCES profiles(id),
    shop_id UUID NOT NULL REFERENCES shops(id),
    total_amount DECIMAL(12, 2) NOT NULL, -- Total tagihan (Subtotal + Ongkir Toko)
    delivery_fee DECIMAL(12, 2) DEFAULT 0.00, -- Ongkir per transaksi toko diinput pasca-order
    delivery_method delivery_method NOT NULL,
    payment_method payment_method NOT NULL,
    status order_status DEFAULT 'pending_confirmation' NOT NULL,
    notes TEXT,
    wa_message_sent BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    product_title VARCHAR(150) NOT NULL,
    price_at_purchase DECIMAL(12, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(12, 2) NOT NULL
);

-- 10. OTP VERIFICATIONS TABLE (WA Langsung HP Admin Tanpa Gateway)
CREATE TABLE IF NOT EXISTS otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id),
    action VARCHAR(50) NOT NULL,
    entity_name VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON products(shop_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_shop ON orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone_number);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE village_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE dusuns ENABLE ROW LEVEL SECURITY;

-- Public can read village config & dusuns
CREATE POLICY "Public can view village config" ON village_config FOR SELECT USING (true);
CREATE POLICY "Public can view dusuns" ON dusuns FOR SELECT USING (true);

-- Public can read active shops & products
CREATE POLICY "Public can view active shops" ON shops FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_available = true);

-- Profiles access: User can read/edit own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Orders: Buyer can view own orders, Shop owner can view orders for their shop
CREATE POLICY "Buyers can view own orders" ON orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Sellers can view shop orders" ON orders FOR SELECT USING (
    EXISTS (SELECT 1 FROM shops WHERE shops.id = orders.shop_id AND shops.owner_id = auth.uid())
);
