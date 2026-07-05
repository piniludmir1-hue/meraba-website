/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [75, 90, 95, 100],
  },
  async redirects() {
    return [
      {
        source: '/admin/index.html',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/config.yml',
        destination: '/admin/config.yml',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
