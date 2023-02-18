/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  reactStrictMode: false,
  env: {
    BASE_URL: process.env.BASE_URL,
    GHL_CLIENT_ID: process.env.GHL_CLIENT_ID,
    GHL_CLIENT_SECRET: process.env.GHL_CLIENT_SECRET,
    GHL_API_VERSION: process.env.GHL_API_VERSION,
  }
}

module.exports = nextConfig
