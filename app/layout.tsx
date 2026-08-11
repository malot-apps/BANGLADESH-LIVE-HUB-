import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'বাংলাদেশ লাইভ ইনফরমেশন হাব | Bangladesh Live Information Hub',
  description: 'বাংলাদেশের রিয়েল-টাইম লাইভ তথ্য হাব - খবর, আবহাওয়া, সরকারি সতর্কতা, বাজার দর, শিক্ষা ও চাকরির সুযোগ।',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'বাংলাদেশ লাইভ ইনফরমেশন হাব',
    description: 'বাংলাদেশে এখন কী হচ্ছে? সরাসরি খবর, আবহাওয়া, সতর্কতা ও দরদাম।',
    locale: 'bn_BD',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#059669',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
