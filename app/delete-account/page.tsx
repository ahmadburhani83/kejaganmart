'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, UserX, AlertTriangle, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl shadow-red-950/5">
        <div className="border-b border-slate-100 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full transition mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda Kejagan Mart
          </Link>
          <div className="flex items-center gap-2">
            <UserX className="w-6 h-6 text-red-600" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Penghapusan Akun & Data Pribadi
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hak Privasi Warga (*Right to be Forgotten*) • UU PDP No. 27/2022
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Perhatian:</strong> Penghapusan akun akan memusnahkan profil warga Anda, riwayat transaksi, foto e-KTP,
            foto tampak rumah, dan biometrik kedipan mata secara permanen dari server desa.
          </div>
        </div>

        {status === 'success' ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">Permohonan Berhasil Dikirim</h3>
            <p className="text-xs text-slate-600">{message}</p>
            <p className="text-[11px] text-slate-500">
              Admin verifikator desa akan memvalidasi dan memusnahkan arsip berkas Anda dalam waktu 1x24 jam kerja.
            </p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs mt-2 transition shadow-sm shadow-emerald-600/20"
            >
              Kembali ke Halaman Utama
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Nomor WhatsApp Terdaftar:
              </label>
              <input
                type="tel"
                required
                placeholder="Contoh: 081234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white font-mono transition"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                NIK KTP Terdaftar (16 Digit):
              </label>
              <input
                type="text"
                required
                maxLength={16}
                placeholder="Contoh: 351508xxxxxxxxxx"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white font-mono transition"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Alasan Pengajuan (Opsional):
              </label>
              <textarea
                rows={3}
                placeholder="Contoh: Sudah pindah domisili dari Desa Kejagan..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition"
              />
            </div>

            {status === 'error' && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-lg shadow-red-600/20 disabled:opacity-50"
            >
              {status === 'loading' ? 'Memproses Permohonan...' : '⚠️ Ajukan Penghapusan Akun & Berkas'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
