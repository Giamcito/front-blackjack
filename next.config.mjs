/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
  async rewrites() {
    return [
      {
        source: '/api/blackjack/:path*',
        destination: 'http://localhost:8082/api/v1/blackjack/:path*',
      },
    ]
  },
}

export default nextConfig
