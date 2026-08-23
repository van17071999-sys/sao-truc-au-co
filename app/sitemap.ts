import type { MetadataRoute } from "next";

const subjects = ["sao-truc-viet-nam", "sao-dizi", "sao-recorder", "dong-tieu-xiao", "flute", "sao-hmong"];
const articleSlugs = ["hoc-thoi-sao-hcm", "5-buoc-tao-tieng-sao", "nguoi-moi-chon-sao-tone-nao", "cach-luyen-hoi-dai"];
const fluteTabSlugs = ["beo-dat-may-troi", "ve-que", "tinh-ca-tay-bac"];
const catalogPaths = [
  ..."dan-ca-nhac-co nhac-dan-gian nhac-tru-tinh-bolero nhac-tre sao-meo-co-ban nhac-ngu-cung giao-trinh-steiner nhac-thieu-nhi dizi-co-ban nhac-hoa-loi-viet".split(" ").map((slug) => `/khoa-hoc/${slug}`),
  ..."beo-dat-may-troi-sao-truc ve-que-sao-truc tinh-ca-tay-bac-sao-truc dai-ngu-sao-dizi than-thoai-sao-dizi luong-son-ba-chuc-anh-dai-sao-dizi inh-la-oi-sao-meo xuan-ve-ban-mong-sao-meo goi-em-ben-suoi-sao-meo vo-ky-tieu-xiao co-mong-tieu-xiao tinh-tam-tieu-xiao always-with-me-recorder ly-cay-xanh-recorder con-chim-non-recorder the-swan-flute canon-in-d-flute a-thousand-years-flute".split(" ").map((slug) => `/video/${slug}`),
  ..."giao-trinh-tong-hop giao-trinh-co-ban giao-trinh-nang-cao giao-trinh-gam-etude giao-trinh-dan-ca ca-khuc-chuyen-soan-theo-chu-de giao-trinh-tong-hop-dizi giao-trinh-co-ban-dizi giao-trinh-nang-cao-dizi giao-trinh-gam-etude-dizi giao-trinh-dan-ca-dizi ca-khuc-chuyen-soan-theo-chu-de-dizi giao-trinh-tong-hop-sao-recorder giao-trinh-co-ban-sao-recorder giao-trinh-nang-cao-sao-recorder giao-trinh-gam-etude-sao-recorder giao-trinh-dan-ca-sao-recorder ca-khuc-chuyen-soan-theo-chu-de-sao-recorder".split(" ").map((slug) => `/giao-trinh/${slug}`),
  ..."tuyen-tap-sheet-sao-truc sheet-kem-ngon-bam tuyen-tap-sheet-dizi sheet-kem-ky-thuat-dizi tuyen-tap-sheet-recorder sheet-hoa-tau-recorder".split(" ").map((slug) => `/sheet/${slug}`),
];

const servicePages = [
  "/lop-hoc",
  "/dang-ky-hoc",
  "/sao-va-phu-kien",
  "/khoa-hoc-quay-san",
  "/giao-trinh-va-sheet",
  "/thu-am-va-quay-video",
  "/booking-nghe-si",
  "/thu-am-nhac-cu-that",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://saotrucauco.com";
  return [
    { url: baseUrl, changeFrequency: "daily", priority: 1.0 },
    ...servicePages.map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: "weekly" as const, priority: 0.95 })),
    { url: `${baseUrl}/bai-viet`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/cam-am`, changeFrequency: "weekly", priority: 0.9 },
    ...articleSlugs.map((slug) => ({ url: `${baseUrl}/bai-viet/${slug}`, changeFrequency: "monthly" as const, priority: 0.85 })),
    ...fluteTabSlugs.map((slug) => ({ url: `${baseUrl}/cam-am/${slug}`, changeFrequency: "monthly" as const, priority: 0.85 })),
    ...subjects.map((slug) => ({ url: `${baseUrl}/bo-mon/${slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...catalogPaths.map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
