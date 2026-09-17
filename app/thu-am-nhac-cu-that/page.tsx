import { InstrumentRecordingPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dịch Vụ Thu Âm Nhạc Cụ Thật Chuyên Nghiệp",
  description: "Thu track nhạc cụ thật chất lượng cao: Sáo trúc, Dizi, Đàn tranh, Đàn bầu, Đàn nhị, Tiêu Xiao sẵn sàng cho producer và ca sĩ từ Sáo Trúc Âu Cơ.",
  alternates: {
    canonical: "https://saotrucauco.com/thu-am-nhac-cu-that",
  },
};

export default function Page() {
  return <InstrumentRecordingPage />;
}
