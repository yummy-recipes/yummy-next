/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["**.graphassets.com"],
    loader: "custom",
    loaderFile: "./image-loader.js",
  },
  experimental: {},
};

module.exports = nextConfig;
