import { ContactPage } from "@/app/service-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Đăng Ký Học Sáo Trúc Tại TP.HCM & Online 1 Kèm 1 | Sáo Trúc Âu Cơ" },
  description: "Đăng ký lớp học sáo trúc, sáo Dizi, Động Tiêu, Recorder trực tiếp tại TP.HCM hoặc học online 1 kèm 1. Tư vấn lộ trình học bài bản và xếp lịch linh hoạt.",
  keywords: [
    "đăng ký học sáo trúc",
    "đăng ký học sáo",
    "học phí học sáo trúc",
    "tư vấn học sáo trúc",
    "lớp học sáo trúc tân phú",
    "học sáo trúc kèm 1 1",
    "đăng ký lớp học sáo online",
    "Sáo Trúc Âu Cơ",
  ],
  alternates: {
    canonical: "https://saotrucauco.com/dang-ky-hoc",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://saotrucauco.com/dang-ky-hoc",
    siteName: "Sáo Trúc Âu Cơ",
    title: "Đăng Ký Học Sáo Trúc Tại TP.HCM & Online 1 Kèm 1 | Sáo Trúc Âu Cơ",
    description: "Đăng ký lớp học sáo trúc, sáo Dizi, Động Tiêu, Recorder trực tiếp tại TP.HCM hoặc học online 1 kèm 1. Tư vấn lộ trình học bài bản và xếp lịch linh hoạt.",
    images: [{ url: "/carousel-saotruc.webp", width: 1672, height: 941, alt: "Đăng ký học sáo trúc - Sáo Trúc Âu Cơ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Đăng Ký Học Sáo Trúc Tại TP.HCM & Online 1 Kèm 1 | Sáo Trúc Âu Cơ",
    description: "Đăng ký lớp học sáo trúc, sáo Dizi, Động Tiêu, Recorder trực tiếp tại TP.HCM hoặc học online 1 kèm 1.",
    images: ["/carousel-saotruc.webp"],
  },
};

const dangKyHocJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "https://saotrucauco.com/dang-ky-hoc#webpage",
      url: "https://saotrucauco.com/dang-ky-hoc",
      name: "Đăng Ký Học Sáo Trúc Tại TP.HCM & Online 1 Kèm 1",
      description: "Trang liên hệ tư vấn và đăng ký học sáo trúc, sáo Dizi, tiêu, recorder tại Sáo Trúc Âu Cơ.",
      mainEntity: {
        "@type": "MusicSchool",
        name: "Sáo Trúc Âu Cơ",
        telephone: "+84374261368",
        email: "vanquach999x@gmail.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "106/72 Hòa Bình, Phường Hiệp Tân, Quận Tân Phú",
          addressLocality: "Hồ Chí Minh",
          addressCountry: "VN",
        },
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://saotrucauco.com/dang-ky-hoc#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://saotrucauco.com" },
        { "@type": "ListItem", position: 2, name: "Đăng ký học", item: "https://saotrucauco.com/dang-ky-hoc" },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dangKyHocJsonLd) }}
      />
      <ContactPage />
    </>
  );
}
