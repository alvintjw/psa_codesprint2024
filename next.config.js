/**
 * @type { import("next").NextConfig }
 */
module.exports = {
  reactStrictMode: false
}

module.exports = {
  reactStrictMode: true,
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
}
