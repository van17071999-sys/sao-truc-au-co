import { BookingPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Nghệ Sĩ Biểu Diễn Sáo Trúc & Nhạc Dân Tộc",
  description: "Độc tấu sáo trúc, song tấu, hòa tấu và ban nhạc dân tộc biểu diễn sự kiện, tiệc cưới, hội nghị, festival chuyên nghiệp từ Sáo Trúc Âu Cơ.",
  alternates: {
    canonical: "https://saotrucauco.com/booking-nghe-si",
  },
};

export default function Page() {
  return <BookingPage />;
}
