# Entity Relationship Diagram (ERD) — Kejagan Mart
**Proyek**: Kejagan Mart (Marketplace Khusus Se-Desa Kejagan)  
**Database**: Supabase PostgreSQL 16+  
**Tanggal**: 2026-11-24  

---

## 1. Visualisasi Diagram Relasi Entitas (Mermaid ERD)

```mermaid
erDiagram
    VILLAGE_CONFIG ||--o{ DUSUNS : "memiliki daftar (village_id)"
    DUSUNS ||--o{ PROFILES : "domisili warga (dusun_id)"
    DUSUNS ||--o{ SHOPS : "lokasi toko (dusun_id)"

    PROFILES ||--o{ SHOPS : "memiliki (owner_id)"
    PROFILES ||--o{ ORDERS : "membeli (buyer_id)"
    PROFILES ||--o{ AUDIT_LOGS : "melakukan aksi (actor_id)"
    PROFILES ||--o{ PROFILES : "memverifikasi KYC (verified_by)"
    
    SHOPS ||--o{ PRODUCTS : "menjual (shop_id)"
    SHOPS ||--o{ ORDERS : "menerima pesanan (shop_id)"
    
    CATEGORIES ||--o{ PRODUCTS : "mengelompokkan (category_id)"
    
    ORDERS ||--|{ ORDER_ITEMS : "memuat item (order_id)"
    PRODUCTS ||--o{ ORDER_ITEMS : "dipesan dalam (product_id)"

    VILLAGE_CONFIG {
        serial id PK
        varchar village_name "Nama Desa (dikelola Superadmin)"
        varchar district_name "Nama Kecamatan"
        varchar regency_name "Nama Kabupaten"
        varchar province_name "Nama Provinsi"
        varchar admin_contact_wa "Nomor WA resmi desa"
        timestamptz updated_at
    }

    DUSUNS {
        serial id PK
        integer village_id FK "Relasi ke village_config.id"
        varchar dusun_name UK "Nama Dusun (Krajan, Kulon, dll)"
        varchar rt_list "Cakupan RT/RW di dusun"
        boolean is_active "Status aktif dusun"
        timestamptz created_at
    }
    
    PROFILES {
        uuid id PK "auth.users.id"
        varchar username UK "Khusus login admin & superadmin (Username + Password)"
        varchar nik UK "16 digit NIK KTP Warga (Pembeli & Penjual)"
        varchar full_name "Nama lengkap sesuai KTP"
        varchar phone_number UK "No WhatsApp aktif (Login Pembeli & Penjual via No WA + Password)"
        integer dusun_id FK "Relasi ke dusuns.id (Filter Dusun)"
        varchar dusun "Fallback nama dusun"
        varchar rt "Nomor RT"
        varchar rw "Nomor RW"
        text address_detail "Detail patokan alamat rumah"
        enum role "buyer | seller | admin | superadmin"
        enum kyc_status "draft | pending | verified | rejected"
        text ktp_image_url "Supabase Private Storage (AES-256) foto KTP"
        text house_image_url "Supabase Private Storage (AES-256) foto rumah"
        text selfie_blink_image_url "Supabase Private Storage (AES-256) selfie kedip"
        text kyc_rejection_reason "Alasan jika ditolak admin"
        uuid verified_by FK "Admin verifikator"
        timestamptz verified_at "Waktu disetujui"
        timestamptz created_at
        timestamptz updated_at
    }

    SHOPS {
        uuid id PK "Default gen_random_uuid()"
        uuid owner_id FK "Relasi ke profiles.id"
        varchar shop_name "Nama Toko / Usaha"
        varchar shop_slug UK "URL ramah SEO"
        text shop_photo_url "Cloudflare R2 CDN URL foto profil toko"
        text description "Deskripsi profil toko"
        varchar whatsapp_number "No WA toko untuk order"
        text qris_image_url "Cloudflare R2 CDN URL barcode QRIS toko"
        numeric default_delivery_fee "Ongkir acuan antar rumah yang diatur penjual"
        boolean free_delivery_same_dusun "Opsi gratis ongkir jika sesama dusun"
        integer dusun_id FK "Relasi ke dusuns.id (Filter Dusun)"
        varchar dusun "Fallback nama dusun"
        varchar rt "RT toko"
        varchar rw "RW toko"
        boolean is_active "Status operasional toko"
        timestamptz created_at
        timestamptz updated_at
    }

    CATEGORIES {
        serial id PK
        varchar name "Nama Kategori (Sembako, Olahan, dll)"
        varchar slug UK
        varchar icon_name "Nama ikon Lucide"
    }

    PRODUCTS {
        uuid id PK "Default gen_random_uuid()"
        uuid shop_id FK "Relasi ke shops.id"
        integer category_id FK "Relasi ke categories.id"
        varchar title "Nama barang (Gaya Shopee 2 Kolom)"
        text description "Deskripsi lengkap barang"
        numeric price "Harga satuan (Rupiah)"
        integer stock "Jumlah stok tersedia"
        numeric rating_avg "Rating bintang ala Shopee (contoh 4.9)"
        integer total_sold "Total barang terjual di desa"
        text_array images "Kumpulan URL foto produk di Cloudflare R2 CDN"
        boolean is_available "Status aktif tayang"
        timestamptz created_at
        timestamptz updated_at
    }

    ORDERS {
        uuid id PK "Default gen_random_uuid()"
        varchar order_code UK "Contoh: KM-20261124-001"
        uuid buyer_id FK "Relasi ke profiles.id"
        uuid shop_id FK "Relasi ke shops.id"
        numeric total_amount "Total tagihan (Subtotal + Ongkir Toko)"
        numeric delivery_fee "Ongkir per toko diinput penjual setelah pembeli order"
        enum delivery_method "delivery_to_home | pickup_at_store"
        enum payment_method "cod_cash | qris_store"
        enum status "pending_confirmation | confirmed | packing | out_for_delivery | ready_for_pickup | completed | cancelled"
        text notes "Catatan pembeli untuk penjual"
        boolean wa_message_sent "Penanda WA dibuka"
        timestamptz completed_at "Waktu pesanan selesai"
        timestamptz created_at
        timestamptz updated_at
    }

    ORDER_ITEMS {
        uuid id PK "Default gen_random_uuid()"
        uuid order_id FK "Relasi ke orders.id"
        uuid product_id FK "Relasi ke products.id"
        varchar product_title "Nama produk saat transaksi"
        numeric price_at_purchase "Harga saat dibeli"
        integer quantity "Jumlah dibeli"
        numeric subtotal "Subtotal item"
    }

    OTP_VERIFICATIONS {
        uuid id PK "Default gen_random_uuid()"
        varchar phone_number "Nomor WhatsApp tujuan"
        varchar otp_code "Kode 6 digit angka"
        boolean is_used "Status penggunaan"
        timestamptz expires_at "Kedaluwarsa 5 menit"
        timestamptz created_at
    }

    AUDIT_LOGS {
        uuid id PK "Default gen_random_uuid()"
        uuid actor_id FK "Relasi ke profiles.id"
        varchar action "Aksi (KYC_APPROVE, ROLE_CHANGE, dll)"
        varchar entity_name "Nama tabel terkait"
        varchar entity_id "ID entitas"
        jsonb details "Payload detail perubahan"
        timestamptz created_at
    }
```

---

## 2. Definisi Relasi & Integritas Data

1. **Relasi Kependudukan & Toko (`PROFILES` -> `SHOPS`)**:
   - Satu profil warga dapat memiliki 0 atau 1 Toko (pada fase MVP). Jika warga ingin berjualan, mereka mengaktifkan modul Toko.
   - `ON DELETE CASCADE`: Jika akun warga dihapus (misal hak hapus akun UU PDP), entitas toko terkait ikut terhapus bersih.
2. **Relasi Toko & Produk (`SHOPS` -> `PRODUCTS`)**:
   - Satu toko memiliki banyak produk (`1 to N`).
   - `ON DELETE CASCADE`: Menghapus toko menghapus seluruh produk yang dimilikinya.
3. **Relasi Pesanan (`ORDERS` & `ORDER_ITEMS`)**:
   - Satu pesanan dibuat oleh 1 Pembeli (`buyer_id`) ditujukan kepada 1 Toko (`shop_id`).
   - Pemisahan order per toko memastikan tidak ada kebingungan konfirmasi WhatsApp toko yang berbeda.
   - Kolom `price_at_purchase` dan `product_title` di `ORDER_ITEMS` diabadikan (snapshot) agar riwayat harga masa lalu tidak berubah meskipun penjual mengubah harga produk di kemudian hari.
4. **Keamanan Dokumen KYC (`PROFILES`)**:
   - Kolom `ktp_image_url`, `house_image_url`, dan `selfie_blink_image_url` menunjuk ke Supabase Storage Bucket bertipe **Private** (`kyc-documents`).
   - Bucket tersebut memiliki kebijakan akses ketat: hanya pemilik akun dan pengguna dengan role `admin` / `superadmin` yang dapat menghasilkan *Signed URL* berdurasi 10 menit untuk meninjau foto.

---

## 3. Indeks Performa Database (PostgreSQL Performance Indexes)

```sql
-- Indeks pencarian cepat produk berdasarkan toko dan status aktif
CREATE INDEX idx_products_shop_available ON products(shop_id, is_available);
CREATE INDEX idx_products_category ON products(category_id) WHERE is_available = TRUE;

-- Indeks pelacakan pesanan pembeli & toko
CREATE INDEX idx_orders_buyer_status ON orders(buyer_id, status);
CREATE INDEX idx_orders_shop_status ON orders(shop_id, status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Indeks antrean verifikasi KYC untuk Admin & Login
CREATE INDEX idx_profiles_kyc_pending ON profiles(kyc_status) WHERE kyc_status = 'pending';
CREATE INDEX idx_profiles_username ON profiles(username) WHERE username IS NOT NULL;
CREATE INDEX idx_profiles_nik ON profiles(nik);
CREATE INDEX idx_profiles_phone ON profiles(phone_number);

-- Indeks masa berlaku OTP
CREATE INDEX idx_otp_phone_active ON otp_verifications(phone_number, is_used, expires_at);
```
