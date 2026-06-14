import { MetadataRoute } from "next";

/**
 * Provide robots metadata for the site, specifying crawler rules and sitemap location.
 *
 * The configuration applies to all user agents, explicitly allows access to selected
 * site paths (homepage, assets, images, Next.js static files, library and browse pages)
 * and disallows the root path. It also sets the sitemap URL.
 *
 * @returns A `MetadataRoute.Robots` object containing the site's crawl `rules` and `sitemap` URL.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/$",
        "/assets/*",
        "/favicon.ico",
        "/sitemap.xml",
        "/~/image",
        "/_next/static/*",
        "/library",
        "/library/anime/*",
        "/library/watch/*",
        "/browse",
      ],
      disallow: "/",
    },
    sitemap: "https://meowani.site/sitemap.xml",
  };
}
