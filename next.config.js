const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    additionalData: `@use 'foundation/index.scss' as *;`,
    includePaths: [path.join(__dirname, 'src/styles')],
  },
  images: {
    domains: ['localhost', 'prod-kotobum.s3.ap-northeast-1.amazonaws.com'],
  },
};

module.exports = nextConfig;
