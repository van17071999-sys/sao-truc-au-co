import { MaterialsPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giáo Trình & Sheet Chuyển Soạn",
  description: "Giáo trình đào tạo sáo trúc, Dizi, Recorder và tuyển tập sheet chuyển soạn độc quyền, hỗ trợ ký âm theo yêu cầu.",
};

export default function Page() {
  return <MaterialsPage />;
}
