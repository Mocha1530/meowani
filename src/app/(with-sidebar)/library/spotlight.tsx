import type { ISpotlight } from "@/types/library";

import SpotlightClient from "@/components/custom/spotlight.wrapper";
import { SourceApi } from "@/lib/api";

const api = new SourceApi();

/**
 * Fetches HiAnime spotlight entries, replaces each item's final ID segment with the corresponding AniList ID, and renders the SpotlightClient with the updated items.
 *
 * On error, logs the failure and returns a fallback fragment containing "Banana".
 *
 * @returns The rendered SpotlightClient component populated with the formatted spotlight items, or a fallback fragment on error.
 */
export async function SpotlightComponent() {
  try {
    const raw = await fetch(api.HiAnime.spotlight(), {
      next: { revalidate: 86400 },
    });
    const { results } = await raw.json();
    console.log(raw);

    const formatted = await Promise.all(
      results.map(async (item: ISpotlight) => {
        const { malID, alID } = await getItem(item.id);

        return {
          ...item,
          id: `${item.id.split("-").slice(0, -1).join("-")}-${alID}`,
        };
      }),
    );

    return <SpotlightClient items={formatted} />;
  } catch (error) {
    console.error("[SpotlightFormatter] Error processing spotlight", error);
    return <>Banana</>;
  }
}

/**
 * Fetches canonical external IDs for a spotlight item from the HiAnime info endpoint.
 *
 * Retrieves the MyAnimeList ID and AniList ID for the given spotlight `id`.
 *
 * @param id - The spotlight item identifier used to query the HiAnime info API
 * @returns An object containing `malID` (MyAnimeList ID) and `alID` (AniList ID)
 */
async function getItem(id: string) {
  const req = await fetch(api.HiAnime.getInfo(id), {
    next: { revalidate: 86400 },
  });
  const { malID, alID } = await req.json();

  return { malID, alID };
}
