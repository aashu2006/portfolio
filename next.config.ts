import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The site collapsed from four routes into one page. Anything still pointing
   * at the old sections lands on the equivalent content at the root instead of
   * a 404.
   */
  async redirects() {
    return [
      { source: "/projects", destination: "/", permanent: true },
      { source: "/work", destination: "/", permanent: true },
      { source: "/blog", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
