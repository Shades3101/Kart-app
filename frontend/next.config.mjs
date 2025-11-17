/**@type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */

  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images:{
    remotePatterns : [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
      
    ]
  }
};

export default nextConfig;
