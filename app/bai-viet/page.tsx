import type { Metadata } from "next";
import { NewsIndex } from "../cms-content-pages";
import { articleIndexEntries } from "../seo-article-data";

export const metadata: Metadata = {
  title: { absolute: "Bài Viết & Kiến Thức Học Sáo Trúc | Sáo Trúc Âu Cơ" },
  description: "Tổng hợp bài viết chia sẻ kinh nghiệm học sáo trúc cho người mới bắt đầu, kỹ thuật bấm ngón, luyện hơi, chọn mua sáo chuẩn âm và địa chỉ học sáo uy tín tại TP.HCM.",
  keywords: [
    "bài viết sáo trúc",
    "kinh nghiệm học sáo",
    "học thổi sáo cho người mới",
    "kỹ thuật sáo trúc",
    "luyện hơi sáo trúc",
    "học sáo trúc tphcm",
    "Sáo Trúc Âu Cơ",
  ],
  alternates: {
    canonical: "https://saotrucauco.com/bai-viet",
  },
  openGraph: {
    title: "Bài Viết & Kiến Thức Học Sáo Trúc | Sáo Trúc Âu Cơ",
    description: "Tổng hợp bài viết chia sẻ kinh nghiệm học sáo trúc, kỹ thuật bấm ngón, luyện hơi và địa chỉ học sáo uy tín tại TP.HCM.",
    url: "https://saotrucauco.com/bai-viet",
    siteName: "Sáo Trúc Âu Cơ",
    type: "website",
    images: [{ url: "/carousel-saotruc.webp", width: 1672, height: 941, alt: "Bài viết kiến thức học sáo trúc - Sáo Trúc Âu Cơ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bài Viết & Kiến Thức Học Sáo Trúc | Sáo Trúc Âu Cơ",
    description: "Tổng hợp bài viết chia sẻ kinh nghiệm học sáo trúc từ Sáo Trúc Âu Cơ.",
    images: ["/carousel-saotruc.webp"],
  },
};

const baiVietJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://saotrucauco.com/bai-viet#webpage",
      url: "https://saotrucauco.com/bai-viet",
      name: "Bài Viết & Kiến Thức Học Sáo Trúc",
      description: "Tổng hợp các bài viết hướng dẫn luyện sáo, kỹ thuật và tuyển sinh lớp học sáo trúc tại TP.HCM.",
      publisher: {
        "@type": "Organization",
        name: "Sáo Trúc Âu Cơ",
        url: "https://saotrucauco.com",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://saotrucauco.com/bai-viet#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://saotrucauco.com" },
        { "@type": "ListItem", position: 2, name: "Bài viết", item: "https://saotrucauco.com/bai-viet" },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(baiVietJsonLd) }}
      />
      <NewsIndex initialEntries={articleIndexEntries} />
    </>
  );
}
