import { StudioPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phòng Thu Âm Sáo Trúc & Quay Video MV Studio",
  description: "Dịch vụ thu âm chuyên nghiệp, mixing mastering và quay dựng MV biểu diễn trọn gói cho học viên và nghệ sĩ tại Sáo Trúc Âu Cơ.",
  alternates: {
    canonical: "https://saotrucauco.com/thu-am-va-quay-video",
  },
};

export default function Page() {
  return <StudioPage />;
}
