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
      {
        source: '/api/conteo/:path*',
        destination: 'http://localhost:8083/counter/:path*',
      },
      {
        source: '/api/ruleta/:path*',
        destination: 'http://localhost:8084/roulette/:path*',
      },
      {
        source: '/api/users/:path*',
        destination: 'http://localhost:8085/:path*',
      },
    ]
  },
}

export default nextConfig
