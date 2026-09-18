import { FounderIntroPage } from "@/app/founder-intro-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Giới Thiệu Người Sáng Lập Sáo Trúc Âu Cơ | Thầy Quách Hạ Văn" },
  description: "Giới thiệu về Thầy Quách Hạ Văn - Người sáng lập & Chủ nhiệm Sáo Trúc Âu Cơ. Hơn 8 năm tâm huyết nghiên cứu, đào tạo và lan tỏa nghệ thuật sáo trúc Việt Nam bài bản.",
  keywords: [
    "Quách Hạ Văn",
    "thầy Quách Hạ Văn",
    "người sáng lập Sáo Trúc Âu Cơ",
    "giáo viên dạy sáo trúc tphcm",
    "chủ nhiệm Sáo Trúc Âu Cơ",
  ],
  alternates: { canonical: "https://saotrucauco.com/gioi-thieu" },
  openGraph: {
    title: "Giới Thiệu Người Sáng Lập Sáo Trúc Âu Cơ | Thầy Quách Hạ Văn",
    description: "Giới thiệu về Thầy Quách Hạ Văn - Người sáng lập & Chủ nhiệm Sáo Trúc Âu Cơ.",
    url: "https://saotrucauco.com/gioi-thieu",
    siteName: "Sáo Trúc Âu Cơ",
    type: "profile",
    images: [{ url: "/intro-portrait.jpg", alt: "Thầy Quách Hạ Văn - Sáng lập Sáo Trúc Âu Cơ" }],
  },
};

const gioiThieuJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://saotrucauco.com/gioi-thieu#founder",
      name: "Quách Hạ Văn",
      jobTitle: "Giảng viên & Người sáng lập Sáo Trúc Âu Cơ",
      worksFor: {
        "@type": "Organization",
        name: "Sáo Trúc Âu Cơ",
        url: "https://saotrucauco.com",
      },
      image: "https://saotrucauco.com/intro-portrait.jpg",
      description: "Người sáng lập và chủ nhiệm Sáo Trúc Âu Cơ, chuyên gia đào tạo và biểu diễn sáo trúc Việt Nam, sáo Dizi, động tiêu.",
      knowsAbout: [
        "Sáo trúc Việt Nam",
        "Sáo Dizi",
        "Động tiêu & Xiao",
        "Sáo Recorder",
        "Kỹ thuật lấy hơi và bấm ngón sáo",
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://saotrucauco.com/gioi-thieu#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://saotrucauco.com" },
        { "@type": "ListItem", position: 2, name: "Giới thiệu người sáng lập", item: "https://saotrucauco.com/gioi-thieu" },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gioiThieuJsonLd) }}
      />
      <FounderIntroPage />
    </>
  );
}
