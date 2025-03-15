/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  images: {
    domains: ["images.pexels.com"], // Allow images from Pexels
  },
  runtime: "nodejs", // ✅ Move runtime outside of experimental
};

module.exports = nextConfig;
