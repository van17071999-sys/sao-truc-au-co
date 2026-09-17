import { MaterialsPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giáo Trình Tự Học Sáo Trúc & Sheet Chuyển Soạn",
  description: "Giáo trình đào tạo sáo trúc, Dizi, Recorder và tuyển tập sheet chuyển soạn độc quyền, hỗ trợ ký âm theo yêu cầu từ Sáo Trúc Âu Cơ.",
  alternates: {
    canonical: "https://saotrucauco.com/giao-trinh-va-sheet",
  },
};

export default function Page() {
  return <MaterialsPage />;
}
