import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";
import { TranslationProvider } from '../lib/hooks/TranslationContext';
import ClientInitializerWrapper from './ClientInitializerWrapper';
import Footer from "@/components/Footer";

// Load Inter font only with Latin subset to reduce size
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Optimize font display
  preload: true,
});

export const metadata: Metadata = {
  title: "German STSL Portal",
  description: "Portal for German STSL requests and box office returns.",
  icons: {
    icon: '/filmbank.png',
  },
  other: {
    'google': 'notranslate', // Prevents Google Translate from being suggested
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ClientInitializerWrapper />
        <TranslationProvider>
          {children}
          <Footer />
        </TranslationProvider>
      </body>
    </html>
  );
}
