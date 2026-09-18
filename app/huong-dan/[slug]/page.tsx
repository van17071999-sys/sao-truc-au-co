import type { Metadata } from "next";
import { GuideDetail } from "../../cms-content-pages";
import { getGuideBySlug } from "../../seo-pre-render-data";

const guideTitles: Record<string, string> = {
  "cach-lay-hoi-va-tao-tieng-sao-tron-ro": "Cách Lấy Hơi Và Tạo Tiếng Sáo Tròn, Rõ",
  "meo-sua-loi-xi-tieng-va-rung-ngon": "Mẹo Sửa Lỗi Xì Tiếng Và Rung Ngón Khi Thổi Sáo",
  "chon-nhac-cu-va-xay-dung-lo-trinh-hoc": "Hướng Dẫn Chọn Nhạc Cụ Và Lộ Trình Học Sáo",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const rawTitle = slug.split("-").filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const baseTitle = guideTitles[slug] || `Hướng Dẫn ${rawTitle}`;
  const fullTitle = `${baseTitle} | Sáo Trúc Âu Cơ`;
  const canonicalUrl = `https://saotrucauco.com/huong-dan/${slug}`;

  return {
    title: { absolute: fullTitle },
    description: `Bài viết và video hướng dẫn ${baseTitle} chi tiết từ Sáo Trúc Âu Cơ.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: `Bài viết và video hướng dẫn ${baseTitle} chi tiết từ Sáo Trúc Âu Cơ.`,
      url: canonicalUrl,
      siteName: "Sáo Trúc Âu Cơ",
      type: "article",
    },
  };
}

export default async function HuongDanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const initialEntry = getGuideBySlug(slug);
  return <GuideDetail initialEntry={initialEntry} />;
}
