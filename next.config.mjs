/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  experimental: {
    turbo: false, // <--- disable Turbopack
  },
};

export default nextConfig;
