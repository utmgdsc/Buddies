/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // development only
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5128/api/:path*'
      }
    ]
  }
}

module.exports = nextConfig
