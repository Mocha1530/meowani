import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist, Geist_Mono, Montserrat, Sora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/shadcn/utils";

import { SerwistProvider } from "./serwist";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MeowAni - Free Anime Streaming",
    template: "%s | MeowAni",
  },
  description:
    "Watch anime online for free with no ads. Stream your favorite anime series in HD quality.",
  authors: [{ name: "Yohan" }],
  openGraph: {
    type: "website",
    siteName: "MeowAni - Free anime online",
    title: "MeowAni - Free Anime Streaming",
    description: "Watch anime online for free with no ads.",
    images: ["/assets/logo/logo-4.png"],
    url: "https://meowani.site/",
  },
  twitter: {
    card: "summary_large_image",
    title: "MeowAni - Free Anime Streaming",
    site: "MeowAni",
    description: "Watch anime online for free with no ads.",
    images: ["/assets/logo/logo-4.png"],
  },
  applicationName: "MeowAni",
  appleWebApp: {
    capable: true,
    title: "MeowAni",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: [{ url: "/favicon.ico", type: "image/x-icon" }],
  },
  alternates: {
    canonical: "https://meowani.site/",
  },
};

export const viewport: Viewport = {
  themeColor: "#8bdfea",
};

/**
 * Application root layout that wraps page content with global font classes, providers, and analytics.
 *
 * @param children - The page content to render within the layout's provider hierarchy.
 * @returns The top-level HTML element containing the provider-wrapped application UI, analytics, and toast components.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        montserrat.variable,
        sora.variable,
        "dark",
      )}
    >
      <head />
      <body className="min-h-full flex flex-col">
        <SerwistProvider swUrl="/serwist/sw.js">
          <NuqsAdapter>
            <TooltipProvider>
              {children}
              {/*<BackNavigationFix />*/}
            </TooltipProvider>
          </NuqsAdapter>
        </SerwistProvider>
        <Analytics />
        <SpeedInsights />
        <Toaster />
      </body>
      <GoogleAnalytics gaId="G-LNNQQ01K4K" />
    </html>
  );
}
