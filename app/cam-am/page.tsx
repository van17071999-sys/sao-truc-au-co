import type { Metadata } from "next";
import { FluteIndex } from "../cms-content-pages";

export const metadata: Metadata = {
  title: "Kho Cảm Âm Sáo Trúc Chuẩn Nhất | Sáo Trúc Âu Cơ",
  description: "Tra cứu và tải cảm âm sáo trúc miễn phí, định dạng chuẩn 2 dòng: lời bài hát ở trên, nốt cảm âm quãng 1, 2, 3 chuẩn cao độ ở dưới. Sáo Trúc Âu Cơ biên soạn.",
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
  openGraph: {
    title: "Kho Cảm Âm Sáo Trúc Chuẩn Nhất | Sáo Trúc Âu Cơ",
    description: "Kho cảm âm sáo trúc chuẩn 2 dòng lời và nốt quãng, dễ tập cho người mới và nâng cao.",
    images: [{ url: "/logo.jpg" }],
  },
};

export default function Page() {
  return <FluteIndex />;
}
