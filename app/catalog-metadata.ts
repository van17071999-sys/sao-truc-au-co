import type { Metadata } from "next";

export async function catalogMetadata(params: Promise<{ slug: string }>, typeLabel: string, basePath: string): Promise<Metadata> {
  const { slug } = await params;
  const rawTitle = slug.split("-").filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  const title = `${rawTitle} – ${typeLabel}`;
  const canonicalUrl = `https://saotrucauco.com/${basePath}/${slug}`;
  const description = `${typeLabel} ${rawTitle} tại Sáo Trúc Âu Cơ. Xem mô tả chi tiết, tài liệu và gửi yêu cầu tư vấn.`;
  return {
    title: { absolute: `${title} | Sáo Trúc Âu Cơ` },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { type: "website", locale: "vi_VN", siteName: "Sáo Trúc Âu Cơ", title: `${title} | Sáo Trúc Âu Cơ`, description, url: canonicalUrl },
  };
}
