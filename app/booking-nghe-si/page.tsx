import { BookingPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Nghệ Sĩ Biểu Diễn",
  description: "Độc tấu sáo trúc, song tấu, hòa tấu và ban nhạc dân tộc biểu diễn sự kiện, tiệc cưới, hội nghị, festival chuyên nghiệp.",
};

export default function Page() {
  return <BookingPage />;
}
