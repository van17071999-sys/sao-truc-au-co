import type { MetadataRoute } from "next";

const subjects = ["sao-truc-viet-nam", "sao-dizi", "sao-recorder", "dong-tieu-xiao", "flute", "sao-hmong"];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://saotrucauco.com";
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    ...subjects.map((slug) => ({ url: `${baseUrl}/bo-mon/${slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
