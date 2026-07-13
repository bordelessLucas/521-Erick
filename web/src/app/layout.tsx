import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { PipelineStagesProvider } from '@/presentation/contexts/PipelineStagesContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Trançatto — Cordas e tricôs náuticos',
    template: '%s · Trançatto',
  },
  description:
    'Cordas e tricôs náuticos com fabricação própria para móveis e decoração.',
  icons: {
    icon: '/images/trancatto/asset-12.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <PipelineStagesProvider>
          {children}
        </PipelineStagesProvider>
      </body>
    </html>
  );
}
