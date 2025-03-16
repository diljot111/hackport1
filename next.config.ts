/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.pexels.com", "tse4.mm.bing.net"], // ✅ Merged domains
  },
  runtime: "nodejs", // ✅ Correctly placed outside experimental
};

module.exports = nextConfig;
