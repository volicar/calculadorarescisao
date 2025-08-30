import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Calculadora de Rescisão Trabalhista 2025 | Calcule seus direitos',
  description: 'Calcule de forma rápida e precisa os valores de rescisão trabalhista. Férias, 13º salário, FGTS e muito mais. Ferramenta gratuita e confiável.',
  keywords: 'calculadora rescisão, rescisão trabalhista, cálculo trabalhista, direitos trabalhistas, FGTS, férias proporcionais',
  authors: [{ name: 'Vinicius' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#22c55e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} min-h-screen`} style={{ backgroundColor: '#111827', color: '#ffffff' }}>
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}