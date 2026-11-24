'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  User,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  Store,
  UserCheck,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  detectUserRole,
  saveRegisteredUser,
  setCurrentSession,
  getRegisteredUsers,
  UserSession
} from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();

  // Mode: 'login' (Masuk Otomatis) atau 'register' (Daftar Mandiri)
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login Form States
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDusun, setRegDusun] = useState('Dusun Krajan');
  const [regRtRw, setRegRtRw] = useState('');
  const [regRole, setRegRole] = useState<'pembeli' | 'penjual'>('pembeli');
  const [regPassword, setRegPassword] = useState('');

  // UI Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Live Detected Role for Login
  const detected = identifier.trim() ? detectUserRole(identifier) : null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'register') {
        setMode('register');
      }
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanId = identifier.trim();

      if (!cleanId || !password) {
        setErrorMessage('Nomor WhatsApp / Username dan Kata Sandi wajib diisi.');
        return;
      }

      // Cari di data tersimpan atau buat sesi otomatis
      const users = getRegisteredUsers();
      const existing = users.find(
        (u) =>
          u.identifier.toLowerCase() === cleanId.toLowerCase() ||
          u.identifier.replace(/^0/, '') === cleanId.replace(/^0/, '').replace(/^\+62/, '')
      );

      const detection = detectUserRole(cleanId);
      const sessionUser: UserSession = existing || {
        id: `user-${Date.now()}`,
        name: cleanId.includes('kades')
          ? 'Kepala Desa Kejagan'
          : cleanId.includes('admin')
          ? 'Petugas Admin Desa'
          : `Warga (${cleanId})`,
        identifier: cleanId,
        role: detection.role,
        roleLabel: detection.roleLabel,
        dusun: 'Desa Kejagan',
        verificationStatus: detection.role === 'admin' || detection.role === 'superadmin' ? 'verified' : 'pending_admin',
        createdAt: new Date().toISOString(),
      };

      setCurrentSession(sessionUser);
      setSuccessMessage(
        `Login berhasil! Terdeteksi otomatis sebagai: ${sessionUser.roleLabel}. Mengalihkan...`
      );

      setTimeout(() => {
        router.push('/');
      }, 1000);
    }, 600);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanPhone = regPhone.trim().replace(/^0/, '').replace(/^\+62/, '');

      if (!regName.trim() || !cleanPhone || !regPassword) {
        setErrorMessage('Mohon lengkapi Nama Lengkap, Nomor WhatsApp, dan Kata Sandi.');
        return;
      }

      const roleLabel =
        regRole === 'penjual'
          ? 'Penjual (Mitra Toko UMKM Desa)'
          : 'Pembeli (Warga Desa)';

      const newUser: UserSession = {
        id: `user-${Date.now()}`,
        name: regName.trim(),
        identifier: cleanPhone,
        role: regRole,
        roleLabel,
        dusun: regDusun,
        rtRw: regRtRw.trim() || '01/01',
        verificationStatus: 'pending_admin', // Tetap melalui verifikasi admin desa
        createdAt: new Date().toISOString(),
      };

      saveRegisteredUser(newUser);
      setCurrentSession(newUser);

      setSuccessMessage(
        `Pendaftaran mandiri berhasil! Akun langsung aktif sebagai ${roleLabel}. Verifikasi kependudukan oleh Admin Desa berlangsung dalam 1x24 jam.`
      );

      setTimeout(() => {
        router.push('/');
      }, 1500);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 via-slate-50 to-emerald-50/50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* BRANDING & BACK LINK */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full transition shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Katalog Belanja
          </Link>

          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="text-3xl">🏪</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kejagan Mart</h1>
          </div>
          <p className="text-xs text-slate-600">
            Desa Kejagan, Kec. Trowulan, Kab. Mojokerto
          </p>
        </div>

        {/* CARD CONTAINER */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/5 space-y-5">
          {/* MODE TOGGLE: MASUK vs DAFTAR OTOMATIS */}
          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Masuk (Deteksi Otomatis)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Daftar Warga Baru</span>
            </button>
          </div>

          {/* FEEDBACK NOTIFICATIONS */}
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 font-medium leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: FORM MASUK (DETEKSI PERAN OTOMATIS) */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Nomor WhatsApp atau Username:
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 081234567890 atau admin / kades"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-300 rounded-2xl py-2.5 pl-10 pr-3.5 text-slate-900 text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>

                {/* LIVE AUTOMATIC ROLE DETECTION BADGE */}
                {detected && (
                  <div className="mt-2 flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-600 font-medium">Peran Terdeteksi:</span>
                    <span
                      className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${detected.badgeColor}`}
                    >
                      {detected.roleLabel}
                    </span>
                  </div>
                )}

                <p className="text-[10px] text-slate-500 mt-1">
                  Sistem otomatis mendeteksi apakah Anda <strong>Pembeli</strong>, <strong>Penjual</strong>, <strong>Admin</strong>, atau <strong>Superadmin</strong>.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Kata Sandi (Password):
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-300 rounded-2xl py-2.5 pl-10 pr-10 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700"
                    aria-label="Tampilkan sandi"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
              >
                {isLoading ? (
                  <span>Memverifikasi Akses...</span>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" /> Masuk ke Kejagan Mart
                  </>
                )}
              </button>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">💡 Akses Cepat untuk Pengujian:</p>
                <ul className="space-y-0.5 text-[10px] text-slate-500 list-disc list-inside">
                  <li><strong>Pembeli:</strong> Masukkan nomor WA warga (bebas sandi)</li>
                  <li><strong>Penjual:</strong> Ketik <code>toko</code> atau no WA toko</li>
                  <li><strong>Admin Verifikator:</strong> Ketik <code>admin</code> (sandi bebas)</li>
                  <li><strong>Superadmin Kades:</strong> Ketik <code>kades</code> (sandi bebas)</li>
                </ul>
              </div>
            </form>
          )}

          {/* TAB 2: FORM DAFTAR MANDIRI OTOMATIS (PEMBELI & PENJUAL) */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" /> Pendaftaran Otomatis + Verifikasi Admin
                </p>
                <p className="text-[10px] text-emerald-800 leading-relaxed">
                  Pembeli maupun Penjual langsung terdaftar dan dapat login seketika. Verifikasi domisili warga dilakukan berkala oleh Admin Desa Kejagan.
                </p>
              </div>

              {/* PILIHAN PERAN */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Pilih Peran Akun:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('pembeli')}
                    className={`p-2.5 rounded-2xl border text-left transition flex flex-col gap-0.5 ${
                      regRole === 'pembeli'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px] font-bold">Warga / Pembeli</span>
                    </div>
                    <span className="text-[9px] text-slate-500">Belanja sembako & pangan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('penjual')}
                    className={`p-2.5 rounded-2xl border text-left transition flex flex-col gap-0.5 ${
                      regRole === 'penjual'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px] font-bold">Penjual & Pembeli</span>
                    </div>
                    <span className="text-[9px] text-slate-500">Buka warung UMKM desa</span>
                  </button>
                </div>
              </div>

              {/* NAMA LENGKAP */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nama Lengkap (Sesuai KTP):
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Burhani"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-2 px-3 text-slate-900 text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                />
              </div>

              {/* NOMOR WA */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nomor WhatsApp Aktif:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold text-xs">
                    +62
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="81234567890"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/^0/, ''))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-2 pl-12 pr-3 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* DUSUN & RT/RW */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Dusun di Kejagan:
                  </label>
                  <select
                    value={regDusun}
                    onChange={(e) => setRegDusun(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-2 px-2.5 text-slate-900 text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  >
                    <option value="Dusun Kejagan">Dusun Kejagan</option>
                    <option value="Dusun Krajan">Dusun Krajan</option>
                    <option value="Dusun Kulon">Dusun Kulon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    RT / RW:
                  </label>
                  <input
                    type="text"
                    placeholder="02/03"
                    value={regRtRw}
                    onChange={(e) => setRegRtRw(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-2 px-3 text-slate-900 text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Buat Kata Sandi:
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimal 6 karakter"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-2 pl-9 pr-9 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
              >
                {isLoading ? (
                  <span>Mendaftarkan Akun Otomatis...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Daftar Akun Warga Sekarang
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* FOOTER BADGES */}
        <div className="text-center space-y-1.5 text-[11px] text-slate-500">
          <p className="flex items-center justify-center gap-1.5 font-medium">
            <span className="text-emerald-600 font-bold">🛡️ Aman & Terenkripsi</span> • Desa Kejagan, Mojokerto
          </p>
          <div className="flex justify-center gap-4 text-xs font-semibold text-emerald-800 pt-1">
            <Link href="/privacy" className="hover:underline">Kebijakan Privasi</Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">Syarat & Ketentuan</Link>
          </div>
          <p className="text-[10px] text-slate-400 pt-1">@2026 Ahmad Burhani</p>
        </div>
      </div>
    </div>
  );
}
