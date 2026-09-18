import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Báo Cáo Analytics Nội Bộ | saotrucauco.com",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <div
        className="analytics-shell min-h-screen text-[#292421]"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          backgroundColor: "#FAF6EE",
          backgroundImage: "radial-gradient(#DCCFB7 0.75px, transparent 0.75px)",
          backgroundSize: "20px 20px",
        }}
      >
        {children}
      </div>
    </>
  );
}
