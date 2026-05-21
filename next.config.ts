import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/create-task",
        destination: "/tasks/create",
        permanent: true,
      },
      {
        source: "/applications",
        destination: "/tasks?tab=applications",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
