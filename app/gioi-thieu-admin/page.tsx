import { FounderIntroPage } from "@/app/founder-intro-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Giới Thiệu Người Sáng Lập Sáo Trúc Âu Cơ | Thầy Quách Hạ Văn" },
  description: "Giới thiệu về Thầy Quách Hạ Văn - Người sáng lập & Chủ nhiệm Sáo Trúc Âu Cơ. Hơn 8 năm tâm huyết nghiên cứu, đào tạo và lan tỏa nghệ thuật sáo trúc Việt Nam bài bản.",
  alternates: { canonical: "https://saotrucauco.com/gioi-thieu-admin" },
  openGraph: {
    title: "Giới Thiệu Người Sáng Lập Sáo Trúc Âu Cơ | Thầy Quách Hạ Văn",
    description: "Giới thiệu về Thầy Quách Hạ Văn - Người sáng lập & Chủ nhiệm Sáo Trúc Âu Cơ. Hơn 8 năm tâm huyết nghiên cứu, đào tạo và lan tỏa nghệ thuật sáo trúc Việt Nam.",
    url: "https://saotrucauco.com/gioi-thieu-admin",
    images: [{ url: "https://saotrucauco.com/intro-portrait.jpg", alt: "Thầy Quách Hạ Văn - Sáo Trúc Âu Cơ" }],
  },
};

export default function Page() {
  return <FounderIntroPage />;
}
