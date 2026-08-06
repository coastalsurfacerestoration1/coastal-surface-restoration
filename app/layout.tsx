import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";
import Header from "./components/Header";
import Footer from "./components/Footer";
import JsonLd from "./components/JsonLd";
import PreLaunchBanner, { bannerDismissScript } from "./components/PreLaunchBanner";
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

/**
 * Search Console and Bing Webmaster Tools each issue a token to prove domain
 * ownership. They come from the environment rather than the source so adding
 * or rotating one is a config change, and each key is only emitted when it is
 * actually set — an empty meta tag fails verification rather than passing it.
 *
 * Google's token is the "HTML tag" method in Search Console. Bing's is under
 * Site verification, meta tag option, the `content` value of msvalidate.01.
 * Bing can also import a verified Search Console property, which skips its
 * token entirely.
 */
const verification: Metadata['verification'] = {
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : {}),
  ...(process.env.BING_SITE_VERIFICATION
    ? { other: { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } }
    : {}),
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Coastal Surface Restoration | Mobile Laser Cleaning Charleston SC",
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  verification,
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
    // The banner script below sets data-banner-dismissed on this element before
    // React hydrates, which React would otherwise report as a server/client
    // mismatch. Suppression applies to this element's own attributes only.
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${barlowCondensed.variable} font-sans antialiased bg-[#0a1628]`}
      >
        {/* Must run before the banner paints. See PreLaunchBanner. */}
        <script dangerouslySetInnerHTML={{ __html: bannerDismissScript }} />
        <JsonLd data={localBusinessSchema()} />
        <JsonLd data={websiteSchema()} />
        <PreLaunchBanner />
        {/* The header is sticky rather than fixed so the banner can sit above
            it in normal flow and scroll away, while the nav still pins to the
            top. A fixed header would need the page offset recalculated every
            time the banner is dismissed. */}
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <GoogleAnalytics gaId="G-TN5F5V63RG" />
      </body>
    </html>
  );
}