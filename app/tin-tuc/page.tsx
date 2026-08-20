import type { Metadata } from "next";
import { NewsIndex } from "../cms-content-pages";

export const metadata: Metadata = {
  title: "Bài viết & Tin tức | Sáo Trúc Âu Cơ",
  description: "Bài viết, chia sẻ kiến thức và kinh nghiệm sáo trúc, nhạc cụ dân tộc từ Sáo Trúc Âu Cơ.",
};

export default function Page() {
  return <NewsIndex />;
}
