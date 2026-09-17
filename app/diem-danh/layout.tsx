import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sổ Điểm Danh Điện Tử & Tra Cứu Học Viên | Sáo Trúc Âu Cơ",
  description: "Cổng tra cứu lịch học, số buổi đã học và điểm danh điện tử dành cho học viên Sáo Trúc Âu Cơ.",
  robots: { index: false, follow: false },
};

export default function AttendanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
