/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
                pathname: '/api/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com', // Google Auth
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com', // GitHub Auth
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com', // Future use
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'tailwindui.com',
            }
        ],
        dangerouslyAllowSVG: true,
        unoptimized: true,
    },
};

export default nextConfig;
