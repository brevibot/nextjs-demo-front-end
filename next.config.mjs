/** @type {import('next').NextConfig} */
const nextConfig = {
  // The proxy for connecting to the backend during development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

export default nextConfig;