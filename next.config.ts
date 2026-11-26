import type { NextConfig } from "next";

// Default to the GitHub Pages subpath. PANGAEA_BASE_PATH=/ builds for a
// root-hosted deployment; both variants are checked in CI. See P3-3.
const raw = process.env.PANGAEA_BASE_PATH ?? "/pangaea";
const basePath = raw === "/" ? "" : raw;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
