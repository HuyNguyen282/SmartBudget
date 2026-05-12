/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
<<<<<<< HEAD
    return [
      {
        source: '/api-backend/:path*',
        destination: 'http://localhost:5000/:path*', // Trỏ tới backend thực sự
      },
    ]
  },
}

export default nextConfig;
=======
    const apiUrl = process.env.API_URL || 'http://localhost:3000';
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
>>>>>>> 0aa3f7ac008efe0f5ebb790c40243eb4cbf1ebc0
