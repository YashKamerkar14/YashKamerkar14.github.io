import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [ { url: "https://yashkamerkar14.github.io/", changeFrequency: "monthly", priority: 1 }, { url: "https://yashkamerkar14.github.io/work/flightsense/", changeFrequency: "monthly", priority: .8 } ];
}
