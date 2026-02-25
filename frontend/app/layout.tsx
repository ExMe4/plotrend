import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE = {
  name: "Plotrend",
  description: "Explore TV show ratings, episode trends and cast insights.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  github: "https://github.com/ExMe4",
  defaultImage: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/og-default.png`,
};

export const metadata: Metadata = {
  metadataBase: SITE.url ? new URL(SITE.url) : undefined,
  title: {
    default: SITE.name,
    template: "%s | Plotrend",
  },
  description: SITE.description,
  icons: {
    icon: "/logoTaskbar.svg",
  },
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    images: [{ url: SITE.defaultImage, width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: [SITE.defaultImage],
  },
  robots: {
    index: true,
    follow: true,
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-900`}
      >
          <NavBar />
            <main>
              {children}
            </main>
      </body>
    </html>
  );
}