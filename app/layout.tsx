import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";
import Header from "./components/Header";
import Footer from "./components/Footer";
import JsonLd from "./components/JsonLd";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const DESCRIPTION =
  "Charleston's mobile laser cleaning specialist for historic, marine, and property restoration. No chemicals, no damage, no mess.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Coastal Surface Restoration | Mobile Laser Cleaning Charleston SC",
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    url: "/",
    title: "Coastal Surface Restoration | Mobile Laser Cleaning Charleston SC",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Coastal Surface Restoration | Mobile Laser Cleaning Charleston SC",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#0a1628]`}
      >
        <JsonLd data={localBusinessSchema()} />
        <JsonLd data={websiteSchema()} />
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
        <Analytics />
        <GoogleAnalytics gaId="G-TN5F5V63RG" />
      </body>
    </html>
  );
}