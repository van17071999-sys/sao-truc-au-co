export type DisciplineSeoConfig = {
  seoTitle: string;
  primaryKeyword: string;
  keywords: string[];
  description: string;
  image: string;
};

export const DISCIPLINE_SEO_MAP: Record<string, DisciplineSeoConfig> = {
  "sao-truc-viet-nam": {
    seoTitle: "Học Sáo Trúc tại TP.HCM & Online | Sáo Trúc Âu Cơ",
    primaryKeyword: "học sáo trúc TP.HCM",
    keywords: [
      "học sáo trúc TP.HCM",
      "học sáo trúc",
      "lớp học sáo trúc",
      "học thổi sáo",
      "học sáo trúc online",
      "lớp học sáo trúc Tân Phú",
      "học sáo trúc 1 kèm 1",
    ],
    description: "Lớp học sáo trúc tại TP.HCM và Online 1 kèm 1 cho người mới bắt đầu đến nâng cao. Lộ trình bài bản, chỉnh khẩu hình, cột hơi và cảm âm cùng Sáo Trúc Âu Cơ.",
    image: "/carousel-saotruc.webp",
  },
  "sao-truc": {
    seoTitle: "Học Sáo Trúc tại TP.HCM & Online | Sáo Trúc Âu Cơ",
    primaryKeyword: "học sáo trúc TP.HCM",
    keywords: [
      "học sáo trúc TP.HCM",
      "học sáo trúc",
      "lớp học sáo trúc",
      "học thổi sáo",
      "học sáo trúc online",
    ],
    description: "Lớp học sáo trúc tại TP.HCM và Online 1 kèm 1 cho người mới bắt đầu đến nâng cao. Lộ trình bài bản, chỉnh khẩu hình, cột hơi và cảm âm cùng Sáo Trúc Âu Cơ.",
    image: "/carousel-saotruc.webp",
  },
  "sao-dizi": {
    seoTitle: "Học Sáo Dizi tại TP.HCM & Online | Sáo Trúc Âu Cơ",
    primaryKeyword: "học sáo Dizi",
    keywords: [
      "học sáo Dizi",
      "học sáo dizi TP.HCM",
      "khóa học sáo dizi",
      "thổi sáo dizi",
      "học sáo dizi online",
      "sáo dizi cổ phong",
    ],
    description: "Khóa học sáo Dizi tại TP.HCM & Online 1 kèm 1. Làm chủ kỹ thuật màng rung, luyến láy và các tác phẩm cổ phong cùng Sáo Trúc Âu Cơ.",
    image: "/carousel-dizi.webp",
  },
  "dizi": {
    seoTitle: "Học Sáo Dizi tại TP.HCM & Online | Sáo Trúc Âu Cơ",
    primaryKeyword: "học sáo Dizi",
    keywords: [
      "học sáo Dizi",
      "học sáo dizi TP.HCM",
      "khóa học sáo dizi",
      "thổi sáo dizi",
      "học sáo dizi online",
    ],
    description: "Khóa học sáo Dizi tại TP.HCM & Online 1 kèm 1. Làm chủ kỹ thuật màng rung, luyến láy và các tác phẩm cổ phong cùng Sáo Trúc Âu Cơ.",
    image: "/carousel-dizi.webp",
  },
  "sao-meo": {
    seoTitle: "Học Sáo Mèo tại TP.HCM & Online | Sáo Trúc Âu Cơ",
    primaryKeyword: "học sáo mèo",
    keywords: [
      "học sáo mèo",
      "học sáo mèo TP.HCM",
      "khóa học sáo mèo",
      "thổi sáo mèo",
      "học sáo H'Mông",
      "học sáo mèo online",
    ],
    description: "Khóa học sáo Mèo (sáo H'Mông) tại TP.HCM & Online 1 kèm 1. Làm chủ lam đồng, cột hơi và các làn điệu Tây Bắc tại Sáo Trúc Âu Cơ.",
    image: "/carousel-saotruc.webp",
  },
  "sao-hmong": {
    seoTitle: "Học Sáo Mèo tại TP.HCM & Online | Sáo Trúc Âu Cơ",
    primaryKeyword: "học sáo mèo",
    keywords: [
      "học sáo mèo",
      "học sáo mèo TP.HCM",
      "khóa học sáo mèo",
      "thổi sáo mèo",
      "học sáo H'Mông",
      "học sáo H Mông online",
    ],
    description: "Khóa học sáo Mèo (sáo H'Mông) tại TP.HCM & Online 1 kèm 1. Làm chủ lam đồng, cột hơi và các làn điệu Tây Bắc tại Sáo Trúc Âu Cơ.",
    image: "/carousel-saotruc.webp",
  },
  "dong-tieu-xiao": {
    seoTitle: "Học Tiêu, Động Tiêu tại TP.HCM & Online | Sáo Trúc Âu Cơ",
    primaryKeyword: "học tiêu, động tiêu",
    keywords: [
      "học tiêu, động tiêu",
      "học tiêu",
      "học động tiêu",
      "học tiêu TP.HCM",
      "học xiao",
      "học động tiêu online",
      "thổi tiêu",
    ],
    description: "Khóa học tiêu và động tiêu, Xiao tại TP.HCM & Online 1 kèm 1. Luyện hơi trầm ấm, sâu lắng và kỹ thuật diễn tấu cổ phong tại Sáo Trúc Âu Cơ.",
    image: "/carousel-tieu.webp",
  },
  "tieu-xiao": {
    seoTitle: "Học Tiêu, Động Tiêu tại TP.HCM & Online | Sáo Trúc Âu Cơ",
    primaryKeyword: "học tiêu, động tiêu",
    keywords: [
      "học tiêu, động tiêu",
      "học tiêu",
      "học động tiêu",
      "học tiêu TP.HCM",
      "học xiao",
      "học động tiêu online",
    ],
    description: "Khóa học tiêu và động tiêu, Xiao tại TP.HCM & Online 1 kèm 1. Luyện hơi trầm ấm, sâu lắng và kỹ thuật diễn tấu cổ phong tại Sáo Trúc Âu Cơ.",
    image: "/carousel-tieu.webp",
  },
  "sao-recorder": {
    seoTitle: "Học Sáo Recorder tại TP.HCM & Online | Sáo Trúc Âu Cơ",
    primaryKeyword: "học recorder",
    keywords: [
      "học recorder",
      "học sáo recorder",
      "lớp học recorder TP.HCM",
      "học recorder online",
      "học sáo recorder cho trẻ em",
    ],
    description: "Khóa học sáo Recorder tại TP.HCM & Online cho trẻ em và người lớn. Học đọc nhạc, tư thế chuẩn và kỹ thuật hòa tấu tại Sáo Trúc Âu Cơ.",
    image: "/carousel-recorder.webp",
  },
  "recorder": {
    seoTitle: "Học Sáo Recorder tại TP.HCM & Online | Sáo Trúc Âu Cơ",
    primaryKeyword: "học recorder",
    keywords: [
      "học recorder",
      "học sáo recorder",
      "lớp học recorder TP.HCM",
      "học recorder online",
    ],
    description: "Khóa học sáo Recorder tại TP.HCM & Online cho trẻ em và người lớn. Học đọc nhạc, tư thế chuẩn và kỹ thuật hòa tấu tại Sáo Trúc Âu Cơ.",
    image: "/carousel-recorder.webp",
  },
  "flute": {
    seoTitle: "Học Sáo Flute tại TP.HCM & Online | Sáo Trúc Âu Cơ",
    primaryKeyword: "học flute",
    keywords: [
      "học flute",
      "học sáo flute",
      "lớp học flute TP.HCM",
      "học flute online",
      "học thổi flute",
      "khóa học flute",
    ],
    description: "Khóa học sáo Flute tại TP.HCM & Online 1 kèm 1 từ cơ bản đến nâng cao. Kỹ thuật phương Tây bài bản, chỉnh khẩu hình và cột hơi tại Sáo Trúc Âu Cơ.",
    image: "/carousel-flute.webp",
  },
  "sao-flute": {
    seoTitle: "Học Sáo Flute tại TP.HCM & Online | Sáo Trúc Âu Cơ",
    primaryKeyword: "học flute",
    keywords: [
      "học flute",
      "học sáo flute",
      "lớp học flute TP.HCM",
      "học flute online",
    ],
    description: "Khóa học sáo Flute tại TP.HCM & Online 1 kèm 1 từ cơ bản đến nâng cao. Kỹ thuật phương Tây bài bản, chỉnh khẩu hình và cột hơi tại Sáo Trúc Âu Cơ.",
    image: "/carousel-flute.webp",
  },
};

export function getDisciplineSeo(slug: string): DisciplineSeoConfig | undefined {
  return DISCIPLINE_SEO_MAP[slug];
}
