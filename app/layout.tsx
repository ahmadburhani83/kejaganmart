import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kejagan Mart - Marketplace Khusus Se-Desa Kejagan',
  description: 'Belanja kebutuhan pokok dan hasil panen langsung dari tetangga se-desa Kejagan. COD di rumah atau ambil di toko. Segar, aman, terverifikasi KYC, cepat dan hemat kuota.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased bg-slate-50 text-slate-900">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
