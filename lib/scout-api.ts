export function scoutEndpoint(path: "/api/agents" | "/api/agents/status") {
  const origin = (process.env.NEXT_PUBLIC_SCOUT_API_ORIGIN || "").replace(/\/+$/, "");
  return origin + path;
}
