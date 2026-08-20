import { ClassesPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lớp Học Các Bộ Môn | Sáo Trúc Âu Cơ",
  description: "Các bộ môn đào tạo âm nhạc dân tộc tại Sáo Trúc Âu Cơ: Sáo trúc Việt Nam, Dizi, Recorder, Động tiêu & Xiao, Flute, Sáo H'Mông. Học offline tại TP.HCM hoặc online 1 kèm 1.",
};

export default function Page() {
  return <ClassesPage />;
}
