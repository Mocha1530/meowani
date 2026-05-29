import type { Metadata } from "next";
import Providers from "./providers";
import { Suspense } from "react";
import {
  CatalogSearchSkeleton,
  CatalogResultSkeleton,
} from "@/components/custom/catalog-search";
import { Footer } from "@/components/custom/footer";

export const metadata: Metadata = {
  title: "Browse Anime",
  description:
    "Browse and filter thousands of anime series by genres, tags, year, season, and more. Find your next favorite anime on MeowAni",
  openGraph: {
    type: "website",
    siteName: "MeowAni",
    title: "Browse Anime | MeowAni",
    description:
      "Browse and filter thousands of anime series by genres, tags, year, season, and more.",
    url: "https://meowani.site/browse",
  },
  twitter: {
    title: "Browse Anime | MeowAni",
    site: "MeowAni",
    description:
      "Browse and filter thousands of anime series by genres, tags, year, season, and more.",
  },
  alternates: {
    canonical: "https://meowani.site/browse",
  },
};

/**
 * Layout component that wraps page content with Providers and a Suspense boundary that shows skeletons while loading.
 *
 * @param children - The page content to render inside the layout.
 * @returns The layout element containing `Providers` and a `Suspense` boundary; while suspended it displays `CatalogSearchSkeleton` and `CatalogResultSkeleton`.
 */
export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Suspense
        fallback={
          <div className="min-w-0 flex flex-1 shrink flex-col bg-background overflow-x-hidden gap-5 overflow-y-scroll max-h-dvh md:pt-16">
            <CatalogSearchSkeleton />
            <CatalogResultSkeleton />
            <Footer className="mt-auto" />
          </div>
        }
      >
        {children}
      </Suspense>
    </Providers>
  );
}
