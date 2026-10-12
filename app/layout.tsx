import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { SITE, SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.artist }],
  creator: SITE.artist,
  keywords: [
    "DJ ShadzO",
    "RNPiano",
    "amapiano",
    "amapiano R&B",
    "amapiano with R&B vocals",
    "South African DJ",
    "Destiny album",
    "RnPiano Records",
    "book a DJ Johannesburg",
    "amapiano DJ Johannesburg",
    "book a DJ Durban",
    "book a DJ Cape Town",
    "book a DJ Gqeberha",
    "book a DJ Port Elizabeth",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: "/",
    locale: "en_ZA",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
