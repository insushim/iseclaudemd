/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },
  images: {
    domains: ['github.com', 'avatars.githubusercontent.com']
  }
};

export default nextConfig;