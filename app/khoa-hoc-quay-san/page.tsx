import { RecordedCoursesPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Khóa Học Sáo Trúc Online Qua Video HD – Tự Học Sáo Tại Nhà | Sáo Trúc Âu Cơ" },
  description: "Khóa học sáo trúc online qua video bài giảng HD trọn đời từ cơ bản đến nâng cao. Tự học sáo trúc tại nhà với lộ trình chi tiết từng câu, sheet nốt và cảm âm chuẩn.",
  keywords: [
    "khóa học sáo trúc online",
    "tự học sáo trúc",
    "học sáo trúc qua video",
    "tự học sáo trúc tại nhà",
    "giáo trình video học sáo",
    "khóa học sáo dizi online",
    "video hướng dẫn thổi sáo",
    "học sáo mèo online",
    "Sáo Trúc Âu Cơ",
  ],
  alternates: {
    canonical: "https://saotrucauco.com/khoa-hoc-quay-san",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://saotrucauco.com/khoa-hoc-quay-san",
    siteName: "Sáo Trúc Âu Cơ",
    title: "Khóa Học Sáo Trúc Online Qua Video HD – Tự Học Sáo Tại Nhà | Sáo Trúc Âu Cơ",
    description: "Khóa học sáo trúc online qua video bài giảng HD trọn đời từ cơ bản đến nâng cao. Tự học sáo trúc tại nhà với lộ trình chi tiết từng câu, sheet nốt và cảm âm chuẩn.",
    images: [{ url: "/carousel-saotruc.webp", width: 1672, height: 941, alt: "Khóa học sáo trúc online qua video bài giảng HD" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khóa Học Sáo Trúc Online Qua Video HD – Tự Học Sáo Tại Nhà | Sáo Trúc Âu Cơ",
    description: "Khóa học sáo trúc online qua video bài giảng HD trọn đời từ cơ bản đến nâng cao.",
    images: ["/carousel-saotruc.webp"],
  },
};

const khoaHocOnlineJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Course",
      "@id": "https://saotrucauco.com/khoa-hoc-quay-san#course",
      name: "Khóa Học Sáo Trúc & Nhạc Cụ Dân Tộc Online Qua Video HD",
      description: "Hệ thống video bài giảng chất lượng cao hướng dẫn tự học sáo trúc, sáo Dizi, sáo mèo, recorder từ cơ bản đến nâng cao, xem lại trọn đời.",
      provider: {
        "@type": "Organization",
        name: "Sáo Trúc Âu Cơ",
        url: "https://saotrucauco.com",
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseSchedule: "Tự do linh hoạt 24/7",
        name: "Học sáo online qua video bài giảng HD trọn đời",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://saotrucauco.com/khoa-hoc-quay-san#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://saotrucauco.com" },
        { "@type": "ListItem", position: 2, name: "Khóa học quay sẵn", item: "https://saotrucauco.com/khoa-hoc-quay-san" },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(khoaHocOnlineJsonLd) }}
      />
      <RecordedCoursesPage />
    </>
  );
}
