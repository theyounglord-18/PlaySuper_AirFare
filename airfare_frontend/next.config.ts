import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["airrf.s3.ap-south-1.amazonaws.com", "images.unsplash.com"],
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "**",
    //   },
    // ],
  },
};

export default nextConfig;
