import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tamias POS - Sistem Kasir Modern untuk Bisnis Anda",
  description:
    "Kelola bisnis lebih cerdas dengan Tamias POS. Sistem Point of Sale modern dengan fitur lengkap: transaksi cepat, laporan realtime, manajemen stok, dan multi-user.",
  keywords: [
    "POS",
    "Point of Sale",
    "Kasir",
    "Sistem Kasir",
    "Manajemen Bisnis",
    "Retail",
    "Tamias POS",
  ],
  authors: [{ name: "Tamias POS" }],
  openGraph: {
    title: "Tamias POS - Sistem Kasir Modern untuk Bisnis Anda",
    description:
      "Kelola bisnis lebih cerdas dengan Tamias POS. Sistem Point of Sale modern dengan fitur lengkap.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
