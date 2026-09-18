import type { Metadata } from "next";
import { GuideIndex } from "../cms-content-pages";
import { initialGuideEntries } from "../seo-pre-render-data";

export const metadata: Metadata = {
  title: { absolute: "Hướng Dẫn Thổi Sáo Trúc & Video Bài Giảng Chuẩn Kỹ Thuật | Sáo Trúc Âu Cơ" },
  description: "Tổng hợp bài viết hướng dẫn bấm ngón, lấy hơi sáo trúc và video bài giảng chi tiết trên YouTube, TikTok từ Sáo Trúc Âu Cơ.",
  alternates: {
    canonical: "https://saotrucauco.com/huong-dan",
  },
  openGraph: {
    title: "Hướng Dẫn Thổi Sáo Trúc & Video Bài Giảng Chuẩn Kỹ Thuật | Sáo Trúc Âu Cơ",
    description: "Tổng hợp bài viết hướng dẫn bấm ngón, lấy hơi sáo trúc và video bài giảng chi tiết trên YouTube, TikTok từ Sáo Trúc Âu Cơ.",
    url: "https://saotrucauco.com/huong-dan",
    siteName: "Sáo Trúc Âu Cơ",
    type: "website",
  },
};

export default function HuongDanPage() {
  return <GuideIndex initialEntries={initialGuideEntries} />;
}
