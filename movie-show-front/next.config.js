/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    BASE_URL: process.env.NEXT_PUBLIC_DB_HOST,
  },
  
}

module.exports = nextConfig
