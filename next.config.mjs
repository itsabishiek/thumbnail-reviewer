/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "hearty-impala-109.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
