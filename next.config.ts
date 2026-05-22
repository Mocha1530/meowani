import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.156", "192.168.100.158"],
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
