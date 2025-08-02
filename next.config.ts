import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This tells Next.js to output a static site to the 'out' folder.
  output: 'export',

  // The rewrites proxy is removed because it only works with a running Next.js server.
  // We will now call the backend API directly from the browser.
};

export default nextConfig;