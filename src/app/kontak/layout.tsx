import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description:
    "Informasi kontak redaksi, kerjasama media, pemasangan iklan, dan alamat kantor korankuid di Bandar Lampung.",
  alternates: {
    canonical: "/kontak",
  },
  openGraph: {
    title: "Hubungi Kami - korankuid",
    description:
      "Informasi kontak redaksi, kerjasama media, pemasangan iklan, dan alamat kantor korankuid di Bandar Lampung.",
    url: "https://korankuid.com/kontak",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
