"use client";

import * as React from "react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayIcon, TvIcon } from "lucide-react";
import { cn } from "@/lib/shadcn/utils";
import Link from "next/link";
import Image from "next/image";
import { getShimmerDataURL } from "@/utils/placeholder";

interface IAnimeCardProps {
  anime: {
    relationType: string | null;
    id: string | null;
    status: string | null;
    image: string | null;
    title: string | null;
    genres: string[] | [] | null;
    type: string | null;
    episodes: number | string | null;
    chapters: number | string | null;
    color: string | null;
  };
  className?: string;
}

/**
 * Render an anime poster card with image, metadata, and an optional link-style hover overlay.
 *
 * Displays the cover image (with shimmer fallback), title, type/status/relation badges, and episodes or chapters count.
 * When rendered as a Next.js `Link` (`as={Link}`), the card adds a dark overlay, a centered play button, and a bottom hover panel showing the title and genre badges.
 *
 * @param anime - The anime data used to populate the card (title, image, color, genres, type, status, relationType, episodes, chapters, etc.)
 * @param className - Optional additional CSS class names applied to the root element
 * @param as - Element or component to render as the root tag; defaults to `"div"`. When passing `Link`, hover overlay features are enabled.
 * @returns A JSX element representing the anime card UI
 */
export function AnimeCard({
  anime,
  className,
  as: Component = "div",
  ...props
}: IAnimeCardProps & { as?: "div" | typeof Link } & Partial<
    React.ComponentPropsWithRef<typeof Link>
  >) {
  const Tag = Component as any;
  return (
    <Tag {...props} className={cn("group relative block w-full", className)}>
      <Card className="relative aspect-2/3 w-full overflow-hidden rounded-xl bg-foreground/5 ring-1 ring-foreground/6 transition-all duration-300 group-hover:ring-foreground/20 group-hover:shadow-xl group-hover:shadow-black/30">
        <Image
          src={anime.image || getShimmerDataURL(anime.color || "#8bdfea")}
          alt={anime.title || "No Title"}
          placeholder="blur"
          blurDataURL={getShimmerDataURL(anime.color || "#8bdfea")}
          fill
          sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {Component === Link ? (
          <>
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/40" />

            {/*Play Button*/}
            <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg backdrop-blur-sm transition-transform duration-300 scale-75 group-hover:scale-100">
                <PlayIcon fill="currentColor" />
              </div>
            </div>

            {/* Hover Info */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end bg-linear-to-t from black/90 via-black/60 to-transparent p-3 pt-16 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="line-clamp-2 text-xs leading-snug text-white/90">
                {anime.title}
              </p>
              {anime.genres && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {anime.genres.map((genre) => (
                    <Badge key={genre} className="">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </Card>

      {/* Info Below */}
      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between">
          {anime.type && (
            <div className="flex items-center gap-1">
              <TvIcon className="size-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">
                {anime.type}
              </span>
            </div>
          )}
          {anime.status && (
            <Badge
              variant="outline"
              className="bg-primary text-primary-foreground text-[8px] h-4 px-1.5"
            >
              {anime.status}
            </Badge>
          )}
        </div>
        <h3 className="line-clamp-2 text-xs font-semibold text-foreground/90 group-hover:text-foreground">
          {anime.title}
        </h3>
        <div className="flex items-center justify-between">
          {anime.relationType && (
            <Badge
              variant="outline"
              className="bg-primary text-primary-foreground text-[8px] h-4 px-1.5"
            >
              {anime.relationType}
            </Badge>
          )}
          {anime.episodes ? (
            <span className="text-[10px] text-muted-foreground">
              {anime.episodes} EPS
            </span>
          ) : anime.chapters ? (
            <span className="text-[10px] text-muted-foreground">
              {anime.chapters} CHS
            </span>
          ) : null}
        </div>
      </div>
    </Tag>
  );
}

/**
 * Renders a skeleton placeholder that matches the layout of `AnimeCard`.
 *
 * Renders markup replicating the poster aspect ratio and the metadata rows below,
 * suitable for use while anime data is loading.
 *
 * @param className - Optional additional class names to apply to the outer wrapper.
 * @param props - Additional `div` element props are forwarded to the outer wrapper.
 * @returns A JSX element containing the card skeleton layout.
 */
export function AnimeCardSkeleton({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "basis-1/3 sm:basis-1/4 md:basis-1/5 pl-4 min-w-0 shrink-0 grow-0",
        className,
      )}
    >
      <div className="relative w-full">
        <Skeleton className="aspect-2/3 w-full rounded-xl" />

        {/* Info Below */}
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
