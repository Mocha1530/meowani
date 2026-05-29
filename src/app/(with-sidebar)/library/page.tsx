import * as React from "react";

import { SpotlightSkeleton } from "@/components/custom/spotlight";
import { EndOfContent } from "@/components/custom/end-of-content";
import {
  AnimeCardsSkeleton,
  AnimeCardsEmpty,
} from "@/components/custom/anime-carousel";
import {
  TrendingComponent,
  SeasonalComponent,
  PopularComponent,
  UpcomingComponent,
  SpotlightComponent,
} from "./anime-carousel";
import { Footer } from "@/components/custom/footer";

const test = [
  {
    id: "sjd",
  },
  {
    id: "@34",
  },
];

/**
 * Render the library page layout containing a spotlight and multiple anime sections with skeleton fallbacks.
 *
 * Sections included: Spotlight, Trending, Seasonal, Popular, and Upcoming, followed by an end-of-content marker.
 *
 * @returns The JSX element representing the library page layout.
 */
export default function LibraryPage() {
  return (
    <div className="min-w-0 flex flex-1 shrink flex-col overflow-x-hidden gap-5 overflow-y-scroll max-h-dvh">
      <React.Suspense fallback={<SpotlightSkeleton />}>
        <SpotlightComponent />
      </React.Suspense>
      {/*<ScrollBar />*/}
      <React.Suspense
        fallback={
          <AnimeCardsSkeleton paddingX="px-1.5 md:px-6 lg:px-12 xl:px-14" />
        }
      >
        <TrendingComponent />
      </React.Suspense>

      <React.Suspense
        fallback={
          <AnimeCardsSkeleton
            paddingX="px-1.5 md:px-6 lg:px-12 xl:px-14"
            label="Popular This Season"
          />
        }
      >
        <SeasonalComponent />
      </React.Suspense>

      <React.Suspense
        fallback={
          <AnimeCardsSkeleton
            paddingX="px-1.5 md:px-6 lg:px-12 xl:px-14"
            label="All Time Popular"
          />
        }
      >
        <PopularComponent />
      </React.Suspense>

      <React.Suspense
        fallback={
          <AnimeCardsSkeleton
            paddingX="px-1.5 md:px-6 lg:px-12 xl:px-14"
            label="Upcoming Anime"
          />
        }
      >
        <UpcomingComponent />
      </React.Suspense>
      <EndOfContent className="my-8" />
      <Footer className="mt-auto" />
      {/*<AnimeCardsEmpty label="TEST" />*/}
    </div>
  );
}
