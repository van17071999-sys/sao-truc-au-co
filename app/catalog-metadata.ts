import type { Metadata } from "next";

export async function catalogMetadata(params: Promise<{ slug: string }>, typeLabel: string, basePath: string): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.split("-").filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  const description = `${typeLabel} ${title} tại Hồng Việt Sáo Trúc. Xem mô tả chi tiết, giá và gửi yêu cầu tư vấn.`;
  return {
    title,
    description,
    alternates: { canonical: `/${basePath}/${slug}` },
    openGraph: { type: "website", locale: "vi_VN", siteName: "Hồng Việt Sáo Trúc", title, description, url: `/${basePath}/${slug}` },
  };
}
