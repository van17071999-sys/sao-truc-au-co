import { StudioPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thu Âm & Quay Video MV Studio | Sáo Trúc Âu Cơ",
  description: "Dịch vụ thu âm chuyên nghiệp, mixing mastering và quay dựng MV biểu diễn trọn gói cho học viên và nghệ sĩ.",
};

export default function Page() {
  return <StudioPage />;
}
