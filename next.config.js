// eslint-disable-next-line @typescript-eslint/no-var-requires
const optimizedImages = require('next-optimized-images');

const nextConfig = optimizedImages({
  reactStrictMode: true,
  handleImages: ['svg'],
  swcMinify: true,
  images: {
    domains: ['raw.githubusercontent.com'],
  },
});

module.exports = nextConfig;
