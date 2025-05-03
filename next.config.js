/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['openweathermap.org'],
  },
  env: {
    SITE_URL: 'https://weather-byaditya.vercel.app',
  },
};

module.exports = nextConfig;
