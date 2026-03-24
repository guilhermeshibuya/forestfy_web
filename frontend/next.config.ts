import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "minio.local",
        port: "9000",
        pathname: "/forestfy-bucket/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/forestfy-bucket/**",
      },
    ],
  },
}

export default nextConfig
