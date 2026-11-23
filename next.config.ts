import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/pangaea",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
