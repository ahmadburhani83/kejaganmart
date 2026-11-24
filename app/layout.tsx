import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kejagan Mart - Marketplace Khusus Se-Desa Kejagan',
  description: 'Belanja kebutuhan pokok dan hasil bumi langsung dari tetangga se-desa Kejagan. COD di rumah atau ambil di toko. Cepat, aman, terverifikasi KYC, hemat kuota.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
