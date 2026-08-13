import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://hong-viet-sao-truc.van17071999.chatgpt.site/sitemap.xml",
  };
}
