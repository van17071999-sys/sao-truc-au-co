import type { Metadata } from "next";
import { GuideDetail } from "../../cms-content-pages";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Hướng Dẫn Kỹ Thuật & Video Sáo Trúc`,
    description: `Bài viết và video hướng dẫn kỹ thuật thổi sáo trúc tại Sáo Trúc Âu Cơ.`,
    alternates: {
      canonical: `https://saotrucauco.com/huong-dan/${slug}`,
    },
    openGraph: {
      title: `Hướng Dẫn Kỹ Thuật & Video Sáo Trúc`,
      description: `Bài viết và video hướng dẫn kỹ thuật thổi sáo trúc tại Sáo Trúc Âu Cơ.`,
      url: `https://saotrucauco.com/huong-dan/${slug}`,
      siteName: "Sáo Trúc Âu Cơ",
      type: "article",
    },
  };
}

export default function HuongDanDetailPage() {
  return <GuideDetail />;
}
