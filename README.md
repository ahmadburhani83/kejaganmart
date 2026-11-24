# 🏪 Kejagan Mart — Marketplace Khusus Se-Desa Kejagan

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.6-black?logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19.3.0-blue?logo=react)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_16-3ecf8e?logo=supabase)](https://supabase.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-25GB_Free_Media-3448C5?logo=cloudinary)](https://cloudinary.com)
[![Capacitor Android](https://img.shields.io/badge/Capacitor-v7_Android_APK-119eff?logo=capacitor)](https://capacitorjs.com)
[![License](https://img.shields.io/badge/License-MIT-emerald)](LICENSE)

**Kejagan Mart** adalah platform lokapasar (marketplace) mikro digital dengan tema segar **Hijau Desa** yang dirancang khusus untuk perputaran ekonomi warga di lingkungan **Desa Kejagan, Kecamatan Trowulan, Kabupaten Mojokerto, Jawa Timur**. 

Sistem ini memfasilitasi transaksi jual-beli sembako, makanan olahan, dan hasil tani langsung antar tetangga desa dengan sistem pembayaran tunai di tempat (**COD**) atau scan **QRIS Toko** saat serah terima barang.

---

## 🌟 Fitur Utama & Peran Pengguna

### 1. 🛒 Pembeli (Warga Desa)
- **Registrasi KYC Kependudukan**: Verifikasi NIK KTP, foto tampak depan rumah, dan swafoto biometrik kedipan mata (*liveness detection*).
- **Wajib Login Sebelum Pesan Barang**: Memastikan keamanan transaksi antar warga dengan modal dialog autentikasi yang elegan.
- **Navigasi Bottom Bar (Ikon Saja)**: Akses instan ke Beranda, Kategori, Dusun, Keranjang, dan Akun Profil.
- **Filter Kategori & Tombol Masuk Berbentuk Ikon Saja**: Antarmuka bersih, ergonomis, dan modern.
- **Tombol Filter Dusun Interaktif**: Tombol filter dinamis yang memunculkan daftar dusun saat diklik.
- **Halaman Login Deteksi Peran Otomatis**: Mendeteksi otomatis Pembeli, Penjual, Admin, atau Superadmin tanpa tab terpisah.
- **Pendaftaran Otomatis (Pembeli & Penjual)**: Warga dapat langsung mendaftar secara instan dengan verifikasi domisili oleh Admin Desa Kejagan.
- **Katalog Belanja Ala Shopee (Grid 2 Kolom Tema Hijau Terang)**: Tampilan visual modern dengan badge COD, rating bintang ⭐, dan filter dusun dinamis (*Dusun Krajan*, *Dusun Kulon*).
- **Halaman Login Khusus Warga**: Masuk menggunakan **Nomor WhatsApp + Password** di rute `/login`.
- **Ongkir Toko Pasca-Order**: Biaya ongkos kirim dihitung flat per transaksi toko (bukan per butir barang) dan ditetapkan langsung oleh penjual setelah pesanan masuk sesuai jarak RT/RW pembeli.
- **Checkout WhatsApp Otomatis**: Pesanan langsung diteruskan ke nomor WhatsApp toko tanpa perlu gateway pihak ketiga berbayar.

### 2. 🏪 Penjual / Toko (UMKM Desa)
- **Pendaftaran Profil Toko**: Input nama toko, foto banner, dusun/alamat RT/RW, dan nomor WhatsApp pemesanan.
- **Unggah Produk Cepat (Cloudinary WebP - 100% Gratis Tanpa Kartu Kredit)**: Foto produk otomatis dikompresi di memori HP ke format WebP ($800 \times 800\text{ px}$, $\approx 50\text{ KB}$), menghemat kuota $98\%$.
- **Penetapan Ongkir Pasca-Order**: Penjual meninjau alamat RT/RW pesanan masuk, menginput nominal ongkir pengantaran, dan mengonfirmasi total tagihan langsung ke pembeli via WhatsApp.
- **Penerimaan QRIS Toko**: Unggah barcode QRIS toko untuk mempermudah transaksi non-tunai saat serah terima barang.

### 3. 🛡️ Admin (Verifikator Desa)
- **Review KYC Sisi-ke-Sisi**: Meninjau foto KTP, foto rumah, dan selfie kedip mata warga.
- **Kirim OTP Langsung dari HP Admin**: Mengirimkan kode OTP verifikasi pendaftaran langsung dari aplikasi WhatsApp di HP Admin desa (100% Gratis, Tanpa Biaya Gateway API).
- **Login Institusional**: Masuk menggunakan **Username + Password** di rute `/login`.

### 4. 👑 Superadmin (Kepala Desa / BPD / BUMDes)
- **Manajemen Identitas Wilayah**: Mengatur nama desa, kecamatan, kabupaten, dan provinsi.
- **Master Dusun Dinamis (CRUD Dusun)**: Menambah, mengubah, atau menonaktifkan nama dusun yang otomatis tersinkronisasi ke filter belanja warga dan alamat pendaftaran.
- **Laporan & Audit Log**: Riwayat transaksi ekonomi desa dan jejak audit keamanan kependudukan.

---

## 🏗️ Arsitektur Teknologi

```
[ Frontend: Next.js 16 (React 19, Tailwind CSS v4, Light Green Theme) ]
                      │
     ┌────────────────┼────────────────┐
     ▼                ▼                ▼
[ Supabase Auth ] [ Supabase DB ] [ Cloudinary Media CDN ]
  - JWT RBAC       - PostgreSQL 16   - Foto Produk & Toko
  - Cookie         - RLS Kedap Air   - 25GB/Bulan Gratis
    HttpOnly       - Audit Logs      - Tanpa Kartu Kredit
                      │
                      ▼
            [ Supabase Storage ]
             - Private Encrypted (AES-256)
             - KTP & Biometrik Warga
             - Signed URL 5 Menit
```

---

## 🚀 Panduan Menjalankan Proyek di Lokal

### 1. Prasyarat
- Node.js versi 20+ (direkomendasikan Node.js 22 atau 26)
- npm, pnpm, atau bun
- Akun Supabase (Gratis) & Akun Cloudinary (Gratis tanpa kartu kredit)

### 2. Kloning Repositori & Instalasi Dependensi
```bash
git clone https://github.com/ahmadburhani83/kejaganmart.git
cd kejaganmart
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Lengkapi nilai variabel lingkungan:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Setup Database Supabase
1. Masuk ke dashboard Supabase Anda.
2. Buka menu **SQL Editor**.
3. Buka file `supabase/schema.sql`, salin seluruh isinya dan klik **Run**.
4. Di menu **Storage**, buat bucket `kyc-documents` dan atur sebagai **Private**.

### 5. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser Anda di `http://localhost:3000`.

---

## 📱 Panduan Build APK Android (Capacitor v7)

Untuk membungkus website menjadi aplikasi Android mandiri:
```bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Inisialisasi
npx cap init "Kejagan Mart" "id.desa.kejaganmart" --web-dir out

# 3. Tambahkan Platform Android & Buka di Android Studio
npx cap add android
npx cap open android
```
Di Android Studio: klik **Build -> Build APK(s)** untuk menghasilkan file `app-release.apk` siap pasang di ponsel warga.

---

## ⚖️ Kepatuhan Hukum & Privasi (UU No. 27/2022)

Aplikasi ini memenuhi standar regulasi perlindungan data pribadi kependudukan Republik Indonesia:
- **Kebijakan Privasi**: Tersedia di rute `/privacy`
- **Syarat & Ketentuan**: Tersedia di rute `/terms`
- **Alur & Endpoint Hapus Data (*Right to be Forgotten*)**: Tersedia di rute `/delete-account` dan API `/api/user/data-deletion`

---

## 📄 Dokumen Arsitektur Lengkap
- [PRD (Product Requirements Document)](./PRD.md)
- [ERD (Entity Relationship Diagram)](./ERD.md)
- [Dokumentasi Teknis & Panduan Publikasi](./DOCUMENTATION.md)

---

@2026 Ahmad Burhani
