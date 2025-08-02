/** @type {import('next').NextConfig} */

// Default configuration for development (npm run dev)
let nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

// WAR build configuration (npm run build:war)
if (process.env.BUILD_MODE === 'war') {
  nextConfig = {
    output: 'export',
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
}

export default nextConfig;