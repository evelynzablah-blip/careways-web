import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    // Preview / staging: keep search engines out until the domain cutover.
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/en/preview", "/es/preview"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
