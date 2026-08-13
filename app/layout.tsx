import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hong-viet-sao-truc.van17071999.chatgpt.site"),
  title: {
    default: "Hồng Việt Sáo Trúc | Dạy sáo & âm nhạc dân tộc",
    template: "%s | Hồng Việt Sáo Trúc",
  },
  description: "Dạy sáo trúc, Dizi, recorder, flute; giáo trình, sheet nhạc, thu âm và booking biểu diễn nhạc cụ dân tộc.",
  keywords: ["học sáo trúc", "dạy sáo trúc", "sáo Dizi", "sáo recorder", "Hồng Việt Sáo Trúc"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Hồng Việt Sáo Trúc",
    title: "Hồng Việt Sáo Trúc | Dạy sáo & âm nhạc dân tộc",
    description: "Lộ trình học sáo bài bản, giáo trình, sheet nhạc, thu âm và booking biểu diễn.",
    images: [{ url: "/hero-flute.webp", width: 1536, height: 1024, alt: "Hồng Việt Sáo Trúc" }],
  },
  twitter: { card: "summary_large_image", images: ["/hero-flute.webp"] },
  robots: { index: true, follow: true },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
