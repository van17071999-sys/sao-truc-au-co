import type { Metadata } from "next";
import "./globals.css";

const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };

export const metadata: Metadata = {
  metadataBase: new URL("https://saotrucauco.com"),
  title: {
    default: "Sáo Trúc Âu Cơ | Trung Tâm Đào Tạo Sáo Trúc, Bán Sáo Chuẩn Âm & Cảm Âm Chuẩn",
    template: "%s | Sáo Trúc Âu Cơ",
  },
  description: "Sáo Trúc Âu Cơ - Đào tạo sáo trúc Việt Nam, sáo Dizi, tiêu, sáo Mèo, recorder, flute chuyên nghiệp tại TP.HCM & Online 1 kèm 1 toàn cầu. Cung cấp sáo trúc chuẩn âm cao cấp, kho cảm âm 2 dòng miễn phí, giáo trình bài bản, dịch vụ thu âm nhạc cụ dân tộc và booking nghệ sĩ biểu diễn.",
  keywords: [
    "Sáo Trúc Âu Cơ",
    "sao truc au co",
    "học thổi sáo",
    "học sáo trúc",
    "học sáo trúc tphcm",
    "học sáo trúc online",
    "dạy sáo trúc",
    "sáo trúc việt nam",
    "cảm âm sáo trúc",
    "cam am sao truc",
    "mua sáo trúc",
    "bán sáo trúc chuẩn âm",
    "sáo dizi",
    "sáo mèo",
    "động tiêu",
    "sáo recorder",
    "flute",
    "khóa học sáo trúc",
    "khóa học thổi sáo cho người mới",
    "tự học sáo trúc",
    "sheet sáo trúc",
    "giáo trình sáo trúc",
    "thu âm sáo trúc",
    "thu âm nhạc cụ dân tộc",
    "booking nghệ sĩ sáo trúc",
    "ban nhạc dân tộc sự kiện",
  ],
  alternates: { canonical: "https://saotrucauco.com" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://saotrucauco.com",
    siteName: "Sáo Trúc Âu Cơ",
    title: "Sáo Trúc Âu Cơ | Đào Tạo Sáo Trúc, Bán Sáo Chuẩn Âm & Âm Nhạc Dân Tộc Chuyên Nghiệp",
    description: "Khóa học sáo trúc trực tiếp tại TP.HCM & online 1 kèm 1 toàn quốc. Cung cấp nhạc cụ dân tộc chuẩn âm, kho cảm âm miễn phí và phòng thu âm chuyên nghiệp.",
    images: [{ url: "/logo.jpg", width: 1024, height: 1024, alt: "Logo Sáo Trúc Âu Cơ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sáo Trúc Âu Cơ | Đào Tạo Sáo Trúc & Nhạc Cụ Dân Tộc",
    description: "Khóa học thổi sáo từ cơ bản đến nâng cao, bán sáo chuẩn âm, cảm âm 2 dòng và thu âm nhạc cụ dân tộc.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/logo.jpg",
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MusicSchool",
      "@id": "https://saotrucauco.com/#school",
      name: "Sáo Trúc Âu Cơ",
      alternateName: ["Au Co Bamboo Flute", "Trung Tâm Sáo Trúc Âu Cơ"],
      url: "https://saotrucauco.com",
      logo: "https://saotrucauco.com/logo.jpg",
      image: "https://saotrucauco.com/logo.jpg",
      description: "Trung tâm đào tạo sáo trúc Việt Nam, Dizi, Tiêu, Recorder, Flute, phân phối nhạc cụ dân tộc chuẩn âm và dịch vụ thu âm nhạc cụ chuyên nghiệp.",
      telephone: "+84374261368",
      email: "vanquach999x@gmail.com",
      priceRange: "50.000đ - 3.000.000đ",
      address: {
        "@type": "PostalAddress",
        streetAddress: "106/72 Hòa Bình, P. Tân Phú",
        addressLocality: "Hồ Chí Minh",
        addressRegion: "Hồ Chí Minh",
        postalCode: "700000",
        addressCountry: "VN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "10.7679",
        longitude: "106.6341",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "08:00",
          closes: "21:30",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "128",
        bestRating: "5",
        worstRating: "1",
      },
      sameAs: [
        "https://www.youtube.com/@saotrucauco",
        "https://www.facebook.com/saotrucauco",
        "https://www.tiktok.com/@saotrucauco",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://saotrucauco.com/#website",
      url: "https://saotrucauco.com",
      name: "Sáo Trúc Âu Cơ",
      publisher: { "@id": "https://saotrucauco.com/#school" },
      inLanguage: ["vi-VN", "en-US"],
      potentialAction: {
        "@type": "SearchAction",
        target: "https://saotrucauco.com/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

import { LanguageProvider } from "./i18n-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
