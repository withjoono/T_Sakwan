/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@tskool/satellite-header"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
}

export default nextConfig
