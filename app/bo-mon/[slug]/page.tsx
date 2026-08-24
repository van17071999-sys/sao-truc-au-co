import type { Metadata } from "next";
import { SubjectDetail } from "../../cms-content-pages";
import { catalogMetadata } from "../../catalog-metadata";
import { getDisciplineSeo } from "../../discipline-seo-data";

const siteUrl = "https://saotrucauco.com";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const seo = getDisciplineSeo(slug);

  if (!seo) {
    return catalogMetadata(params, "Lớp học", "bo-mon");
  }

  const canonicalUrl = `${siteUrl}/bo-mon/${slug}`;

  return {
    title: seo.seoTitle,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: "Sáo Trúc Âu Cơ",
      title: `${seo.seoTitle} | Sáo Trúc Âu Cơ`,
      description: seo.description,
      url: canonicalUrl,
      images: [
        {
          url: `${siteUrl}${seo.image}`,
          alt: `${seo.seoTitle} | Sáo Trúc Âu Cơ`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.seoTitle} | Sáo Trúc Âu Cơ`,
      description: seo.description,
      images: [`${siteUrl}${seo.image}`],
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
  const seo = getDisciplineSeo(slug);
  const canonicalUrl = `${siteUrl}/bo-mon/${slug}`;

  const structuredData = seo ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "@id": `${canonicalUrl}#course`,
        name: seo.seoTitle,
        description: seo.description,
        provider: {
          "@type": "Organization",
          name: "Sáo Trúc Âu Cơ",
          url: siteUrl,
        },
        hasCourseInstance: [
          {
            "@type": "CourseInstance",
            courseMode: "onsite",
            courseSchedule: "Linh động theo lịch học viên",
            name: "Lớp học trực tiếp tại TP.HCM",
          },
          {
            "@type": "CourseInstance",
            courseMode: "online",
            name: "Lớp học Online 1 kèm 1",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Lớp học", item: `${siteUrl}/lop-hoc` },
          { "@type": "ListItem", position: 3, name: seo.seoTitle.split("|")[0].trim(), item: canonicalUrl },
        ],
      },
    ],
  } : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <SubjectDetail />
    </>
  );
}

