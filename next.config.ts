/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Accept images from all domains
      },
    ],
  },
  runtime: "nodejs",
};

module.exports = nextConfig;
