import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";
import Header from "./components/Header";
import Footer from "./components/Footer";
import JsonLd from "./components/JsonLd";
import MobileStickyCta from "./components/MobileStickyCta";
import PreLaunchBanner from "./components/PreLaunchBanner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Condensed grotesque for headlines. The width contrast against Inter is what
// makes the pairing read as deliberate — a second neo-grotesque would just
// look like Inter at a different weight.
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const DESCRIPTION =
  "Charleston's mobile laser cleaning specialist for historic, marine, and property restoration. No chemicals, no damage, no mess.";

// Search Console and Bing verification are handled via DNS TXT record at
// Porkbun (Bing imports from the verified GSC property), not via meta tags.

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
        className={`${inter.variable} ${barlowCondensed.variable} font-sans antialiased bg-[#0e273e]`}
      >
        <JsonLd data={localBusinessSchema()} />
        <JsonLd data={websiteSchema()} />
        <PreLaunchBanner />
        {/* The header is sticky rather than fixed so the banner can sit above
            it in normal flow, with the nav still pinning to the top once the
            banner scrolls past. A fixed header would sit on top of the banner
            instead and need the page offset hardcoded around it. */}
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileStickyCta />
        <Analytics />
        <GoogleAnalytics gaId="G-TN5F5V63RG" />
      </body>
    </html>
  );
}