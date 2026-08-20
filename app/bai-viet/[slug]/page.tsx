import type { Metadata } from "next";
import { NewsDetail } from "../../cms-content-pages";

export const metadata: Metadata = {
  title: "Bài viết | Sáo Trúc Âu Cơ",
};

export default function Page() {
  return <NewsDetail />;
}
