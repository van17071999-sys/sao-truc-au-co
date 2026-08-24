import { InstrumentRecordingPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thu Âm Nhạc Cụ Thật",
  description: "Thu track nhạc cụ thật chất lượng cao: Sáo trúc, Dizi, Đàn tranh, Đàn bầu, Đàn nhị, Tiêu Xiao sẵn sàng cho producer và ca sĩ.",
};

export default function Page() {
  return <InstrumentRecordingPage />;
}
