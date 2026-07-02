"use client";

import * as React from "react";
import sanitizeHTML from "sanitize-html";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs as TabsPrimitive } from "radix-ui";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/shadcn/utils";
import Link from "next/link";
import {
  PlayIcon,
  PencilLineIcon,
  BookmarkIcon,
  Share2Icon,
  ClapperboardIcon,
  StarIcon,
  InfoIcon,
  LayersIcon,
  ChevronDown,
  Building2Icon,
  ExternalLinkIcon,
  XIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AnimeCard } from "@/components/custom/anime-card";
import { mapSimple } from "@/utils/mapper";
import { getShimmerDataURL } from "@/utils/placeholder";
import { DateFormatter, TitleSlug, truncateHTML } from "@/utils/formatter";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { SocialSharing } from "./social-sharing";

interface IAnimeInfoBannerProps {
  data: {
    id: number;
    image?: { large: string; extraLarge: string };
    color?: string;
    bannerImage?: string;
    title?: { eng?: string; romaji?: string };
    episodes?: number;
    type?: string;
    status?: string;
    season?: string;
    score?: number;
    genres: string[];
  };
}

/**
 * Render a responsive anime information hero/banner with background imagery, a cover modal, metadata badges (episodes/type/status/season/score), genres, and action controls.
 *
 * @param data - The banner data object containing images, color, titles, numeric/string metadata (episodes, type, status, season, score), and required `genres: string[]`. Used to populate images, badges, titles, genre links, and action targets.
 * @returns A React element representing the anime info banner section.
 */
export function AnimeInfoBanner({
  data,
  className,
  ...props
}: IAnimeInfoBannerProps & React.ComponentProps<"section">) {
  return (
    <section className={cn("w-full", className)} {...props}>
      <div className="relative min-h-[240px] md:min-h-[300px] lg:min-h-[360px] flex items-end">
        <Image
          src={
            data.bannerImage ||
            data.image?.large ||
            getShimmerDataURL(data.color || "#FFFFFF")
          }
          alt={data.title?.eng || "banner"}
          placeholder="blur"
          blurDataURL={getShimmerDataURL(data.color || "#8bdfea")}
          fill
          className="object-cover w-full aspect-video absolute inset-0 z-10"
        />
        <div className="absolute inset-0 z-11 bg-linear-to-t from-background from-20% via-background/80 via-60% to-transparent" />
        <div className="relative pointer-events-auto flex w-full flex-col items-center justify-center gap-6 px-4 pt-16 md:pt-24 md:px-10 xl:px-14 max-w-[1600px] z-20">
          <div className="flex w-full flex-col md:flex-row items-center gap-3 pt-4 md:pt-8 md:gap-5">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="group no-scale pt-0 relative h-[175px] w-[125px] shrink-0 overflow-hidden rounded-xl md:h-[256px] md:w-[180px]"
                  aria-label="View full size image"
                >
                  <Image
                    src={
                      data.image?.large ||
                      getShimmerDataURL(data.color || "#8bdfea")
                    }
                    alt={data.title?.eng || "cover"}
                    placeholder="blur"
                    blurDataURL={getShimmerDataURL(data.color || "#8bdfea")}
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
                    className="h-full w-full object-cover"
                  />
                </Button>
              </DialogTrigger>
              <DialogContent
                showCloseButton={false}
                className="max-w-[90vw] max-h-[90vh] p-0 border-0 border-none bg-transparent shadow-none w-auto md:w-full"
              >
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    className="flex rounded-xl h-auto ps-0 pe-0 px-0"
                  >
                    <Image
                      src={
                        data.image?.extraLarge ||
                        data.image?.large ||
                        getShimmerDataURL(data.color || "#8bdfea")
                      }
                      placeholder="blur"
                      blurDataURL={getShimmerDataURL(data.color || "#8bdfea")}
                      alt={data.title?.eng || "cover"}
                      className="size-auto md:size-full object-contain rounded-xl"
                      width={800}
                      height={1000}
                    />
                  </Button>
                </DialogClose>
                <VisuallyHidden>
                  <DialogTitle>Anime cover image</DialogTitle>
                  <DialogDescription>
                    The cover image of the current anime
                  </DialogDescription>
                </VisuallyHidden>
              </DialogContent>
            </Dialog>

            {/* Anime Info */}
            <div className="flex w-full flex-col items-start justify-end gap-2 md:gap-4">
              <div className="flex w-full flex-col gap-1 text-start md:gap-1.5 items-center md:items-start">
                {/* Stats */}
                <div className="hidden md:flex w-full flex-wrap gap-1.5 pt-0.5 md:gap-3 md:pt-1">
                  {/* Episode */}
                  {data.episodes && (
                    <Badge className="h-5 font-bold md:h-6 md:px-3.5 md:text-base">
                      {data.episodes} EPS
                    </Badge>
                  )}

                  {/* Type */}
                  {data.type && (
                    <Badge
                      className="h-5 font-bold md:h-6 md:px-3.5 md:text-base"
                      asChild
                    >
                      <Link href={`/browse?format=${data.type}`}>
                        {data.type}
                      </Link>
                    </Badge>
                  )}

                  {/* Status */}
                  {data.status && (
                    <Badge
                      className="h-5 font-bold md:h-6 md:px-3.5 md:text-base"
                      asChild
                    >
                      <Link href={`/browse?status=${data.status}`}>
                        {data.status}
                      </Link>
                    </Badge>
                  )}

                  {/* Season */}
                  {data.season && (
                    <Badge
                      className="hidden h-5 font-bold md:h-6 md:px-3.5 md:text-base lg:inline-flex capitalize"
                      asChild
                    >
                      <Link href={`/browse?season=${data.season}`}>
                        {data.season}
                      </Link>
                    </Badge>
                  )}

                  {/* Score */}
                  {data.score && (
                    <Badge
                      className="hidden font-bold h-5 md:h-6 md:px-3.5 md:text-base lg:inline-flex"
                      asChild
                    >
                      <Link href="/browse?sort=SCORE_DESC">{data.score}%</Link>
                    </Badge>
                  )}
                </div>

                <h2 className="line-clamp-1 hidden text-base font-light text-muted-foreground select-text md:block md:text-lg">
                  {data.title?.romaji}
                </h2>
                <h1 className="line-clamp-2 text-xl font-black select-text md:text-4xl text-center md:text-start">
                  {data.title?.eng || data.title?.romaji || "No Title"}
                </h1>

                {/* Genres */}
                {data.genres && (
                  <div className="flex flex-wrap items-center gap-2 md:justify-start md:self-start">
                    {data.genres.map((genre) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="hidden h-7 text-nowrap md:inline-flex"
                        asChild
                      >
                        <Link href={`/browse?genres=${genre}`}>{genre}</Link>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex md:hidden flex-wrap items-center justify-center gap-2">
                  {data.score && (
                    <Badge
                      variant="outline"
                      className="h-7 border-cyan-500/20 bg-cyan-500/10 text-cyan-500"
                    >
                      <StarIcon fill="currentColor" />
                      {data.score / 10}
                    </Badge>
                  )}
                  {data.status && (
                    <Badge variant="secondary" className="h-7">
                      {data.status}
                    </Badge>
                  )}
                  {data.episodes && (
                    <Badge variant="ghost" className="text-muted-foreground">
                      {data.episodes} Episodes
                    </Badge>
                  )}
                </div>

                <div className="md:justify-start gap-2 flex w-fit md:w-full items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2">
                  <ButtonGroup className="inline-flex items-center overflow-hidden">
                    {data.episodes && data.episodes >= 1 ? (
                      <Button className="md:h-10 md:px-3" asChild>
                        <Link
                          href={`/library/watch/${TitleSlug.fromTitle(data.title?.eng || data.title?.romaji || "No Title", data.id)}/episode-1`}
                        >
                          <PlayIcon fill="currentColor" />
                          Watch Now
                        </Link>
                      </Button>
                    ) : (
                      <Button className="md:h-10 md:px-3" disabled>
                        <PlayIcon fill="currentColor" />
                        Watch Now
                      </Button>
                    )}
                    <Button className="md:h-10 md:px-3">
                      <PencilLineIcon />
                    </Button>
                  </ButtonGroup>
                  <Button className="md:size-10">
                    <BookmarkIcon />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="md:size-10">
                        <Share2Icon />
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      showCloseButton={false}
                      className="p-0 gap-0"
                    >
                      <DialogClose asChild>
                        <Button
                          variant="ghost"
                          size="icon-lg"
                          className="absolute top-2 right-2 rounded-md p-1 text-zinc-500 hover:text-foreground transition-colors size-auto z-1"
                        >
                          <XIcon className="size-5 text-foreground" />
                        </Button>
                      </DialogClose>
                      <DialogHeader className="border-b px-5 pt-5 pb-4">
                        <DialogTitle className="flex items-center gap-2.5 text-base font-bold tracking-tight text-foreground">
                          <div className="flex size-8 items-center justify-center rounded-lg bg-white/8 ring-1 ring-white/10">
                            <ExternalLinkIcon className="size-4 text-white/70" />
                          </div>
                          {" Share Links"}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                          Share this anime to other social media platforms
                        </DialogDescription>
                      </DialogHeader>
                      <SocialSharing
                        title={`Watch ${data.title?.eng ?? data.title?.romaji} on MeowAni`}
                        url={`https://meowani.site/library/anime/${TitleSlug.fromTitle(data.title?.eng || data.title?.romaji || "No Title", data.id)}`}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AnimeInfoBannerV2({
  data,
  className,
  ...props
}: IAnimeInfoBannerProps & React.ComponentProps<"div">) {
  return (
    <section>
      <div className={cn("h-[550px] sm:h-[500px]", className)} {...props}>
        <div className="relative bottom-0 h-[350px]">
          <Image
            src={
              data.bannerImage ||
              data.image?.large ||
              getShimmerDataURL(data.color || "#FFFFFF")
            }
            alt={data.title?.eng || "banner"}
            placeholder="blur"
            blurDataURL={getShimmerDataURL(data.color || "#8bdfea")}
            fill
            className="object-cover object-center size-full absolute inset-0"
            fetchPriority="high"
          />
          <div className="absolute bottom-[-2px] left-0 h-[101%] w-full bg-linear-to-t from-background from-20% via-background/80 via-60% to-transparent" />
          <div
            className={cn(
              "absolute bottom-[-58%] left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-[-35%] sm:left-[2%] sm:translate-x-0 sm:flex-row sm:gap-6",
              "sm:left-1.5 md:left-6 lg:left-12 xl:left-14",
            )}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="group no-scale pt-0 relative h-[245px] w-[170px] shrink-0 overflow-hidden rounded-xl sm:h-[270px] sm:w-[180px] md:h-[300px] md:w-[200px]"
                  aria-label="View full size image"
                >
                  <Image
                    src={
                      data.image?.large ||
                      getShimmerDataURL(data.color || "#8bdfea")
                    }
                    alt={data.title?.eng || "cover"}
                    placeholder="blur"
                    blurDataURL={getShimmerDataURL(data.color || "#8bdfea")}
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
                    className="size-full object-cover"
                    fetchPriority="high"
                  />
                </Button>
              </DialogTrigger>
              <DialogContent
                showCloseButton={false}
                className="p-0 border-0 border-none bg-transparent shadow-none h-auto w-max"
              >
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    className="flex rounded-xl h-auto w-fit ps-0 pe-0 px-0 max-w-[90vw] max-h-[90vh]"
                  >
                    <Image
                      src={
                        data.image?.extraLarge ||
                        data.image?.large ||
                        getShimmerDataURL(data.color || "#8bdfea")
                      }
                      placeholder="blur"
                      blurDataURL={getShimmerDataURL(data.color || "#8bdfea")}
                      alt={data.title?.eng || "cover"}
                      className="size-auto max-h-[85vh] max-w-full rounded-xl object-contain"
                      width={800}
                      height={1000}
                      fetchPriority="high"
                    />
                  </Button>
                </DialogClose>
                <VisuallyHidden>
                  <DialogTitle>Anime cover image</DialogTitle>
                  <DialogDescription>
                    The cover image of the current anime
                  </DialogDescription>
                </VisuallyHidden>
              </DialogContent>
            </Dialog>

            {/* Anime Info */}
            <div className="flex max-w-[95%] flex-col px-4 sm:max-w-[400px] sm:self-center sm:px-0 md:max-w-[500px] xl:max-w-[700px]">
              {/* Stats */}
              <div className="hidden sm:flex w-max items-center justify-start flex-wrap gap-1.5 md:gap-3">
                {/* Episode */}
                {data.episodes &&
                  data.episodes >= 1 &&
                  data.status === "FINISHED" && (
                    <Badge className="h-5 font-bold md:h-6 md:px-3.5 md:text-base">
                      {data.episodes} EPS
                    </Badge>
                  )}

                {/* Type */}
                {data.type && (
                  <Badge
                    className="h-5 font-bold md:h-6 md:px-3.5 md:text-base"
                    asChild
                  >
                    <Link href={`/browse?format=${data.type}`}>
                      {data.type}
                    </Link>
                  </Badge>
                )}

                {/* Status */}
                {data.status && (
                  <Badge
                    className="h-5 font-bold md:h-6 md:px-3.5 md:text-base"
                    asChild
                  >
                    <Link href={`/browse?status=${data.status}`}>
                      {data.status}
                    </Link>
                  </Badge>
                )}

                {/* Season */}
                {data.season && (
                  <Badge
                    className="hidden h-5 font-bold md:h-6 md:px-3.5 md:text-base lg:inline-flex capitalize"
                    asChild
                  >
                    <Link href={`/browse?season=${data.season}`}>
                      {data.season}
                    </Link>
                  </Badge>
                )}

                {/* Score */}
                {data.score && (
                  <Badge
                    className="hidden font-bold h-5 md:h-6 md:px-3.5 md:text-base lg:inline-flex"
                    asChild
                  >
                    <Link href="/browse?sort=SCORE_DESC">{data.score}%</Link>
                  </Badge>
                )}
              </div>

              <h1 className="line-clamp-2 text-xl w-full font-bold tracking-tighter select-text text-[1.3rem] leading-7 text-center sm:text-left sm:text-[1.4rem] sm:leading-8 md:text-[1.5rem] lg:text-[1.7rem] lg:leading-10 xl:text-[1.9rem]">
                {data.title?.eng || data.title?.romaji || "No Title"}
              </h1>
              <h2 className="mt-0.5 line-clamp-2 hidden text-center text-[0.95rem] font-medium text-muted-foreground select-text sm:block sm:text-left">
                {data.title?.romaji}
              </h2>

              {/* Genres */}
              {data.genres && (
                <div className="hidden mt-2.5 mb-2.5 sm:flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  {data.genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant="secondary"
                      className="size-auto px-2.5 py-1 text-[0.8rem] font-semibold tracking-wide text-nowrap"
                      asChild
                    >
                      <Link href={`/browse?genres=${genre}`}>{genre}</Link>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mt-2 mb-2.5 flex sm:hidden flex-wrap items-center justify-center gap-2">
                {data.score ? (
                  <Badge
                    variant="outline"
                    className="size-auto px-2.5 py-1 text-[0.8rem] font-semibold border-cyan-500/20 bg-cyan-500/10 text-cyan-500"
                  >
                    <StarIcon fill="currentColor" />
                    {data.score / 10}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="size-auto px-2.5 py-1 text-[0.8rem] font-semibold border-muted-foreground/20 bg-muted-foreground/10 text-muted-foreground"
                  >
                    <StarIcon fill="currentColor" />
                    {"N/A"}
                  </Badge>
                )}
                {data.status && (
                  <Badge
                    variant="secondary"
                    className="size-auto px-2.5 py-1 text-[0.8rem] font-semibold uppercase tracking-wide text-nowrap bg-emerald-500/20 text-emerald-300"
                  >
                    {data.status}
                  </Badge>
                )}
                {data.episodes &&
                  data.episodes > 1 &&
                  data.status === "FINISHED" && (
                    <Badge
                      variant="ghost"
                      className="size-auto px-2.5 py-1 text-[0.8rem] font-medium text-normal text-muted-foreground/60"
                    >
                      {data.episodes} Episodes
                    </Badge>
                  )}
              </div>

              <div className="sm:justify-start gap-3 flex w-max items-center *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2">
                <ButtonGroup className="inline-flex items-center overflow-hidden">
                  {data.episodes && data.episodes >= 1 ? (
                    <Button
                      className="size-auto md:h-10 px-3 py-1.5 font-medium"
                      asChild
                    >
                      <Link
                        href={`/library/watch/${TitleSlug.fromTitle(data.title?.eng || data.title?.romaji || "No Title", data.id)}/1`}
                      >
                        <PlayIcon fill="currentColor" className="size-5" />
                        Watch Now
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      className="size-auto md:h-10 px-3 py-1.5 font-medium"
                      disabled
                    >
                      <PlayIcon fill="currentColor" className="size-5" />
                      Watch Now
                    </Button>
                  )}
                  <Button className="size-auto md:h-10 px-3 py-1.5">
                    <PencilLineIcon className="size-5" />
                  </Button>
                </ButtonGroup>
                <Button className="size-auto md:h-10 px-3 py-1.5">
                  <BookmarkIcon className="size-5" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="size-auto md:h-10 px-3 py-1.5">
                      <Share2Icon className="size-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent showCloseButton={false} className="p-0 gap-0">
                    <DialogClose asChild>
                      <Button
                        variant="ghost"
                        size="icon-lg"
                        className="absolute top-2 right-2 rounded-md p-1 text-zinc-500 hover:text-foreground transition-colors size-auto z-1"
                      >
                        <XIcon className="size-5 text-foreground" />
                      </Button>
                    </DialogClose>
                    <DialogHeader className="border-b px-5 pt-5 pb-4">
                      <DialogTitle className="flex items-center gap-2.5 text-base font-bold tracking-tight text-foreground">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-white/8 ring-1 ring-white/10">
                          <ExternalLinkIcon className="size-4 text-white/70" />
                        </div>
                        {" Share Links"}
                      </DialogTitle>
                      <DialogDescription className="sr-only">
                        Share this anime to other social media platforms
                      </DialogDescription>
                    </DialogHeader>
                    <SocialSharing
                      title={`Watch ${data.title?.eng ?? data.title?.romaji} on MeowAni`}
                      url={`https://meowani.site/library/anime/${TitleSlug.fromTitle(data.title?.eng || data.title?.romaji || "No Title", data.id)}`}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Renders a tabbed interface with Overview, Relations, and Characters panels for a given anime.
 *
 * @param data - Anime data used to populate the panels. Must include `relations` and `characters` arrays and any fields consumed by the Overview panel (e.g., synopsis, nextEpisode, studios, tags, externalLinks).
 * @param className - Optional additional CSS classes applied to the root Tabs container.
 * @returns A React element containing a Tabs control with Overview, Relations, and Characters content derived from `data`.
 */
export function AnimeInfoTabs({
  data,
  className,
  ...props
}: { data: any } & React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <Tabs
      className={cn(
        "px-1.5 md:px-6 lg:px-12 xl:px-14 gap-4 sm:gap-6",
        className,
      )}
      defaultValue="overview"
      orientation="horizontal"
      {...props}
    >
      <TabsList className="group-data-horizontal/tabs:h-10 h-10 bg-white/3 border ring-ring w-fit p-1 gap-0.5">
        <TabsTrigger
          value="overview"
          className="text-primary-foreground/60 hover:text-primary-foreground dark:hover:text-primary-foreground data-active:bg-primary data-active:text-primary-foreground dark:data-active:bg-primary dark:data-active:text-primary-foreground data-active:border-transparent dark:data-active:border-transparenti px-3.5 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm font-semibold transition-colors duration-300 ease-in-out"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="relations"
          className="text-primary-foreground/60 hover:text-primary-foreground dark:hover:text-primary-foreground data-active:bg-primary data-active:text-primary-foreground dark:data-active:bg-primary dark:data-active:text-primary-foreground data-active:border-transparent dark:data-active:border-transparenti px-3.5 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm font-semibold transition-colors duration-300 ease-in-out"
        >
          Relations
        </TabsTrigger>
        <TabsTrigger
          value="characters"
          className="text-primary-foreground/60 hover:text-primary-foreground dark:hover:text-primary-foreground data-active:bg-primary data-active:text-primary-foreground dark:data-active:bg-primary dark:data-active:text-primary-foreground data-active:border-transparent dark:data-active:border-transparenti px-3.5 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm font-semibold transition-colors duration-300 ease-in-out"
        >
          Characters
        </TabsTrigger>
      </TabsList>
      <div className="transition-all duration-300">
        <TabsContent
          value="overview"
          className="space-y-3 rounded-md text-foreground/90 shadow-sm lg:space-y-6"
        >
          <Overview items={data} />
        </TabsContent>
        <TabsContent value="relations">
          <Relations items={data.relations} />
        </TabsContent>
        <TabsContent value="characters">
          <Characters items={data.characters} />
        </TabsContent>
      </div>
    </Tabs>
  );
}

interface IOverviewProps {
  items: {
    id: number;
    releaseDate: string | null;
    endDate: string | null;
    nextEpisode: { airing: number | null; episode: number | null };
    trailer: { url: string | null; thumbnail: string | null };
    type: string | null;
    status: string | null;
    description: string;
    studios: string[];
    genres: string[];
    tags: string[];
    synonyms: string[];
    externalLinks: { site: string; url: string }[];
  };
}

/**
 * Renders the overview panel for an anime, including airing info, metadata, synopsis, studios, synonyms, genres, external tracking links, and tags.
 *
 * @param items - Anime overview data. Expected fields used: `id`, `description`, `type`, `releaseDate`, `endDate`, `nextEpisode` (with `airing` and `episode`), `trailer` (with `url`), `studios`, `synonyms`, `genres`, `externalLinks` (array of `{ url, site }`), and `tags` (string[]).
 * @returns The rendered overview JSX element for the provided anime data.
 */
function Overview({
  items,
  className,
  ...props
}: IOverviewProps & Omit<React.ComponentPropsWithoutRef<"div">, "children">) {
  const date = items.nextEpisode.airing
    ? new DateFormatter(items.nextEpisode.airing)
    : null;
  const synopsis = truncateHTML(
    sanitizeHTML(items.description || "<i>No Synopsis</i>", {
      allowedTags: ["i", "b", "em", "strong", "br", "p", "span"],
      allowedAttributes: {},
    }),
    200,
  );
  const [tagExpanded, setTagExpanded] = React.useState(false);
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-stretch lg:gap-6",
        className,
      )}
      {...props}
    >
      <ItemGroup className="flex h-full flex-col space-y-3 rounded-md text-foreground/90 lg:col-span-8 gap-0">
        {date && (
          <Item
            variant="outline"
            className="border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm text-foreground/80"
          >
            <ItemContent className="flex-row gap-2">
              <span className="font-medium text-foreground">
                Episode {items.nextEpisode.episode}
              </span>
              <span suppressHydrationWarning>airing {date?.diff}</span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/50" suppressHydrationWarning>
                {date?.formattted}
              </span>
            </ItemContent>
          </Item>
        )}
        <Item
          variant="outline"
          className="flex-row items-center bg-white/3 text-foreground/80 px-3 py-2 gap-2 sm:gap-3 lg:px-4"
        >
          <ItemContent className="flex-row gap-2 flex-none">
            <div className="rounded-md border focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 border-border px-3 py-1.5 text-xs font-medium text-foreground/80 bg-input/30">
              {items.type ?? "TV"}
            </div>
            {items.releaseDate && (
              <div className="rounded-md border focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 border-border px-3 py-1.5 text-xs font-medium text-foreground/70 bg-input/30">
                {items.status?.toUpperCase() === "UPCOMING"
                  ? "Airing "
                  : "Aired "}
                {items.releaseDate}
                {items.endDate ? ` - ${items.endDate}` : ""}
              </div>
            )}
          </ItemContent>
          <ItemActions className="ml-auto">
            {items.trailer.url && (
              <Button
                variant="outline"
                className="items-center h-fit gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-foreground/90 transition-all duration-200"
                disabled={
                  items.trailer.url === null || items.trailer.url === undefined
                }
                asChild
              >
                <Link
                  href={items.trailer.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-background">
                    <PlayIcon fill="currentColor" />
                  </span>
                  Trailer
                </Link>
              </Button>
            )}
          </ItemActions>
        </Item>
        <Collapsible className="group/synopsis h-full">
          <Item
            variant="outline"
            className="flex min-h-0 flex-col gap-0 bg-white/3 p-3 lg:h-full lg:flex-1 lg:p-4 lg:md:p-5"
          >
            <h3 className="mb-2 w-full flex items-center gap-2 text-[10px] font-medium tracking-widest text-muted-foreground/50 uppercase lg:mb-3">
              <InfoIcon size={12} />
              Synopsis
            </h3>
            <ItemContent className="prose prose-invert prose-sm max-w-none w-full flex-1 overflow-auto text-sm leading-relaxed font-normal text-foreground/75 [&_p]:my-1 [&_p]:text-sm">
              {synopsis.truncated ? (
                <>
                  <span
                    className="group-data-[state=open]/synopsis:hidden lg:hidden"
                    dangerouslySetInnerHTML={{ __html: synopsis.truncated }}
                  />
                  <span
                    className="hidden group-data-[state=open]/synopsis:block lg:block"
                    dangerouslySetInnerHTML={{ __html: synopsis.full }}
                  />
                </>
              ) : (
                <span
                  className="group-data-[state=open]/synopsis:block lg:block"
                  dangerouslySetInnerHTML={{ __html: synopsis.full }}
                />
              )}
            </ItemContent>
            {synopsis.truncated && (
              <ItemActions className="w-full">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-secondary mt-2 text-[10px] font-medium tracking-widest uppercase transition-all duration-200 w-full px-3 py-1.5 text-foreground/60 h-fit lg:hidden"
                  >
                    <span className="group-data-[state=open]/synopsis:hidden text-foreground/60">
                      Read more
                    </span>
                    <span className="text-foreground/60 group-data-[state=closed]/synopsis:hidden">
                      Read less
                    </span>
                  </Button>
                </CollapsibleTrigger>
              </ItemActions>
            )}
          </Item>
        </Collapsible>
      </ItemGroup>
      <aside className="h-full lg:col-span-4">
        <Collapsible className="h-full group">
          <Item
            variant="outline"
            className="h-full overflow-auto p-3 lg:p-4 bg-white/3 items-start"
          >
            <ItemActions className="w-full lg:hidden">
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full uppercase transition-all duration-200 px-3 py-2 flex justify-between text-left gap-2 border-none"
                >
                  <span className="flex items-center gap-2 text-[10px] font-medium tracking-widest text-foreground/40 uppercase">
                    <LayersIcon size={12} />
                    <span className="group-data-[state=open]:hidden">
                      Show more info
                    </span>
                    <span className="group-data-[state=closed]:hidden">
                      Hide info
                    </span>
                  </span>
                  <ChevronDown
                    size={14}
                    className="shrink-0 text-foreground/40 transition-transform duration-200 group-data-[state=open]/button:rotate-180"
                  />
                </Button>
              </CollapsibleTrigger>
            </ItemActions>
            <ItemContent className="group-data-[state=closed]:hidden lg:group-data-[state=open]:block lg:group-data-[state=closed]:block space-y-4">
              {/* Studios */}
              <div>
                <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium tracking-widest text-muted-foreground/50 uppercase">
                  <Building2Icon size={11} />
                  Studios
                </div>
                {items.studios && items.studios.length >= 1 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {items.studios.map((studio) => (
                      <Badge
                        key={studio}
                        variant="outline"
                        className="bg-white/5 px-2.5 py-0 text-[11px] text-foreground/65 transition font-normal"
                      >
                        {studio}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant="outline"
                      className="bg-white/5 px-2.5 py-0 text-[11px] text-foreground/65 transition font-normal"
                    >
                      No data
                    </Badge>
                  </div>
                )}
              </div>

              {/* Synonyms */}
              <div>
                <p className="mb-1.5 text-[10px] font-medium tracking-widest text-muted-foreground/50 uppercase">
                  Synonyms
                </p>
                {items.synonyms && items.synonyms.length >= 1 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {items.synonyms.map((synonym) => (
                      <Badge
                        key={synonym}
                        variant="outline"
                        className="bg-white/5 px-2.5 py-0.5 h-auto text-[11px] text-foreground/65 transition font-normal whitespace-normal"
                      >
                        {synonym}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant="outline"
                      className="bg-white/5 px-2.5 py-0 text-[11px] text-foreground/65 transition font-normal"
                    >
                      No data
                    </Badge>
                  </div>
                )}
              </div>

              {/* Genres */}
              <div>
                <p className="mb-1.5 text-[10px] font-medium tracking-widest text-muted-foreground/50 uppercase">
                  Genres
                </p>
                {items.genres && items.genres.length >= 1 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {items.genres.map((genre) => (
                      <Badge
                        key={genre}
                        variant="outline"
                        className="bg-white/5 px-2.5 py-0 text-[11px] text-foreground/65 transition font-normal"
                        asChild
                      >
                        <Link href={`/browse?genres=${genre}`}>{genre}</Link>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant="outline"
                      className="bg-white/5 px-2.5 py-0 text-[11px] text-foreground/65 transition font-normal"
                    >
                      No data
                    </Badge>
                  </div>
                )}
              </div>

              {/* External site */}
              <div>
                <p className="mb-1.5 text-[10px] font-medium tracking-widest text-muted-foreground/50 uppercase">
                  Track on
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge
                    key="anilist"
                    variant="outline"
                    className="bg-white/5 px-2.5 py-0 text-[11px] text-foreground/65 transition font-normal"
                    asChild
                  >
                    <Link
                      href={`https://anilist.co/anime/${items.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Anilist
                    </Link>
                  </Badge>
                  {items.externalLinks?.map((link) => (
                    <Badge
                      key={link.url}
                      variant="outline"
                      className="bg-white/5 px-2.5 py-0 text-[11px] text-foreground/65 transition font-normal"
                      asChild
                    >
                      <Link
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.site}
                      </Link>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="mb-1.5 text-[10px] font-medium tracking-widest text-muted-foreground/50 uppercase">
                  Tags
                </p>
                {items.tags && items.tags.length >= 1 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {(tagExpanded ? items.tags : items.tags.slice(0, 10)).map(
                      (tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="bg-white/5 px-2.5 py-0 text-[11px] text-foreground/65 transition font-normal"
                          asChild
                        >
                          <Link href={`/browse?tags=${tag}`}>{tag}</Link>
                        </Badge>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant="outline"
                      className="bg-white/5 px-2.5 py-0 text-[11px] text-foreground/65 transition font-normal"
                    >
                      No data
                    </Badge>
                  </div>
                )}
                {items.tags.length > 10 && (
                  <Button
                    variant="ghost"
                    onClick={() => setTagExpanded(!tagExpanded)}
                    className="mt-2 text-[10px] font-medium tracking-widest text-muted-foreground/55 uppercase transition p-0 size-fit"
                  >
                    {tagExpanded
                      ? "Show less"
                      : `+${items.tags.length - 10} more`}
                  </Button>
                )}
              </div>
            </ItemContent>
          </Item>
        </Collapsible>
      </aside>
    </div>
  );
}

interface RelationsProps {
  items: {
    relationType: string | null;
    id: string;
    status: string | null;
    image: string | null;
    title: string;
    genres: string[] | [] | null;
    type: string | null;
    chapters: number | string | null;
    episodes: number | string | null;
    color: string | null;
    media: "ANIME" | "MANGA";
  }[];
}

/**
 * Render a filterable carousel of related media grouped by relation type.
 *
 * Shows relation-type filter buttons when multiple relation groups exist and a draggable carousel of corresponding `AnimeCard` tiles; displays a dashed "No Relations" placeholder when no items are available.
 *
 * @param items - Array of relation entries to display; each entry should include `id` and `relationType`. `media` and `type` influence whether a card is rendered as a link.
 * @returns A container element that includes optional filter controls and a carousel of related entries, or a placeholder when the list is empty.
 */
function Relations({
  items,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"div">, "children"> & RelationsProps) {
  const relations = React.useMemo(() => {
    const uniqueRelations = Array.from(
      new Set(items.map((item) => item.relationType)),
    );
    return ["All", ...uniqueRelations];
  }, [items]);

  const [activeFilter, setActiveFilter] = React.useState("All");

  const filteredItems = React.useMemo(() => {
    if (activeFilter === "All") return items;
    return items.filter((item) => item.relationType === activeFilter);
  }, [items, activeFilter]);

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {filteredItems.length >= 1 ? (
        <>
          {relations.length > 2 && (
            <div className="flex flex-wrap gap-2 items-center">
              {relations.map((type) => (
                <Button
                  key={type}
                  variant={activeFilter === type ? "default" : "outline"}
                  data-active={activeFilter === type}
                  onClick={() => setActiveFilter(type!)}
                  className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all duration-200 data-[active=false]:bg-white/3 data-[active=false]:text-foreground/60 size-fit"
                >
                  {type}
                </Button>
              ))}
            </div>
          )}

          <Carousel
            opts={{ align: "center", dragFree: true }}
            className={cn("w-full", relations.length > 2 && "mt-3")}
          >
            <CarouselContent className="min-w-0">
              {filteredItems.map((item) => {
                const href = `/library/anime/${item.id}`;
                const anime = {
                  ...item,
                  relationType: mapType(item.relationType!),
                  status: null,
                };
                const isLink =
                  item.media === "ANIME" &&
                  item.type?.toLowerCase() !== "music";

                return (
                  <CarouselItem
                    key={item.id}
                    className="basis-1/3 md:basis-1/5 lg:basis-1/6 min-w-0 shrink-0 grow-0"
                  >
                    <AnimeCard
                      anime={anime}
                      href={isLink ? href : undefined}
                      as={isLink ? Link : "div"}
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            {filteredItems.length > 3 && (
              <div className="flex justify-end gap-2 mt-4">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
            )}
          </Carousel>
        </>
      ) : (
        <section className="w-full">
          <div className={cn("min-w-0")}>
            <div className="flex items-center justify-center min-h-[200px] md:min-h-[280px] rounded-xl bg-muted/20 border border-dashed border-muted-foreground/25">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">No Relations</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

const mapType = (type: string) => {
  switch (type.toLowerCase()) {
    case "alternative":
      return "ALT";
    default:
      return type;
  }
};

export interface ICharactersProps {
  items: {
    id: number | string;
    role: string;
    name: string;
    image: string;
  }[];
}

/**
 * Renders a horizontal carousel of character cards.
 *
 * Each character in `items` is converted into an `AnimeCard`-compatible shape (the character's `name` becomes the card title, `role` becomes the card status, and `id` is used as the card id) and displayed as a carousel cell.
 *
 * @param items - Array of character entries to render.
 * @param className - Optional additional CSS classes applied to the wrapper.
 * @returns A React element containing a carousel of character cards.
 */
export function Characters({
  items,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"div">, "children"> & ICharactersProps) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      <h2 className="text-2xl font-bold text-foreground tracking-tight">
        {"Main Cast & Supporting"}
      </h2>
      {items.length >= 1 ? (
        <Carousel opts={{ align: "center", dragFree: true }} className="w-full">
          <CarouselContent className="min-w-0">
            {items.map((item) => {
              const anime = {
                ...item,
                status: item.role,
                title: item.name,
                id: item.id as string,
                genres: null,
                color: null,
                episodes: null,
                chapters: null,
                relationType: null,
                type: null,
              };

              return (
                <CarouselItem
                  key={item.id}
                  className="basis-1/3 md:basis-1/5 lg:basis-1/6 min-w-0 shrink-0 grow-0"
                >
                  <AnimeCard anime={anime} />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          {items.length > 3 && (
            <div className="flex justify-end gap-2 mt-4">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          )}
        </Carousel>
      ) : (
        <section className="w-full">
          <div className={cn("min-w-0")}>
            <div className="flex items-center justify-center min-h-[200px] md:min-h-[280px] rounded-xl bg-muted/20 border border-dashed border-muted-foreground/25">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">No Characters</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export function AnimeEpisodes() {
  return <>d</>;
}

export function AnimeInfoBannerSkeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <section>
      <div className={cn("h-[550px] sm:h-[500px]")} {...props}>
        <div className="relative bottom-0 h-[350px]">
          {/* Banner Background */}
          <Skeleton className="absolute size-full inset-0" />
          <div className="absolute bottom-[-2px] left-0 h-[101%] w-full bg-linear-to-t from-background from-20% via-background/80 via-60% to-transparent" />

          <div
            className={cn(
              "absolute bottom-[-58%] left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-[-35%] sm:left-[2%] sm:translate-x-0 sm:flex-row sm:gap-6",
              "sm:left-1.5 md:left-6 lg:left-12 xl:left-14",
            )}
          >
            {/* Cover Image */}
            <Skeleton className="h-[245px] w-[170px] shrink-0 rounded-xl sm:h-[270px] sm:w-[180px] md:h-[300px] md:w-[200px]" />

            {/* Info Section */}
            <div className="flex max-w-[95%] flex-col px-4 sm:max-w-[400px] sm:self-center sm:px-0 md:max-w-[500px] xl:max-w-[700px] gap-1 sm:gap-1.5">
              {/* Stats */}
              <div className="hidden sm:flex w-max items-center justify-start flex-wrap gap-1.5 md:gap-3">
                <Skeleton className="h-5 w-16 rounded-full md:h-6" />
                <Skeleton className="h-5 w-12 rounded-full md:h-6" />
                <Skeleton className="h-5 w-20 rounded-full md:h-6" />
                <Skeleton className="hidden lg:block h-5 w-16 rounded-full md:h-6" />
              </div>

              {/* Main Title */}
              <Skeleton className="h-[1.3rem] sm:h-[1.4rem] md:h-[1.5rem] lg:h-[1.7rem] xl:h-[1.9rem] w-64 md:h-10 md:w-96" />

              {/* Romaji Title */}
              <Skeleton className="hidden sm:block h-[0.95rem] w-48 md:w-64" />

              {/* Genres */}
              <div className="hidden sm:flex mt-1.5 mb-1.5 sm:mt-1 sm:mb-1 flex-wrap items-center justify-start gap-2">
                <Skeleton className="h-7 w-16 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-14 rounded-full" />
                <Skeleton className="h-7 w-18 rounded-full" />
              </div>

              {/* Badges */}
              <div className="mt-1.5 mb-1.5 flex sm:hidden flex-wrap items-center justify-center gap-2">
                <Skeleton className="h-7 w-14 rounded-full" />
                <Skeleton className="h-7 w-[72px] rounded-full" />
                <Skeleton className="h-7 w-[76px] rounded-full" />
              </div>

              {/* Actions */}
              <div className="sm:justify-start gap-3 flex w-max items-center">
                <Skeleton className="h-8 md:h-10 w-40 rounded-md" />
                <Skeleton className="size-8 md:size-10 rounded-md" />
                <Skeleton className="size-8 md:size-10 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AnimeInfoTabsSkeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "px-1.5 md:px-6 lg:px-12 xl:px-14 flex flex-col gap-4 sm:gap-6",
        className,
      )}
      {...props}
    >
      {/* Tab Triggers */}
      <div className="flex gap-0.5 p-1 sm:p-1.5 bg-white/3 border rounded-lg w-fit">
        <Skeleton className="h-8 w-20 rounded-md sm:w-24" />
        <Skeleton className="h-8 w-20 rounded-md sm:w-24" />
        <Skeleton className="h-8 w-24 rounded-md sm:w-28" />
      </div>

      {/* Tab Content - default */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-stretch lg:gap-6">
        {/* Main Content Area */}
        <div className="flex flex-col space-y-3 lg:col-span-8 gap-0">
          {/* Next Episode */}
          <Skeleton className="h-10 w-full rounded-lg" />

          {/* Type And Date */}
          <div className="flex items-center gap-2 sm:gap-3 p-3 lg:p-4 rounded-lg border bg-white/3">
            <Skeleton className="h-7 w-12 rounded-md" />
            <Skeleton className="h-7 w-32 rounded-md" />
            <Skeleton className="ml-auto h-9 w-24 rounded-full" />
          </div>

          {/* Synopsis */}
          <div className="p-3 lg:p-4 rounded-lg border bg-white/3 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="size-3 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col space-y-3 lg:col-span-4 h-full">
          <div className="p-3 lg:p-4 rounded-lg border bg-white/3 space-y-4 h-full">
            {/* Studios */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="size-3 rounded" />
                <Skeleton className="h-3 w-14" />
              </div>
              <Skeleton className="h-5 w-32" />
            </div>

            {/* Genres */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="size-3 rounded" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="size-3 rounded" />
                <Skeleton className="h-3 w-8" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-18 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
