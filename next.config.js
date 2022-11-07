// eslint-disable-next-line @typescript-eslint/no-var-requires
const optimizedImages = require('next-optimized-images');

const nextConfig = optimizedImages({
  reactStrictMode: true,
  handleImages: ['svg'],
  swcMinify: true,
  images: {
    domains: ['raw.githubusercontent.com'],
  },
  experimental: { nftTracing: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fixes npm packages that depend on `fs` module
      // https://github.com/vercel/next.js/issues/7755#issuecomment-937721514
      config.resolve.fallback.fs = false
    }
    config.resolve.mainFields = ['browser', 'main', 'module']
    return config
  },
  env: {
    MORALIS_API_KEY: process.env.MORALIS_API_KEY,
  }
});

module.exports = nextConfig;
