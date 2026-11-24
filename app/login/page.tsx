'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, Lock, User, ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loginType, setLoginType] = useState<'warga' | 'admin'>('warga');

  // Form State Warga (No WA + Password)
  const [phoneNumber, setPhoneNumber] = useState('');
  const [wargaPassword, setWargaPassword] = useState('');

  // Form State Admin (Username + Password)
  const [username, setUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleWargaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    // Simulasi autentikasi Warga desa
    setTimeout(() => {
      setIsLoading(false);
      if (phoneNumber.length < 9 || !wargaPassword) {
        setErrorMessage('Nomor WhatsApp atau Kata Sandi belum lengkap.');
        return;
      }
      setSuccessMessage(`Selamat datang kembali! Masuk sebagai warga nomor WA: +62 ${phoneNumber}`);
      setTimeout(() => {
        router.push('/');
      }, 1200);
    }, 700);
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    // Simulasi autentikasi Admin/Superadmin institusional desa
    setTimeout(() => {
      setIsLoading(false);
      if (!username || !adminPassword) {
        setErrorMessage('Username atau Kata Sandi Admin wajib diisi.');
        return;
      }
      setSuccessMessage(`Berhasil login ke Portal Aparatur Desa (${username})!`);
      setTimeout(() => {
        router.push('/');
      }, 1200);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-slate-50 to-emerald-50/40 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* TOP BRANDING & BACK LINK */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3.5 py-1.5 rounded-full transition shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Katalog Belanja
          </Link>

          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="text-3xl">🏪</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kejagan Mart</h1>
          </div>
          <p className="text-xs text-slate-600">
            Marketplace Mandiri Warga Desa Kejagan, Kec. Tulangan, Sidoarjo
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/5 space-y-5">
          {/* TAB SWITCHER */}
          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setLoginType('warga');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                loginType === 'warga'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Warga (Pembeli & Penjual)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginType('admin');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                loginType === 'admin'
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Aparatur Desa (Admin)</span>
            </button>
          </div>

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* FORM 1: WARGA (NO WA + PASSWORD) */}
          {loginType === 'warga' && (
            <form onSubmit={handleWargaSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Nomor WhatsApp Terdaftar:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-xs">
                    +62
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="81234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/^0/, ''))}
                    className="w-full bg-slate-50/80 border border-slate-300 rounded-2xl py-2.5 pl-12 pr-3.5 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Masukkan nomor WhatsApp aktif tanpa angka 0 di depan.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Kata Sandi (Password):
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={wargaPassword}
                    onChange={(e) => setWargaPassword(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-300 rounded-2xl py-2.5 pl-10 pr-3.5 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Memeriksa Akun Warga...</span>
                ) : (
                  <>
                    <Phone className="w-4 h-4" /> Masuk sebagai Warga Desa
                  </>
                )}
              </button>

              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-800 text-center leading-relaxed">
                Belum terdaftar sebagai warga? Hubungi <strong>Admin KYC Desa</strong> atau ketua RT/RW setempat untuk verifikasi KTP & Foto Rumah.
              </div>
            </form>
          )}

          {/* FORM 2: APARATUR DESA (USERNAME + PASSWORD) */}
          {loginType === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Username Petugas Desa:
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: admin_kejagan_1 atau kades"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-300 rounded-2xl py-2.5 pl-10 pr-3.5 text-slate-900 text-xs font-semibold focus:outline-none focus:border-emerald-700 focus:bg-white transition"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Akun resmi yang diterbitkan oleh Pemerintah Desa Kejagan.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Kata Sandi Admin:
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-300 rounded-2xl py-2.5 pl-10 pr-3.5 text-slate-900 text-xs focus:outline-none focus:border-emerald-700 focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Memvalidasi Akses Petugas...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Masuk ke Portal Admin Desa
                  </>
                )}
              </button>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 text-center leading-relaxed">
                Portal ini hanya untuk peninjauan antrean KYC KTP warga, moderasi pasar, dan pengelolaan master wilayah oleh Kepala Desa.
              </div>
            </form>
          )}
        </div>

        {/* SECURITY & LEGAL BADGES */}
        <div className="text-center space-y-2 text-[11px] text-slate-500">
          <p className="flex items-center justify-center gap-1.5 font-medium">
            <span className="text-emerald-600 font-bold">🛡️ Aman & Terenkripsi</span> • Sesi HttpOnly Cookie • Bebas Kebocoran Data
          </p>
          <div className="flex justify-center gap-4 text-xs font-semibold text-emerald-800 pt-1">
            <Link href="/privacy" className="hover:underline">Kebijakan Privasi</Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
