/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        unoptimized: true,
        domains: ['media.graphassets.com', 'lh3.googleusercontent.com', 'ap-south-1.graphassets.com']
    },
    compiler: {
        styledComponents: true,
    },
    webpack(config) {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.resolve(new URL('./src', import.meta.url).pathname), // Use import.meta.url
        };
        return config;
    },
};

export default nextConfig;

import path from 'path';