import { Suspense } from "react";
import {
  AnimeInfoBannerSkeleton,
  AnimeInfoTabsSkeleton,
} from "@/components/custom/anime-info";
import { AnimeCardsSkeleton } from "@/components/custom/anime-carousel";
import { EndOfContent } from "@/components/custom/end-of-content";
import { Footer } from "@/components/custom/footer";

/**
 * Layout component that wraps `children` in a React Suspense boundary and shows catalog skeletons while descendants are pending.
 *
 * @param children - The content to render inside the layout.
 * @returns The layout element that renders `children` when ready, or a skeleton fallback UI while descendants are loading.
 */
export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-w-0 max-h-dvh overflow-x-hidden overflow-y-scroll flex flex-1 shrink flex-col pt-0 gap-5 sm:gap-7 md:gap-11">
          <AnimeInfoBannerSkeleton />
          <AnimeInfoTabsSkeleton />
          <AnimeCardsSkeleton paddingX="px-1.5 md:px-6 lg:px-12 xl:px-14" />
          <EndOfContent />
          <Footer className="mt-auto" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
  // return (
  //   <div className="min-w-0 max-h-dvh overflow-x-hidden overflow-y-scroll flex flex-1 flex-col pt-0 gap-5 overflow-auto">
  //     <AnimeInfoBannerSkeleton />
  //     <AnimeInfoTabsSkeleton />
  //     <AnimeCardsSkeleton paddingX="px-1.5 md:px-6 lg:px-12 xl:px-14" />
  //   </div>
  // );
}
