import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export const metadata = {
  title: 'Syarat & Ketentuan | Kejagan Mart',
  description: 'Syarat dan ketentuan transaksi perdagangan digital warga Desa Kejagan.',
};

export default function TermsPage() {
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
            <FileText className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Syarat & Ketentuan (Terms of Service)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Terakhir Diperbarui: 24 November 2026 • Kejagan Mart
          </p>
        </div>

        <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">1. Ruang Lingkup Layanan</h2>
          <p>
            Kejagan Mart adalah platform lokapasar (marketplace) mikro yang memfasilitasi transaksi jual-beli barang,
            makanan, sembako, dan hasil panen antar warga yang berdomisili di Desa Kejagan, Kecamatan Tulangan, Kabupaten Sidoarjo.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">2. Ketentuan Akun Warga & Verifikasi KYC</h2>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
            <li>Setiap warga yang mendaftar wajib menyertakan data asli (NIK KTP, foto rumah tempat tinggal, dan foto selfie kedip mata).</li>
            <li>Akun pembeli dan penjual masuk menggunakan Nomor WhatsApp aktif dan Password pribadi.</li>
            <li>Admin desa berhak menolak atau menonaktifkan akun yang menggunakan identitas palsu atau beralamat di luar Desa Kejagan.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">3. Tata Cara Transaksi & Pembayaran COD</h2>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
            <li>Transaksi disepakati melalui koordinasi langsung via WhatsApp antara pembeli dan pemilik toko.</li>
            <li>Pembayaran dilakukan secara tunai di tempat (*Cash On Delivery* / COD) atau scan QRIS toko saat serah terima barang.</li>
            <li>Pembeli wajib membayar sesuai total tagihan yang telah dikonfirmasi penjual saat barang tiba di rumah.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">4. Ketentuan Ongkos Kirim Pasca-Order</h2>
          <p>
            Biaya ongkos kirim (ongkir) dihitung flat per transaksi toko (bukan per butir barang). Penjual menentukan
            nominal ongkir secara wajar setelah meninjau alamat RT/RW pembeli dan mengonfirmasikannya kepada pembeli sebelum barang diantar.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">5. Barang yang Dilarang</h2>
          <p>
            Dilarang keras memperjualbelikan minuman keras/beralkohol, obat-obatan terlarang, senjata tajam tanpa izin,
            barang hasil tindak kejahatan, atau barang ilegal lainnya yang melanggar hukum NKRI dan norma ketertiban desa.
          </p>
        </section>

        <section className="space-y-2 text-xs text-slate-500 border-t border-slate-100 pt-4">
          <p>
            Pemerintah Desa Kejagan • Kantor Kepala Desa Kejagan, Kec. Tulangan, Kab. Sidoarjo, Jawa Timur.
          </p>
        </section>
      </div>
    </div>
  );
}
