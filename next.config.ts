import type { NextConfig } from "next";

// Origin of the Rails GraphQL backend. Overridable per environment via .env.local.
const bookApiOrigin = process.env.BOOK_API_URL ?? "http://localhost:3002";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without this, a stray lockfile in a
  // parent directory makes Next infer the wrong root and mis-watches files.
  turbopack: {
    root: import.meta.dirname,
  },

  // Proxy browser requests for /graphql to the Rails backend.
  // The browser only ever calls same-origin /graphql, so there is no CORS.
  async rewrites() {
    return [
      {
        source: "/graphql",
        destination: `${bookApiOrigin}/graphql`,
      },
    ];
  },
};

export default nextConfig;
