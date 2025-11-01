import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OG Meta Previewer - Preview Social Media Cards & SEO Tags",
    template: "%s | OG Meta Previewer"
  },
  description: "Free tool to preview how your URLs appear across social platforms. Check Open Graph tags, Twitter Cards, and meta tags before sharing your content on Facebook, Twitter, LinkedIn, and more.",
  keywords: ["og meta preview", "open graph preview", "twitter card preview", "social media preview", "meta tags checker", "seo preview", "facebook preview", "linkedin preview", "og image preview"],
  authors: [{ name: "OG Meta Previewer" }],
  creator: "OG Meta Previewer",
  publisher: "OG Meta Previewer",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "OG Meta Previewer - Preview Social Media Cards & SEO Tags",
    description: "Free tool to preview how your URLs appear across social platforms. Check Open Graph tags, Twitter Cards, and meta tags before sharing.",
    url: '/',
    siteName: "OG Meta Previewer",
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OG Meta Previewer - Preview your social media cards',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "OG Meta Previewer - Preview Social Media Cards & SEO Tags",
    description: "Free tool to preview how your URLs appear across social platforms. Check Open Graph tags, Twitter Cards, and meta tags before sharing.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification tokens here when available
    // google: 'your-google-verification-token',
    // yandex: 'your-yandex-verification-token',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'OG Meta Previewer',
    description: 'Free tool to preview how your URLs appear across social platforms. Check Open Graph tags, Twitter Cards, and meta tags before sharing.',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Open Graph meta tag preview',
      'Twitter Card preview',
      'Facebook link preview',
      'LinkedIn share preview',
      'Meta tags checker',
      'SEO tag validation',
    ],
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
