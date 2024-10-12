/**
 * @type { import("next").NextConfig }
 */
// module.exports = {
//   reactStrictMode: false
// }
// next.config.js
/**
 * @type { import("next").NextConfig }
 */
const nextConfig = {
  reactStrictMode: true,  // Keep this from both branches
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**'
      }
    ]
  }
};

module.exports = nextConfig;