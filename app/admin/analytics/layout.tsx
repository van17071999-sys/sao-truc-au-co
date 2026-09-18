import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Báo Cáo Analytics & Hành Vi Khách Hàng | Sáo Trúc Âu Cơ",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <div className="analytics-root-container min-h-screen bg-[#11050a] text-slate-100">{children}</div>;
}
