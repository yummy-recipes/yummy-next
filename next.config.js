const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["**.graphassets.com"],
    loader: "custom",
    loaderFile: "./image-loader.js",
  },
  serverExternalPackages: ["@huggingface/transformers"],
  experimental: {},
  webpack(config, { isServer }) {
    config.resolve.alias["@huggingface/transformers"] = path.resolve(
      __dirname,
      "node_modules/@huggingface/transformers",
    );
    return config;
  },
};

module.exports = nextConfig;
