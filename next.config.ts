/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb", // images ke liye
    },
  },
};

module.exports = nextConfig;
