import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  reloadOnOnline: true,
  sw: '/sw.js',
  workboxOptions: {
    disableDevLogs: true,
    maximumFileSizeToCacheInBytes: 5000000,
  }
});

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // Disable ESLint during the build process
  },
  images: {
    loader: 'default',
    domains: ['firebasestorage.googleapis.com'], // Allowed domains for images
  },
  reactStrictMode: false,
  // Adding the headers configuration from next.config.js
  
  headers: async () => [
    {
      source: '/firebase-messaging-sw.js',
      headers: [
        {
          key: 'Service-Worker-Allowed',
          value: '/'
        }
      ]
    }
  ]

};

export default withPWA(nextConfig);