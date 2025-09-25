/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  experimental: {
    turbo: {
      enabled: true
    }
  },
  // i18n: {
  //   locales: ["en", "ar"],
  //   defaultLocale: "en",
  //   localeDetection: true,
  // },
};

export default nextConfig;
