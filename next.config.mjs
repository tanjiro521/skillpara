/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Completely disable source maps in production to avoid possible length errors
  productionBrowserSourceMaps: false,
  // Disable React strict mode which can lead to issues with undefined arrays during development
  reactStrictMode: false,

}

export default nextConfig
