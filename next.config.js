/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  swcMinify: false,
};

module.exports = nextConfig;
