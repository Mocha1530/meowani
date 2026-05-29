import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS
    ? process.env.ALLOWED_DEV_ORIGINS.split(",")
    : [],
  cacheComponents: true,
  images: {
    // unoptimized: true,
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.anilist.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.noitatnemucod.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withSerwist(nextConfig);
