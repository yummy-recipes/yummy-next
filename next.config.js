/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['media.graphassets.com'],
    loader: 'custom',
    loaderFile: './image-loader.js'
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
