import type { Metadata } from "next";
import { GuideDetail } from "../../cms-content-pages";
import { getGuideBySlug } from "../../seo-pre-render-data";

const guideTitles: Record<string, string> = {
  "cach-lay-hoi-va-tao-tieng-sao-tron-ro": "Cách Lấy Hơi Và Tạo Tiếng Sáo Tròn, Rõ",
  "meo-sua-loi-xi-tieng-va-rung-ngon": "Mẹo Sửa Lỗi Xì Tiếng Và Rung Ngón Khi Thổi Sáo",
  "chon-nhac-cu-va-xay-dung-lo-trinh-hoc": "Hướng Dẫn Chọn Nhạc Cụ Và Lộ Trình Học Sáo",
};

const guideDescriptions: Record<string, string> = {
  "cach-lay-hoi-va-tao-tieng-sao-tron-ro": "Phương pháp lấy hơi sâu bằng cơ hoành, cách ngậm môi chuẩn và kỹ thuật tạo luồng hơi tập trung để tiếng sáo tròn trịa, không bị xì rè.",
  "meo-sua-loi-xi-tieng-va-rung-ngon": "Tổng hợp các lỗi phổ biến khi người mới tập sáo như xì tiếng, hụt hơi, ngón bấm không kín và cách khắc phục hiệu quả nhanh chóng.",
  "chon-nhac-cu-va-xay-dung-lo-trinh-hoc": "Hướng dẫn chi tiết cách chọn sáo cho người mới bắt đầu (sáo Đô C5, La A4 hay Dizi) và lộ trình từng bước để tự học sáo thành công.",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const rawTitle = slug.split("-").filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const baseTitle = guideTitles[slug] || `Hướng Dẫn ${rawTitle}`;
  const fullTitle = `${baseTitle} | Sáo Trúc Âu Cơ`;
  const canonicalUrl = `https://saotrucauco.com/huong-dan/${slug}`;
  const description = guideDescriptions[slug] || `Bài viết và video hướng dẫn ${baseTitle} chi tiết từ Sáo Trúc Âu Cơ.`;

  return {
    title: { absolute: fullTitle },
    description,
    keywords: [
      baseTitle,
      "hướng dẫn thổi sáo",
      "kỹ thuật sáo trúc",
      "tự học sáo trúc",
      "Sáo Trúc Âu Cơ",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: "Sáo Trúc Âu Cơ",
      type: "article",
      images: [{ url: "/carousel-saotruc.webp", width: 1672, height: 941, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/carousel-saotruc.webp"],
    },
  };
}

export default async function HuongDanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const initialEntry = getGuideBySlug(slug);
  const baseTitle = guideTitles[slug] || initialEntry?.title || "Hướng Dẫn Thổi Sáo";
  const canonicalUrl = `https://saotrucauco.com/huong-dan/${slug}`;
  const description = guideDescriptions[slug] || initialEntry?.excerpt || `Hướng dẫn ${baseTitle} từ Sáo Trúc Âu Cơ.`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        headline: baseTitle,
        description,
        url: canonicalUrl,
        publisher: {
          "@type": "Organization",
          name: "Sáo Trúc Âu Cơ",
          url: "https://saotrucauco.com",
        },
        inLanguage: "vi-VN",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://saotrucauco.com" },
          { "@type": "ListItem", position: 2, name: "Hướng dẫn", item: "https://saotrucauco.com/huong-dan" },
          { "@type": "ListItem", position: 3, name: baseTitle, item: canonicalUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideDetail initialEntry={initialEntry} />
    </>
  );
}
