import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/quan-tri", "/api/"],
    },
    sitemap: "https://saotrucauco.com/sitemap.xml",
  };
}
