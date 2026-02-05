/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['three', 'react-globe.gl', 'react-leaflet'],
    reactStrictMode: false,
};

module.exports = nextConfig;
