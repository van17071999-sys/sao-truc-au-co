import type { Metadata } from "next";
import { GuideIndex } from "../cms-content-pages";
import { initialGuideEntries } from "../seo-pre-render-data";

export const metadata: Metadata = {
  title: { absolute: "Hướng Dẫn Học Thổi Sáo Trúc & Video Bài Giảng Kỹ Thuật | Sáo Trúc Âu Cơ" },
  description: "Tổng hợp các bài viết và video hướng dẫn học thổi sáo trúc từ cơ bản: cách ngậm môi tạo tiếng, lấy hơi, bấm ngón, sửa lỗi xì tiếng và chọn sáo chuẩn từ Sáo Trúc Âu Cơ.",
  keywords: [
    "hướng dẫn học sáo trúc",
    "hướng dẫn thổi sáo",
    "cách thổi sáo kêu",
    "cách lấy hơi thổi sáo",
    "kỹ thuật bấm ngón sáo",
    "tự học sáo trúc",
    "sửa lỗi xì tiếng sáo",
    "chọn sáo cho người mới",
    "Sáo Trúc Âu Cơ",
  ],
  alternates: {
    canonical: "https://saotrucauco.com/huong-dan",
  },
  openGraph: {
    title: "Hướng Dẫn Học Thổi Sáo Trúc & Video Bài Giảng Kỹ Thuật | Sáo Trúc Âu Cơ",
    description: "Tổng hợp các bài viết và video hướng dẫn học thổi sáo trúc từ cơ bản: tạo tiếng, lấy hơi, bấm ngón, sửa lỗi xì tiếng và chọn sáo chuẩn.",
    url: "https://saotrucauco.com/huong-dan",
    siteName: "Sáo Trúc Âu Cơ",
    type: "website",
    images: [{ url: "/carousel-saotruc.webp", width: 1672, height: 941, alt: "Hướng dẫn học sáo trúc - Sáo Trúc Âu Cơ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hướng Dẫn Học Thổi Sáo Trúc & Video Bài Giảng Kỹ Thuật | Sáo Trúc Âu Cơ",
    description: "Tổng hợp hướng dẫn học sáo trúc từ cơ bản đến nâng cao từ Sáo Trúc Âu Cơ.",
    images: ["/carousel-saotruc.webp"],
  },
};

const huongDanJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://saotrucauco.com/huong-dan#webpage",
      url: "https://saotrucauco.com/huong-dan",
      name: "Hướng Dẫn Học Thổi Sáo Trúc Chuẩn Kỹ Thuật",
      description: "Tổng hợp tài liệu, hướng dẫn kỹ thuật và video bài giảng học sáo trúc cho người mới bắt đầu.",
      publisher: {
        "@type": "Organization",
        name: "Sáo Trúc Âu Cơ",
        url: "https://saotrucauco.com",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://saotrucauco.com/huong-dan#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://saotrucauco.com" },
        { "@type": "ListItem", position: 2, name: "Hướng dẫn học sáo", item: "https://saotrucauco.com/huong-dan" },
      ],
    },
    {
      "@type": "ItemList",
      "@id": "https://saotrucauco.com/huong-dan#guides",
      name: "Danh sách bài hướng dẫn học sáo trúc cơ bản",
      itemListElement: initialGuideEntries.map((guide, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: guide.title,
        url: `https://saotrucauco.com/huong-dan/${guide.slug}`,
      })),
    },
  ],
};

export default function HuongDanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(huongDanJsonLd) }}
      />
      <GuideIndex initialEntries={initialGuideEntries} />
    </>
  );
}
