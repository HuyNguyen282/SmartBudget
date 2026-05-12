/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api-backend/:path*',
        destination: 'http://localhost:5000/:path*', // Trỏ tới backend thực sự
      },
    ]
  },
}

export default nextConfig;