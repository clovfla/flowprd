import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "FlowPRD — AI PRD & Workflow Generator",
    template: "%s | FlowPRD",
  },
  description:
    "Buat PRD lengkap dan workflow development dalam hitungan detik. Deskripsikan project kamu, AI generate 8 dokumen sekaligus. Gratis untuk memulai.",
  keywords: [
    "PRD generator",
    "product requirement document",
    "workflow generator",
    "AI PRD",
    "development workflow",
    "project planning",
    "product management",
  ],
  authors: [{ name: "FlowPRD" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "FlowPRD",
    title: "FlowPRD — AI PRD & Workflow Generator",
    description:
      "Buat PRD lengkap dan workflow development dalam hitungan detik.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowPRD — AI PRD & Workflow Generator",
    description:
      "Buat PRD lengkap dan workflow development dalam hitungan detik.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-bg text-ink">{children}</body>
    </html>
  );
}
