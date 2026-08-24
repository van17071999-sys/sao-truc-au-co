import type { Metadata } from "next";
import { NewsIndex } from "../cms-content-pages";
import { articleIndexEntries } from "../seo-article-data";

export const metadata: Metadata = {
  title: "Bài viết & Chia sẻ kiến thức | Sáo Trúc Âu Cơ",
  description: "Tổng hợp bài viết hướng dẫn luyện thổi sáo, kỹ thuật bấm ngón, chọn sáo chuẩn âm và kiến thức âm nhạc dân tộc từ Sáo Trúc Âu Cơ.",
  keywords: ["bài viết sáo trúc", "kinh nghiệm học sáo", "cách chọn sáo", "kỹ thuật sáo trúc", "Sáo Trúc Âu Cơ"],
  alternates: {
    canonical: "/bai-viet",
  },
  openGraph: {
    title: "Bài viết & Chia sẻ kiến thức | Sáo Trúc Âu Cơ",
    description: "Tổng hợp bài viết hướng dẫn luyện thổi sáo, kỹ thuật bấm ngón, chọn sáo chuẩn âm từ Sáo Trúc Âu Cơ.",
    images: [{ url: "/logo.jpg" }],
  },
};

export default function Page() {
  return <NewsIndex initialEntries={articleIndexEntries} />;
}
