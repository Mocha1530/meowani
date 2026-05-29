import type { Metadata } from "next";
import { cache } from "react";
import {
  AnimeInfoBanner,
  AnimeInfoBannerV2,
  AnimeInfoTabs,
  Characters,
} from "@/components/custom/anime-info";
import { EndOfContent } from "@/components/custom/end-of-content";

import { getAnimeInfo } from "./actions";
import { notFound } from "next/navigation";
import { capitalizeFirst, formatYearMonth, TitleSlug } from "@/utils/formatter";
import { AnimeInfoQuery, MediaEdge, Studio } from "@/types/anilist-types";
import { mapStatus, mapSimple, mapRelationType } from "@/utils/mapper";
import {
  AnimeCards,
  AnimeCardsEmpty,
} from "@/components/custom/anime-carousel";
import { Footer } from "@/components/custom/footer";
import { SourceApi } from "@/lib/api";

// const raw = await anilistRequest(animeInfo, { id: 180745 });
// const mapped = raw.Media.characters.edges.map((character) => {
//   const voiceActor = character.voiceActorRoles.map((actor) =>
//     console.log({
//       id: actor.voiceActor.id,
//       name: actor.voiceActor.name.userPreferred,
//       image: actor.voiceActor.image.large,
//     }),
//   );
//   return {
//     id: character.id,
//     role: character.role,
//     name: character.node.name.userPreferred,
//     image: character.node.image.large,
//     voiceActor: voiceActor,
//   };
// });

const getCachedAnime = cache(async (id: number) => {
  const anime = (await getAnimeInfo(id)) as AnimeInfoQuery;
  if (!anime?.Media) return null;
  if (anime?.Media?.type !== "ANIME") return null;
  if (anime?.Media?.format === "MUSIC") return null;
  return mapAdvanced(anime.Media);
});

/**
 * Renders the anime details page for a given route slug.
 *
 * If the route id cannot be parsed or the anime data is not available, triggers a 404 response.
 *
 * @param params - Promise resolving to an object with `animeId`, a route slug (e.g. "some-title-12345")
 * @returns The React element for the anime details page
 */

export default async function InfoPage({
  params,
}: {
  params: Promise<{ animeId: string }>;
}) {
  const { animeId } = await params;
  let id: number;
  try {
    id = new TitleSlug(animeId).getId();
  } catch {
    notFound();
  }

  const animeInfo = await getCachedAnime(id);
  if (!animeInfo) notFound();
  // throw new Error("Error test");

  return (
    <div className="min-w-0 max-h-dvh overflow-x-hidden overflow-y-scroll flex flex-1 shrink flex-col pt-0 gap-5 sm:gap-7">
      {/* <div className="w-screen max-w-full min-h-dvh overflow-x-hidden overflow-y-scroll pt-0"> */}
      <AnimeInfoBannerV2 data={animeInfo} />
      {/* <div className="flex flex-1 flex-col gap-5 sm:gap-7 md:gap-11"> */}
      <AnimeInfoTabs data={animeInfo} />
      {animeInfo.recommendations?.length > 0 ? (
        <AnimeCards
          animes={animeInfo.recommendations}
          label="Recommendations"
          paddingX="px-1.5 md:px-6 lg:px-12 xl:px-14"
        />
      ) : (
        <AnimeCardsEmpty
          label="Recommendations"
          message="No Recommendations"
          paddingX="px-1.5 md:px-6 lg:px-12 xl:px-14"
        />
      )}
      <EndOfContent />
      <Footer className="mt-auto" />
      {/* </div> */}
    </div>
  );
}

/**
 * Generate SEO metadata for an anime detail page based on the route `animeId`.
 *
 * @param params - A promise resolving to route parameters; must include `animeId` (slug or title-id string).
 * @returns A `Metadata` object with title, description, Open Graph and Twitter card data, and a canonical URL. If the anime cannot be resolved, returns metadata with title "Anime Not Found" and a brief not-found description.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ animeId: string }>;
}): Promise<Metadata> {
  const { animeId } = await params;
  let id: number;
  try {
    id = new TitleSlug(animeId).getId();
  } catch {
    return {
      title: "Anime Not Found",
      description: "Anime not found on MeowAni",
    };
  }

  const animeInfo = await getCachedAnime(id);
  if (!animeInfo) {
    return {
      title: "Anime Not Found",
      description: "Anime not found on MeowAni",
    };
  }

  const title = animeInfo.title.eng || animeInfo.title.romaji || "No Title";
  const description = truncateText(
    (animeInfo.description || "No Synopsis")
      .replace(/<[^>]*>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&"),
    160,
  );

  const api = new SourceApi().Assets;
  const card = api.card({
    title,
    season: animeInfo.season ? capitalizeFirst(animeInfo.season) : undefined,
    year: animeInfo.year,
    type: animeInfo.type,
    studios: animeInfo.studios,
    genres: animeInfo.genres,
    cover: animeInfo.image.extraLarge ?? animeInfo.image.large,
    episodes: animeInfo.episodes,
  });

  return {
    title: `${title}`,
    description,
    openGraph: {
      siteName: "MeowAni",
      title: `${title} | MeowAni`,
      description,
      images: [card],
      type: "video.tv_show",
      url: `https://meowani.site/library/anime/${animeId}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | MeowAni`,
      site: "MeowAni",
      description,
      images: [card],
    },
    alternates: {
      canonical: `https://meowani.site/library/anime/${animeId}`,
    },
  };
}

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
};

const mapAdvanced = (data: any) => {
  return {
    ...data,
    title: { eng: data.title?.english, romaji: data.title?.romaji },
    image: {
      large: data.coverImage?.large,
      extraLarge: data.coverImage?.extraLarge,
    },
    bannerImage: data.bannerImage || data.coverImage?.extraLarge,
    color: data.coverImage?.color,
    type: data.format,
    score: data.averageScore,
    year: data.seasonYear,
    studios: data.studios?.nodes?.map((studio: Studio) => studio.name),
    episodes: data.episodes ?? data.nextAiringEpisode?.episode,
    nextEpisode: {
      airing: data.nextAiringEpisode?.airingAt,
      episode: data.nextAiringEpisode?.episode,
    },
    releaseDate:
      data.startDate.year && data.startDate.month
        ? formatYearMonth(data.startDate.year, data.startDate.month)
        : null,
    endDate:
      data.endDate.year && data.endDate.month
        ? formatYearMonth(data.endDate.year, data.endDate.month)
        : null,
    trailer: {
      url: data.trailer?.id
        ? `https://youtube.com/watch?v=${data.trailer?.id}`
        : null,
      thumbnail: data.trailer?.thumbnail,
    },
    tags: data.tags
      .filter((tag: { isAdult: boolean; name: string }) => !tag.isAdult)
      .map((tag: { isAdult: boolean; name: string }) => tag.name),
    status: data.status ? mapStatus(data.status) : null,
    characters: data.characters?.edges ? mapChar(data.characters?.edges) : null,
    relations: data.relations?.edges
      ? mapRelations(data.relations?.edges)
      : null,
    recommendations: data.recommendations?.nodes
      ? mapSimple(data.recommendations?.nodes)
      : null,
  };
};

const mapChar = (chars: any[]) => {
  return chars.map((char) => {
    return {
      id: char.id,
      role: char.role,
      name: char.node?.name?.full,
      image: char.node?.image?.large,
    };
  });
};

const mapRelations = (relations: any[]) => {
  return relations.map((relation) => {
    const node = relation.node;
    const title = node.title.english || node.title.romaji;
    const id = TitleSlug.fromTitle(title, node.id).slug;

    return {
      relationType: mapRelationType(relation.relationType),
      id,
      title,
      type: node.format,
      status: mapStatus(node.status),
      image: node.coverImage?.large,
      color: node.coverImage?.color,
      episodes: node.episodes,
      chapters: node.chapters,
      media: node.type,
    };
  });
};

const mapRecommendations = (recommendations: any[]) => {
  return recommendations.map((recommendation) => {
    const media = recommendation.mediaRecommendation;
    return {};
  });
};

// relationType?: string;
// id: string;
// status?: string;
// image?: string;
// title: string;
// genres?: string[];
// type?: string;
// chapters?: number | string;
// episodes?: number | string;
// color?: string;
