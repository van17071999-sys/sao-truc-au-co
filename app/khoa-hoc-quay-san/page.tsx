import { RecordedCoursesPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Khóa Học Quay Sẵn & Video Từng Bài | Sáo Trúc Âu Cơ",
  description: "Video bài giảng HD từ nhập môn đến nâng cao, học mọi lúc và xem lại trọn đời. Hướng dẫn từng câu, sheet nốt và ngón bấm chuẩn.",
};

export default function Page() {
  return <RecordedCoursesPage />;
}
