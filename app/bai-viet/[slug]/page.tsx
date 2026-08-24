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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getSeoArticle(slug);

  if (!article || article.slug !== hocThoiSaoHcmArticle.slug) {
    return {
      title: "Bài viết",
      alternates: { canonical: `/bai-viet/${slug}` },
    };
  }

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      "học thổi sáo TP.HCM",
      "lớp học sáo trúc Tân Phú",
      "lớp học sáo Tân Bình",
      "học sáo trúc cho người mới",
      "học sáo trúc online",
    ],
    alternates: { canonical: targetPath },
    openGraph: {
      type: "article",
      locale: "vi_VN",
      url: targetPath,
      siteName: "Sáo Trúc Âu Cơ",
      title: `${seoTitle} | Sáo Trúc Âu Cơ`,
      description: seoDescription,
      publishedTime: "2026-08-20T00:00:00+07:00",
      modifiedTime: "2026-08-20T16:32:29+07:00",
      images: [{
        url: article.imageUrl,
        alt: "Lớp học thổi sáo tại TP.HCM của Sáo Trúc Âu Cơ",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${seoTitle} | Sáo Trúc Âu Cơ`,
      description: seoDescription,
      images: [article.imageUrl],
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
