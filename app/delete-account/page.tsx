'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DeleteAccountPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nik, setNik] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !nik) {
      alert('Mohon masukkan Nomor WhatsApp dan NIK KTP Anda.');
      return;
    }

    if (!confirm('Apakah Anda yakin ingin mengajukan penghapusan akun dan seluruh berkas data pribadi Anda dari Kejagan Mart?')) {
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/user/data-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, nik, reason }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Permohonan penghapusan data Anda telah diterima.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Terjadi kendala saat memproses permohonan.');
      }
    } catch {
      setStatus('error');
      setMessage('Gagal terhubung ke server. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <Link href="/" className="text-emerald-400 text-xs font-bold hover:underline mb-2 inline-block">
            ← Kembali ke Beranda Kejagan Mart
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Penghapusan Akun & Data Pribadi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Hak Privasi Warga (*Right to be Forgotten*) • UU PDP No. 27/2022
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
          <strong>Perhatian:</strong> Penghapusan akun akan menghapus profil warga Anda, riwayat transaksi, foto e-KTP,
          foto tampak rumah, dan biometrik kedipan mata secara permanen dari server desa.
        </div>

        {status === 'success' ? (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-3">
            <span className="text-3xl">✅</span>
            <h3 className="text-sm font-bold text-white">Permohonan Berhasil Dikirim</h3>
            <p className="text-xs text-slate-300">{message}</p>
            <p className="text-[11px] text-slate-400">
              Admin verifikator desa akan memvalidasi dan memusnahkan arsip berkas Anda dalam waktu 1x24 jam kerja.
            </p>
            <Link href="/" className="inline-block px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs mt-2 transition">
              Kembali ke Halaman Utama
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Nomor WhatsApp Terdaftar:
              </label>
              <input
                type="tel"
                required
                placeholder="Contoh: 081234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                NIK KTP Terdaftar (16 Digit):
              </label>
              <input
                type="text"
                required
                maxLength={16}
                placeholder="Contoh: 351508xxxxxxxxxx"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Alasan Pengajuan (Opsional):
              </label>
              <textarea
                rows={3}
                placeholder="Contoh: Sudah pindah domisili dari Desa Kejagan..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {status === 'error' && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition shadow-lg shadow-red-600/20 disabled:opacity-50"
            >
              {status === 'loading' ? 'Memproses Permohonan...' : '⚠️ Ajukan Penghapusan Akun & Berkas'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
