import { ContactPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng Ký Lớp Học Sáo Trúc & Tư Vấn Khóa Học",
  description: "Đăng ký học sáo trúc, Dizi, Tiêu Xiao, Recorder, Flute trực tiếp tại TP.HCM hoặc online 1 kèm 1 linh động tại Sáo Trúc Âu Cơ.",
  alternates: {
    canonical: "https://saotrucauco.com/dang-ky-hoc",
  },
};

export default function Page() {
  return <ContactPage />;
}
