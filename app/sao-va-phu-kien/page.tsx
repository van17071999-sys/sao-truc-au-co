import { ProductsPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sáo & Phụ Kiện Tuyển Chọn | Sáo Trúc Âu Cơ",
  description: "Sáo trúc chuẩn âm, Sáo Dizi, Sáo nứa, Sáo mèo, Tiêu Xiao, Recorder, Flute cùng phụ kiện âm nhạc tuyển chọn chất lượng cao.",
};

export default function Page() {
  return <ProductsPage />;
}
