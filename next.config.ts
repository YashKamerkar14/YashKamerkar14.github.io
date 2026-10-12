import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
  cacheComponents: false,
  agentRules: false,
};

export default function nextConfig(phase: string): NextConfig {
  const backend = process.env.NEXT_PUBLIC_SCOUT_API_ORIGIN;
  if (backend) {
    const url = new URL(backend);
    const loopback = ["127.0.0.1", "localhost"].includes(url.hostname);
    if ((url.protocol !== "https:" && !(loopback && url.protocol === "http:")) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
      throw new Error("NEXT_PUBLIC_SCOUT_API_ORIGIN must be an HTTPS origin, without credentials or a path.");
    }
  }
  return phase === PHASE_DEVELOPMENT_SERVER ? { ...config, rewrites: async () => [{ source: "/api/agents/:path*", destination: `http://127.0.0.1:${Number(process.env.PORT || 3000)+1}/api/agents/:path*` }] } : config;
}
