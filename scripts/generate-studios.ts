import fs from "fs/promises";
import path from "path";

const anilist = "https://graphql.anilist.co";

interface Studio {
  id: number;
  name: string;
  isAnimationStudio: boolean;
}

interface PageResponse {
  data: {
    Page: {
      pageInfo: { hasNextPage: boolean };
      studios: Studio[];
    };
  };
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches all studios from the AniList GraphQL API by iterating through paginated results.
 *
 * The function pages through results until no more pages are available, applying short delays and periodic longer pauses to avoid exceeding rate limits. Retrieved items include each studio's `id`, `name`, and `isAnimationStudio` fields.
 *
 * @returns An array of `Studio` objects retrieved from AniList (each with `id`, `name`, and `isAnimationStudio`).
 */
async function fetchAllStudios(): Promise<Studio[]> {
  const studios: Studio[] = [];
  let page = 1;
  let hasNextPage = true;
  let requestsThisMinute = 0;

  while (hasNextPage) {
    if (requestsThisMinute >= 28) {
      console.log("Pausing for 90 seconds");
      await delay(90000);
      requestsThisMinute = 0;
    }
    const query = `
      query($page: Int) {
        Page(page: $page, perPage: 50) {
          pageInfo { hasNextPage }
          studios {
            id
            name
            isAnimationStudio
          }
        }
      }
    `;

    const response = await fetch(anilist, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { page } }),
    });
    if (!response.ok) {
      throw new Error(`AniList request failed: ${response.status}`);
    }

    const json = (await response.json()) as
      | PageResponse
      | { errors?: { message: string }[] };

    if (!("data" in json) || !json.data?.Page) {
      const message =
        "errors" in json && json.errors?.[0]?.message
          ? json.errors[0].message
          : "Unknown AniList API error";
      throw new Error(message);
    }

    studios.push(...json.data.Page.studios);
    hasNextPage = json.data.Page.pageInfo.hasNextPage;
    page++;
    requestsThisMinute++;

    console.log(`Fetched ${page - 1}, total studios: ${studios.length}`);
    await delay(500);
  }
  return studios;
}

async function updateVariable(items: Array<{ id: number; name: string }>) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "constants",
    "anilist",
    "enums.ts",
  );
  const variable = "studioEnums";

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");

    const objectRows = items.map((item) => {
      const name = JSON.stringify(item.name);
      return `  { id: ${item.id}, name: ${name} },`;
    });

    const formattedArray = `[\n${objectRows.join("\n")}\n] as const;`;
    const targetDeclaration = `export const ${variable} =`;

    const startIndex = fileContent.indexOf(targetDeclaration);
    if (startIndex === -1) {
      throw new Error(`Variable "${variable}" not found in the file.`);
    }

    const searchAfterStart = fileContent.substring(startIndex);
    const relativeIndex = searchAfterStart.indexOf("as const;");

    if (relativeIndex === -1) {
      throw new Error(
        "Could not find the closing 'as const;' marker to clean broken text.",
      );
    }

    const endIndex = startIndex + relativeIndex + "as const;".length;

    const updateContent =
      fileContent.substring(0, startIndex) +
      `${targetDeclaration} ${formattedArray}` +
      fileContent.substring(endIndex);

    await fs.writeFile(filePath, updateContent, "utf-8");
    console.log(`[v2] Saved ${items.length} studios to ${filePath}`);
  } catch (error) {
    throw error;
  }
}

async function main() {
  console.log("Fetching all animation studios...");
  const studios = await fetchAllStudios();
  const animationStudios = studios
    .filter((studio) => studio.isAnimationStudio)
    .map(({ id, name }) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // const outputPath = path.join(process.cwd(), "data", "animation-studios.json");
  // await fs.mkdir(path.dirname(outputPath), { recursive: true });
  // await fs.writeFile(outputPath, JSON.stringify(animationStudios, null, 2));
  //
  // console.log(`Saved ${animationStudios.length} studios to ${outputPath}`);

  await updateVariable(animationStudios);
}

main().catch(console.error);
