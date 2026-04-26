/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',      // ← BẮT BUỘC cho Docker
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
