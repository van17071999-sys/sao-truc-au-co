import type { Metadata } from "next";
import { GuideIndex } from "../cms-content-pages";

export const metadata: Metadata = {
  title: "Hướng Dẫn Thổi Sáo Trúc, Video Kỹ Thuật YouTube & TikTok",
  description: "Tổng hợp các bài viết hướng dẫn chi tiết, video bài giảng YouTube và video mẹo luyện sáo ngắn trên TikTok từ Sáo Trúc Âu Cơ.",
  alternates: {
    canonical: "https://saotrucauco.com/huong-dan",
  },
  openGraph: {
    title: "Hướng Dẫn Thổi Sáo Trúc, Video Kỹ Thuật YouTube & TikTok",
    description: "Tổng hợp các bài viết hướng dẫn chi tiết, video bài giảng YouTube và video mẹo luyện sáo ngắn trên TikTok từ Sáo Trúc Âu Cơ.",
    url: "https://saotrucauco.com/huong-dan",
    siteName: "Sáo Trúc Âu Cơ",
    type: "website",
  },
};

export default function HuongDanPage() {
  return <GuideIndex />;
}
