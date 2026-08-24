import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./i18n-context";

const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };

export const metadata: Metadata = {
  metadataBase: new URL("https://saotrucauco.com"),
  title: {
    default: "Sáo Trúc Âu Cơ | Lớp Học Sáo Trúc TP.HCM & Online - Bán Sáo Chuẩn Âm",
    template: "%s | Sáo Trúc Âu Cơ",
  },
  description: "Trung tâm đào tạo Sáo Trúc Âu Cơ uy tín tại TP.HCM & Online toàn cầu: Dạy thổi Sáo Trúc Việt Nam, Sáo Dizi, Động Tiêu, Sáo Recorder, Flute, Sáo Mèo. Cung cấp sáo trúc cao cấp chuẩn âm, kho cảm âm bài bản, giáo trình học thổi sáo từ cơ bản đến nâng cao và dịch vụ thu âm biểu diễn chuyên nghiệp.",
  keywords: [
    "sáo trúc âu cơ",
    "sao truc au co",
    "học sáo trúc",
    "hoc sao truc",
    "lớp học sáo trúc tphcm",
    "học sáo trúc online",
    "dạy thổi sáo",
    "day thoi sao tphcm",
    "học thổi sáo cho người mới",
    "khóa học sáo trúc",
    "sáo trúc việt nam",
    "sáo dizi",
    "học sáo dizi",
    "động tiêu",
    "học thổi tiêu",
    "sáo recorder",
    "sáo mèo",
    "sáo flute",
    "cảm âm sáo trúc",
    "cam am sao truc",
    "kho cảm âm chuẩn",
    "mua sáo trúc",
    "bán sáo trúc chuẩn âm",
    "sáo trúc tân phú",
    "sheet sáo trúc",
    "giáo trình tự học sáo trúc",
    "thu âm sáo trúc",
    "thu âm nhạc cụ dân tộc",
    "booking nghệ sĩ sáo trúc",
    "biểu diễn nhạc cụ dân tộc",
  ],
  authors: [{ name: "Sáo Trúc Âu Cơ", url: "https://saotrucauco.com" }],
  creator: "Sáo Trúc Âu Cơ",
  publisher: "Sáo Trúc Âu Cơ",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: "https://saotrucauco.com",
    languages: {
      "vi-VN": "https://saotrucauco.com",
      "en-US": "https://saotrucauco.com",
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://saotrucauco.com",
    siteName: "Sáo Trúc Âu Cơ",
    title: "Sáo Trúc Âu Cơ | Lớp Học Sáo Trúc TP.HCM & Online - Bán Sáo Chuẩn Âm",
    description: "Trung tâm đào tạo sáo trúc và nhạc cụ dân tộc uy tín: Lớp học trực tiếp tại TP.HCM & Online 1 kèm 1, cung cấp sáo chuẩn âm cao cấp, kho cảm âm phong phú và phòng thu âm chuyên nghiệp.",
    images: [
      {
        url: "https://saotrucauco.com/logo.jpg",
        width: 1024,
        height: 1024,
        alt: "Logo Sáo Trúc Âu Cơ - Giảng Dạy & Biểu Diễn Sáo Trúc Chuyên Nghiệp",
      },
      {
        url: "https://saotrucauco.com/carousel-saotruc.webp",
        width: 1672,
        height: 941,
        alt: "Khóa học sáo trúc Việt Nam tại Sáo Trúc Âu Cơ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sáo Trúc Âu Cơ | Lớp Học Sáo Trúc & Nhạc Cụ Dân Tộc TP.HCM & Online",
    description: "Đào tạo sáo trúc từ cơ bản đến chuyên nghiệp, cung cấp sáo chuẩn âm và kho cảm âm miễn phí.",
    images: ["https://saotrucauco.com/logo.jpg"],
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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/logo.jpg", sizes: "1024x1024", type: "image/jpeg" },
    ],
  },
  manifest: "/site.webmanifest",
  category: "music",
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["MusicSchool", "LocalBusiness", "EducationalOrganization"],
      "@id": "https://saotrucauco.com/#school",
      name: "Sáo Trúc Âu Cơ",
      alternateName: ["Trung Tâm Sáo Trúc Âu Cơ", "Au Co Bamboo Flute School", "Sáo Trúc Âu Cơ TP.HCM"],
      url: "https://saotrucauco.com",
      logo: "https://saotrucauco.com/icon-512.png",
      image: "https://saotrucauco.com/logo.jpg",
      description: "Trung tâm đào tạo sáo trúc Việt Nam, Sáo Dizi, Động Tiêu, Sáo Recorder, Flute chuyên nghiệp tại TP.HCM & Online toàn quốc. Cung cấp nhạc cụ dân tộc chuẩn âm, cảm âm 2 dòng và dịch vụ thu âm biểu diễn.",
      telephone: "+84374261368",
      email: "vanquach999x@gmail.com",
      priceRange: "50.000đ - 3.500.000đ",
      currenciesAccepted: "VND",
      paymentAccepted: "Cash, Credit Card, Bank Transfer, VietQR",
      address: {
        "@type": "PostalAddress",
        streetAddress: "106/72 Hòa Bình, Phường Hiệp Tân, Quận Tân Phú",
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
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Khóa Học & Dịch Vụ Sáo Trúc Âu Cơ",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Khóa Học Sáo Trúc Việt Nam Cơ Bản & Nâng Cao",
              description: "Học thổi sáo trúc từ số 0, làm quen khẩu hình, thế bấm nốt, rung hơi, láy ngón và thổi hoàn chỉnh các bài nhạc.",
              provider: { "@id": "https://saotrucauco.com/#school" },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Khóa Học Sáo Dizi Trung Hoa",
              description: "Kỹ thuật dán màng rung, rung hơi nhạc Hoa, vuốt ngón, phi ngón và các ca khúc cổ phong.",
              provider: { "@id": "https://saotrucauco.com/#school" },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Khóa Học Động Tiêu & Xiao",
              description: "Âm sắc trầm ấm, thư giãn, phương pháp lấy hơi sâu và kỹ thuật diễn tấu tiêu thiền định.",
              provider: { "@id": "https://saotrucauco.com/#school" },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Khóa Học Sáo Recorder & Sáo Flute",
              description: "Học sáo phương Tây, đọc bản nhạc chuẩn quốc tế, hòa tấu và luyện thanh nhạc cụ.",
              provider: { "@id": "https://saotrucauco.com/#school" },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Sáo Trúc & Nhạc Cụ Dân Tộc Chuẩn Âm",
              description: "Cung cấp sáo nứa Bắc, nứa Nam, sáo Dizi, tiêu bát khổng, sáo Mèo chuẩn cao độ 440Hz/442Hz.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Thu Âm, Phối Khí & Booking Nghệ Sĩ Biểu Diễn Nhạc Cụ Dân Tộc",
              description: "Dịch vụ phòng thu âm chuyên nghiệp cho nhạc cụ dân tộc và biểu diễn sự kiện, hội nghị, đám cưới.",
            },
          },
        ],
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
    },
    {
      "@type": "FAQPage",
      "@id": "https://saotrucauco.com/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Người mới bắt đầu chưa biết gì có học thổi sáo trúc được không?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Hoàn toàn được! Giáo trình tại Sáo Trúc Âu Cơ được thiết kế khoa học, từ cách ngậm môi tạo khẩu hình phát ra tiếng kêu trong 15 phút đầu tiên, cho đến cách bấm nốt và hoàn thành bài hát đầu tiên sau 3-5 buổi học.",
          },
        },
        {
          "@type": "Question",
          name: "Sáo Trúc Âu Cơ có dạy sáo trúc online cho học viên ở xa hoặc nước ngoài không?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Có. Sáo Trúc Âu Cơ có lớp học kèm 1-1 Online qua Video Call và hệ thống video bài giảng chi tiết, hỗ trợ chỉnh sửa khẩu hình và ngón bấm từng buổi cho học viên ở tất cả các tỉnh thành và học viên tại nước ngoài.",
          },
        },
        {
          "@type": "Question",
          name: "Địa chỉ lớp học sáo trúc tại TP.HCM ở đâu?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Lớp học trực tiếp tại TP.HCM tọa lạc tại 106/72 Hòa Bình, Phường Hiệp Tân, Quận Tân Phú, TP. Hồ Chí Minh. Hotline/Zalo tư vấn: 0374 261 368.",
          },
        },
        {
          "@type": "Question",
          name: "Tôi có thể mua sáo trúc chuẩn âm tại Sáo Trúc Âu Cơ không?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Có. Sáo Trúc Âu Cơ cung cấp đầy đủ các loại Sáo Trúc Việt Nam (sáo Đô C5, La Trầm A4, Sol G4...), Sáo Dizi, Động Tiêu, Sáo Recorder, Sáo Mèo... được tuyển chọn kỹ lưỡng, đo tần số chuẩn âm 100% bằng máy chuyên dụng.",
          },
        },
        {
          "@type": "Question",
          name: "Học thổi sáo trúc mất bao lâu thì thổi được các bài nhạc yêu thích?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Với lộ trình chuẩn tại Sáo Trúc Âu Cơ, chỉ sau 1 đến 2 tháng (khoảng 8-12 buổi học), bạn đã có thể nắm vững nhạc lý cơ bản, bấm chuẩn các thế bấm và tự thổi trôi chảy các bài dân ca, nhạc trẻ, nhạc Hoa mà mình yêu thích.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="144x144" href="/favicon-144x144.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#63172f" />
        <meta name="geo.region" content="VN-SG" />
        <meta name="geo.placename" content="Hồ Chí Minh" />
        <meta name="geo.position" content="10.7679;106.6341" />
        <meta name="ICBM" content="10.7679, 106.6341" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
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
