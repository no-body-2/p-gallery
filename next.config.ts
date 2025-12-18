import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb', // 👈 여기! 제한을 10MB로 늘림
        },
    },
};

export default nextConfig;
