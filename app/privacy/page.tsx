import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Kebijakan Privasi | Kejagan Mart',
  description: 'Kebijakan privasi perlindungan data warga sesuai UU No. 27/2022 (UU PDP).',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl shadow-emerald-950/5">
        <div className="border-b border-slate-100 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full transition mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda Kejagan Mart
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Kebijakan Privasi (Privacy Policy)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Terakhir Diperbarui: 24 November 2026 • Kepatuhan UU No. 27/2022 (UU PDP)
          </p>
        </div>

        <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">1. Pendahuluan</h2>
          <p>
            Selamat datang di <strong>Kejagan Mart</strong>, platform marketplace mikro khusus lingkungan warga Desa Kejagan,
            Kecamatan Trowulan, Kabupaten Mojokerto. Kami berkomitmen penuh untuk melindungi privasi dan integritas data
            pribadi seluruh warga desa sesuai Undang-Undang Perlindungan Data Pribadi Republik Indonesia (UU PDP No. 27/2022).
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">2. Data Pribadi yang Kami Kumpulkan</h2>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
            <li><strong>Data Identitas Kependudukan:</strong> NIK, Nama Lengkap sesuai KTP, dan Nomor WhatsApp aktif.</li>
            <li><strong>Dokumen Verifikasi KYC:</strong> Foto e-KTP, foto tampak depan rumah, dan swafoto kedipan mata (*liveness detection*).</li>
            <li><strong>Informasi Wilayah Domisili:</strong> Nama Dusun, RT, RW, dan patokan alamat tinggal.</li>
            <li><strong>Data Toko & Transaksi:</strong> Nama usaha/warung, produk, alamat antar, nomor kontak, serta riwayat pemesanan COD.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">3. Tujuan Pemrosesan Data</h2>
          <p>
            Seluruh data yang dikumpulkan semata-mata digunakan untuk:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
            <li>Memverifikasi keaslian bahwa pengguna adalah warga asli/berdomisili resmi di Desa Kejagan.</li>
            <li>Mencegah pesanan fiktif, penipuan, atau akun palsu di lingkungan pasar desa.</li>
            <li>Menghubungkan pembeli dengan penjual via koordinasi WhatsApp langsung saat pengantaran barang COD.</li>
          </ul>
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900">
            Kami TIDAK PERNAH menjual, menyewakan, atau membagikan data kependudukan warga kepada pihak ketiga komersial mana pun.
          </div>
        </section>

        <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">4. Keamanan & Penyimpanan Berkas</h2>
          <p>
            Dokumen sensitif (KTP, foto rumah, selfie kedip) disimpan di dalam media penyimpanan berenkripsi AES-256
            dan diakses secara terbatas hanya oleh Admin Verifikator Desa melalui tiket akses sementara (*Signed URLs*)
            yang kedaluwarsa otomatis dalam 5 menit. Foto dagangan publik disimpan di Cloudinary Media CDN (Gratis 25GB).
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">5. Hak Warga & Penghapusan Data (*Right to be Forgotten*)</h2>
          <p>
            Setiap warga berhak untuk memperbarui data pribadinya atau mengajukan permohonan penghapusan akun beserta
            seluruh arsip dokumen KYC dari database desa kapan saja melalui tautan{' '}
            <Link href="/delete-account" className="text-emerald-700 font-bold underline hover:text-emerald-900">
              Halaman Permohonan Hapus Data (/delete-account)
            </Link>.
          </p>
        </section>

        <section className="space-y-2 text-xs text-slate-500 border-t border-slate-100 pt-4">
          <p>
            Pemerintah Desa Kejagan • Kantor Kepala Desa Kejagan, Kec. Trowulan, Kab. Mojokerto, Jawa Timur.
          </p>
        </section>
      </div>
    </div>
  );
}
