import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.rescisaonline.com.br'),
  title: 'Rescisão Online | Calculadora de Rescisão Trabalhista',
  description: 'Calcule sua rescisão trabalhista online com precisão, incluindo férias, 13º, FGTS e aviso prévio. Simples, rápido e gratuito!',
  verification: {
    google: 'oF-QTbm38s2fVK7YIY7goNwsweWbdXTxZdQ_i0uX978',
  },
  keywords: 'rescisão online, calculadora rescisão, rescisão trabalhista, cálculo trabalhista, direitos trabalhistas, FGTS, férias proporcionais',
  authors: [{ name: 'Vinicius Olicar' }],
  openGraph: {
    title: 'Rescisão Online | Calculadora de Rescisão Trabalhista',
    description: 'Calcule sua rescisão trabalhista online com precisão, incluindo férias, 13º, FGTS e aviso prévio.',
    images: [
      {
        url: "/metadata_og.png", // coloca o arquivo em /public
        width: 1200,
        height: 630,
        alt: "Calculadora de Rescisão Trabalhista",
      },
    ],
    url: 'https://rescisaonline.com.br',
    siteName: 'Rescisão Online',
    locale: 'pt_BR',
    type: 'website',
  },
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
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5155326548013471"
          crossOrigin="anonymous"></script>
        <meta name="google-adsense-account" content="ca-pub-5155326548013471"></meta>
      </head>
      <body className={`${inter.variable} ${jakarta.variable} font-sans min-h-screen`} style={{ backgroundColor: '#111827', color: '#ffffff' }}>
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