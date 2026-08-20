"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { parseFluteTab, formatFluteNoteLine } from "./cms-content-pages";
import { buildVietQrUrl } from "./vietqr-helper";
import { useLanguage, LanguageSwitcher } from "./i18n-context";
import { PriceTag, parsePrice } from "./price-helper";

const serviceSlugToHref: Record<string, string> = {
  classes: "/lop-hoc",
  contact: "/dang-ky-hoc",
  products: "/sao-va-phu-kien",
  courses: "/khoa-hoc-quay-san",
  materials: "/giao-trinh-va-sheet",
  studio: "/thu-am-va-quay-video",
  booking: "/booking-nghe-si",
  "instrument-recording": "/thu-am-nhac-cu-that",
};

const defaultServices = [
  { no: "01", icon: "♫", image: "/carousel-saotruc.webp", title: "Lớp học các bộ môn", text: "Sáo trúc, Dizi, sáo nứa, sáo mèo, recorder và các bộ môn dân tộc.", cta: "Xem lớp học", href: "/lop-hoc" },
  { no: "02", icon: "⌂", image: "/carousel-recorder.webp", title: "Đăng ký lớp học", text: "Học tại trung tâm, gia sư tại nhà hoặc online 1 kèm 1 với lịch linh động.", cta: "Đăng ký ngay", href: "/dang-ky-hoc" },
  { no: "03", icon: "◌", image: "/carousel-dizi.webp", title: "Sáo & phụ kiện", text: "Sáo trúc chuẩn âm, Dizi, sáo nứa, sáo mèo cùng phụ kiện được tuyển chọn.", cta: "Khám phá", href: "/sao-va-phu-kien" },
  { no: "04", icon: "▶", image: "/carousel-tieu.webp", title: "Khóa học quay sẵn", text: "Video bài giảng HD từ nhập môn đến nâng cao, học mọi lúc và xem lại trọn đời.", cta: "Xem khóa học", href: "/khoa-hoc-quay-san" },
  { no: "05", icon: "▤", image: "/carousel-flute.webp", title: "Giáo trình & sheet", text: "Giáo trình kỹ thuật, sheet nhạc và bản chuyển soạn theo yêu cầu biểu diễn.", cta: "Xem tài liệu", href: "/giao-trinh-va-sheet", price: "Từ 50.000đ / sheet" },
  { no: "06", icon: "◉", image: "/hero-flute.webp", title: "Thu âm & quay video", text: "Thu âm, mixing, quay hình và dựng video chỉn chu cho học viên, nghệ sĩ.", cta: "Xem các gói", href: "/thu-am-va-quay-video", price: "Từ 900.000đ" },
  { no: "07", icon: "♬", image: "/carousel-saotruc.webp", title: "Booking nghệ sĩ", text: "Độc tấu sáo, hòa tấu và ban nhạc dân tộc cho sự kiện, sân khấu, lễ hội.", cta: "Xem gói booking", href: "/booking-nghe-si" },
  { no: "08", icon: "≋", image: "/carousel-dizi.webp", title: "Thu âm nhạc cụ thật", text: "Sáo, đàn tranh, đàn bầu, đàn nhị và nhiều nhạc cụ dân tộc khác.", cta: "Xem dịch vụ thu", href: "/thu-am-nhac-cu-that", price: "Từ 500.000đ / track" },
];

const disciplines = [
  { slug: "sao-truc-viet-nam", image: "/carousel-saotruc.webp", imageAlt: "Minh họa bộ môn sáo trúc Việt Nam", icon: "♫", title: "Sáo trúc Việt Nam", short: "Nền tảng hơi, ngón và kỹ thuật biểu cảm đặc trưng.", intro: "Bộ môn chủ đạo dành cho người mới lẫn người muốn biểu diễn chuyên sâu. Học viên được xây dựng nền tảng vững chắc và phát triển tiếng sáo tự nhiên, giàu cảm xúc.", learn: ["Tư thế, khẩu hình và cột hơi", "Ngón bấm, đánh lưỡi, rung hơi", "Dân ca, nhạc trữ tình và nhạc trẻ"], suitable: "Người mới bắt đầu, người chơi tự học hoặc học viên muốn biểu diễn." },
  { slug: "sao-dizi", image: "/carousel-dizi.webp", imageAlt: "Minh họa bộ môn sáo Dizi", icon: "◉", title: "Sáo Dizi", short: "Âm sắc sáng, vang với màng rung và phong cách cổ phong.", intro: "Chương trình tập trung vào cách tạo âm Dizi đặc trưng, xử lý màng rung và kỹ thuật diễn tấu các tác phẩm Trung Hoa từ dễ đến nâng cao.", learn: ["Dán và điều chỉnh màng rung", "Hệ thống ngón và kỹ thuật hơi", "Luyến, láy và xử lý tác phẩm cổ phong"], suitable: "Người yêu nhạc Trung Hoa, nhạc phim và âm sắc Dizi." },
  { slug: "sao-recorder", image: "/carousel-recorder.webp", imageAlt: "Minh họa bộ môn sáo Recorder", icon: "♩", title: "Sáo Recorder", short: "Dễ tiếp cận, phù hợp trẻ em và giáo dục âm nhạc.", intro: "Lộ trình recorder kết hợp kỹ thuật nhạc cụ và đọc nhạc, giúp người học chơi đúng ngay từ đầu và có thể tham gia hòa tấu.", learn: ["Tư thế, hơi và ngón bấm chuẩn", "Đọc bản nhạc và giữ nhịp", "Độc tấu, song tấu và hòa tấu"], suitable: "Trẻ em, người mới học và giáo viên âm nhạc phổ thông." },
  { slug: "dong-tieu-xiao", image: "/carousel-tieu.webp", imageAlt: "Minh họa bộ môn động tiêu và Xiao", icon: "♬", title: "Động tiêu & Xiao", short: "Âm thanh trầm ấm, sâu lắng và giàu chất thiền.", intro: "Khóa học giúp người học làm chủ huyệt thổi dọc, cột hơi dài và sắc thái tinh tế của động tiêu Việt Nam và Xiao Trung Quốc.", learn: ["Tạo tiếng và kiểm soát âm trầm", "Ngón bấm hai hệ nhạc cụ", "Vuốt, rung và xử lý giai điệu chậm"], suitable: "Người yêu âm nhạc nhẹ nhàng, cổ phong và thiền định." },
  { slug: "flute", image: "/carousel-flute.webp", imageAlt: "Minh họa bộ môn Flute", icon: "♪", title: "Flute", short: "Kỹ thuật phương Tây bài bản, âm sắc trong trẻo linh hoạt.", intro: "Từ nền tảng tư thế đến gam, etude và tác phẩm, chương trình flute được cá nhân hóa theo trình độ và mục tiêu của từng học viên.", learn: ["Tư thế, khẩu hình và cao độ", "Gam, etude và kỹ thuật lưỡi", "Đọc nhạc và xử lý tác phẩm"], suitable: "Người mới, học sinh nghệ thuật hoặc người muốn nâng cao kỹ thuật." },
  { slug: "sao-hmong", image: "/carousel-saotruc.webp", imageAlt: "Minh họa bộ môn sáo H’Mông", icon: "❋", title: "Sáo H’Mông", short: "Khám phá âm hưởng Tây Bắc mộc mạc và da diết.", intro: "Người học làm quen với nguyên lý lam đồng, hệ thống ngón và những làn điệu mang bản sắc âm nhạc vùng cao.", learn: ["Tạo tiếng và điều khiển lam đồng", "Hệ thống ngón đặc trưng", "Làn điệu và phong cách Tây Bắc"], suitable: "Người yêu âm nhạc dân tộc và muốn khám phá nhạc cụ mới." },
];

const slides = [
  { image: "/carousel-saotruc.webp", eyebrow: "BỘ MÔN TRUYỀN THỐNG", title: "Sáo trúc Việt Nam", copy: "Từ hơi thở đầu tiên đến tiếng sáo giàu cảm xúc.", href: "/bo-mon/sao-truc-viet-nam", cta: "Khám phá bộ môn" },
  { image: "/carousel-dizi.webp", eyebrow: "ÂM SẮC CỔ PHONG", title: "Sáo Dizi", copy: "Khám phá màng rung và kỹ thuật diễn tấu Trung Hoa.", href: "/bo-mon/sao-dizi", cta: "Khám phá bộ môn" },
  { image: "/carousel-recorder.webp", eyebrow: "ÂM NHẠC CHO MỌI LỨA TUỔI", title: "Sáo Recorder", copy: "Khởi đầu dễ dàng, đọc nhạc bài bản và cùng nhau hòa tấu.", href: "/bo-mon/sao-recorder", cta: "Khám phá bộ môn" },
  { image: "/carousel-tieu.webp", eyebrow: "TRẦM ẤM & SÂU LẮNG", title: "Động tiêu & Xiao", copy: "Một khoảng lặng đẹp cho người yêu âm nhạc cổ phong.", href: "/bo-mon/dong-tieu-xiao", cta: "Khám phá bộ môn" },
  { image: "/carousel-flute.webp", eyebrow: "KỸ THUẬT PHƯƠNG TÂY", title: "Flute", copy: "Âm sắc trong trẻo, linh hoạt cùng lộ trình cá nhân hóa.", href: "/bo-mon/flute", cta: "Khám phá bộ môn" },
];

const defaultArticles = [
  { slug: "5-buoc-tao-tieng-sao", tag: "Kỹ thuật", title: "5 bước tạo tiếng sáo trong và ổn định", excerpt: "Từ tư thế, khẩu hình đến luồng hơi — nền tảng dành cho người mới bắt đầu.", date: "08.08.2026" },
  { slug: "nguoi-moi-chon-sao-tone-nao", tag: "Chọn nhạc cụ", title: "Người mới nên bắt đầu với sáo tone nào?", excerpt: "So sánh sáo Đô C5, La A4 và Sol G4 để chọn cây sáo phù hợp với mục tiêu học.", date: "02.08.2026" },
  { slug: "cach-luyen-hoi-dai", tag: "Luyện tập", title: "Cách luyện hơi dài mà không bị căng", excerpt: "Một lịch tập ngắn, an toàn và hiệu quả để cải thiện cột hơi mỗi ngày.", date: "28.07.2026" },
];

const freeGuides = [
  { platform: "YouTube", icon: "▶", topic: "Sáo trúc căn bản", title: "Cách lấy hơi và tạo tiếng sáo tròn, rõ", description: "Video mẫu để bạn gắn đường dẫn YouTube hướng dẫn kỹ thuật, bài tập và kinh nghiệm luyện sáo.", href: "#contact" },
  { platform: "TikTok", icon: "♪", topic: "Mẹo luyện tập nhanh", title: "Chuỗi kiến thức ngắn mỗi ngày", description: "Khu vực dành cho video dọc TikTok: mẹo sửa lỗi, ngón bấm, xử lý hơi và các đoạn thị phạm ngắn.", href: "#contact" },
  { platform: "Bài viết", icon: "✎", topic: "Kiến thức chuyên sâu", title: "Chọn nhạc cụ và xây dựng lộ trình học", description: "Đăng bài chia sẻ dài, tài liệu tham khảo hoặc liên kết tới một bài viết riêng trên website.", href: "#articles" },
];

const fluteTabs = [
  { title: "Luyện hơi buổi sáng", fullTitle: "Luyện hơi buổi sáng – Bài cảm âm nhập môn", tone: "Tone C5 · Nhịp 4/4 · Dễ", lines: [
    { lyric: "Nắng lên bên hiên, tiếng chim gọi ngày mới", notes: "Đô  Rê  Mi  Sol | Sol  Mi  Rê  Đô | Rê  Mi  Sol  Mi | Rê — — —" },
    { lyric: "Em nâng cây sáo, gửi thanh âm lên trời", notes: "Mi  Sol  La  Sol | Mi  Rê  Đô  Rê | Mi  Sol  Mi  Rê | Đô — — —" },
  ]},
  { title: "Chiều trên quê hương", fullTitle: "Chiều trên quê hương – Cảm âm dân gian", tone: "Tone C5 · Nhịp 2/4 · Trung bình", lines: [
    { lyric: "Chiều nghiêng theo gió, bờ tre ru êm đềm", notes: "Sol  La  Sol  Mi | Rê  Mi  Sol — | La  Sol  Mi  Rê | Đô —" },
    { lyric: "Dòng sông lấp lánh, chở câu ca về làng", notes: "Mi  Sol  La  Đô² | Si  La  Sol — | Mi  Rê  Mi  Sol | Đô —" },
  ]},
  { title: "Khúc sáo vùng cao", fullTitle: "Khúc sáo vùng cao – Bài luyện luyến láy", tone: "Tone G4 · Nhịp 6/8 · Trung bình", lines: [
    { lyric: "Mây bay qua núi, bước chân vui trên đồi", notes: "Sol  La  Si | Rê²  Si  La | Sol  La  Sol | Mi — —" },
    { lyric: "Tiếng sáo ngân dài, gọi mùa xuân về đây", notes: "Si  Rê²  Mi² | Rê²  Si  La | Sol  Mi  Sol | La  Sol —" },
  ]},
];

const productCategories = [
  { title: "Sáo ngang Việt Nam", image: "/carousel-saotruc.webp", intro: "Nhạc cụ ngang truyền thống, âm sắc mộc mạc và phù hợp từ người mới đến người biểu diễn.", products: [
    { name: "Sáo nứa", description: "Chất âm ấm, nhẹ, dễ rung và giàu màu sắc dân gian.", price: "Liên hệ" },
    { name: "Sáo trúc", description: "Âm thanh sáng, vang, độ bền cao; có nhiều tone để lựa chọn.", price: "Liên hệ" },
    { name: "Sáo nứa Bắc", description: "Thành sáo mỏng, tiếng thanh và mềm, phù hợp dân ca miền Bắc.", price: "Liên hệ" },
  ]},
  { title: "Sáo Dizi Trung Quốc", image: "/carousel-dizi.webp", intro: "Dòng sáo có màng rung đặc trưng, âm thanh sáng và giàu chất cổ phong.", products: [
    { name: "Dizi trúc", description: "Phiên bản truyền thống, âm sắc cân bằng và dễ sử dụng.", price: "Liên hệ" },
    { name: "Dizi ngọc", description: "Ngoại hình sang trọng, âm sắc riêng và thích hợp sưu tầm.", price: "Liên hệ" },
    { name: "Dizi thủy tinh", description: "Thiết kế trong suốt độc đáo, nổi bật khi biểu diễn và trưng bày.", price: "Liên hệ" },
  ]},
  { title: "Sáo mèo", image: "/carousel-saotruc.webp", intro: "Âm sắc da diết nhờ lam đồng, mang đậm màu sắc âm nhạc vùng cao.", products: [
    { name: "Sáo mèo đơn bằng gỗ", description: "Thân gỗ chắc chắn, âm trầm ấm và dễ mang theo.", price: "Liên hệ" },
    { name: "Sáo mèo cặp bằng nứa", description: "Hai ống nứa hòa âm tạo chất tiếng dày và độc đáo.", price: "Liên hệ" },
  ]},
  { title: "Tiêu & Xiao", image: "/carousel-tieu.webp", intro: "Nhạc cụ thổi dọc với âm vực trầm, sâu, thích hợp nhạc thiền và cổ phong.", products: [
    { name: "Tiêu trúc Việt 6 lỗ", description: "Hệ ngón quen thuộc, tiếng trầm mộc mạc và dễ tiếp cận.", price: "Liên hệ" },
    { name: "Xiao trúc Trung Quốc 8 lỗ", description: "Hệ 8 lỗ linh hoạt, âm sắc sâu và giàu khả năng biểu cảm.", price: "Liên hệ" },
  ]},
  { title: "Recorder", image: "/carousel-recorder.webp", intro: "Nhạc cụ dễ học, phù hợp trẻ em, giáo dục âm nhạc và hòa tấu.", products: [
    { name: "Recorder nhựa", description: "Bền, dễ vệ sinh và ổn định cao độ cho người mới học.", price: "Liên hệ" },
    { name: "Recorder gỗ", description: "Chất âm ấm, tự nhiên, phù hợp người chơi nâng cao và biểu diễn.", price: "Liên hệ" },
  ]},
  { title: "Flute", image: "/carousel-flute.webp", intro: "Sáo ngang phương Tây với âm sắc trong trẻo, linh hoạt và âm vực rộng.", products: [
    { name: "Flute nhựa", description: "Nhẹ, dễ bảo quản, phù hợp người mới và môi trường ngoài trời.", price: "Liên hệ" },
    { name: "Flute mạ bạc", description: "Lựa chọn phổ biến cho học tập, âm thanh sáng và cơ chế ổn định.", price: "Liên hệ" },
    { name: "Flute bạc", description: "Âm sắc dày và giàu cộng hưởng, dành cho người chơi chuyên sâu.", price: "Liên hệ" },
  ]},
  { title: "Sáo dọc", image: "/carousel-tieu.webp", intro: "Các dòng sáo thổi dọc gọn nhẹ, âm thanh gần gũi và dễ luyện tập.", products: [
    { name: "Sáo dọc nứa", description: "Chất tiếng mềm, mộc và mang nét dân gian tự nhiên.", price: "Liên hệ" },
    { name: "Sáo dọc trúc", description: "Thân chắc, tiếng sáng và độ bền tốt khi sử dụng lâu dài.", price: "Liên hệ" },
  ]},
];

const recordedCourses = [
  { instrument: "Sáo trúc", image: "/carousel-saotruc.webp", items: [
    { name: "Dân ca & nhạc cổ ba miền", detail: "Tác phẩm tiêu biểu miền Bắc, Trung và Nam; hướng dẫn luyến láy, hơi và phong cách.", price: "399.000đ", showPrice: true },
    { name: "Nhạc âm hưởng dân ca, dân gian", detail: "Xử lý các ca khúc mới mang màu sắc dân gian Việt Nam.", price: "399.000đ", showPrice: true },
    { name: "Nhạc trữ tình & Bolero", detail: "Kỹ thuật rung hơi, nhả chữ và tạo câu nhạc mềm mại, tình cảm.", price: "399.000đ", showPrice: true },
    { name: "Nhạc trẻ", detail: "Chuyển soạn và trình diễn các ca khúc hiện đại trên sáo trúc.", price: "399.000đ", showPrice: true },
  ]},
  { instrument: "Sáo mèo", image: "/carousel-saotruc.webp", items: [
    { name: "Sáo mèo từ cơ bản đến biểu diễn", detail: "Làm chủ lam đồng, hệ ngón và phong cách âm nhạc vùng cao.", price: "499.000đ", showPrice: true },
  ]},
  { instrument: "Recorder", image: "/carousel-recorder.webp", items: [
    { name: "Nhạc ngũ cung Việt Nam", detail: "Giai điệu Việt Nam được chuyển soạn phù hợp cho recorder.", price: "299.000đ", showPrice: true },
    { name: "Giáo trình Steiner", detail: "Lộ trình cảm thụ, hơi, ngón và đọc nhạc theo từng cấp độ.", price: "399.000đ", showPrice: true },
    { name: "Nhạc thiếu nhi", detail: "Tuyển tập bài vui tươi, dễ học dành cho trẻ em.", price: "299.000đ", showPrice: true },
  ]},
  { instrument: "Sáo Dizi", image: "/carousel-dizi.webp", items: [
    { name: "Dizi cơ bản & 15 nhạc phẩm Trung Quốc", detail: "Từ dán màng rung, hệ ngón đến 15 tác phẩm kinh điển.", price: "599.000đ", showPrice: true },
    { name: "Nhạc Hoa lời Việt", detail: "Tuyển tập ca khúc quen thuộc với hướng dẫn diễn cảm chi tiết.", price: "399.000đ", showPrice: true },
  ]},
];

const singleVideoGroups = [
  { instrument: "Sáo trúc", image: "/carousel-saotruc.webp", description: "Dân ca, nhạc trữ tình và nhạc trẻ chuyển soạn cho sáo trúc.", songs: [{name:"Bèo dạt mây trôi",price:"99.000đ",showPrice:true},{name:"Về quê",price:"99.000đ",showPrice:true},{name:"Tình ca Tây Bắc",price:"99.000đ",showPrice:true}] },
  { instrument: "Sáo Dizi", image: "/carousel-dizi.webp", description: "Nhạc Trung Hoa kinh điển với màng rung và kỹ thuật luyến láy.", songs: [{name:"Đại Ngư",price:"129.000đ",showPrice:true},{name:"Thần Thoại",price:"129.000đ",showPrice:true},{name:"Lương Sơn Bá – Chúc Anh Đài",price:"149.000đ",showPrice:true}] },
  { instrument: "Sáo mèo", image: "/carousel-saotruc.webp", description: "Âm nhạc Tây Bắc dành cho sáo mèo đơn và sáo mèo kép.", songs: [{name:"Inh lả ơi",price:"99.000đ",showPrice:true},{name:"Xuân về bản Mông",price:"129.000đ",showPrice:true},{name:"Gọi em bên suối",price:"99.000đ",showPrice:false}] },
  { instrument: "Tiêu & Xiao", image: "/carousel-tieu.webp", description: "Tác phẩm trầm lắng, cổ phong và thiền cho tiêu, Xiao.", songs: [{name:"Vô Ky",price:"129.000đ",showPrice:true},{name:"Cố Mộng",price:"129.000đ",showPrice:true},{name:"Tịnh tâm",price:"99.000đ",showPrice:true}] },
  { instrument: "Recorder", image: "/carousel-recorder.webp", description: "Nhạc phim, thiếu nhi và ngũ cung Việt Nam cho recorder.", songs: [{name:"Always With Me",price:"99.000đ",showPrice:true},{name:"Lý cây xanh",price:"79.000đ",showPrice:true},{name:"Con chim non",price:"79.000đ",showPrice:true}] },
  { instrument: "Flute", image: "/carousel-flute.webp", description: "Tác phẩm flute theo cấp độ với sheet và hướng dẫn kỹ thuật.", songs: [{name:"The Swan",price:"129.000đ",showPrice:true},{name:"Canon in D",price:"129.000đ",showPrice:true},{name:"A Thousand Years",price:"129.000đ",showPrice:false}] },
];

const curriculumGroups = [
  { instrument: "Sáo trúc", image: "/carousel-saotruc.webp", items: [
    { name: "Giáo trình tổng hợp", detail: "Lộ trình đầy đủ từ nhập môn đến xử lý tác phẩm.", price: "499.000đ", showPrice: true },
    { name: "Giáo trình cơ bản", detail: "Tư thế, khẩu hình, hơi, ngón và đọc nhạc nền tảng.", price: "249.000đ", showPrice: true },
    { name: "Giáo trình nâng cao", detail: "Rung hơi, luyến láy, kỹ thuật nhanh và biểu cảm.", price: "399.000đ", showPrice: true },
    { name: "Giáo trình gam & etude", detail: "Hệ thống bài luyện gam, ngón và etude theo cấp độ.", price: "299.000đ", showPrice: true },
    { name: "Giáo trình dân ca", detail: "Dân ca ba miền cùng hướng dẫn xử lý phong cách.", price: "299.000đ", showPrice: true },
    { name: "Ca khúc chuyển soạn theo chủ đề", detail: "Tuyển tập tác phẩm theo chủ đề và mục tiêu biểu diễn.", price: "Liên hệ", showPrice: false },
  ]},
  { instrument: "Sáo Dizi", image: "/carousel-dizi.webp", items: [
    { name: "Giáo trình tổng hợp", detail: "Từ dán màng rung đến hoàn thiện tác phẩm Dizi.", price: "599.000đ", showPrice: true },
    { name: "Giáo trình cơ bản", detail: "Hơi, ngón, màng rung và kỹ thuật nền tảng.", price: "299.000đ", showPrice: true },
    { name: "Giáo trình nâng cao", detail: "Luyến, láy, rung và kỹ thuật biểu diễn cổ phong.", price: "449.000đ", showPrice: true },
    { name: "Giáo trình gam & etude", detail: "Bài luyện gam và etude riêng cho hệ Dizi.", price: "299.000đ", showPrice: true },
    { name: "Giáo trình dân ca", detail: "Tác phẩm dân gian Trung Hoa tuyển chọn.", price: "349.000đ", showPrice: true },
    { name: "Ca khúc chuyển soạn theo chủ đề", detail: "Nhạc Hoa, cổ phong và nhạc phim theo chủ đề.", price: "Liên hệ", showPrice: false },
  ]},
  { instrument: "Sáo Recorder", image: "/carousel-recorder.webp", items: [
    { name: "Giáo trình tổng hợp", detail: "Chương trình recorder toàn diện theo từng cấp độ.", price: "399.000đ", showPrice: true },
    { name: "Giáo trình cơ bản", detail: "Hơi, ngón, nhịp và đọc bản nhạc cho người mới.", price: "199.000đ", showPrice: true },
    { name: "Giáo trình nâng cao", detail: "Kỹ thuật nâng cao, hòa tấu và xử lý tác phẩm.", price: "349.000đ", showPrice: true },
    { name: "Giáo trình gam & etude", detail: "Gam, ngón chéo và etude phát triển kỹ thuật.", price: "249.000đ", showPrice: true },
    { name: "Giáo trình dân ca", detail: "Dân ca Việt Nam chuyển soạn phù hợp recorder.", price: "249.000đ", showPrice: true },
    { name: "Ca khúc chuyển soạn theo chủ đề", detail: "Thiếu nhi, nhạc phim và tác phẩm giáo dục.", price: "Liên hệ", showPrice: false },
  ]},
];

const sheetGroups = [
  { instrument: "Sáo trúc", image: "/carousel-saotruc.webp", items: [{ name: "Tuyển tập sheet sáo trúc", detail: "Dân ca, trữ tình, nhạc trẻ và tác phẩm biểu diễn.", price: "79.000đ", showPrice: true }, { name: "Sheet kèm ngón bấm", detail: "Bản nhạc trình bày rõ ràng, có ký hiệu ngón hỗ trợ.", price: "99.000đ", showPrice: true }] },
  { instrument: "Sáo Dizi", image: "/carousel-dizi.webp", items: [{ name: "Tuyển tập sheet Dizi", detail: "Nhạc Hoa, cổ phong và nhạc phim chuyển soạn cho Dizi.", price: "99.000đ", showPrice: true }, { name: "Sheet kèm kỹ thuật", detail: "Đánh dấu hơi, luyến láy và vị trí xử lý màng rung.", price: "129.000đ", showPrice: true }] },
  { instrument: "Sáo Recorder", image: "/carousel-recorder.webp", items: [{ name: "Tuyển tập sheet Recorder", detail: "Nhạc thiếu nhi, nhạc phim và ngũ cung Việt Nam.", price: "69.000đ", showPrice: true }, { name: "Sheet hòa tấu Recorder", detail: "Bản song tấu và hòa tấu phân bè theo trình độ.", price: "Liên hệ", showPrice: false }] },
];

const studioPackages = [
  { icon: "◉", title: "Thu âm cơ bản", subtitle: "Một nhạc cụ · Một tác phẩm", price: "900.000đ", showPrice: true, features: ["Thu một nhạc cụ tại studio", "Chỉnh sửa lỗi và lọc tạp âm", "Mixing & mastering cơ bản", "Bàn giao WAV và MP3", "01 lần chỉnh sửa"] },
  { icon: "♫", title: "Thu âm hoàn chỉnh", subtitle: "Bản thu sẵn sàng phát hành", price: "1.500.000đ", showPrice: true, features: ["Tư vấn tone và cấu trúc bài", "Thu nhiều lượt, chọn take tốt", "Mixing & mastering hoàn chỉnh", "Ghép beat hoặc piano có sẵn", "Bàn giao WAV, MP3 và instrumental"] },
  { icon: "▶", title: "Quay video biểu diễn", subtitle: "Hình ảnh chỉn chu, giàu cảm xúc", price: "1.800.000đ", showPrice: true, features: ["Quay Full HD với nhiều góc máy", "Hỗ trợ bố cục và diễn xuất", "Dựng video, chỉnh màu cơ bản", "01 bản ngang YouTube/Facebook", "01 lần chỉnh sửa"] },
  { icon: "◆", title: "MV trọn gói", subtitle: "Thu âm · Quay hình · Hậu kỳ", price: "Liên hệ", showPrice: false, features: ["Lên ý tưởng và kịch bản hình ảnh", "Thu âm, mixing & mastering", "Quay studio hoặc ngoại cảnh", "Dựng MV, chỉnh màu, chèn tiêu đề", "Có thể thêm bản dọc TikTok/Reels"] },
  { icon: "★", title: "Video kỷ niệm học viên", subtitle: "Lưu lại dấu mốc âm nhạc", price: "1.200.000đ", showPrice: true, features: ["Tư vấn chọn bài phù hợp", "Thu âm hoặc thu tiếng trực tiếp", "Quay video biểu diễn", "Dựng clip hoàn chỉnh", "Tặng ảnh bìa video"] },
];

const studioSteps = ["Gửi bài & yêu cầu", "Tư vấn tone, beat, ý tưởng", "Báo giá & đặt lịch", "Thu âm hoặc quay hình", "Duyệt bản nháp", "Hoàn thiện & bàn giao"];

const bookingPackages = [
  { icon: "♪", title: "Độc tấu nghệ sĩ", detail: "01 nghệ sĩ · 1–3 tiết mục", price: "Từ 2.000.000đ", showPrice: true, features: ["Sáo trúc, Dizi, tiêu, sáo mèo, recorder hoặc flute", "Tư vấn tiết mục phù hợp không khí sự kiện", "Trang phục biểu diễn cơ bản"] },
  { icon: "♫", title: "Song tấu", detail: "Sáo kết hợp piano, guitar hoặc đàn tranh", price: "Từ 4.000.000đ", showPrice: true, features: ["02 nghệ sĩ chuyên nghiệp", "Phối hợp tiết mục theo chủ đề", "1–3 tiết mục biểu diễn"] },
  { icon: "♬", title: "Nhóm hòa tấu", detail: "Đội hình 3–5 nghệ sĩ", price: "Liên hệ", showPrice: false, features: ["Nhạc cụ dân tộc hoặc kết hợp hiện đại", "Biểu diễn đón khách, mở màn hoặc sân khấu", "Tư vấn đội hình theo ngân sách"] },
  { icon: "◆", title: "Ban nhạc dân tộc", detail: "Đội hình từ 5 nghệ sĩ", price: "Liên hệ", showPrice: false, features: ["Chương trình nghệ thuật quy mô lớn", "Dàn dựng theo kịch bản sự kiện", "Có thể kết hợp ca sĩ và múa"] },
  { icon: "★", title: "Biểu diễn theo yêu cầu", detail: "Dàn dựng riêng theo chủ đề", price: "Liên hệ", showPrice: false, features: ["Chuyển soạn bài mới", "Trang phục và hình thức biểu diễn riêng", "Phù hợp quảng cáo, quay phim, lễ nghi"] },
];

const bookingEvents = ["Khai trương & khánh thành", "Tiệc cưới & lễ gia tiên", "Hội nghị & gala dinner", "Festival & lễ hội văn hóa", "Sự kiện trường học", "Chương trình nghệ thuật", "Lễ tưởng niệm & truyền thống", "Quay phim & quảng cáo"];

const recordingInstruments = [
  { icon: "♫", title: "Sáo trúc Việt Nam", tone: "Mộc mạc, mềm mại, giàu chất dân gian", price: "500.000đ", showPrice: true },
  { icon: "◉", title: "Sáo Dizi", tone: "Sáng, vang, phù hợp cổ phong và nhạc Hoa", price: "600.000đ", showPrice: true },
  { icon: "♬", title: "Tiêu & Xiao", tone: "Trầm ấm, sâu lắng, thích hợp nhạc thiền", price: "600.000đ", showPrice: true },
  { icon: "♪", title: "Recorder & Flute", tone: "Trong trẻo, linh hoạt cho nhạc phim và thiếu nhi", price: "500.000đ", showPrice: true },
  { icon: "◇", title: "Đàn tranh, đàn bầu, đàn nhị", tone: "Âm sắc truyền thống cho bản phối hiện đại", price: "Liên hệ", showPrice: false },
  { icon: "✦", title: "Nhạc cụ theo yêu cầu", tone: "Nhạc cụ dây, gõ và hiệu ứng âm thanh riêng", price: "Liên hệ", showPrice: false },
];

const recordingPackages = [
  { title: "Đoạn ngắn", detail: "Intro, solo, fill, outro hoặc hiệu ứng · tối đa 60 giây", price: "Từ 500.000đ" },
  { title: "Một track hoàn chỉnh", detail: "Một nhạc cụ xuyên suốt toàn bộ tác phẩm", price: "Từ 900.000đ" },
  { title: "Thu nhiều lớp", detail: "Từ hai lớp âm thanh để tạo chiều sâu cho bản phối", price: "Liên hệ" },
  { title: "Phối nhạc cụ dân tộc", detail: "Đề xuất câu nhạc, cách vào bài và xử lý phong cách", price: "Liên hệ" },
];

const defaultSocialLinks = [
  { slug: "youtube", platform: "YOUTUBE", icon: "▶", title: "Kênh Sáo Trúc Âu Cơ", href: "https://www.youtube.com/" },
  { slug: "facebook", platform: "FACEBOOK", icon: "f", title: "Sáo Trúc Âu Cơ", href: "https://www.facebook.com/" },
  { slug: "tiktok", platform: "TIKTOK", icon: "♪", title: "@saotruc.auco", href: "https://www.tiktok.com/" },
  { slug: "instagram", platform: "INSTAGRAM", icon: "◎", title: "@saotruc.auco", href: "https://www.instagram.com/" },
];

function slugify(value: string) {
  return (value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
const slugifyPath = slugify;

function scrollElementToId(id: string) {
  document.getElementById(id.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
}

type ServiceSection = "classes" | "contact" | "products" | "courses" | "materials" | "studio" | "booking" | "instrument-recording" | "flute-tabs";

type CmsEntry = {
  id: string;
  collection: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  imageUrl: string;
  tag: string;
  price: string;
  content: string;
  visible: boolean;
  sortOrder: number;
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeService, setActiveService] = useState<ServiceSection | null>(null);
  const [openDiscipline, setOpenDiscipline] = useState<number | null>(0);
  const [openProductCategory, setOpenProductCategory] = useState<number | null>(0);
  const [courseTab, setCourseTab] = useState<"courses" | "videos">("courses");
  const [openRecordedCourse, setOpenRecordedCourse] = useState<number | null>(null);
  const [openVideoGroup, setOpenVideoGroup] = useState<number | null>(0);
  const [materialTab, setMaterialTab] = useState<"curriculum" | "sheets">("curriculum");
  const [openMaterialGroup, setOpenMaterialGroup] = useState<number | null>(0);
  const [openFluteTab, setOpenFluteTab] = useState<number | null>(null);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [recordingDetailsOpen, setRecordingDetailsOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState("");
  const [orderSent, setOrderSent] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [transferContent, setTransferContent] = useState("");
  const { lang, t, translate } = useLanguage();
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>(() => {
    if (typeof window === "undefined") return ["Sáo trúc Việt Nam"];
    const requested = new URLSearchParams(window.location.search).get("subject");
    return requested ? [requested] : ["Sáo trúc Việt Nam"];
  });

  const allInterestOptions = useMemo(() => [
    "Sáo trúc Việt Nam",
    "Sáo Dizi Trung Quốc",
    "Sáo Recorder",
    "Động tiêu & Xiao",
    "Flute phương Tây",
    "Sáo H'Mông",
    "Sáo mèo & Sáo bầu",
    "Mua sáo & phụ kiện",
    "Khóa học video quay sẵn",
    "Sheet nhạc & giáo trình",
    "Thu âm & quay MV",
    "Booking biểu diễn",
  ], []);

  function toggleInterest(item: string) {
    setSelectedDisciplines((prev) => {
      if (prev.includes(item)) {
        return prev.length > 1 ? prev.filter((d) => d !== item) : prev;
      }
      return [...prev, item];
    });
  }

  function setSelectedDiscipline(item: string) {
    setSelectedDisciplines((prev) => prev.includes(item) ? prev : [item, ...prev]);
  }
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderPaused, setSliderPaused] = useState(false);
  const [sent, setSent] = useState(false);
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [cmsEntries, setCmsEntries] = useState<CmsEntry[]>([]);

  const cmsHeroSlides = cmsEntries
    .filter((entry) => entry.collection === "hero-slides" && entry.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const rawSlides = cmsHeroSlides.length ? cmsHeroSlides.map((entry) => ({
    image: entry.imageUrl || "/carousel-saotruc.webp",
    eyebrow: entry.tag || "BỘ MÔN",
    title: entry.title,
    copy: entry.excerpt,
    href: entry.content || `/bo-mon/${entry.slug}`,
    cta: entry.price || "Khám phá bộ môn",
  })) : slides;
  const displayedSlides = rawSlides.map((s) => ({
    ...s,
    eyebrow: translate(s.eyebrow),
    title: translate(s.title),
    copy: translate(s.copy),
    cta: translate(s.cta),
  }));

  useEffect(() => {
    if (sliderPaused) return;
    const timer = window.setInterval(() => setCurrentSlide((current) => (current + 1) % displayedSlides.length), 5500);
    return () => window.clearInterval(timer);
  }, [displayedSlides.length, sliderPaused]);

  useEffect(() => {
    if (currentSlide >= displayedSlides.length) setCurrentSlide(0);
  }, [currentSlide, displayedSlides.length]);

  useEffect(() => {
    let active = true;
    fetch("/api/cms/content")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("cms_unavailable")))
      .then((data: { entries?: CmsEntry[] }) => { if (active && Array.isArray(data.entries)) setCmsEntries(data.entries); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (window.location.hash !== "#contact") return;
    setActiveService("contact");
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => scrollElementToId("contact")));
  }, []);

  const cmsServices = cmsEntries.filter((entry) => entry.collection === "services" && entry.visible && ["classes", "contact", "products", "courses", "materials", "studio", "booking", "instrument-recording"].includes(entry.slug));
  const rawServices = cmsServices.length ? cmsServices.map((entry, index) => ({
    no: String(index + 1).padStart(2, "0"),
    icon: entry.tag || "♪",
    image: entry.imageUrl,
    title: entry.title,
    text: entry.excerpt,
    cta: entry.content || "Xem chi tiết",
    href: serviceSlugToHref[entry.slug] || `/${entry.slug}`,
    price: entry.price || undefined,
  })) : defaultServices;
  const services = rawServices.map((svc) => ({
    ...svc,
    title: translate(svc.title),
    text: translate(svc.text),
    cta: translate(svc.cta),
    price: svc.price ? translate(svc.price) : undefined,
  }));
  const cmsArticles = cmsEntries.filter((entry) => entry.collection === "articles" && entry.visible);
  const rawArticles = cmsArticles.length ? cmsArticles.map((entry) => ({
    slug: entry.slug,
    tag: entry.tag || "Bài viết",
    title: entry.title,
    excerpt: entry.excerpt,
    imageUrl: entry.imageUrl || "",
    date: entry.publishedAt ? new Date(`${entry.publishedAt}T00:00:00`).toLocaleDateString(lang === "en" ? "en-US" : "vi-VN") : "",
  })) : defaultArticles;
  const articles = rawArticles.map((a) => ({
    ...a,
    tag: translate(a.tag),
    title: translate(a.title),
    excerpt: translate(a.excerpt),
  }));
  const generalSettings = cmsEntries.find((entry) => entry.collection === "settings" && entry.slug === "general");
  const brandName = translate(generalSettings?.title || "SÁO TRÚC ÂU CƠ");
  const brandTagline = translate(generalSettings?.excerpt || "SÁO TRÚC & ÂM NHẠC DÂN TỘC");
  const contactAddress = translate(generalSettings?.content || "106/72 Hòa Bình, P. Tân Phú, TP.HCM");
  const contactPhone = generalSettings?.price || "0374 261 368";
  const contactEmail = generalSettings?.tag || "vanquach999x@gmail.com";
  const paymentSettings = cmsEntries.find((entry) => entry.collection === "settings" && entry.slug === "payment" && entry.visible);
  const paymentBank = paymentSettings?.tag || "STB · Sacombank";
  const paymentAccount = paymentSettings?.price || "030046023451";
  const paymentAccountName = paymentSettings?.excerpt || "QUACH HA VAN";
  const paymentQrUrl = buildVietQrUrl({
    bank: paymentBank,
    account: paymentAccount,
    accountName: paymentAccountName,
    amount: paymentAmount,
    memo: transferContent,
    customImageUrl: paymentSettings?.imageUrl,
  });
  const visibleCollection = (name: string) => cmsEntries
    .filter((entry) => entry.collection === name && entry.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const lines = (value: string) => value.split(/\n+/).map((line) => line.trim()).filter(Boolean);

  const cmsClassDetails = visibleCollection("class-details");
  const rawDisciplines = cmsClassDetails.length ? cmsClassDetails.map((entry) => ({
    slug: entry.slug, image: entry.imageUrl || "/carousel-saotruc.webp", imageAlt: `Minh họa bộ môn ${entry.title}`,
    icon: entry.tag || "♪", title: entry.title, short: entry.excerpt, intro: entry.excerpt,
    learn: lines(entry.content), suitable: entry.price || "Phù hợp với mọi người yêu âm nhạc.",
  })) : disciplines;
  const displayedDisciplines = rawDisciplines.map((d) => ({
    ...d,
    title: translate(d.title),
    short: translate(d.short),
    intro: translate(d.intro),
    learn: d.learn.map((pt) => translate(pt)),
    suitable: translate(d.suitable),
  }));

  const defaultProductGroupSlugs: Record<string, string> = {
    "Sáo ngang Việt Nam": "sao-ngang-viet-nam",
    "Sáo Dizi Trung Quốc": "sao-dizi-trung-quoc",
    "Sáo mèo": "sao-meo",
    "Tiêu & Xiao": "tieu-xiao",
    "Recorder": "recorder",
    "Flute": "flute",
    "Sáo dọc": "sao-doc",
  };

  const cmsProductGroups = visibleCollection("product-groups");
  const cmsProductItems = visibleCollection("product-items");
  const rawProductCats = cmsProductGroups.length ? cmsProductGroups.map((group) => {
    const customItems = cmsProductItems.filter((item) => item.tag === group.slug);
    const defaultCat = productCategories.find((c) => defaultProductGroupSlugs[c.title] === group.slug || c.title === group.title);
    return {
      title: group.title,
      image: group.imageUrl || defaultCat?.image || "/carousel-saotruc.webp",
      intro: group.excerpt,
      products: customItems.length ? customItems.map((item) => ({
        name: item.title,
        description: item.excerpt,
        price: item.price || "Liên hệ",
        image: item.imageUrl || group.imageUrl || defaultCat?.image || "/carousel-saotruc.webp",
      })) : (defaultCat?.products || []),
    };
  }) : productCategories.map((cat) => {
    const groupSlug = defaultProductGroupSlugs[cat.title] || slugify(cat.title);
    const customItems = cmsProductItems.filter((item) => item.tag === groupSlug || item.tag === cat.title || slugify(item.tag) === groupSlug);
    return {
      title: cat.title,
      image: cat.image,
      intro: cat.intro,
      products: customItems.length ? customItems.map((item) => ({
        name: item.title,
        description: item.excerpt,
        price: item.price || "Liên hệ",
        image: item.imageUrl || cat.image,
      })) : cat.products,
    };
  });
  const displayedProductCategories = rawProductCats.map((cat) => ({
    ...cat,
    title: translate(cat.title),
    intro: translate(cat.intro),
    products: (cat.products || []).map((p) => ({
      ...p,
      name: translate(p.name),
      description: translate(p.description),
      price: translate(p.price),
    })),
  }));

  const cmsCourseGroups = visibleCollection("course-groups");
  const cmsCourseItems = visibleCollection("course-items");
  const rawRecordedCourses = cmsCourseGroups.length ? cmsCourseGroups.map((group) => ({
    instrument: group.title, image: group.imageUrl || "/carousel-saotruc.webp",
    items: cmsCourseItems.filter((item) => item.tag === group.slug).map((item) => ({
      slug: item.slug, name: item.title, detail: item.excerpt, price: item.price || "Liên hệ", showPrice: Boolean(item.price && item.price.toLocaleLowerCase("vi") !== "liên hệ"),
    })),
  })) : recordedCourses.map((group) => ({ ...group, items: group.items.map((item) => ({ ...item, slug: slugifyPath(item.name) })) }));
  const displayedRecordedCourses = rawRecordedCourses.map((group) => ({
    ...group,
    instrument: translate(group.instrument),
    items: group.items.map((it) => ({
      ...it,
      name: translate(it.name),
      detail: translate(it.detail),
      price: translate(it.price),
    })),
  }));

  const cmsSingleVideos = visibleCollection("single-videos");
  const displayedSingleVideoGroups = (() => {
    if (!cmsSingleVideos.length) {
      return singleVideoGroups.map((group) => ({
        ...group,
        songs: group.songs.map((song) => ({
          ...song,
          slug: `${slugifyPath(song.name)}-${slugifyPath(group.instrument)}`,
          detail: "Video hướng dẫn từng câu · Sheet nhạc · Ngón bấm · Kỹ thuật",
        })),
      }));
    }

    const disciplineMap: Record<string, { instrument: string; image: string; description: string }> = {
      "sao-truc": { instrument: "Sáo trúc", image: "/carousel-saotruc.webp", description: "Dân ca, nhạc trữ tình và nhạc trẻ chuyển soạn cho sáo trúc." },
      "sao-dizi": { instrument: "Sáo Dizi", image: "/carousel-dizi.webp", description: "Nhạc Trung Hoa kinh điển với màng rung và kỹ thuật luyến láy." },
      "sao-meo": { instrument: "Sáo mèo", image: "/carousel-saotruc.webp", description: "Âm nhạc Tây Bắc dành cho sáo mèo đơn và sáo mèo kép." },
      "tieu-xiao": { instrument: "Tiêu & Xiao", image: "/carousel-tieu.webp", description: "Tác phẩm trầm lắng, cổ phong và thiền cho tiêu, Xiao." },
      "dong-tieu-xiao": { instrument: "Tiêu & Xiao", image: "/carousel-tieu.webp", description: "Tác phẩm trầm lắng, cổ phong và thiền cho tiêu, Xiao." },
      "recorder": { instrument: "Recorder", image: "/carousel-recorder.webp", description: "Nhạc phim, thiếu nhi và ngũ cung Việt Nam cho recorder." },
      "flute": { instrument: "Flute", image: "/carousel-flute.webp", description: "Tác phẩm flute theo cấp độ với sheet và hướng dẫn kỹ thuật." },
      "sao-hmong": { instrument: "Sáo H’Mông", image: "/carousel-saotruc.webp", description: "Làn điệu vùng cao Tây Bắc và kỹ thuật lam đồng." },
    };

    for (const g of cmsCourseGroups) {
      if (!disciplineMap[g.slug]) {
        disciplineMap[g.slug] = { instrument: g.title, image: g.imageUrl || "/carousel-saotruc.webp", description: g.excerpt || `Video hướng dẫn từng bài bộ môn ${g.title}` };
      }
    }
    for (const c of cmsClassDetails) {
      if (!disciplineMap[c.slug]) {
        disciplineMap[c.slug] = { instrument: c.title, image: c.imageUrl || "/carousel-saotruc.webp", description: c.excerpt || `Video hướng dẫn từng bài bộ môn ${c.title}` };
      }
    }

    const usedTags = Array.from(new Set(cmsSingleVideos.map((v) => v.tag).filter(Boolean)));
    const allSlugs = Array.from(new Set([...Object.keys(disciplineMap), ...usedTags]));

    return allSlugs.map((slug) => {
      const info = disciplineMap[slug] || {
        instrument: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        image: "/carousel-saotruc.webp",
        description: "Tuyển tập video hướng dẫn từng câu và sheet nhạc.",
      };
      const songs = cmsSingleVideos
        .filter((entry) => entry.tag === slug || slugifyPath(entry.tag) === slug || entry.tag === info.instrument)
        .map((entry) => ({
          slug: entry.slug,
          name: entry.title,
          detail: entry.excerpt || "Video hướng dẫn từng câu · Sheet nhạc · Ngón bấm",
          price: entry.price || "Liên hệ",
          showPrice: Boolean(entry.price && entry.price.toLowerCase() !== "liên hệ"),
        }));

      return {
        instrument: translate(info.instrument),
        slug,
        image: info.image,
        description: translate(info.description),
        songs: songs.map((s) => ({
          ...s,
          name: translate(s.name),
          detail: translate(s.detail),
          price: translate(s.price),
        })),
      };
    }).filter((g) => g.songs.length > 0);
  })();

  const cmsMaterials = visibleCollection("materials");
  const materialGroups = (kind: "giao-trinh" | "sheet", fallbackGroups: typeof curriculumGroups | typeof sheetGroups) => {
    const hasManagedItems = cmsMaterials.some((entry) => entry.tag.startsWith(`${kind}:`));
    if (!hasManagedItems) return fallbackGroups.map((group, groupIndex) => ({
      ...group,
      instrument: translate(group.instrument),
      items: group.items.map((item) => ({
        ...item,
        name: translate(item.name),
        detail: translate(item.detail),
        price: translate(item.price),
        slug: groupIndex === 0 ? slugifyPath(item.name) : `${slugifyPath(item.name)}-${slugifyPath(group.instrument)}`,
      })),
    }));
    return fallbackGroups.map((group) => ({
      ...group,
      instrument: translate(group.instrument),
      items: cmsMaterials.filter((entry) => entry.tag === `${kind}:${slugifyPath(group.instrument)}`).map((entry) => ({
        slug: entry.slug, name: translate(entry.title), detail: translate(entry.excerpt), price: translate(entry.price || "Liên hệ"),
        showPrice: Boolean(entry.price && entry.price.toLocaleLowerCase("vi") !== "liên hệ"),
      })),
    })).filter((group) => group.items.length);
  };
  const displayedCurriculumGroups = materialGroups("giao-trinh", curriculumGroups);
  const displayedSheetGroups = materialGroups("sheet", sheetGroups);

  const cmsSocialLinks = visibleCollection("social-links");
  const rawSocialLinks = cmsSocialLinks.length ? cmsSocialLinks.map((entry) => ({
    slug: entry.slug, platform: entry.price || entry.slug.toUpperCase(), icon: entry.tag || "↗", title: entry.title, href: entry.content,
  })).filter((entry) => entry.href.startsWith("http://") || entry.href.startsWith("https://")) : defaultSocialLinks;
  const displayedSocialLinks = rawSocialLinks.map((s) => ({
    ...s,
    title: translate(s.title),
  }));

  const cmsStudioPackages = visibleCollection("studio-packages");
  const rawStudioPackages = cmsStudioPackages.length ? cmsStudioPackages.map((entry) => ({
    icon: entry.tag || "♪", title: entry.title, subtitle: entry.excerpt, price: entry.price || "Liên hệ",
    showPrice: Boolean(entry.price && entry.price.toLocaleLowerCase("vi") !== "liên hệ"), features: lines(entry.content),
  })) : studioPackages;
  const displayedStudioPackages = rawStudioPackages.map((p) => ({
    ...p,
    title: translate(p.title),
    subtitle: translate(p.subtitle),
    price: translate(p.price),
    features: p.features.map((f) => translate(f)),
  }));

  const cmsBookingPackages = visibleCollection("booking-packages");
  const rawBookingPackages = cmsBookingPackages.length ? cmsBookingPackages.map((entry) => ({
    icon: entry.tag || "♪", title: entry.title, detail: entry.excerpt, price: entry.price || "Liên hệ",
    showPrice: Boolean(entry.price && entry.price.toLocaleLowerCase("vi") !== "liên hệ"), features: lines(entry.content),
  })) : bookingPackages;
  const displayedBookingPackages = rawBookingPackages.map((b) => ({
    ...b,
    title: translate(b.title),
    detail: translate(b.detail),
    price: translate(b.price),
    features: b.features.map((f) => translate(f)),
  }));

  const cmsRecordingInstruments = visibleCollection("recording-instruments");
  const rawRecordingInstruments = cmsRecordingInstruments.length ? cmsRecordingInstruments.map((entry) => ({
    icon: entry.tag || "♪", title: entry.title, tone: entry.excerpt, price: entry.price || "Liên hệ",
    showPrice: Boolean(entry.price && entry.price.toLocaleLowerCase("vi") !== "liên hệ"),
  })) : recordingInstruments;
  const displayedRecordingInstruments = rawRecordingInstruments.map((r) => ({
    ...r,
    title: translate(r.title),
    tone: translate(r.tone),
    price: translate(r.price),
  }));

  const cmsFluteTabs = visibleCollection("flute-tabs");
  const rawFluteTabs = cmsFluteTabs.length ? cmsFluteTabs.map((entry) => ({
    title: entry.title,
    fullTitle: entry.excerpt || entry.title,
    tone: entry.tag || "Cảm âm sáo trúc",
    lines: parseFluteTab(entry.content),
  })) : fluteTabs.map((f) => ({
    ...f,
    lines: f.lines.map((l) => ({
      lyric: l.lyric,
      notes: formatFluteNoteLine(l.notes),
    })),
  }));
  const displayedFluteTabs = rawFluteTabs.map((f) => ({
    ...f,
    title: translate(f.title),
    fullTitle: translate(f.fullTitle),
    tone: translate(f.tone),
  }));

  const cmsFreeGuides = visibleCollection("free-guides");
  const rawFreeGuides = cmsFreeGuides.length ? cmsFreeGuides.map((entry) => ({
    platform: entry.tag || "Bài viết",
    icon: entry.tag.toLocaleLowerCase("vi").includes("youtube") ? "▶" : entry.tag.toLocaleLowerCase("vi").includes("tiktok") ? "♪" : "✎",
    topic: entry.price || "Hướng dẫn miễn phí",
    title: entry.title,
    description: entry.excerpt,
    href: entry.content || "#contact",
  })) : freeGuides;
  const displayedFreeGuides = rawFreeGuides.map((g) => ({
    ...g,
    platform: translate(g.platform),
    topic: translate(g.topic),
    title: translate(g.title),
    description: translate(g.description),
  }));
  const searchItems = services
    .map((item) => ({ title: item.title, type: t("Danh mục", "Category"), href: item.href }))
    .filter((item) => item.title.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi")));

  function scrollToId(id: string) {
    if (id.replace("#", "") === "contact" && activeService !== "contact") {
      setActiveService("contact");
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => scrollElementToId("contact"));
      });
      return;
    }
    scrollElementToId(id);
  }

  function openService(href: string) {
    const section = href.replace("#", "") as ServiceSection;
    setActiveService(section);
    setMenuOpen(false);
    setSearchOpen(false);
    setQuery("");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => scrollElementToId(section === "contact" ? "contact" : "service-detail"));
    });
  }

  function closeService() {
    setActiveService(null);
    window.requestAnimationFrame(() => scrollToId("services"));
  }

  async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSent(false);
    setRequestError("");
    setRequestSubmitting(true);
    const data = new FormData(e.currentTarget);
    const interestsString = selectedDisciplines.length ? selectedDisciplines.join(", ") : "Sáo trúc Việt Nam";
    try {
      const response = await fetch("/api/contact-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          interest: interestsString,
          message: data.get("message"),
        }),
      });
      if (!response.ok) throw new Error("request_failed");
      setSent(true);
      try {
        form.reset();
      } catch {
        // The request is already delivered; a browser reset failure must not show a send error.
      }
    } catch {
      setRequestError("Chưa gửi được yêu cầu. Vui lòng thử lại hoặc liên hệ số 0374 261 368.");
    } finally {
      setRequestSubmitting(false);
    }
  }

  function openPayment(product: string, price = "") {
    setSelectedPurchase(product);
    setPaymentAmount(price ? parsePrice(price).effectiveAmount : "");
    setTransferContent(product.toLocaleUpperCase("vi").replace(/[^A-Z0-9À-Ỹ]+/g, "_").slice(0, 32));
    setOrderSent(false);
    setPaymentSubmitting(false);
    setPaymentError("");
    setPaymentOpen(true);
  }

  async function confirmPayment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPaymentSubmitting(true);
    setPaymentError("");
    const data = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/payment-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: selectedPurchase,
          amount: paymentAmount,
          transferContent,
          buyerName: data.get("buyerName"),
          buyerPhone: data.get("buyerPhone"),
          buyerEmail: data.get("buyerEmail"),
        }),
      });

      if (!response.ok) throw new Error("notification_failed");
      setOrderSent(true);
    } catch {
      setPaymentError("Chưa gửi được thông báo. Vui lòng thử lại hoặc liên hệ Zalo 0374 261 368.");
    } finally {
      setPaymentSubmitting(false);
    }
  }

  return (
    <main>
      <div className="top-contact-bar" aria-label={t("Thông tin liên hệ nhanh", "Quick contact info")}>
        <a className="top-address" href="#contact" onClick={(e) => { e.preventDefault(); openService("#contact"); }}><span>⌖</span><span>{contactAddress}</span></a>
        <a className="top-phone" href={`tel:${contactPhone.replace(/\D/g, "")}`}><span>☎</span><span>{contactPhone}</span><small>{t("Hotline / Zalo", "Hotline / Zalo")}</small></a>
        <LanguageSwitcher className="lang-switcher-top" compact />
      </div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label={t("Sáo Trúc Âu Cơ - Trang chủ", "Au Co Bamboo Flute - Home")}>
          <img src="/logo.jpg" alt="Logo Sáo Trúc Âu Cơ" width={46} height={46} style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 8, flex: "0 0 auto" }} />
          <span><b>{brandName}</b><small>{brandTagline}</small></span>
        </a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={t("Mở menu", "Open menu")} aria-expanded={menuOpen}>☰</button>
        <nav className={menuOpen ? "open" : ""} aria-label={t("Điều hướng chính", "Main navigation")}>
          <a href="#top" onClick={() => setMenuOpen(false)}>{t("Trang chủ", "Home")}</a>
          <button className="nav-search" onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}>{t("⌕ Tìm kiếm", "⌕ Search")}</button>
          <a href="/bai-viet" onClick={() => setMenuOpen(false)}>{t("Bài viết", "Articles")}</a>
          <a href="#classes" onClick={(e) => { e.preventDefault(); openService("#classes"); }}>{t("Lớp học", "Classes")}</a>
          <a href="/cam-am" onClick={() => setMenuOpen(false)}>{t("Cảm âm", "Flute Tabs")}</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); openService("#contact"); }}>{t("Liên hệ", "Contact")}</a>
        </nav>
        <button className="button button-gold header-cta" onClick={() => openService("#contact")}>{t("✦ Đăng ký học", "✦ Enroll Now")}</button>
        {searchOpen && <div className="search-panel"><div className="search-box"><span>⌕</span><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Tìm lớp học, khóa học, dịch vụ...", "Search classes, courses, services...")} aria-label={t("Tìm kiếm nội dung", "Search content")} /><button onClick={() => { setSearchOpen(false); setQuery(""); }} aria-label={t("Đóng tìm kiếm", "Close search")}>×</button></div>{query && <div className="search-results">{searchItems.length ? searchItems.slice(0, 6).map((item) => <a key={`${item.type}-${item.title}`} href={item.href} onClick={(e) => { e.preventDefault(); openService(item.href); }}><small>{item.type}</small><span>{item.title}</span><b>→</b></a>) : <p>{t("Không tìm thấy nội dung phù hợp.", "No matching content found.")}</p>}</div>}</div>}
      </header>

      <section className="hero" id="top">
        {displayedSlides.map((slide, i) => <div key={`${slide.href}-${i}`} className={`hero-image hero-slide-${i + 1}${currentSlide === i ? " slide-active" : ""}`} style={{ backgroundImage: `url(${slide.image})` }} aria-hidden="true" />)}
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="brand-slogan"><span className="slogan-text">{t("Hơi Thở Thành Âm", "Breath Into Sound")}</span><span className="slogan-divider">—</span><span className="slogan-text">{t("Tâm Hồn Thành Nhạc", "Soul Into Melody")}</span></p>
          <p className="eyebrow">{displayedSlides[currentSlide].eyebrow}</p>
          <p className="slide-count">{String(currentSlide + 1).padStart(2, "0")} <span>/ {String(displayedSlides.length).padStart(2, "0")}</span></p>
          <h1>{displayedSlides[currentSlide].title}</h1>
          <p className="hero-copy">{displayedSlides[currentSlide].copy}</p>
          <div className="hero-actions">
            <a className="button button-gold hero-link" href={displayedSlides[currentSlide].href}>{displayedSlides[currentSlide].cta}</a>
            <button className="button button-outline" onClick={() => openService("#contact")}>{t("Đăng ký học", "Enroll Now")}</button>
          </div>
        </div>
        <div className="hero-features" aria-label={t("Điểm nổi bật", "Highlights")}>
          <div><i>♫</i><span>{t("Phương pháp khoa học,", "Scientific method,")}<br />{t("trọng tâm, dễ hiểu", "focused & clear")}</span></div>
          <div><i>●</i><span>{t("Giáo viên", "Professional")}<br />{t("chuyên nghiệp", "instructors")}</span></div>
          <div><i>★</i><span>{t("Dạy Offline tại TP.HCM,", "Offline in HCMC,")}<br />{t("Online cho học viên ở xa", "Online worldwide")}</span></div>
          <div><i>♥</i><span>{t("Đồng hành – Tận tâm", "Dedicated – Inspiring")}<br />{t("– Truyền cảm hứng", "– Passionate")}</span></div>
        </div>
        <button className="slider-arrow slider-prev" onClick={() => { setSliderPaused(true); setCurrentSlide((currentSlide - 1 + displayedSlides.length) % displayedSlides.length); }} aria-label={t("Ảnh trước", "Previous slide")}>‹</button>
        <button className="slider-arrow slider-next" onClick={() => { setSliderPaused(true); setCurrentSlide((currentSlide + 1) % displayedSlides.length); }} aria-label={t("Ảnh tiếp theo", "Next slide")}>›</button>
        <div className="slider-dots" aria-label={t("Chọn ảnh quảng cáo", "Select slide")}>{displayedSlides.map((slide, i) => <button key={`${slide.title}-${i}`} className={currentSlide === i ? "active" : ""} onClick={() => { setSliderPaused(true); setCurrentSlide(i); }} aria-label={`${t("Xem", "View")} ${slide.title}`} />)}</div>
      </section>

      <section className="section" id="services">
        <div className="section-heading"><span /><div><p className="eyebrow">{t("HỆ SINH THÁI ÂM NHẠC", "MUSICAL ECOSYSTEM")}</p><h2>{t("Dịch vụ của chúng tôi", "Our Services & Solutions")}</h2></div><span /></div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.no}>
              <Link href={service.href} style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%" }}>
                <div className="card-top">
                  <span className="card-no">{service.no}</span>
                  <span className="card-icon">{service.icon}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                {service.price && <PriceTag price={service.price} className="price" />}
                <span className="service-card-link" style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, color: "#8c1c38", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", paddingTop: 12 }}>
                  {service.cta}
                  <span>→</span>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {activeService && <div className="service-detail-bar" id="service-detail">
        <div><small>{t("NỘI DUNG ĐANG XEM", "CURRENTLY VIEWING")}</small><b>{services.find((service) => service.href === `#${activeService}`)?.title}</b></div>
        <button onClick={closeService}>{t("← Quay lại 8 danh mục", "← Back to 8 categories")}</button>
      </div>}

      {activeService === "classes" && <section className="courses section" id="classes">
        <div className="courses-head"><div><p className="eyebrow">{t("CÁC BỘ MÔN GIẢNG DẠY", "TRAINING DISCIPLINES")}</p><h2>{t("Chọn thanh âm", "Choose your tone")}<br />{t("phù hợp với bạn", "that resonates with you")}</h2></div><p>{t("Mỗi bộ môn có một màu sắc riêng. Bấm “Xem thêm” để khám phá nội dung học, đối tượng phù hợp và đăng ký tư vấn.", "Each discipline offers unique tonal color. Explore syllabus, prerequisites, and enroll.")}</p></div>
        <div className="discipline-grid">{displayedDisciplines.map((item, i) => <article className="discipline-card" key={item.title}><a className="discipline-summary" href={`/bo-mon/${item.slug}`}><span className="discipline-photo"><img src={item.image} alt={item.imageAlt} width="640" height="420" loading="lazy" decoding="async" /><i>{item.icon}</i></span><span className="discipline-copy"><small>{t("BỘ MÔN", "DISCIPLINE")} 0{i + 1}</small><h3>{item.title}</h3><p>{item.short}</p></span><b className="discipline-cta">{t("Xem chi tiết →", "View details →")}</b></a></article>)}</div>
      </section>}

      {activeService === "courses" && <section className="recorded-section" id="courses">
        <div className="recorded-head"><div><p className="eyebrow">{t("HỌC MỌI LÚC · XEM LẠI TRỌN ĐỜI", "LEARN ANYTIME · LIFETIME ACCESS")}</p><h2>{t("Khóa học & video quay sẵn", "Video Courses & Masterclasses")}</h2></div><p>{t("Chọn một lộ trình đầy đủ hoặc mua riêng từng video tác phẩm theo đúng nhạc cụ bạn đang chơi.", "Select structured roadmaps or individual song masterclasses tailored to your instrument.")}</p></div>
        <div className="recorded-tabs" role="tablist" aria-label={t("Loại nội dung quay sẵn", "Recorded content types")}><button className={courseTab === "courses" ? "active" : ""} onClick={() => setCourseTab("courses")} role="tab" aria-selected={courseTab === "courses"}>{t("I. Khóa học theo bộ môn", "I. Courses by Instrument")}</button><button className={courseTab === "videos" ? "active" : ""} onClick={() => setCourseTab("videos")} role="tab" aria-selected={courseTab === "videos"}>{t("II. Video quay từng bài", "II. Individual Song Videos")}</button></div>
        {courseTab === "courses" ? <div className="recorded-course-list">{displayedRecordedCourses.map((course, i) => <article className={openRecordedCourse === i ? "recorded-course is-open" : "recorded-course"} key={course.instrument}>
          <button className="recorded-course-summary" onClick={() => setOpenRecordedCourse(openRecordedCourse === i ? null : i)} aria-expanded={openRecordedCourse === i}>
            <span className="recorded-cover" style={{ backgroundImage: `linear-gradient(0deg,rgba(69,14,31,.82),transparent 70%),url(${course.image})` }}><small>{t("KHÓA HỌC", "COURSE")} 0{i + 1}</small><h3>{course.instrument}</h3></span>
            <span className="recorded-summary-copy"><small>{t("CHƯƠNG TRÌNH QUAY SẴN", "RECORDED PROGRAM")}</small><b>{t("Khóa học", "Course")} {course.instrument}</b><em>{course.items.length} {t("nội dung · Học mọi lúc · Xem lại trọn đời", "lessons · Learn anytime · Lifetime access")}</em></span><i>{openRecordedCourse === i ? "−" : "+"}</i>
          </button>
          {openRecordedCourse === i && <div className="recorded-lessons">{course.items.map((item, j) => <div key={item.name}><span>{i + 1}.{j + 1}</span><p><a className="catalog-detail-link" href={`/khoa-hoc/${item.slug}`}>{item.name}</a><small>{item.detail}</small></p><div className="purchase-action"><small>{t("GIÁ KHÓA HỌC", "COURSE TUITION")}</small><PriceTag price={item.price} />{parsePrice(item.price).effectiveAmount ? <button onClick={() => openPayment(`${t("Khóa học", "Course")} ${course.instrument} – ${item.name}`, item.price)}>{t("Mua ngay qua VietQR", "Buy via VietQR")}</button> : <button onClick={() => { setSelectedDiscipline(`${t("Khóa học", "Course")} ${course.instrument} - ${item.name}`); scrollToId("contact"); }}>{t("Nhận tư vấn →", "Get Consultation →")}</button>}</div></div>)}</div>}
        </article>)}</div> : <div className="single-video-catalog">
          <article className="custom-video-card"><div><span>✦</span><p><small>{t("VIDEO CÁ NHÂN HÓA", "CUSTOM VIDEO LESSON")}</small><b>{t("Bài quay theo yêu cầu", "Custom Video on Demand")}</b><em>{t("Gửi tên bài, tone sáo và yêu cầu kỹ thuật. Sáo Trúc Âu Cơ sẽ quay video hướng dẫn riêng phù hợp với bạn.", "Send song title, key, and level. Au Co Bamboo Flute will record a tailored tutorial video for you.")}</em></p></div><strong>{t("Liên hệ", "Contact")}</strong><button onClick={() => openPayment(t("Bài quay theo yêu cầu", "Custom Video on Demand"))}>{t("Gửi yêu cầu", "Send Request")}</button></article>
          <div className="video-group-list">{displayedSingleVideoGroups.map((group, i) => <article className={openVideoGroup === i ? "video-group is-open" : "video-group"} key={group.instrument}>
            <button className="video-group-button" onClick={() => setOpenVideoGroup(openVideoGroup === i ? null : i)} aria-expanded={openVideoGroup === i}><span className="video-group-image" style={{ backgroundImage: `linear-gradient(0deg,rgba(70,14,31,.58),transparent),url(${group.image})` }}><i>▶</i></span><span><small>{t("NHẠC CỤ", "INSTRUMENT")} 0{i + 1}</small><b>{group.instrument}</b><em>{group.description}</em></span><strong>{group.songs.length} {t("bài", "songs")}</strong><i>{openVideoGroup === i ? "−" : "+"}</i></button>
            {openVideoGroup === i && <div className="video-song-list">{group.songs.map((song, j) => <div key={song.name}><span>{String(j + 1).padStart(2,"0")}</span><p><a className="catalog-detail-link" href={`/video/${song.slug}`}>{song.name}</a><small>{song.detail}</small></p><div className="purchase-action"><small>{t("GIÁ VIDEO", "VIDEO PRICE")}</small><PriceTag price={song.price} />{parsePrice(song.price).effectiveAmount ? <button onClick={() => openPayment(`Video ${group.instrument} – ${song.name}`, song.price)}>{t("Mua ngay qua VietQR", "Buy via VietQR")}</button> : <button onClick={() => { setSelectedDiscipline(`Video ${group.instrument} - ${song.name}`); scrollToId("contact"); }}>{t("Nhận tư vấn →", "Get Consultation →")}</button>}</div></div>)}</div>}
          </article>)}</div>
        </div>}
        <div className="payment-note"><span>▣</span><p><b>{t("Thanh toán nhanh bằng VietQR", "Instant Payment with VietQR")}</b><small>{t("Bấm “Mua khóa học” hoặc “Chọn video” để mở bảng thanh toán và chỉnh số tiền, nội dung chuyển khoản.", "Click 'Buy via VietQR' to open QR payment modal and complete order.")}</small></p></div>
      </section>}

      {paymentOpen && <div className="payment-modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setPaymentOpen(false); }}>
        <section className="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-title">
          <button className="payment-close" onClick={() => setPaymentOpen(false)} aria-label={t("Đóng bảng thanh toán", "Close payment modal")}>×</button>
          <header><h2 id="payment-title">{t("Thanh Toán Qua VietQR", "VietQR Instant Payment")}</h2><p>{selectedPurchase}</p></header>
          <div className="payment-modal-grid">
            <div className="payment-left">
              <h3>{t("THÔNG TIN CHUYỂN KHOẢN", "BANK TRANSFER DETAILS")}</h3>
              <div className="bank-info"><p><span>{t("Ngân hàng:", "Bank:")}</span><b>{paymentBank}</b></p><p><span>{t("Số tài khoản:", "Account No.:")}</span><b>{paymentAccount}</b><button type="button" onClick={() => navigator.clipboard?.writeText(paymentAccount)}>{t("Sao chép", "Copy")}</button></p><p><span>{t("Chủ tài khoản:", "Account Holder:")}</span><b>{paymentAccountName}</b></p><label><span>{t("Số tiền thanh toán:", "Amount to pay:")}</span><input value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder={t("Nhập số tiền (VNĐ)", "Enter amount (VND)")} inputMode="numeric" /></label><label><span>{t("Nội dung chuyển khoản:", "Transfer memo:")}</span><input value={transferContent} onChange={(e) => setTransferContent(e.target.value)} placeholder={t("Nhập nội dung chuyển khoản", "Enter transfer memo")} /><button type="button" onClick={() => navigator.clipboard?.writeText(transferContent)}>{t("Sao chép", "Copy")}</button></label></div>
              <h3>{t("THÔNG TIN NGƯỜI MUA", "CUSTOMER INFORMATION")}</h3>
              <form id="payment-form" onSubmit={confirmPayment}><label>{t("Họ và tên", "Full Name")} <small>({t("không bắt buộc", "optional")})</small><input name="buyerName" placeholder={t("Nhập họ tên của bạn", "Enter your full name")} /></label><label>{t("Số điện thoại / Zalo nhận file *", "Phone / Zalo to receive file *")}<input required name="buyerPhone" type="tel" placeholder={t("Nhập số điện thoại Zalo", "Enter phone or Zalo number")} /></label><label>{t("Email nhận khóa học", "Email to receive course files")}<input name="buyerEmail" type="email" placeholder={t("Email của bạn (nếu có)", "Your email (optional)")} /></label></form>
            </div>
            <aside className="payment-qr"><img src={paymentQrUrl} alt={`Mã thanh toán VietQR ${paymentBank}`} width="540" height="540" loading="eager" decoding="sync" /><a href={paymentQrUrl} target="_blank" rel="noreferrer">{t("↓ Tải / Mở ảnh QR", "↓ Download / Open QR")}</a><button className="payment-confirm" type="submit" form="payment-form" disabled={paymentSubmitting || orderSent}>{paymentSubmitting ? t("Đang gửi thông báo...", "Sending notification...") : orderSent ? t("✓ Đã gửi xác nhận", "✓ Confirmation Sent") : t("● Xác nhận đã chuyển khoản", "● Confirm Payment Completed")}</button>{orderSent && <p role="status">{t("Đã gửi thông báo cho Sáo Trúc Âu Cơ. Giao dịch sẽ được kiểm tra trước khi cấp khóa học hoặc sản phẩm.", "Notification sent to Au Co Bamboo Flute. Your order will be verified and delivered shortly.")}</p>}{paymentError && <p className="payment-error" role="alert">{paymentError}</p>}</aside>
          </div>
        </section>
      </div>}

      {activeService === "products" && <section className="products-section" id="products">
        <div className="products-heading"><div><p className="eyebrow">{t("SÁO & PHỤ KIỆN", "FLUTES & ACCESSORIES")}</p><h2>{t("Chọn nhạc cụ phù hợp", "Find the perfect instrument")}<br />{t("với thanh âm của bạn.", "for your musical voice.")}</h2></div><p>{t("Mỗi nhóm nhạc cụ có nhiều chất liệu và cấu hình khác nhau. Bấm vào từng mục để xem mô tả, hình ảnh và thông tin giá.", "Each instrument family comes in diverse materials and keys. Click to view descriptions, photos, and pricing.")}</p></div>
        <div className="product-category-list">{displayedProductCategories.map((category, i) => <article className={openProductCategory === i ? "product-category is-open" : "product-category"} key={category.title}>
          <button className="product-category-button" onClick={() => setOpenProductCategory(openProductCategory === i ? null : i)} aria-expanded={openProductCategory === i}>
            <span className="product-category-image" style={{ backgroundImage: `linear-gradient(90deg,rgba(65,13,30,.18),rgba(65,13,30,.02)),url(${category.image})` }} />
            <span><small>{t("NHÓM SẢN PHẨM", "PRODUCT GROUP")} 0{i + 1}</small><b>{category.title}</b><em>{category.intro}</em></span><i>{openProductCategory === i ? "−" : "+"}</i>
          </button>
          {openProductCategory === i && <div className="product-detail-grid">{category.products.map((product) => <div className="product-item" key={product.name}>
            <div className="product-thumb" style={{ backgroundImage: `url(${"image" in product && product.image ? product.image : category.image})` }}><span>{product.name}</span></div>
            <div className="product-item-copy"><h3>{product.name}</h3><p>{product.description}</p><div><PriceTag price={product.price} /><button className="button button-wine" onClick={() => { setSelectedDiscipline(t("Mua sáo & phụ kiện", "Buy Flute & Accessories")); openService("#contact"); }}>{t("Nhận tư vấn →", "Get Consultation →")}</button></div></div>
          </div>)}</div>}
        </article>)}</div>
      </section>}

      {activeService === "studio" && <section className="studio-section" id="studio">
        <div className="studio-head"><div><p className="eyebrow">{t("THU ÂM & QUAY VIDEO", "AUDIO RECORDING & MV PRODUCTION")}</p><h2>{t("Biến phần trình diễn", "Transform your performance")}<br />{t("thành một sản phẩm đẹp.", "into a polished masterpiece.")}</h2></div><p>{t("Từ một bản thu mộc đến MV hoàn chỉnh, Sáo Trúc Âu Cơ đồng hành ở cả âm thanh, hình ảnh và cách thể hiện để giữ được màu sắc riêng của người biểu diễn.", "From raw acoustic tracks to full music videos, Au Co Bamboo Flute accompanies you through audio, visuals, and expression to preserve your unique identity.")}</p></div>
        <div className="studio-package-grid">{displayedStudioPackages.map((item) => <article className="studio-package" key={item.title}><div className="studio-package-top"><span>{item.icon}</span><div><small>{item.subtitle}</small><h3>{item.title}</h3></div></div><ul>{item.features.map((feature) => <li key={feature}>✓ <span>{feature}</span></li>)}</ul><div className="studio-buy"><small>{t("GIÁ THAM KHẢO", "STARTING PRICE")}</small><PriceTag price={item.price} />{parsePrice(item.price).effectiveAmount ? <button onClick={() => openPayment(`${t("Đặt cọc", "Deposit")} ${item.title}`, item.price)}>{t("Đặt cọc qua VietQR", "Deposit via VietQR")}</button> : <button onClick={() => { setSelectedDiscipline(t("Thu âm / Booking biểu diễn", "Audio Recording / Artist Booking")); scrollToId("contact"); }}>{t("Nhận báo giá qua Zalo", "Get Quote via Zalo")}</button>}</div></article>)}</div>
        <div className="studio-info-grid"><article><p className="eyebrow">{t("QUY TRÌNH THỰC HIỆN", "WORKFLOW PROCESS")}</p><h3>{t("Rõ ràng trong từng bước", "Clear step-by-step milestones")}</h3><ol>{studioSteps.map((step, i) => <li key={step}><span>{String(i + 1).padStart(2, "0")}</span>{translate(step)}</li>)}</ol></article><article><p className="eyebrow">{t("THÔNG TIN CẦN GỬI", "INFORMATION REQUIRED")}</p><h3>{t("Để nhận báo giá chính xác", "To receive an accurate quote")}</h3><ul><li>{t("Tên tác phẩm và nhạc cụ sử dụng", "Song title and chosen instruments")}</li><li>{t("Beat hoặc bản phối hiện có", "Backing track or demo arrangement")}</li><li>{t("Thu âm, quay video hay gói trọn bộ", "Audio recording, music video, or full package")}</li><li>{t("Địa điểm và thời gian mong muốn", "Preferred venue and target schedule")}</li><li>{t("Phong cách hình ảnh tham khảo", "Visual reference and moodboard")}</li></ul><button onClick={() => { setSelectedDiscipline(t("Thu âm / Booking biểu diễn", "Audio Recording / Artist Booking")); scrollToId("contact"); }}>{t("Gửi yêu cầu tư vấn →", "Submit consultation request →")}</button></article><article><p className="eyebrow">{t("SẢN PHẨM BÀN GIAO", "DELIVERABLES")}</p><h3>{t("Đầy đủ để lưu giữ & chia sẻ", "Ready for archiving & releasing")}</h3><ul><li>{t("Âm thanh WAV và MP3 chất lượng cao", "High-resolution WAV & MP3 master files")}</li><li>{t("Video Full HD hoặc 4K theo thỏa định", "Full HD or 4K video masters")}</li><li>{t("Bản ngang cho YouTube/Facebook", "Horizontal landscape edit for YouTube/Facebook")}</li><li>{t("Bản dọc TikTok/Reels khi đăng ký", "Vertical reels edit for TikTok/Instagram")}</li><li>{t("Ảnh bìa hoặc thumbnail theo gói", "Custom cover art or YouTube thumbnail")}</li></ul><small>{t("Chi phí địa điểm, beat bản quyền, nhạc công, trang phục và trang điểm sẽ được báo riêng nếu phát sinh.", "Venue, licensed beats, session musicians, costumes, and makeup are quoted separately if requested.")}</small></article></div>
        <div className="studio-note"><b>{t("Lưu ý trước khi đặt lịch", "Booking notice")}</b><span>{t("Mỗi gói có phạm vi, số lần chỉnh sửa và thời gian bàn giao khác nhau. Lịch chỉ được giữ sau khi hai bên thống nhất nội dung và đặt cọc.", "Each package varies in scope, revision rounds, and turnaround. Schedules are confirmed upon agreement and deposit.")}</span></div>
      </section>}

      {activeService === "booking" && <section className="booking-section" id="booking">
        <div className="booking-head"><div><p className="eyebrow">{t("BOOKING NGHỆ SĨ", "ARTIST BOOKING")}</p><h2>{t("Âm nhạc phù hợp", "The right music")}<br />{t("cho từng khoảnh khắc.", "for every memorable moment.")}</h2></div><p>{t("Độc tấu, song tấu, hòa tấu hoặc ban nhạc dân tộc được tư vấn theo quy mô, không gian và tinh thần riêng của mỗi sự kiện.", "Solo, duet, ensemble, or full traditional bands tailored to the scale, acoustic space, and ambiance of your event.")}</p></div>
        <div className="booking-events">{bookingEvents.map((event) => <span key={event}>✦ {translate(event)}</span>)}</div>
        <div className="booking-package-grid">{displayedBookingPackages.map((item) => <article className="booking-package" key={item.title}><span className="booking-icon">{item.icon}</span><small>{item.detail}</small><h3>{item.title}</h3><ul>{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><div><small>{t("GIÁ THAM KHẢO", "STARTING PRICE")}</small><PriceTag price={item.price} />{parsePrice(item.price).effectiveAmount ? <button onClick={() => openPayment(`${t("Đặt cọc booking", "Booking Deposit")} – ${item.title}`, item.price)}>{t("Kiểm tra lịch & đặt cọc", "Check availability & deposit")}</button> : <button onClick={() => { setSelectedDiscipline(t("Thu âm / Booking biểu diễn", "Audio Recording / Artist Booking")); scrollToId("contact"); }}>{t("Nhận báo giá qua Zalo", "Get Quote via Zalo")}</button>}</div></article>)}</div>
        <button className="booking-detail-toggle" onClick={() => setBookingDetailsOpen(!bookingDetailsOpen)} aria-expanded={bookingDetailsOpen}><span><small>{t("THÔNG TIN BOOKING", "BOOKING DETAILS")}</small><b>{bookingDetailsOpen ? t("Ẩn quy trình và điều khoản", "Hide workflow and terms") : t("Xem quy trình, yêu cầu và điều khoản", "View workflow, requirements & terms")}</b></span><i>{bookingDetailsOpen ? "−" : "+"}</i></button>
        {bookingDetailsOpen && <div className="booking-detail-grid"><article><small>{t("QUY TRÌNH BOOKING", "BOOKING WORKFLOW")}</small><h3>{t("8 bước xác nhận lịch", "8 steps to schedule confirmation")}</h3><ol><li>{t("Gửi thông tin sự kiện", "Submit event information")}</li><li>{t("Kiểm tra lịch nghệ sĩ", "Check artist availability")}</li><li>{t("Tư vấn tiết mục và đội hình", "Advise repertoire and lineup")}</li><li>{t("Gửi báo giá", "Provide formal quote")}</li><li>{t("Xác nhận hợp đồng, đặt cọc", "Sign agreement & deposit")}</li><li>{t("Thống nhất kịch bản và kỹ thuật", "Align script & soundcheck")}</li><li>{t("Biểu diễn tại sự kiện", "Live performance at event")}</li><li>{t("Thanh toán phần còn lại", "Final balance settlement")}</li></ol></article><article><small>{t("THÔNG TIN CẦN GỬI", "INFORMATION REQUIRED")}</small><h3>{t("Để báo giá chính xác", "For an accurate quotation")}</h3><ul><li>{t("Tên đơn vị và số điện thoại/Zalo", "Organization name & contact phone/Zalo")}</li><li>{t("Loại sự kiện, ngày giờ, địa điểm", "Event type, date, time & venue location")}</li><li>{t("Số tiết mục hoặc thời lượng", "Number of performances or duration")}</li><li>{t("Đội hình và danh sách bài dự kiến", "Preferred lineup and setlist")}</li><li>{t("Yêu cầu trang phục, âm thanh", "Sound system and costume requirements")}</li><li>{t("Ngân sách dự kiến", "Estimated budget range")}</li></ul></article><article><small>{t("CHI PHÍ & ĐIỀU KHOẢN", "EXPENSES & TERMS")}</small><h3>{t("Cần thống nhất trước", "To be agreed beforehand")}</h3><ul><li>{t("Di chuyển, lưu trú ngoài tỉnh", "Travel and lodging for out-of-town events")}</li><li>{t("Tập luyện, chuyển soạn bài mới", "Rehearsal and custom arrangements")}</li><li>{t("Thiết bị, trang phục đặc biệt", "Special stage equipment and outfits")}</li><li>{t("Chính sách đổi ngày hoặc hủy lịch", "Rescheduling and cancellation policies")}</li><li>{t("Giờ thử âm thanh và thời lượng phát sinh", "Soundcheck schedule and overtime terms")}</li><li>{t("Quyền quay phim, livestream và sử dụng hình ảnh", "Media recording, broadcast and livestream rights")}</li></ul></article></div>}
        <div className="booking-cta"><div><small>{t("SẴN SÀNG CHO SỰ KIỆN CỦA BẠN?", "READY FOR YOUR EVENT?")}</small><b>{t("Gửi ngày, địa điểm và đội hình mong muốn để kiểm tra lịch.", "Send date, venue, and lineup preference to check availability.")}</b></div><button onClick={() => { setSelectedDiscipline(t("Thu âm / Booking biểu diễn", "Audio Recording / Artist Booking")); scrollToId("contact"); }}>{t("Nhận báo giá qua Zalo →", "Get Quote via Zalo →")}</button></div>
      </section>}

      {activeService === "instrument-recording" && <section className="instrument-recording" id="instrument-recording">
        <div className="instrument-recording-head"><div><p className="eyebrow">{t("THU ÂM NHẠC CỤ THẬT", "REAL INSTRUMENT RECORDING")}</p><h2>{t("Chất liệu âm thanh thật", "Authentic acoustic textures")}<br />{t("cho bản phối của bạn.", "for your music production.")}</h2></div><p>{t("Dành cho ca sĩ, nhạc sĩ, nhà sản xuất và người làm nội dung cần một track nhạc cụ giàu cảm xúc, đúng tone, BPM và sẵn sàng đưa vào dự án.", "For singers, songwriters, producers, and creators needing expressive instrument tracks with exact key, BPM, and project readiness.")}</p></div>
        <div className="recording-instrument-grid">{displayedRecordingInstruments.map((item) => <article key={item.title}><span>{item.icon}</span><small>{t("NHẠC CỤ NHẬN THU", "RECORDING INSTRUMENTS")}</small><h3>{item.title}</h3><p>{item.tone}</p><div><small>{t("GIÁ TỪ", "PRICE FROM")}</small><PriceTag price={item.price} />{parsePrice(item.price).effectiveAmount ? <button onClick={() => openPayment(`${t("Đặt thu âm", "Book recording")} ${item.title}`, item.price)}>{t("Đặt thu qua VietQR", "Book recording via VietQR")}</button> : <button onClick={() => { setSelectedDiscipline(t("Thu âm / Booking biểu diễn", "Audio Recording / Artist Booking")); scrollToId("contact"); }}>{t("Gửi yêu cầu riêng", "Send custom request")}</button>}</div></article>)}</div>
        <div className="recording-package-row">{recordingPackages.map((item, i) => <article key={item.title}><span>0{i + 1}</span><div><h3>{translate(item.title)}</h3><p>{translate(item.detail)}</p></div><PriceTag price={item.price} /></article>)}</div>
        <div className="recording-brief"><div><small>{t("KHÁCH HÀNG CẦN GỬI", "WHAT CLIENTS PROVIDE")}</small><h3>{t("Beat, BPM, tone và phần tham chiếu", "Backing track, BPM, Key & Reference audio")}</h3><p>{t("Gửi file WAV/MP3, sheet, MIDI hoặc audio mẫu; ghi rõ vị trí cần nhạc cụ, cảm xúc, kỹ thuật mong muốn và thời hạn nhận file.", "Send WAV/MP3, sheet, MIDI, or demo audio with desired instrument cues, mood, and deadline.")}</p></div><button onClick={() => { setSelectedDiscipline(t("Thu âm / Booking biểu diễn", "Audio Recording / Artist Booking")); scrollToId("contact"); }}>{t("Gửi beat & nhận báo giá →", "Send beat & get quote →")}</button></div>
        <button className="recording-detail-toggle" onClick={() => setRecordingDetailsOpen(!recordingDetailsOpen)} aria-expanded={recordingDetailsOpen}><span><small>{t("THÔNG TIN CHUYÊN MÔN", "TECHNICAL SPECIFICATIONS")}</small><b>{recordingDetailsOpen ? t("Ẩn quy trình và chính sách", "Hide process and policies") : t("Xem quy trình, file bàn giao và bản quyền", "View process, deliverables & licensing")}</b></span><i>{recordingDetailsOpen ? "−" : "+"}</i></button>
        {recordingDetailsOpen && <div className="recording-detail-grid"><article><small>{t("HÌNH THỨC THU", "RECORDING MODES")}</small><h3>{t("Linh hoạt theo dự án", "Flexible to project needs")}</h3><ul><li>{t("Thu theo sheet hoàn chỉnh", "Track recorded from full sheet music")}</li><li>{t("Thu theo MIDI hoặc audio mẫu", "Track aligned to MIDI guide or demo")}</li><li>{t("Ứng tấu theo hợp âm và phong cách", "Improvised over chord progressions & mood")}</li><li>{t("Thu bè hoặc nhiều lớp âm thanh", "Layered harmony stems and multitracks")}</li><li>{t("Thu đoạn ngắn hoặc toàn bộ tác phẩm", "Short solo hooks or full-length arrangements")}</li></ul></article><article><small>{t("QUY TRÌNH", "WORKFLOW")}</small><h3>{t("Từ brief đến file gốc", "From brief to master stems")}</h3><ol><li>{t("Gửi beat và yêu cầu", "Send project brief and backing track")}</li><li>{t("Kiểm tra tone, BPM, độ khó", "Verify key, BPM, and complexity")}</li><li>{t("Tư vấn và báo giá", "Consult arrangement and provide quote")}</li><li>{t("Đặt cọc, tiến hành thu", "Confirm deposit and commence recording")}</li><li>{t("Gửi bản nghe thử", "Deliver review sample")}</li><li>{t("Chỉnh sửa và bàn giao", "Revisions and master stems delivery")}</li></ol></article><article><small>{t("FILE BÀN GIAO", "DELIVERABLES")}</small><h3>{t("Sẵn sàng cho producer", "Ready for producers")}</h3><ul><li>{t("WAV riêng từng nhạc cụ", "24-bit/48kHz isolated WAV tracks")}</li><li>{t("MP3 nghe thử", "MP3 preview mix")}</li><li>{t("Track khớp BPM và timeline", "Timeline-aligned stems locked to project grid")}</li><li>{t("Bản dry/wet theo gói", "Dry acoustic and processed wet options")}</li><li>{t("Các take lựa chọn khi đăng ký", "Alternative solo takes upon request")}</li></ul></article><article><small>{t("CHỈNH SỬA & BẢN QUYỀN", "REVISIONS & LICENSING")}</small><h3>{t("Minh bạch trước khi thu", "Transparent before recording")}</h3><ul><li>{t("Ghi rõ số lần chỉnh sửa miễn phí", "Defined complimentary revision rounds")}</li><li>{t("Đổi tone, BPM hoặc phối có thể tính phí thu lại", "Key/tempo changes post-recording quoted separately")}</li><li>{t("Thống nhất quyền sử dụng thương mại", "Commercial release rights guaranteed")}</li><li>{t("Bảo mật tác phẩm chưa phát hành", "Strict NDA for unreleased productions")}</li><li>{t("Chỉ dùng làm sản phẩm mẫu khi được đồng ý", "Portfolio showcase only with client consent")}</li></ul></article></div>}
        <div className="recording-footer-cta"><div><small>{t("CẦN THU GẤP HOẶC NHIỀU NHẠC CỤ?", "NEED RUSH DELIVERY OR MULTIPLE INSTRUMENTS?")}</small><b>{t("Gửi dự án để được tư vấn đội hình và thời gian bàn giao.", "Send your project to discuss arrangement, lineup, and rush delivery.")}</b></div><button onClick={() => { setSelectedDiscipline(t("Thu âm / Booking biểu diễn", "Audio Recording / Artist Booking")); scrollToId("contact"); }}>{t("Liên hệ thu gấp →", "Rush order contact →")}</button></div>
      </section>}

      {activeService === "classes" && <section className="articles section" id="articles">
        <div className="articles-head"><div><p className="eyebrow">{t("KIẾN THỨC & CẢM HỨNG", "KNOWLEDGE & INSPIRATION")}</p><h2>{t("Bài viết mới", "Recent Articles")}</h2></div><p>{t("Những hướng dẫn ngắn gọn, dễ áp dụng để bạn hiểu nhạc cụ và luyện tập đúng cách.", "Concise, actionable guides to help you understand traditional instruments and practice effectively.")}</p></div>
        <div className="article-grid">{articles.map((article, i) => <article key={article.title}><div className={`article-visual ${article.imageUrl ? "has-image" : ""}`}>{article.imageUrl ? <><img src={article.imageUrl} alt={article.title} className="article-visual-img" onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }} /><span>0{i + 1}</span></> : <><span>0{i + 1}</span><b>♪</b></>}</div><div className="article-body"><small>{article.tag} · {article.date}</small><h3>{article.title}</h3><p>{article.excerpt}</p><a href={`/bai-viet/${article.slug}`}>{t("Đọc bài viết", "Read article")} <span>→</span></a></div></article>)}</div>
      </section>}

      {activeService === "classes" && <section className="free-guides-section" id="free-guides">
        <div className="free-guides-head">
          <div><p className="eyebrow">{t("CHIA SẺ KIẾN THỨC · HOÀN TOÀN MIỄN PHÍ", "KNOWLEDGE SHARING · 100% FREE")}</p><h2>{t("Hướng dẫn miễn phí", "Free Tutorials & Guides")}</h2></div>
          <p>{t("Nơi tổng hợp video YouTube, TikTok và bài viết hữu ích. Bạn chỉ cần thay đường dẫn trong từng nội dung để giới thiệu kênh và chia sẻ kiến thức tới học viên.", "Curated collection of video tutorials, tips, and articles for flute learners.")}</p>
        </div>
        <div className="free-guides-grid">
          {displayedFreeGuides.map((guide) => <article key={`${guide.platform}-${guide.title}`}>
            <div className="guide-visual"><span>{guide.icon}</span><small>{guide.platform}</small></div>
            <div className="guide-copy"><small>{guide.topic}</small><h3>{guide.title}</h3><p>{guide.description}</p><a href={guide.href} target={guide.href.startsWith("http") ? "_blank" : undefined} rel={guide.href.startsWith("http") ? "noreferrer" : undefined} onClick={(e) => { if (guide.href === "#contact") { e.preventDefault(); openService("#contact"); } }}>{guide.platform === "Bài viết" || guide.platform === "Article" ? t("Đọc bài viết", "Read article") : `${t("Xem trên", "Watch on")} ${guide.platform}`} <span>→</span></a></div>
          </article>)}
        </div>
        <div className="free-guides-note"><span>✦</span><p><b>{t("Sẵn sàng để gắn nội dung của bạn", "Ready for learning resources")}</b><small>{t("Thay các đường dẫn mẫu bằng link YouTube, TikTok hoặc bài viết thật; bố cục sẽ tự thích ứng trên máy tính và điện thoại.", "Easily customized with direct video links and learning resources.")}</small></p><button onClick={() => openService("#contact")}>{t("Gửi link cần cập nhật", "Submit learning resource")}</button></div>
      </section>}

      {activeService === "flute-tabs" && <section className="flute-tabs-section" id="cam-am-sao-truc">
        <div className="flute-tabs-head"><div><p className="eyebrow">{t("LỜI BÀI HÁT · NỐT CẢM ÂM", "LYRICS · FLUTE TABS")}</p><h2>{t("Cảm âm sáo trúc", "Bamboo Flute Tabs")}</h2></div><p>{t("Chọn tên bài và bấm dấu “+” để xem lời cùng nốt cảm âm. Bấm “−” để thu gọn khi không cần sử dụng.", "Click '+' to view lyrics with corresponding flute notation. Click '-' to collapse.")}</p></div>
        <div className="flute-tab-list">{displayedFluteTabs.map((song, i) => <article className={openFluteTab === i ? "flute-tab is-open" : "flute-tab"} key={song.title}>
          <button className="flute-tab-summary" onClick={() => setOpenFluteTab(openFluteTab === i ? null : i)} aria-expanded={openFluteTab === i}><span><small>{t("BÀI CẢM ÂM", "FLUTE TAB")} {String(i + 1).padStart(2,"0")}</small><b>{song.title}</b></span><i aria-hidden="true">{openFluteTab === i ? "−" : "+"}</i></button>
          {openFluteTab === i && <div className="flute-tab-detail"><header><div><small>{t("TÊN ĐẦY ĐỦ", "FULL TITLE")}</small><h3>{song.fullTitle}</h3></div><span>{song.tone}</span></header><div className="notation-lines">{song.lines.map((line, j) => <div key={`${song.title}-${j}`}><span>{String(j + 1).padStart(2,"0")}</span><div className="notation-phrase">{line.lyric && <p className="lyric-line">{line.lyric}</p>}{line.notes && <p className="note-line">{line.notes}</p>}</div></div>)}</div><footer><span>♪</span><p><b>{t("Hướng dẫn đọc:", "Reading guide:")}</b> {t("Dấu “—” là ngân dài; số ² là nốt ở quãng cao. Bạn có thể thay nội dung mẫu bằng lời và cảm âm của từng bài.", "Dash '—' denotes sustained notes; superscript ² denotes higher octave. Notes align directly with lyrics.")}</p></footer></div>}
        </article>)}</div>
        <div className="flute-tab-request"><div><small>{t("CHƯA CÓ BÀI BẠN CẦN?", "CAN'T FIND YOUR SONG?")}</small><b>{t("Yêu cầu cảm âm một bài mới", "Request a Custom Flute Tab")}</b><p>{t("Gửi tên bài, tone sáo và đường dẫn nghe để được tư vấn.", "Send song title, flute key, and audio link to get assistance.")}</p></div><button onClick={() => { setSelectedDiscipline(t("Cảm âm sáo trúc", "Bamboo Flute Tabs")); scrollToId("contact"); }}>{t("Liên hệ yêu cầu →", "Submit tab request →")}</button></div>
      </section>}

      {activeService === "materials" && <section className="materials-section" id="materials">
        <div className="materials-head"><div><p className="eyebrow">{t("GIÁO TRÌNH & SHEET CHUYỂN SOẠN", "CURRICULUM & ARRANGED SHEETS")}</p><h2>{t("Tài liệu học tập", "Learning Materials")}<br />{t("theo từng bộ môn.", "by Instrument.")}</h2></div><p>{t("Chọn bộ môn để xem chi tiết. Mỗi tài liệu đều có giá phía trên nút mua VietQR; các mục ẩn giá sẽ hiển thị “Liên hệ”.", "Select a discipline for details. Pricing is displayed above each VietQR purchase button.")}</p></div>
        <div className="recorded-tabs" role="tablist"><button role="tab" className={materialTab === "curriculum" ? "active" : ""} onClick={() => { setMaterialTab("curriculum"); setOpenMaterialGroup(0); }}>{t("I. Giáo trình", "I. Curriculums")}</button><button role="tab" className={materialTab === "sheets" ? "active" : ""} onClick={() => { setMaterialTab("sheets"); setOpenMaterialGroup(0); }}>{t("II. Sheet chuyển soạn", "II. Arranged Sheet Music")}</button></div>
        <div className="material-groups">{(materialTab === "curriculum" ? displayedCurriculumGroups : displayedSheetGroups).map((group, i) => <article className={openMaterialGroup === i ? "material-group is-open" : "material-group"} key={`${materialTab}-${group.instrument}`}>
          <button className="material-group-button" onClick={() => setOpenMaterialGroup(openMaterialGroup === i ? null : i)} aria-expanded={openMaterialGroup === i}><span className="material-cover" style={{ backgroundImage: `linear-gradient(90deg,rgba(60,10,28,.15),rgba(60,10,28,.25)),url(${group.image})` }} /><span><small>{materialTab === "curriculum" ? t("BỘ MÔN GIÁO TRÌNH", "CURRICULUM DISCIPLINE") : t("BỘ MÔN SHEET", "SHEET MUSIC DISCIPLINE")}</small><b>{group.instrument}</b><em>{group.items.length} {t("tài liệu hiện có", "documents available")}</em></span><i>{openMaterialGroup === i ? "−" : "+"}</i></button>
          {openMaterialGroup === i && <div className="material-items">{group.items.map((item, j) => <div key={item.name}><span>{String(j + 1).padStart(2, "0")}</span><p><a className="catalog-detail-link" href={`/${materialTab === "curriculum" ? "giao-trinh" : "sheet"}/${item.slug}`}>{item.name}</a><small>{item.detail}</small></p><div className="purchase-action"><small>{t("GIÁ TÀI LIỆU", "MATERIAL PRICE")}</small><PriceTag price={item.price} />{parsePrice(item.price).effectiveAmount ? <button onClick={() => openPayment(`${materialTab === "curriculum" ? t("Giáo trình", "Curriculum") : t("Sheet", "Sheet")} ${group.instrument} – ${item.name}`, item.price)}>{t("Mua ngay qua VietQR", "Buy via VietQR")}</button> : <button onClick={() => { setSelectedDiscipline(`${materialTab === "curriculum" ? t("Giáo trình", "Curriculum") : t("Sheet", "Sheet")} ${group.instrument} - ${item.name}`); scrollToId("contact"); }}>{t("Nhận tư vấn →", "Get Consultation →")}</button>}</div></div>)}</div>}
        </article>)}</div>
        {materialTab === "sheets" && <div className="custom-sheet-card"><span>✎</span><div><small>{t("DỊCH VỤ CHUYỂN SOẠN RIÊNG", "CUSTOM ARRANGEMENT SERVICE")}</small><h3>{t("Yêu cầu sheet theo bài", "Custom Sheet Arrangement")}</h3><p>{t("Gửi tên bài, tone sáo và yêu cầu ký âm; Sáo Trúc Âu Cơ sẽ tư vấn giá và thời gian hoàn thiện qua Zalo.", "Send song title, key, and notation requirements; Au Co Bamboo Flute will advise pricing and timeline via Zalo.")}</p></div><button onClick={() => { setSelectedDiscipline(t("Sheet nhạc & giáo trình", "Sheet Music & Curriculum")); scrollToId("contact"); }}>{t("Liên hệ qua Zalo →", "Contact via Zalo →")}</button></div>}
      </section>}

      <section className="social section" id="mang-xa-hoi">
        <div className="section-heading"><span /><div><p className="eyebrow">{t("THEO DÕI SÁO TRÚC ÂU CƠ", "FOLLOW AU CO BAMBOO FLUTE")}</p><h2>{t("Kết nối với chúng tôi", "Connect With Us")}</h2></div><span /></div>
        <div className="social-grid">{displayedSocialLinks.map((item) => <a href={item.href} className={item.slug} target="_blank" rel="noreferrer" key={item.slug}><b>{item.icon}</b><span><small>{item.platform}</small>{item.title}</span><i>↗</i></a>)}</div>
      </section>

      {activeService === "contact" && <section className="contact section" id="contact">
        <div className="contact-copy"><p className="eyebrow">{t("BẮT ĐẦU HÀNH TRÌNH", "BEGIN YOUR MUSICAL JOURNEY")}</p><h2>{t("Để tiếng sáo cất lời.", "Let your melody speak.")}</h2><p>{t("Để lại thông tin, Sáo Trúc Âu Cơ sẽ liên hệ tư vấn lớp học, chọn sáo hoặc dịch vụ phù hợp.", "Leave your information, Au Co Bamboo Flute will contact you for course, instrument, or service advice.")}</p><ul><li>{contactAddress}</li><li>{t("Hotline / Zalo:", "Hotline / Zalo:")} {contactPhone}</li><li>Email: {contactEmail}</li></ul></div>
        <form onSubmit={submitForm}>
          <label>{t("Họ và tên", "Full Name")}<input required name="name" placeholder={t("Tên của bạn", "Your full name")} /></label>
          <label>{t("Số điện thoại / Zalo", "Phone / Zalo")}<input required name="phone" type="tel" placeholder={t("Số điện thoại liên hệ", "Your contact phone/Zalo")} /></label>
          
          <div className="full interest-selection-group">
            <span className="interest-group-label">
              {t("Đăng ký bộ môn or Tư vấn dịch vụ, sản phẩm", "Course Enrollment or Service & Product Consultation")}
              <small style={{ display: "block", color: "#8a7e72", fontWeight: 400, marginTop: 3 }}>
                {t("(Bấm để chọn tích một hoặc nhiều mục cùng lúc)", "(Click to select one or multiple options)")}
              </small>
            </span>
            <div className="interest-checkbox-grid">
              {allInterestOptions.map((item) => {
                const isChecked = selectedDisciplines.includes(item);
                return (
                  <label key={item} className={`interest-checkbox-chip ${isChecked ? "is-selected" : ""}`}>
                    <input
                      type="checkbox"
                      name="interest"
                      value={item}
                      checked={isChecked}
                      onChange={() => toggleInterest(item)}
                    />
                    <span className="interest-check-icon">{isChecked ? "✓" : "+"}</span>
                    <span className="interest-title">{translate(item)}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <label className="full">{t("Lời nhắn", "Message")}<textarea name="message" rows={3} placeholder={t("Mục tiêu hoặc nhu cầu của bạn", "Your goals, questions, or specific needs")} /></label>
          <button className="button button-wine full" type="submit" disabled={requestSubmitting}>{requestSubmitting ? t("Đang gửi…", "Sending…") : t("Gửi yêu cầu →", "Submit Request →")}</button>
          {sent && <p className="success full" role="status">{t("Yêu cầu đã được gửi thành công. Sáo Trúc Âu Cơ sẽ liên hệ lại với bạn sớm nhất.", "Request submitted successfully! Au Co Bamboo Flute will contact you shortly.")}</p>}
          {requestError && <p className="payment-error full" role="alert">{requestError}</p>}
        </form>
      </section>}

      <footer><div className="brand"><img src="/logo.jpg" alt="Logo Sáo Trúc Âu Cơ" width={46} height={46} style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 8, flex: "0 0 auto" }} /><span><b>{brandName}</b><small>{brandTagline}</small></span></div><p>{t("Đam mê làm nên giá trị · Chất lượng tạo nên uy tín", "Passion creates value · Quality builds trust")}</p><small>{t("© 2026 Sáo Trúc Âu Cơ. All rights reserved.", "© 2026 Au Co Bamboo Flute. All rights reserved.")}</small></footer>
    </main>
  );
}
