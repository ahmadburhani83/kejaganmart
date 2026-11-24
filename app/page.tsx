'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Search,
  MapPin,
  Truck,
  Star,
  LogIn,
  SlidersHorizontal,
  Home,
  Layers,
  User,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  X,
  AlertTriangle,
  Store,
  Sparkles
} from 'lucide-react';
import {
  getCurrentSession,
  clearCurrentSession,
  UserSession
} from '@/lib/auth';

interface Product {
  id: number;
  title: string;
  price: number;
  shop: string;
  dusun: string;
  category: string;
  icon: string;
  rating: number;
  sold: number;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, title: 'Beras Rojolele Asli Kemasan 5 Kg', price: 68000, shop: 'Toko Pak Budi', dusun: 'Dusun Krajan', category: 'sembako', icon: '🌾', rating: 4.9, sold: 142 },
  { id: 2, title: 'Sambal Pecel Madiun Khas Desa 500g', price: 25000, shop: 'Warung Bu Slamet', dusun: 'Dusun Kulon', category: 'makanan', icon: '🥘', rating: 4.8, sold: 98 },
  { id: 3, title: 'Telur Ayam Kampung Segar 1 Kg', price: 32000, shop: 'Peternakan Kang Asep', dusun: 'Dusun Krajan', category: 'tani', icon: '🥚', rating: 5.0, sold: 64 },
  { id: 4, title: 'Kripik Tempe Renyah Gurih Gurih', price: 12000, shop: 'Warung Bu Slamet', dusun: 'Dusun Kulon', category: 'makanan', icon: '🥟', rating: 4.9, sold: 110 },
  { id: 5, title: 'Minyak Goreng Sawit Murni 2 Liter', price: 34000, shop: 'Toko Pak Budi', dusun: 'Dusun Krajan', category: 'sembako', icon: '🌻', rating: 4.7, sold: 215 },
  { id: 6, title: 'Sayur Bayam & Kangkung Segar Panen Pagi', price: 5000, shop: 'Petani Kebun Krajan', dusun: 'Dusun Krajan', category: 'tani', icon: '🥬', rating: 5.0, sold: 48 },
  { id: 7, title: 'Gula Pasir Kristal Putih 1 Kg', price: 17500, shop: 'Toko Bu Siti', dusun: 'Dusun Kejagan', category: 'sembako', icon: '🍚', rating: 4.9, sold: 88 },
  { id: 8, title: 'Kopi Bubuk Robusta Sangrai Tradisional 250g', price: 20000, shop: 'Kopi Desa Kejagan', dusun: 'Dusun Kejagan', category: 'makanan', icon: '☕', rating: 5.0, sold: 53 },
];

const DUSUN_LIST = [
  { id: 'Semua Dusun', label: 'Semua Dusun', desc: 'Seluruh Wilayah Desa Kejagan' },
  { id: 'Dusun Kejagan', label: 'Dusun Kejagan', desc: 'Pusat Kantor Balai Desa & Sekitarnya' },
  { id: 'Dusun Krajan', label: 'Dusun Krajan', desc: 'Wilayah Krajan & Pertanian Timur' },
  { id: 'Dusun Kulon', label: 'Dusun Kulon', desc: 'Wilayah Kulon & Sentra Olahan' },
];

const CATEGORIES = [
  { id: 'all', name: 'Semua', icon: '🛒' },
  { id: 'sembako', name: 'Sembako', icon: '🌾' },
  { id: 'makanan', name: 'Makanan & Kuliner', icon: '🥘' },
  { id: 'tani', name: 'Hasil Tani & Sayur', icon: '🥬' },
];

export default function HomePage() {
  const router = useRouter();

  // Filter & Search State
  const [selectedDusun, setSelectedDusun] = useState('Semua Dusun');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Panels State
  const [isDusunModalOpen, setIsDusunModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Cart & Order State
  const [cart, setCart] = useState<Product[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<'cod' | 'pickup'>('cod');
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'category' | 'dusun' | 'cart' | 'profile'>('home');

  // User Auth Session State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  useEffect(() => {
    // Muat sesi pengguna saat client mounting
    const session = getCurrentSession();
    setCurrentUser(session);
  }, []);

  const filteredProducts = INITIAL_PRODUCTS.filter((p) => {
    const matchDusun = selectedDusun === 'Semua Dusun' || p.dusun === selectedDusun;
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shop.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDusun && matchCat && matchSearch;
  });

  // Handler Tambah Keranjang dengan Proteksi Wajib Login
  const handleAddToCart = (product: Product) => {
    if (!currentUser) {
      setIsLoginRequiredModalOpen(true);
      return;
    }
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  // Checkout WhatsApp dengan Penegakan Wajib Login
  const handleCheckoutWhatsApp = () => {
    if (!currentUser) {
      setIsCartOpen(false);
      setIsLoginRequiredModalOpen(true);
      return;
    }

    if (cart.length === 0) return;

    const itemsList = cart.map((i) => `- ${i.title} (Rp ${i.price.toLocaleString('id-ID')})`).join('\n');
    const methodDesc =
      deliveryMethod === 'cod'
        ? 'Diantar ke Rumah (COD)\nBiaya Ongkir Toko: Menunggu penetapan oleh toko sesuai RT/RW'
        : 'Ambil Mandiri di Toko (Ongkir Rp 0 - Gratis)';

    const message = `*PESANAN BARU KEJAGAN MART*\nID Order: #KM-${Date.now().toString().slice(-6)}\nPembeli: ${currentUser.name} (${currentUser.roleLabel})\nAlamat: ${currentUser.dusun || 'Desa Kejagan'}, RT/RW: ${currentUser.rtRw || '-'}\nNo. WA Pembeli: +62 ${currentUser.identifier}\nStatus Verifikasi: ${currentUser.verificationStatus === 'verified' ? 'Terverifikasi' : 'Menunggu Verifikasi Admin'}\n\nRincian Barang:\n${itemsList}\n\nSubtotal Produk: Rp ${subtotal.toLocaleString('id-ID')}\nMetode Pengantaran: ${methodDesc}\n----------------------------------\n*ESTIMASI TOTAL: Rp ${subtotal.toLocaleString('id-ID')} (+ Ongkir Toko)*\n\nMohon toko memeriksa pesanan dan mengonfirmasi pengantaran. Terima kasih!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/6281234567890?text=${encoded}`, '_blank');
    setCart([]);
    setIsCartOpen(false);
  };

  const handleLogout = () => {
    clearCurrentSession();
    setCurrentUser(null);
    setIsProfileModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 text-slate-900 pb-28">
      {/* TOP HEADER (LIGHT THEME - HIJAU DESA) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-2xs px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl">🏪</span>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">Kejagan Mart</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                Se-Desa
              </span>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-600" />
              Desa Kejagan, Kec. Trowulan, Mojokerto
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* TOMBOL MASUK / PROFIL (BENTUK IKON SAJA) */}
            {currentUser ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="relative p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/90 transition shadow-2xs flex items-center justify-center active:scale-95"
                aria-label={`Profil: ${currentUser.name}`}
                title={`Masuk sebagai: ${currentUser.name} (${currentUser.roleLabel})`}
              >
                <User className="w-5 h-5 text-emerald-700" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
              </button>
            ) : (
              <Link
                href="/login"
                className="p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/90 transition shadow-2xs flex items-center justify-center active:scale-95"
                aria-label="Masuk Akun"
                title="Masuk Akun Warga / Aparatur"
              >
                <LogIn className="w-5 h-5 text-emerald-700" />
              </Link>
            )}

            {/* TOMBOL KERANJANG DI HEADER */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm shadow-emerald-600/20 active:scale-95"
              aria-label="Buka Keranjang Belanja"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* SEARCH BAR & DUSUN FILTER BUTTON */}
        <div className="max-w-4xl mx-auto mt-2.5 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari beras, sambal, sayur, warung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl py-2 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
            />
          </div>

          {/* TOMBOL FILTER DUSUN (MUNCUL LIST SAAT DIKLIK) */}
          <button
            onClick={() => setIsDusunModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition shadow-2xs whitespace-nowrap active:scale-95"
            aria-label="Filter Dusun"
            title="Klik untuk memilih dusun"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">{selectedDusun}</span>
            <span className="sm:hidden">{selectedDusun.replace('Dusun ', '')}</span>
            <span className="text-emerald-600 text-[10px]">▾</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 space-y-4">
        {/* BANNER PROMO DESA (BERSIH DARI TEKS CLOUDINARY & LCP) */}
        <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/70 border border-emerald-200/90 flex items-center justify-between shadow-xs">
          <div className="space-y-0.5">
            <span className="font-extrabold text-emerald-950 flex items-center gap-1.5 text-xs sm:text-sm">
              <span>🌾</span> Pasar Digital UMKM & Warga Desa Kejagan
            </span>
            <p className="text-[11px] text-emerald-800">
              COD diantar tetangga se-desa • Bayar tunai setelah barang tiba di rumah
            </p>
          </div>
          <span className="hidden sm:inline-flex text-[10px] px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-bold whitespace-nowrap shadow-xs">
            Mojokerto
          </span>
        </div>

        {/* STATUS USER LOGIN BANNER JIKA LOGIN */}
        {currentUser && (
          <div className="p-2.5 px-3.5 rounded-2xl bg-white border border-emerald-200/90 shadow-2xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-600">
                Masuk sebagai: <strong className="text-slate-900">{currentUser.name}</strong>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                {currentUser.roleLabel}
              </span>
            </div>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="text-emerald-700 hover:underline text-[11px] font-bold"
            >
              Lihat Profil
            </button>
          </div>
        )}

        {/* FILTER BERDASARKAN KATEGORI (BENTUK IKON SAJA) */}
        <div id="kategori-section" className="space-y-1.5">
          <div className="flex justify-between items-center text-xs px-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Kategori Produk
            </span>
            <span className="text-[10px] text-slate-400">Pilih ikon kategori</span>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                title={cat.name}
                aria-label={cat.name}
                className={`py-3.5 rounded-2xl border transition flex flex-col items-center justify-center gap-1 active:scale-95 ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 border-emerald-700 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/20 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/40 shadow-2xs'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                {selectedCategory === cat.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* SHOPEE-STYLE 2-COLUMN PRODUCT GRID (LIGHT THEME) */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <h2 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>🛒</span> Katalog Produk {selectedDusun !== 'Semua Dusun' ? `(${selectedDusun})` : 'Desa Kejagan'}
            </h2>
            <span className="text-emerald-700 font-mono font-bold text-[11px]">
              {filteredProducts.length} Produk
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2 shadow-xs">
              <span className="text-3xl">🛒</span>
              <p className="text-xs">Tidak ada produk yang cocok dengan pencarian atau filter dusun Anda.</p>
              <button
                onClick={() => {
                  setSelectedDusun('Semua Dusun');
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-400 hover:shadow-md transition group"
                >
                  {/* Square Image with Badges */}
                  <div className="w-full aspect-square bg-slate-100 flex items-center justify-center text-5xl relative border-b border-slate-100">
                    <span>{p.icon}</span>
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-black uppercase shadow">
                      COD
                    </span>
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-xs text-amber-700 border border-slate-200/60 text-[9px] font-bold flex items-center gap-0.5 shadow-xs">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" /> {p.rating}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-emerald-700 transition">
                        {p.title}
                      </h3>
                      <p className="text-sm font-black text-emerald-700 mt-1 font-mono">
                        Rp {p.price.toLocaleString('id-ID')}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px]">
                      <div className="text-emerald-700 font-semibold flex items-center gap-1 text-[9px]">
                        <Truck className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{p.dusun}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500 text-[9px]">
                        <span className="truncate max-w-[85px] font-medium">{p.shop}</span>
                        <span>Terjual {p.sold}+</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(p)}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1 shadow-sm shadow-emerald-600/20 active:scale-98"
                    >
                      + Keranjang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* FOOTER & LEGAL TRIO (@2026 Ahmad Burhani) */}
      <footer className="border-t border-slate-200 bg-white px-4 py-8 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <p className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <span>🏪</span> Kejagan Mart
              </p>
              <p className="text-[11px] text-slate-500">
                Marketplace Kependudukan Khusus Warga Desa Kejagan, Mojokerto.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-emerald-800">
              <Link href="/login" className="hover:text-emerald-950 transition">
                Masuk / Login
              </Link>
              <Link href="/privacy" className="hover:text-emerald-950 transition">
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="hover:text-emerald-950 transition">
                Syarat & Ketentuan
              </Link>
              <Link href="/delete-account" className="hover:text-red-600 transition">
                Hapus Akun / Data
              </Link>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium text-center sm:text-left border-t border-slate-100 pt-3">
            @2026 Ahmad Burhani
          </p>
        </div>
      </footer>

      {/* BOTTOMBAR NAVIGASI (BENTUK IKON SAJA) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-6 flex items-center justify-around max-w-lg mx-auto shadow-2xl">
        {/* 1. Beranda */}
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveBottomNav('home');
          }}
          aria-label="Beranda"
          title="Beranda"
          className={`p-2.5 rounded-2xl transition flex flex-col items-center relative ${
            activeBottomNav === 'home'
              ? 'text-emerald-700 bg-emerald-50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          {activeBottomNav === 'home' && (
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-0.5"></span>
          )}
        </button>

        {/* 2. Kategori Produk */}
        <button
          onClick={() => {
            const el = document.getElementById('kategori-section');
            el?.scrollIntoView({ behavior: 'smooth' });
            setActiveBottomNav('category');
          }}
          aria-label="Kategori"
          title="Kategori Produk"
          className={`p-2.5 rounded-2xl transition flex flex-col items-center relative ${
            activeBottomNav === 'category'
              ? 'text-emerald-700 bg-emerald-50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-5 h-5" />
          {activeBottomNav === 'category' && (
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-0.5"></span>
          )}
        </button>

        {/* 3. Filter Dusun (Popup Selector) */}
        <button
          onClick={() => {
            setIsDusunModalOpen(true);
            setActiveBottomNav('dusun');
          }}
          aria-label="Filter Dusun"
          title={`Filter Dusun (${selectedDusun})`}
          className={`p-2.5 rounded-2xl transition flex flex-col items-center relative ${
            selectedDusun !== 'Semua Dusun' || activeBottomNav === 'dusun'
              ? 'text-emerald-700 bg-emerald-50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          {selectedDusun !== 'Semua Dusun' ? (
            <span className="w-2 h-2 bg-emerald-600 rounded-full absolute top-1.5 right-1.5 border-2 border-white"></span>
          ) : (
            activeBottomNav === 'dusun' && (
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-0.5"></span>
            )
          )}
        </button>

        {/* 4. Keranjang Belanja */}
        <button
          onClick={() => {
            setIsCartOpen(true);
            setActiveBottomNav('cart');
          }}
          aria-label="Keranjang Belanja"
          title="Keranjang Belanja"
          className={`p-2.5 rounded-2xl transition flex flex-col items-center relative ${
            activeBottomNav === 'cart'
              ? 'text-emerald-700 bg-emerald-50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {cart.length > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center shadow">
              {cart.length}
            </span>
          )}
        </button>

        {/* 5. Akun Pengguna / Masuk */}
        <button
          onClick={() => {
            if (currentUser) {
              setIsProfileModalOpen(true);
            } else {
              router.push('/login');
            }
            setActiveBottomNav('profile');
          }}
          aria-label={currentUser ? `Akun: ${currentUser.name}` : 'Masuk Akun'}
          title={currentUser ? `Akun: ${currentUser.name}` : 'Masuk Akun'}
          className={`p-2.5 rounded-2xl transition flex flex-col items-center relative ${
            currentUser
              ? 'text-emerald-700 bg-emerald-50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-5 h-5" />
          {currentUser && (
            <span className="w-2 h-2 bg-emerald-500 rounded-full absolute top-1.5 right-1.5 border border-white"></span>
          )}
        </button>
      </nav>

      {/* MODAL 1: FILTER DUSUN (MUNCUL LIST DUSUN SAAT DIKLIK) */}
      {isDusunModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 text-xs text-slate-800 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Pilih Dusun di Desa Kejagan
                </h3>
                <p className="text-[10px] text-slate-500">Filter toko & produk berdasarkan wilayah dusun</p>
              </div>
              <button
                onClick={() => setIsDusunModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-base font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {DUSUN_LIST.map((dusun) => (
                <button
                  key={dusun.id}
                  onClick={() => {
                    setSelectedDusun(dusun.id);
                    setIsDusunModalOpen(false);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                    selectedDusun === dusun.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs">{dusun.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{dusun.desc}</p>
                  </div>
                  {selectedDusun === dusun.id && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsDusunModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
              >
                Terapkan Filter Dusun
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: WAJIB LOGIN DULU SEBELUM PESAN BARANG */}
      {isLoginRequiredModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 space-y-4 text-xs text-slate-800 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <LogIn className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-black text-slate-900">
                Wajib Masuk Terlebih Dahulu
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Untuk menjaga keamanan transaksi antar warga di lingkungan <strong>Desa Kejagan</strong>, Anda harus masuk ke akun warga sebelum memesan barang.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 text-left space-y-1">
              <p className="font-bold">✨ Belum punya akun?</p>
              <p className="text-[10px] text-emerald-700">
                Pembeli maupun Penjual dapat <strong>daftar mandiri secara instan</strong> dengan nomor WhatsApp.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <Link
                href="/login"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25"
              >
                <LogIn className="w-4 h-4" /> Masuk Akun Sekarang
              </Link>
              <Link
                href="/login?tab=register"
                className="w-full py-2.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" /> Daftar Warga Baru (Gratis)
              </Link>
              <button
                onClick={() => setIsLoginRequiredModalOpen(false)}
                className="text-[11px] text-slate-400 hover:text-slate-600 pt-1"
              >
                Tutup & Lanjut Lihat Katalog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PROFIL USER & LOGOUT */}
      {isProfileModalOpen && currentUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 space-y-4 text-xs text-slate-800 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" /> Profil Akun Warga
              </h3>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-base font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Nama Lengkap:</span>
                <span className="font-bold text-slate-900">{currentUser.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">No. WhatsApp:</span>
                <span className="font-mono font-bold text-slate-900">+62 {currentUser.identifier}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Peran:</span>
                <span className="font-bold px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[10px]">
                  {currentUser.roleLabel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Wilayah:</span>
                <span className="text-slate-700 font-medium">{currentUser.dusun} (RT/RW: {currentUser.rtRw || '-'})</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                <span className="text-slate-500 text-[11px]">Verifikasi Admin Desa:</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  {currentUser.verificationStatus === 'verified' ? 'Terverifikasi' : 'Menunggu Verifikasi'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Keluar dari Akun (Logout)
            </button>
          </div>
        </div>
      )}

      {/* CART MODAL & CHECKOUT */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 text-xs text-slate-800 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-emerald-600" /> Keranjang Belanja
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-base font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center text-slate-400 py-6">Keranjang masih kosong.</p>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200/80"
                  >
                    <div>
                      <p className="font-bold text-slate-800 line-clamp-1">{item.title}</p>
                      <p className="text-[10px] text-slate-500">{item.shop} • COD Se-Desa</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-700 font-mono">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Delivery Method Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px]">
              <label className="font-bold text-slate-700">Pilih Metode Pengantaran:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('cod')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col ${
                    deliveryMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-bold">Diantar ke Rumah</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Ongkir Ditetapkan Toko</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col ${
                    deliveryMethod === 'pickup'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-bold">Ambil di Toko</span>
                  <span className="text-[10px] text-slate-500">Ongkir Rp 0 (Gratis)</span>
                </button>
              </div>
            </div>

            {/* Breakdown & Action */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="flex justify-between items-center text-slate-600">
                <span>Subtotal Produk:</span>
                <span className="text-slate-900 font-mono font-bold">
                  Rp {subtotal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Biaya Ongkir Toko:</span>
                <span className="text-amber-700 font-mono font-semibold">
                  {deliveryMethod === 'cod' ? 'Ditetapkan Toko Pasca-Order' : 'Rp 0 (Gratis)'}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-1 flex justify-between items-center text-sm font-bold">
                <span>Estimasi Tagihan:</span>
                <span className="text-emerald-700 font-mono text-base font-black">
                  Rp {subtotal.toLocaleString('id-ID')} {deliveryMethod === 'cod' && '(+ Ongkir)'}
                </span>
              </div>

              {/* JIKA BELUM LOGIN: MINTA LOGIN DULU */}
              {!currentUser ? (
                <button
                  disabled={cart.length === 0}
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsLoginRequiredModalOpen(true);
                  }}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 mt-2 disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" /> Masuk Akun Dulu untuk Memesan
                </button>
              ) : (
                <button
                  disabled={cart.length === 0}
                  onClick={handleCheckoutWhatsApp}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 mt-2 disabled:opacity-50"
                >
                  <span>💬</span> Konfirmasi Pesanan ke WhatsApp Toko
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
