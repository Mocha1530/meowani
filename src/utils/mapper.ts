import type {
  MediaStatus,
  MediaRelation,
  MediaFormat,
  Studio,
  Media,
} from "@/types/anilist-types";

export type TStatus =
  | "CANCELLED"
  | "FINISHED"
  | "HIATUS"
  | "UPCOMING"
  | "ONGOING"
  | "OTHER";

export interface ISimpleAnimeData {
  rank?: number;
  description?: string;
  relationType: string | null;
  id: string | null;
  title: string | null;
  image: string | null;
  banner?: string;
  color: string | null;
  type: string | null;
  status: TStatus | null;
  genres: string[] | [] | null;
  episodes: number | string | null;
  chapters: number | string | null;
  studios: string[] | [] | null;
}

export const mapStatus = (status: MediaStatus): TStatus => {
  switch (status) {
    case "NOT_YET_RELEASED":
      return "UPCOMING";
    case "RELEASING":
      return "ONGOING";
    default:
      return status;
  }
};

export const mapRelationType = (
  relationType: MediaRelation,
): MediaRelation | undefined => {
  if (!relationType) return;
  switch (relationType) {
    case "SPIN_OFF":
      return "Spin Off" as MediaRelation;
    case "SIDE_STORY":
      return "Side Story" as MediaRelation;
    default:
      return (relationType[0].toUpperCase() +
        relationType.slice(1).toLowerCase()) as MediaRelation;
  }
};

export const capitalize = (text: string): string => {
  return text[0].toUpperCase() + text.slice(1).toUpperCase();
};

export const mapMediaType = (type: MediaFormat): string => {
  switch (type) {
    case "ONE_SHOT":
      return "MANGA";
    case "TV_SHORT":
      return "SHORT";
    default:
      return type;
  }
};

interface MediaRecommendation {
  mediaRecommendation: {
    id: number;
    title: any;
    coverImage: string;
    episodes: number;
    status: string;
    format: string;
    nextAiringEpisode: any;
  };
}

export const mapSimple = (data: any[]): ISimpleAnimeData[] =>
  data
    .filter((anime): anime is any & MediaRecommendation => {
      return anime.mediaRecommendation !== null;
    })
    .map((anime, index) => {
      let animeData;
      if (anime.mediaRecommendation) {
        animeData = anime.mediaRecommendation;
      } else if (anime.node) {
        animeData = anime.node;
      } else animeData = anime;

      const title =
        animeData.title?.english || animeData.title?.romaji || animeData.title;
      const id = `${title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}-${animeData.id}`;
      const status = mapStatus(animeData.status);

      const relationType = animeData.relationType
        ? mapRelationType(animeData.relationType)
        : mapRelationType(anime.relationType);

      const type = animeData.format
        ? mapMediaType(animeData.format)
        : animeData.type
          ? mapMediaType(animeData.type)
          : null;

      return {
        relationType: relationType || null,
        rank: index + 1,
        id,
        title,
        image: animeData.coverImage?.large || animeData.image,
        banner: animeData.bannerImage,
        type,
        status: status ? (capitalize(status) as TStatus) : null,
        genres: animeData.genres,
        episodes: animeData.episodes,
        chapters: animeData.chapters,
        studios: animeData.studios
          ? animeData.studios.nodes?.map((studio: Studio) => studio.name)
          : null,
        color: animeData.coverImage?.color || animeData.color,
        description: animeData.description,
      };
    });
