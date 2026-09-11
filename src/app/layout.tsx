import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { getAds, getSiteMeta, getTags } from "@/lib/api";
import { WebsiteAndOrgJsonLd } from "@/components/seo/JsonLd";
import FloatingSideAds from "@/components/ads/FloatingSideAds";
import NavigationProgress from "@/components/ui/NavigationProgress";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://korankuid.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "korankuid - Portal Informasi Politik dan Pembangunan",
    template: "%s - korankuid",
  },
  description:
    "Portal Berita Terkini Perkembangan Politik, Hukum, Pendidikan, Pemerintahan, dan Kabar Daerah se-Provinsi Lampung.",
  applicationName: "korankuid",
  authors: [{ name: "Redaksi korankuid", url: siteUrl }],
  creator: "korankuid",
  publisher: "korankuid",
  keywords: [
    "korankuid",
    "berita lampung",
    "politik lampung",
    "pembangunan lampung",
    "hukum lampung",
    "pemerintahan lampung",
    "kabar daerah lampung",
    "berita terkini lampung",
    "bandar lampung",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "korankuid",
    title: "korankuid - Portal Informasi Politik dan Pembangunan",
    description:
      "Portal Berita Terkini Perkembangan Politik, Hukum, Pendidikan, Pemerintahan, dan Kabar Daerah se-Provinsi Lampung.",
    images: [
      {
        url: `${siteUrl}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "korankuid - Portal Informasi Politik dan Pembangunan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "korankuid - Portal Informasi Politik dan Pembangunan",
    description:
      "Portal Berita Terkini Perkembangan Politik, Hukum, Pendidikan, Pemerintahan, dan Kabar Daerah se-Provinsi Lampung.",
    site: "@korankuid",
    creator: "@korankuid",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [siteMeta, headerAds, floatingAds, focusTags] = await Promise.all([
    getSiteMeta(),
    getAds("header"),
    getAds("floating-left,floating-right"),
    getTags(),
  ]);
  const floatingLeftAd = floatingAds.find((ad) => ad.posisi === "floating-left");
  const floatingRightAd = floatingAds.find((ad) => ad.posisi === "floating-right");

  return (
    <html
      lang="id"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fcfcfc] text-gray-900 font-sans">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <WebsiteAndOrgJsonLd
          siteUrl={siteUrl}
          siteName="korankuid"
          logoUrl={siteMeta?.logo_url}
        />
        <Header
          logoUrl={siteMeta?.logo_url}
          headerAd={headerAds[0]}
          focusTags={focusTags}
        />
        <FloatingSideAds leftAd={floatingLeftAd} rightAd={floatingRightAd} />
        <main id="main-content" className="site-shell flex-1 pt-6 pb-2">
          {children}
        </main>
        <Footer logoUrl={siteMeta?.footer_logo_url} />
      </body>
    </html>
  );
}
