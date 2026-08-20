import { ContactPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng Ký Lớp Học & Tư Vấn | Sáo Trúc Âu Cơ",
  description: "Đăng ký học sáo trúc, Dizi, Tiêu Xiao, Recorder, Flute trực tiếp tại TP.HCM hoặc online 1 kèm 1 linh động.",
};

export default function Page() {
  return <ContactPage />;
}
