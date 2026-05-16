const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api-backend/:path*',
        destination: 'http://127.0.0.1:5000/:path*', // ← đổi localhost thành 127.0.0.1
      },
    ]
  },
}

export default nextConfig;