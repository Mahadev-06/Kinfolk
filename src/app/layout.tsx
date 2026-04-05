import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Kinfolk — Build & Sync Your Family Tree in the Cloud',
  description: 'Map your lineage beautifully with our visual builder. Securely save, share, and import family trees across all your devices.',
  keywords: ['family tree', 'genealogy', 'cloud family tree', 'family history', 'kinfolk'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen bg-night text-slate-100 font-sans antialiased overflow-x-hidden">
        <main className="animate-page-slide-up">
          {children}
        </main>
      </body>
    </html>
  );
}
