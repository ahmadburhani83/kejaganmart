import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Syarat & Ketentuan | Kejagan Mart',
  description: 'Syarat dan ketentuan transaksi perdagangan digital warga Desa Kejagan.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <Link href="/" className="text-emerald-400 text-xs font-bold hover:underline mb-2 inline-block">
            ← Kembali ke Beranda Kejagan Mart
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Syarat & Ketentuan (Terms of Service)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Terakhir Diperbarui: 24 November 2026 • Kejagan Mart
          </p>
        </div>

        <section className="space-y-3 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold text-white">1. Ruang Lingkup Layanan</h2>
          <p>
            Kejagan Mart adalah platform lokapasar (marketplace) mikro yang memfasilitasi transaksi jual-beli barang,
            makanan, sembako, dan hasil panen antar warga yang berdomisili di Desa Kejagan, Kecamatan Tulangan, Kabupaten Sidoarjo.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold text-white">2. Ketentuan Akun Warga & Verifikasi KYC</h2>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Setiap warga yang mendaftar wajib menyertakan data asli (NIK KTP, foto rumah tempat tinggal, dan foto selfie kedip mata).</li>
            <li>Akun pembeli dan penjual masuk menggunakan Nomor WhatsApp aktif dan Password pribadi.</li>
            <li>Admin desa berhak menolak atau menonaktifkan akun yang menggunakan identitas palsu atau beralamat di luar Desa Kejagan.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold text-white">3. Tata Cara Transaksi & Pembayaran COD</h2>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Transaksi disepakati melalui koordinasi langsung via WhatsApp antara pembeli dan pemilik toko.</li>
            <li>Pembayaran dilakukan secara tunai di tempat (*Cash On Delivery* / COD) atau scan QRIS toko saat serah terima barang.</li>
            <li>Pembeli wajib membayar sesuai total tagihan yang telah dikonfirmasi penjual saat barang tiba di rumah.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold text-white">4. Ketentuan Ongkos Kirim Pasca-Order</h2>
          <p>
            Biaya ongkos kirim (ongkir) dihitung flat per transaksi toko (bukan per butir barang). Penjual menentukan
            nominal ongkir secara wajar setelah meninjau alamat RT/RW pembeli dan mengonfirmasikannya kepada pembeli sebelum barang diantar.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold text-white">5. Barang yang Dilarang</h2>
          <p>
            Dilarang keras memperjualbelikan minuman keras/beralkohol, obat-obatan terlarang, senjata tajam tanpa izin,
            barang hasil tindak kejahatan, atau barang ilegal lainnya yang melanggar hukum NKRI dan norma ketertiban desa.
          </p>
        </section>

        <section className="space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-4">
          <p>
            Pemerintah Desa Kejagan • Kantor Kepala Desa Kejagan, Kec. Tulangan, Kab. Sidoarjo, Jawa Timur.
          </p>
        </section>
      </div>
    </div>
  );
}
