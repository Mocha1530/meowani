export interface CardParams {
  title: string;
  season?: string;
  year?: string;
  type?: string;
  studios?: string[];
  genres?: string[];
  episodes?: string;
  cover?: string;
  banner?: string;
}

export class SourceApi {
  private readonly base = "https://source.meowani.site";

  public readonly HiAnime = {
    path: `${this.base}/anime/hianime`,
    search: (query: string) => `${this.HiAnime.path}/${query}`,
    getInfo: (id: string) => `${this.HiAnime.path}/info?id=${id}`,
    spotlight: () => `${this.HiAnime.path}/spotlight`,
    recentlyAdded: () => `${this.HiAnime.path}/recently-added`,
  };

  public readonly AnimePahe = {
    path: `${this.base}/anime/animepahe`,
    search: (query: string) => `${this.AnimePahe.path}/${query}`,
  };

  public readonly AnimeKai = {
    path: `${this.base}/anime/animekai`,
    search: (query: string) => `${this.AnimeKai.path}/${query}`,
    getInfo: (id: string) => `${this.AnimeKai.path}/info?id=${id}`,
  };

  public readonly Assets = {
    path: `${this.base}/assets`,
    card: (params: CardParams) => {
      const searchParams = new URLSearchParams();
      if (params.season) searchParams.set("season", params.season);
      if (params.year) searchParams.set("year", params.year);
      if (params.type) searchParams.set("mediaType", params.type);
      if (params.title) searchParams.set("title", params.title);
      if (params.studios && params.studios?.length >= 1)
        searchParams.set("studio", params.studios.join(", "));
      if (params.genres && params.genres?.length >= 1)
        searchParams.set("genre", params.genres.join(", "));
      if (params.cover) searchParams.set("imageUrl", params.cover);
      if (params.banner) searchParams.set("backgroundUrl", params.banner);
      if (params.episodes) searchParams.set("episodes", params.episodes);

      return `${this.Assets.path}/card?${searchParams}`;
    },
  };
}
