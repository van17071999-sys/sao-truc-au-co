import { RecordedCoursesPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Khóa Học Sáo Trúc Quay Sẵn & Video Bài Giảng HD",
  description: "Video bài giảng HD từ nhập môn đến nâng cao, học mọi lúc và xem lại trọn đời. Hướng dẫn từng câu, sheet nốt và ngón bấm chuẩn từ Sáo Trúc Âu Cơ.",
  alternates: {
    canonical: "https://saotrucauco.com/khoa-hoc-quay-san",
  },
};

export default function Page() {
  return <RecordedCoursesPage />;
}
