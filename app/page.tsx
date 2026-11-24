'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, MapPin, Truck, Star, LogIn, Store, ShieldCheck } from 'lucide-react';

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
];

const DUSUNS = ['Semua Dusun', 'Dusun Krajan', 'Dusun Kulon'];

export default function HomePage() {
  const [selectedDusun, setSelectedDusun] = useState('Semua Dusun');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'cod' | 'pickup'>('cod');

  const filteredProducts = INITIAL_PRODUCTS.filter((p) => {
    const matchDusun = selectedDusun === 'Semua Dusun' || p.dusun === selectedDusun;
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shop.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDusun && matchCat && matchSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;
    const itemsList = cart.map((i) => `- ${i.title} (Rp ${i.price.toLocaleString('id-ID')})`).join('\n');
    const methodDesc =
      deliveryMethod === 'cod'
        ? 'Diantar ke Rumah (COD)\nBiaya Ongkir Toko: Menunggu penetapan oleh toko sesuai RT/RW'
        : 'Ambil Mandiri di Toko (Ongkir Rp 0 - Gratis)';

    const message = `*PESANAN BARU KEJAGAN MART*\nID Order: #KM-${Date.now().toString().slice(-6)}\nPembeli: Warga Desa Kejagan\n\nRincian Barang:\n${itemsList}\n\nSubtotal Produk: Rp ${subtotal.toLocaleString('id-ID')}\nMetode Pengantaran: ${methodDesc}\n----------------------------------\n*ESTIMASI TOTAL: Rp ${subtotal.toLocaleString('id-ID')} (+ Ongkir Toko)*\n\nMohon toko memeriksa alamat kami dan mengonfirmasi pesanan ini. Terima kasih!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/6281234567890?text=${encoded}`, '_blank');
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* TOP HEADER (LIGHT THEME - HIJAU DESA) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs px-4 py-3">
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
              Desa Kejagan, Kec. Tulangan, Sidoarjo
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* LOGIN BUTTON */}
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 px-3 py-2 rounded-xl transition shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-600" />
              <span>Masuk</span>
            </Link>

            {/* CART BUTTON */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm shadow-emerald-600/20"
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

        {/* SEARCH BAR */}
        <div className="max-w-4xl mx-auto mt-2.5">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari beras, sambal pecel, sayur, atau nama warung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl py-2 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
            />
          </div>
        </div>

        {/* DUSUN FILTER PILLS */}
        <div className="max-w-4xl mx-auto mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {DUSUNS.map((dusun) => (
            <button
              key={dusun}
              onClick={() => setSelectedDusun(dusun)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition font-bold text-[11px] ${
                selectedDusun === dusun
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
              }`}
            >
              {dusun}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 space-y-4">
        {/* BANNER PROMO DESA & CLOUDINARY */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/70 border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
          <div className="space-y-1">
            <span className="font-extrabold text-emerald-900 flex items-center gap-1.5 text-xs sm:text-sm">
              <span>🌾</span> Pasar Digital UMKM & Warga Desa Kejagan
            </span>
            <p className="text-[11px] text-emerald-800">
              COD diantar tetangga • Bayar setelah barang tiba • Didukung Penyimpanan Cloudinary (Gratis 25GB)
            </p>
          </div>
          <span className="self-start sm:self-auto text-[10px] px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-bold whitespace-nowrap shadow-xs">
            LCP &lt; 0.8s Kilat
          </span>
        </div>

        {/* CATEGORY SELECTOR */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { id: 'all', name: 'Semua', icon: '🛒' },
            { id: 'sembako', name: 'Sembako', icon: '🌾' },
            { id: 'makanan', name: 'Makanan', icon: '🥘' },
            { id: 'tani', name: 'Hasil Tani', icon: '🥬' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-3 rounded-2xl border transition flex flex-col items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs font-bold'
                  : 'bg-white border-slate-200/80 text-slate-600 hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-[11px] font-semibold">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* SHOPEE-STYLE 2-COLUMN PRODUCT GRID (LIGHT THEME) */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <h2 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
              Katalog Produk Desa
            </h2>
            <span className="text-emerald-700 font-mono font-bold text-[11px]">
              {filteredProducts.length} Produk
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2 shadow-xs">
              <span className="text-3xl">🛒</span>
              <p className="text-xs">Tidak ada produk yang cocok dengan pencarian Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-400 hover:shadow-md transition group"
                >
                  {/* Square Image with Shopee Badges */}
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
                        <Truck className="w-3 h-3 text-emerald-600" />
                        <span>COD Se-Desa (Ongkir Pasca-Order)</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500 text-[9px]">
                        <span className="truncate max-w-[85px] font-medium">{p.shop}</span>
                        <span>Terjual {p.sold}+</span>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(p)}
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

      {/* CART MODAL & WHATSAPP CHECKOUT */}
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
              <p className="text-[10px] text-slate-500">
                💡 Ongkir flat per pesanan toko. Penjual menetapkan nominal pasca-order sesuai alamat RT/RW Anda.
              </p>
            </div>

            {/* Breakdown */}
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
              <button
                disabled={cart.length === 0}
                onClick={handleCheckoutWhatsApp}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 mt-2 disabled:opacity-50"
              >
                <span>💬</span> Konfirmasi Pesanan ke WhatsApp Toko
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER & LEGAL TRIO (LIGHT THEME) */}
      <footer className="border-t border-slate-200 bg-white px-4 py-8 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <p className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <span>🏪</span> Kejagan Mart
              </p>
              <p className="text-[11px] text-slate-500">
                Marketplace Kependudukan Khusus Warga Desa Kejagan, Sidoarjo.
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
          <p className="text-[10px] text-slate-400 text-center sm:text-left border-t border-slate-100 pt-3">
            © 2026 Pemerintah Desa Kejagan. Semua Hak Dilindungi. Didukung oleh Supabase, Cloudinary, dan Vercel.
          </p>
        </div>
      </footer>
    </div>
  );
}
