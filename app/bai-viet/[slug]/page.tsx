import type { Metadata } from "next";
import { NewsDetail } from "../../cms-content-pages";
import { getSeoArticle, hocThoiSaoHcmArticle } from "../../seo-article-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const siteUrl = "https://saotrucauco.com";
const targetPath = `/bai-viet/${hocThoiSaoHcmArticle.slug}`;
const seoTitle = "Học Thổi Sáo Tại TP.HCM – Lớp Sáo Trúc Tân Phú";
const seoDescription = "Lớp học thổi sáo tại Tân Phú, TP.HCM cho người mới và học viên nâng cao. Học trực tiếp hoặc online theo lộ trình bài bản tại Sáo Trúc Âu Cơ.";

const articleMetadataMap: Record<string, { title: string; description: string }> = {
  "5-buoc-tao-tieng-sao": {
    title: "5 Bước Tạo Tiếng Sáo Trong Cho Người Mới",
    description: "Hướng dẫn 5 bước cơ bản từ tư thế, khẩu hình đến luồng hơi giúp người mới thổi sáo phát ra âm thanh trong trẻo, tròn và ổn định.",
  },
  "nguoi-moi-chon-sao-tone-nao": {
    title: "Người Mới Nên Chọn Sáo Tone Nào?",
    description: "So sánh chi tiết sáo Đô C5, La A4 và Sol G4 để người mới bắt đầu dễ dàng chọn được cây sáo phù hợp với mục tiêu học tập.",
  },
  "cach-luyen-hoi-dai": {
    title: "Cách Luyện Hơi Dài Khi Thổi Sáo",
    description: "Phương pháp luyện tập cột hơi bằng cơ hoành mỗi ngày giúp hơi dài, không bị mệt và kiểm soát tốt cao độ khi thổi sáo trúc.",
  },
  "hoc-thoi-sao-hcm": {
    title: "Học Thổi Sáo Tại TP.HCM – Lớp Sáo Trúc Tân Phú",
    description: "Lớp học thổi sáo tại Tân Phú, TP.HCM cho người mới và học viên nâng cao. Học trực tiếp hoặc online theo lộ trình bài bản tại Sáo Trúc Âu Cơ.",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getSeoArticle(slug);
  const articleInfo = articleMetadataMap[slug];

  const title = articleInfo?.title || article?.title || "Bài Viết Sáo Trúc";
  const description = articleInfo?.description || article?.excerpt || "Kiến thức, hướng dẫn và kỹ thuật thổi sáo trúc từ Sáo Trúc Âu Cơ.";
  const canonicalUrl = `${siteUrl}/bai-viet/${slug}`;
  const fullTitle = `${title} | Sáo Trúc Âu Cơ`;
  const imageUrl = article?.imageUrl || `${siteUrl}/logo.jpg`;

  return {
    title: { absolute: fullTitle },
    description,
    keywords: [
      title,
      "học thổi sáo TP.HCM",
      "sáo trúc Việt Nam",
      "kỹ thuật sáo trúc",
      "Sáo Trúc Âu Cơ",
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      locale: "vi_VN",
      url: canonicalUrl,
      siteName: "Sáo Trúc Âu Cơ",
      title: fullTitle,
      description,
      publishedTime: article?.publishedAt ? `${article.publishedAt}T00:00:00+07:00` : undefined,
      images: [{
        url: imageUrl.startsWith("http") ? imageUrl : `${siteUrl}${imageUrl}`,
        alt: fullTitle,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl.startsWith("http") ? imageUrl : `${siteUrl}${imageUrl}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const article = getSeoArticle(slug);
  const isTargetArticle = article?.slug === hocThoiSaoHcmArticle.slug;
  const canonicalUrl = `${siteUrl}${targetPath}`;

  const structuredData = isTargetArticle ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${canonicalUrl}#article`,
        headline: seoTitle,
        description: seoDescription,
        image: `${siteUrl}${article.imageUrl}`,
        datePublished: "2026-08-20T00:00:00+07:00",
        dateModified: "2026-08-20T16:32:29+07:00",
        inLanguage: "vi-VN",
        mainEntityOfPage: canonicalUrl,
        author: { "@id": `${siteUrl}/#school` },
        publisher: { "@id": `${siteUrl}/#school` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Bài viết", item: `${siteUrl}/bai-viet` },
          { "@type": "ListItem", position: 3, name: "Học thổi sáo tại TP.HCM", item: canonicalUrl },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Học sáo bao lâu thì có thể thổi được một bài?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Thời gian tiến bộ tùy độ tuổi, thời gian luyện tập, khả năng cảm âm và mức độ đều đặn. Người mới nên ưu tiên âm thanh rõ, hơi ổn định, bấm nốt chính xác và giữ đúng nhịp trước khi tăng số lượng bài.",
            },
          },
          {
            "@type": "Question",
            name: "Có thể học sáo online không?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Có. Người ở xa hoặc không thuận tiện di chuyển có thể chọn học online, chuẩn bị nhạc cụ phù hợp và không gian yên tĩnh để giáo viên nghe và chỉnh sửa âm thanh.",
            },
          },
          {
            "@type": "Question",
            name: "Ai phù hợp với lớp học sáo?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Lớp học phù hợp với học sinh, sinh viên, người đi làm, người yêu âm nhạc dân tộc và cả người mới chưa biết nhạc lý.",
            },
          },
        ],
      },
    ],
  } : null;

  return <>
    {structuredData && <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
    />}
    <NewsDetail initialEntry={article} />
  </>;
}
