import type { NextConfig } from "next";
import { DEFAULT_LOCALE } from "./src/data/types";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * `/` is not a content edition of its own — it is a doorway to the default
   * one. A redirect here is simpler than middleware and keeps every real page
   * statically generated. Deliberately temporary (307), not permanent: which
   * locale is the default is a product decision that may change, and a 301
   * would be cached in readers' browsers indefinitely.
   */
  async redirects() {
    return [
      { source: "/", destination: `/${DEFAULT_LOCALE}`, permanent: false },
    ];
  },
};

export default nextConfig;
