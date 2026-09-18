import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/quan-tri", "/admin/", "/api/", "/diem-danh"],
    },
    sitemap: "https://saotrucauco.com/sitemap.xml",
  };
}
