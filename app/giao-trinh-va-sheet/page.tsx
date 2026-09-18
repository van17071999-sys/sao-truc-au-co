import { MaterialsPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Giáo Trình Học Sáo Trúc & Sheet Nhạc Chuyển Soạn Chuẩn | Sáo Trúc Âu Cơ" },
  description: "Trọn bộ giáo trình học sáo trúc, Dizi, Recorder từ cơ bản đến nâng cao và tuyển tập sheet nhạc chuyển soạn độc quyền, hỗ trợ thế bấm ngón từ Sáo Trúc Âu Cơ.",
  keywords: [
    "giáo trình học sáo trúc",
    "giáo trình sáo trúc cơ bản",
    "tài liệu tự học sáo trúc",
    "sheet nhạc sáo trúc",
    "sheet nốt sáo trúc",
    "giáo trình sáo dizi",
    "giáo trình sáo recorder",
    "sheet cảm âm sáo trúc",
    "Sáo Trúc Âu Cơ",
  ],
  alternates: {
    canonical: "https://saotrucauco.com/giao-trinh-va-sheet",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://saotrucauco.com/giao-trinh-va-sheet",
    siteName: "Sáo Trúc Âu Cơ",
    title: "Giáo Trình Học Sáo Trúc & Sheet Nhạc Chuyển Soạn Chuẩn | Sáo Trúc Âu Cơ",
    description: "Trọn bộ giáo trình học sáo trúc, Dizi, Recorder từ cơ bản đến nâng cao và tuyển tập sheet nhạc chuyển soạn độc quyền từ Sáo Trúc Âu Cơ.",
    images: [{ url: "/carousel-saotruc.webp", width: 1672, height: 941, alt: "Giáo trình và sheet nhạc sáo trúc - Sáo Trúc Âu Cơ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Giáo Trình Học Sáo Trúc & Sheet Nhạc Chuyển Soạn Chuẩn | Sáo Trúc Âu Cơ",
    description: "Trọn bộ giáo trình học sáo trúc, Dizi, Recorder từ cơ bản đến nâng cao.",
    images: ["/carousel-saotruc.webp"],
  },
};

const giaoTrinhSheetJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LearningResource",
      "@id": "https://saotrucauco.com/giao-trinh-va-sheet#resource",
      name: "Giáo Trình Tự Học Sáo Trúc & Sheet Nhạc Chuyển Soạn",
      description: "Bộ tài liệu và giáo trình giảng dạy sáo trúc Việt Nam, sáo Dizi, sáo Recorder và sheet nốt bài bản.",
      learningResourceType: "Curriculum / Music Sheet",
      educationalLevel: "Beginner to Advanced",
      publisher: {
        "@type": "Organization",
        name: "Sáo Trúc Âu Cơ",
        url: "https://saotrucauco.com",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://saotrucauco.com/giao-trinh-va-sheet#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://saotrucauco.com" },
        { "@type": "ListItem", position: 2, name: "Giáo trình & Sheet nhạc", item: "https://saotrucauco.com/giao-trinh-va-sheet" },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(giaoTrinhSheetJsonLd) }}
      />
      <MaterialsPage />
    </>
  );
}
