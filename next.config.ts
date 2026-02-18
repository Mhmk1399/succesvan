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
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.eu-west-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["react-icons"],
  },
  compress: true,
  poweredByHeader: false,
  
  // Turbopack configuration (required for Next.js 16+)
  turbopack: {},
};

// PWA Configuration - only for webpack build
const withPWA = (config: NextConfig): NextConfig => {
  // Dynamic import to avoid webpack-only code in Turbopack
  if (process.env.TURBOPACK) {
    console.log('PWA disabled in Turbopack mode');
    return config;
  }

  try {
    const nextPWA = require("next-pwa");
    return nextPWA({
      dest: "public",
      register: true,
      skipWaiting: true,
      disable: process.env.NODE_ENV === "development",
      runtimeCaching: [
        {
          urlPattern: /^https?.*\/api\/.*/i,
          handler: "NetworkFirst",
          options: {
            cacheName: "api-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https?.*\.(png|jpg|jpeg|svg|gif|webp|avif)/i,
          handler: "CacheFirst",
          options: {
            cacheName: "image-cache",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https?.*\.(js|css|woff|woff2|ttf|eot)/i,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "static-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https?.*/i,
          handler: "NetworkFirst",
          options: {
            cacheName: "pages-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    })(config);
  } catch (e) {
    console.log('PWA not available:', e);
    return config;
  }
};

export default withPWA(nextConfig);
