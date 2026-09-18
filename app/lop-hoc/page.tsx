import { ClassesPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Lớp Học Sáo Trúc Tại TP.HCM & Online 1 Kèm 1 | Sáo Trúc Âu Cơ" },
  description: "Khóa học sáo trúc tại TP.HCM và Online 1 kèm 1 cho người mới bắt đầu đến nâng cao. Đào tạo sáo trúc Việt Nam, Sáo Dizi, Động Tiêu, Sáo Recorder, Flute chuẩn kỹ thuật.",
  keywords: [
    "lớp học sáo trúc",
    "lớp học sáo trúc tphcm",
    "học sáo trúc",
    "học sáo trúc online",
    "học thổi sáo",
    "dạy thổi sáo tân phú",
    "khóa học sáo trúc 1 kèm 1",
    "học sáo dizi",
    "học thổi tiêu",
    "học sáo recorder",
    "Sáo Trúc Âu Cơ",
  ],
  alternates: {
    canonical: "https://saotrucauco.com/lop-hoc",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://saotrucauco.com/lop-hoc",
    siteName: "Sáo Trúc Âu Cơ",
    title: "Lớp Học Sáo Trúc Tại TP.HCM & Online 1 Kèm 1 | Sáo Trúc Âu Cơ",
    description: "Khóa học sáo trúc tại TP.HCM và Online 1 kèm 1 cho người mới bắt đầu đến nâng cao. Đào tạo sáo trúc Việt Nam, Sáo Dizi, Động Tiêu, Sáo Recorder, Flute chuẩn kỹ thuật.",
    images: [{ url: "/carousel-saotruc.webp", width: 1672, height: 941, alt: "Lớp học sáo trúc tại TP.HCM - Sáo Trúc Âu Cơ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lớp Học Sáo Trúc Tại TP.HCM & Online 1 Kèm 1 | Sáo Trúc Âu Cơ",
    description: "Khóa học sáo trúc tại TP.HCM và Online 1 kèm 1 cho người mới bắt đầu đến nâng cao.",
    images: ["/carousel-saotruc.webp"],
  },
};

const lopHocJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Course",
      "@id": "https://saotrucauco.com/lop-hoc#courses",
      name: "Khóa Học Sáo Trúc & Nhạc Cụ Dân Tộc Tại TP.HCM & Online",
      description: "Chương trình đào tạo sáo trúc Việt Nam, Dizi, Động Tiêu, Recorder, Flute từ cơ bản đến nâng cao theo hình thức học kèm 1:1 trực tiếp và online.",
      provider: {
        "@type": "Organization",
        name: "Sáo Trúc Âu Cơ",
        url: "https://saotrucauco.com",
      },
      hasCourseInstance: [
        {
          "@type": "CourseInstance",
          courseMode: "onsite",
          courseSchedule: "Linh hoạt sáng, chiều, tối các ngày trong tuần",
          name: "Lớp học sáo trúc trực tiếp tại TP.HCM (Tân Phú)",
          location: {
            "@type": "Place",
            name: "Sáo Trúc Âu Cơ",
            address: {
              "@type": "PostalAddress",
              streetAddress: "106/72 Hòa Bình, Phường Hiệp Tân, Quận Tân Phú",
              addressLocality: "Hồ Chí Minh",
              addressCountry: "VN",
            },
          },
        },
        {
          "@type": "CourseInstance",
          courseMode: "online",
          name: "Lớp học sáo trúc Online 1 kèm 1 qua Video Call HD",
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://saotrucauco.com/lop-hoc#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://saotrucauco.com" },
        { "@type": "ListItem", position: 2, name: "Lớp học sáo trúc", item: "https://saotrucauco.com/lop-hoc" },
      ],
    },
    {
      "@type": "ItemList",
      "@id": "https://saotrucauco.com/lop-hoc#disciplines",
      name: "Danh sách bộ môn sáo đào tạo tại Sáo Trúc Âu Cơ",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Sáo trúc Việt Nam",
          url: "https://saotrucauco.com/bo-mon/sao-truc-viet-nam",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Sáo Dizi Trung Quốc",
          url: "https://saotrucauco.com/bo-mon/sao-dizi",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Sáo Recorder",
          url: "https://saotrucauco.com/bo-mon/sao-recorder",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Động tiêu & Xiao",
          url: "https://saotrucauco.com/bo-mon/dong-tieu-xiao",
        },
        {
          "@type": "ListItem",
          position: 5,
          name: "Flute phương Tây",
          url: "https://saotrucauco.com/bo-mon/flute",
        },
        {
          "@type": "ListItem",
          position: 6,
          name: "Sáo H'Mông / Sáo Mèo",
          url: "https://saotrucauco.com/bo-mon/sao-hmong",
        },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lopHocJsonLd) }}
      />
      <ClassesPage />
    </>
  );
}
