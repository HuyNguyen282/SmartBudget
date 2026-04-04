"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nextConfig = {
    async rewrites() {
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
//# sourceMappingURL=next.config.js.map