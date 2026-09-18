import type { Metadata } from "next";
import { FluteDetail } from "../../cms-content-pages";
import { getFluteTabBySlug } from "../../seo-pre-render-data";

const fluteTabTitles: Record<string, string> = {
  "beo-dat-may-troi": "Cảm Âm Bèo Dạt Mây Trôi – Chuẩn 2 Dòng Lời & Nốt Sáo Trúc",
  "chieu-tren-que-huong": "Cảm Âm Chiều Trên Quê Hương – Nốt Sáo Trúc Chuẩn",
  "khuc-sao-vung-cao": "Cảm Âm Khúc Sáo Vùng Cao – Luyện Luyến Láy Sáo Mèo, Sáo Trúc",
  "ve-que": "Cảm Âm Về Quê – Bản Chuẩn Âm Nhạc Quê Hương Cho Sáo Trúc",
  "tinh-ca-tay-bac": "Cảm Âm Tình Ca Tây Bắc – Nốt Sáo Trúc Quãng Chuẩn",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const rawTitle = slug.split("-").filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const baseTitle = fluteTabTitles[slug] || `Cảm Âm ${rawTitle} – Nốt Chuẩn 2 Dòng`;
  const canonicalUrl = `https://saotrucauco.com/cam-am/${slug}`;

  return {
    title: { absolute: `${baseTitle} | Sáo Trúc Âu Cơ` },
    description: `Xem và luyện tập ${baseTitle} với lời bài hát và nốt cảm âm quãng chuẩn xác, biên soạn bởi Sáo Trúc Âu Cơ.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${baseTitle} | Sáo Trúc Âu Cơ`,
      description: `Xem và luyện tập ${baseTitle} với lời bài hát và nốt cảm âm quãng chuẩn xác.`,
      url: canonicalUrl,
      siteName: "Sáo Trúc Âu Cơ",
      type: "article",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const initialEntry = getFluteTabBySlug(slug);
  return <FluteDetail initialEntry={initialEntry} />;
}
