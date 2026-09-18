import type { Metadata } from "next";
import { FluteIndex } from "../cms-content-pages";
import { initialFluteTabEntries } from "../seo-pre-render-data";

export const metadata: Metadata = {
  title: { absolute: "Kho Cảm Âm Sáo Trúc Chuẩn Nhất – Lời Bài Hát & Nốt Quãng | Sáo Trúc Âu Cơ" },
  description: "Tra cứu và tải cảm âm sáo trúc miễn phí định dạng chuẩn 2 dòng: lời bài hát ở trên, nốt cảm âm quãng chuẩn cao độ ở dưới. Sáo Trúc Âu Cơ biên soạn.",
  keywords: [
    "cảm âm sáo trúc",
    "cam am sao truc",
    "cảm âm sáo",
    "nốt sáo trúc",
    "cảm âm nhạc trẻ",
    "cảm âm dân ca",
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
    images: [{ url: "/logo.jpg" }],
  },
};

export default function Page() {
  return <FluteIndex initialEntries={initialFluteTabEntries} />;
}
