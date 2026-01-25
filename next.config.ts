import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vhsbuckets3.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "svh-bucket-s3.s3.eu-west-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["react-icons"],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
