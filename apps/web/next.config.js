/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['design-system/react'],
  experimental: {
    esmExternals: true,
  },
  compiler: {
    removeConsole: {
      exclude: process.env.NEXT_PUBLIC_APP_ENV !== 'development' ? ['log', 'warn'] : [],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
