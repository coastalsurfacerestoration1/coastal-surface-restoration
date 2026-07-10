import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coastal Surface Restoration | Mobile Laser Cleaning Charleston SC",
  description:
    "Charleston's mobile laser cleaning specialist for historic, marine, and property restoration. No chemicals, no damage, no mess.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a1628]`}
      >
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-TN5F5V63RG" />
    </html>
  );
}