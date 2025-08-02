import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add a rewrite to proxy API requests to the Spring Boot backend
  // This avoids CORS issues and keeps the frontend code clean.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*', // Proxy to Spring Boot
      },
    ];
  },
};

export default nextConfig;