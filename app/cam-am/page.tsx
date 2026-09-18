import type { Metadata } from "next";
import { FluteIndex } from "../cms-content-pages";
import { initialFluteTabEntries } from "../seo-pre-render-data";

export const metadata: Metadata = {
  title: { absolute: "Kho Cảm Âm Sáo Trúc Chuẩn Nhất – Lời Bài Hát & Nốt Quãng | Sáo Trúc Âu Cơ" },
  description: "Tra cứu và tải cảm âm sáo trúc miễn phí định dạng chuẩn 2 dòng: lời bài hát ở trên, nốt cảm âm quãng chuẩn cao độ ở dưới. Dễ tập cho người mới học sáo.",
  keywords: [
    "cảm âm sáo trúc",
    "cam am sao truc",
    "cảm âm sáo",
    "nốt sáo trúc",
    "cảm âm nhạc trẻ",
    "cảm âm dân ca",
    "tự học sáo trúc",
    "tự thổi sáo",
    "Sáo Trúc Âu Cơ",
  ],
  alternates: {
    canonical: "https://saotrucauco.com/cam-am",
  },
  openGraph: {
    title: "Kho Cảm Âm Sáo Trúc Chuẩn Nhất – Lời Bài Hát & Nốt Quãng | Sáo Trúc Âu Cơ",
    description: "Kho cảm âm sáo trúc chuẩn 2 dòng lời và nốt quãng, dễ tập cho người mới và nâng cao.",
    url: "https://saotrucauco.com/cam-am",
    siteName: "Sáo Trúc Âu Cơ",
    type: "website",
    images: [{ url: "/carousel-saotruc.webp", width: 1672, height: 941, alt: "Kho cảm âm sáo trúc chuẩn - Sáo Trúc Âu Cơ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kho Cảm Âm Sáo Trúc Chuẩn Nhất | Sáo Trúc Âu Cơ",
    description: "Kho cảm âm sáo trúc chuẩn 2 dòng lời và nốt quãng, dễ tập cho người mới học sáo.",
    images: ["/carousel-saotruc.webp"],
  },
};

const camAmJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://saotrucauco.com/cam-am#webpage",
      url: "https://saotrucauco.com/cam-am",
      name: "Kho Cảm Âm Sáo Trúc Chuẩn Nhất",
      description: "Thư viện cảm âm sáo trúc định dạng chuẩn 2 dòng lời bài hát và nốt quãng cao độ.",
      publisher: {
        "@type": "Organization",
        name: "Sáo Trúc Âu Cơ",
        url: "https://saotrucauco.com",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://saotrucauco.com/cam-am#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://saotrucauco.com" },
        { "@type": "ListItem", position: 2, name: "Cảm âm sáo trúc", item: "https://saotrucauco.com/cam-am" },
      ],
    },
    {
      "@type": "ItemList",
      "@id": "https://saotrucauco.com/cam-am#tabs",
      name: "Danh sách bài cảm âm sáo trúc",
      itemListElement: initialFluteTabEntries.map((tab, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: tab.title,
        url: `https://saotrucauco.com/cam-am/${tab.slug}`,
      })),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(camAmJsonLd) }}
      />
      <FluteIndex initialEntries={initialFluteTabEntries} />
    </>
  );
}
