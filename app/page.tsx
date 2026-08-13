"use client";

import { FormEvent, useEffect, useState } from "react";

const defaultServices = [
  { no: "01", icon: "♫", image: "/carousel-saotruc.webp", title: "Lớp học các bộ môn", text: "Sáo trúc, Dizi, sáo nứa, sáo mèo, recorder và các bộ môn dân tộc.", cta: "Xem lớp học", href: "#classes" },
  { no: "02", icon: "⌂", image: "/carousel-recorder.webp", title: "Đăng ký lớp học", text: "Học tại trung tâm, gia sư tại nhà hoặc online 1 kèm 1 với lịch linh động.", cta: "Đăng ký ngay", href: "#contact" },
  { no: "03", icon: "◌", image: "/carousel-dizi.webp", title: "Sáo & phụ kiện", text: "Sáo trúc chuẩn âm, Dizi, sáo nứa, sáo mèo cùng phụ kiện được tuyển chọn.", cta: "Khám phá", href: "#products" },
  { no: "04", icon: "▶", image: "/carousel-tieu.webp", title: "Khóa học quay sẵn", text: "Video bài giảng HD từ nhập môn đến nâng cao, học mọi lúc và xem lại trọn đời.", cta: "Xem khóa học", href: "#courses" },
  { no: "05", icon: "▤", image: "/carousel-flute.webp", title: "Giáo trình & sheet", text: "Giáo trình kỹ thuật, sheet nhạc và bản chuyển soạn theo yêu cầu biểu diễn.", cta: "Xem tài liệu", href: "#materials", price: "Từ 50.000đ / sheet" },
  { no: "06", icon: "◉", image: "/hero-flute.webp", title: "Thu âm & quay video", text: "Thu âm, mixing, quay hình và dựng video chỉn chu cho học viên, nghệ sĩ.", cta: "Xem các gói", href: "#studio", price: "Từ 900.000đ" },
  { no: "07", icon: "♬", image: "/carousel-saotruc.webp", title: "Booking nghệ sĩ", text: "Độc tấu sáo, hòa tấu và ban nhạc dân tộc cho sự kiện, sân khấu, lễ hội.", cta: "Xem gói booking", href: "#booking" },
  { no: "08", icon: "≋", image: "/carousel-dizi.webp", title: "Thu âm nhạc cụ thật", text: "Sáo, đàn tranh, đàn bầu, đàn nhị và nhiều nhạc cụ dân tộc khác.", cta: "Xem dịch vụ thu", href: "#instrument-recording", price: "Từ 500.000đ / track" },
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
  { image: "/carousel-saotruc.webp", eyebrow: "BỘ MÔN TRUYỀN THỐNG", title: "Sáo trúc Việt Nam", copy: "Từ hơi thở đầu tiên đến tiếng sáo giàu cảm xúc.", href: "/bo-mon/sao-truc-viet-nam" },
  { image: "/carousel-dizi.webp", eyebrow: "ÂM SẮC CỔ PHONG", title: "Sáo Dizi", copy: "Khám phá màng rung và kỹ thuật diễn tấu Trung Hoa.", href: "/bo-mon/sao-dizi" },
  { image: "/carousel-recorder.webp", eyebrow: "ÂM NHẠC CHO MỌI LỨA TUỔI", title: "Sáo Recorder", copy: "Khởi đầu dễ dàng, đọc nhạc bài bản và cùng nhau hòa tấu.", href: "/bo-mon/sao-recorder" },
  { image: "/carousel-tieu.webp", eyebrow: "TRẦM ẤM & SÂU LẮNG", title: "Động tiêu & Xiao", copy: "Một khoảng lặng đẹp cho người yêu âm nhạc cổ phong.", href: "/bo-mon/dong-tieu-xiao" },
  { image: "/carousel-flute.webp", eyebrow: "KỸ THUẬT PHƯƠNG TÂY", title: "Flute", copy: "Âm sắc trong trẻo, linh hoạt cùng lộ trình cá nhân hóa.", href: "/bo-mon/flute" },
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
  { slug: "youtube", platform: "YOUTUBE", icon: "▶", title: "Kênh Sáo Hồng Việt", href: "https://www.youtube.com/" },
  { slug: "facebook", platform: "FACEBOOK", icon: "f", title: "Hồng Việt Sáo Trúc", href: "https://www.facebook.com/" },
  { slug: "tiktok", platform: "TIKTOK", icon: "♪", title: "@hongvietsao", href: "https://www.tiktok.com/@hongvietsao" },
  { slug: "instagram", platform: "INSTAGRAM", icon: "◎", title: "@hongviet.music", href: "https://www.instagram.com/hongviet.music/" },
];

function slugifyPath(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

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
  const [selectedDiscipline, setSelectedDiscipline] = useState(() => {
    if (typeof window === "undefined") return "Sáo trúc Việt Nam";
    const requested = new URLSearchParams(window.location.search).get("subject");
    return requested && disciplines.some((item) => item.title === requested) ? requested : "Sáo trúc Việt Nam";
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderPaused, setSliderPaused] = useState(false);
  const [sent, setSent] = useState(false);
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [cmsEntries, setCmsEntries] = useState<CmsEntry[]>([]);

  useEffect(() => {
    if (sliderPaused) return;
    const timer = window.setInterval(() => setCurrentSlide((current) => (current + 1) % slides.length), 5500);
    return () => window.clearInterval(timer);
  }, [sliderPaused]);

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
  const services = cmsServices.length ? cmsServices.map((entry, index) => ({
    no: String(index + 1).padStart(2, "0"),
    icon: entry.tag || "♪",
    image: entry.imageUrl,
    title: entry.title,
    text: entry.excerpt,
    cta: entry.content || "Xem chi tiết",
    href: `#${entry.slug}`,
    price: entry.price || undefined,
  })) : defaultServices;
  const cmsArticles = cmsEntries.filter((entry) => entry.collection === "articles" && entry.visible);
  const articles = cmsArticles.length ? cmsArticles.map((entry) => ({
    slug: entry.slug,
    tag: entry.tag || "Bài viết",
    title: entry.title,
    excerpt: entry.excerpt,
    date: entry.publishedAt ? new Date(`${entry.publishedAt}T00:00:00`).toLocaleDateString("vi-VN") : "",
  })) : defaultArticles;
  const generalSettings = cmsEntries.find((entry) => entry.collection === "settings" && entry.slug === "general");
  const brandName = generalSettings?.title || "HỒNG VIỆT";
  const brandTagline = generalSettings?.excerpt || "SÁO TRÚC & ÂM NHẠC DÂN TỘC";
  const contactAddress = generalSettings?.content || "106/72 Hòa Bình, P. Tân Phú, TP.HCM";
  const contactPhone = generalSettings?.price || "0374 261 368";
  const contactEmail = generalSettings?.tag || "vanquach999x@gmail.com";
  const visibleCollection = (name: string) => cmsEntries
    .filter((entry) => entry.collection === name && entry.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const lines = (value: string) => value.split(/\n+/).map((line) => line.trim()).filter(Boolean);

  const cmsClassDetails = visibleCollection("class-details");
  const displayedDisciplines = cmsClassDetails.length ? cmsClassDetails.map((entry) => ({
    slug: entry.slug, image: entry.imageUrl || "/carousel-saotruc.webp", imageAlt: `Minh họa bộ môn ${entry.title}`,
    icon: entry.tag || "♪", title: entry.title, short: entry.excerpt, intro: entry.excerpt,
    learn: lines(entry.content), suitable: entry.price || "Phù hợp với mọi người yêu âm nhạc.",
  })) : disciplines;

  const cmsProductGroups = visibleCollection("product-groups");
  const cmsProductItems = visibleCollection("product-items");
  const displayedProductCategories = cmsProductGroups.length ? cmsProductGroups.map((group) => ({
    title: group.title, image: group.imageUrl || "/carousel-saotruc.webp", intro: group.excerpt,
    products: cmsProductItems.filter((item) => item.tag === group.slug).map((item) => ({
      name: item.title, description: item.excerpt, price: item.price || "Liên hệ", image: item.imageUrl || group.imageUrl,
    })),
  })) : productCategories;

  const cmsCourseGroups = visibleCollection("course-groups");
  const cmsCourseItems = visibleCollection("course-items");
  const displayedRecordedCourses = cmsCourseGroups.length ? cmsCourseGroups.map((group) => ({
    instrument: group.title, image: group.imageUrl || "/carousel-saotruc.webp",
    items: cmsCourseItems.filter((item) => item.tag === group.slug).map((item) => ({
      slug: item.slug, name: item.title, detail: item.excerpt, price: item.price || "Liên hệ", showPrice: Boolean(item.price && item.price.toLocaleLowerCase("vi") !== "liên hệ"),
    })),
  })) : recordedCourses.map((group) => ({ ...group, items: group.items.map((item) => ({ ...item, slug: slugifyPath(item.name) })) }));

  const cmsSingleVideos = visibleCollection("single-videos");
  const displayedSingleVideoGroups = cmsSingleVideos.length ? singleVideoGroups.map((group) => {
    const groupSlug = slugifyPath(group.instrument);
    return {
      ...group,
      songs: cmsSingleVideos.filter((entry) => entry.tag === groupSlug).map((entry) => ({
        slug: entry.slug, name: entry.title, detail: entry.excerpt, price: entry.price || "Liên hệ",
        showPrice: Boolean(entry.price && entry.price.toLocaleLowerCase("vi") !== "liên hệ"),
      })),
    };
  }).filter((group) => group.songs.length) : singleVideoGroups.map((group) => ({
    ...group,
    songs: group.songs.map((song) => ({ ...song, slug: `${slugifyPath(song.name)}-${slugifyPath(group.instrument)}`, detail: "Video hướng dẫn từng câu · Sheet nhạc · Ngón bấm · Kỹ thuật" })),
  }));

  const cmsMaterials = visibleCollection("materials");
  const materialGroups = (kind: "giao-trinh" | "sheet", fallbackGroups: typeof curriculumGroups | typeof sheetGroups) => {
    const hasManagedItems = cmsMaterials.some((entry) => entry.tag.startsWith(`${kind}:`));
    if (!hasManagedItems) return fallbackGroups.map((group, groupIndex) => ({
      ...group,
      items: group.items.map((item) => ({ ...item, slug: groupIndex === 0 ? slugifyPath(item.name) : `${slugifyPath(item.name)}-${slugifyPath(group.instrument)}` })),
    }));
    return fallbackGroups.map((group) => ({
      ...group,
      items: cmsMaterials.filter((entry) => entry.tag === `${kind}:${slugifyPath(group.instrument)}`).map((entry) => ({
        slug: entry.slug, name: entry.title, detail: entry.excerpt, price: entry.price || "Liên hệ",
        showPrice: Boolean(entry.price && entry.price.toLocaleLowerCase("vi") !== "liên hệ"),
      })),
    })).filter((group) => group.items.length);
  };
  const displayedCurriculumGroups = materialGroups("giao-trinh", curriculumGroups);
  const displayedSheetGroups = materialGroups("sheet", sheetGroups);

  const cmsSocialLinks = visibleCollection("social-links");
  const displayedSocialLinks = cmsSocialLinks.length ? cmsSocialLinks.map((entry) => ({
    slug: entry.slug, platform: entry.price || entry.slug.toUpperCase(), icon: entry.tag || "↗", title: entry.title, href: entry.content,
  })).filter((entry) => entry.href.startsWith("http://") || entry.href.startsWith("https://")) : defaultSocialLinks;

  const cmsStudioPackages = visibleCollection("studio-packages");
  const displayedStudioPackages = cmsStudioPackages.length ? cmsStudioPackages.map((entry) => ({
    icon: entry.tag || "♪", title: entry.title, subtitle: entry.excerpt, price: entry.price || "Liên hệ",
    showPrice: Boolean(entry.price && entry.price.toLocaleLowerCase("vi") !== "liên hệ"), features: lines(entry.content),
  })) : studioPackages;
  const cmsBookingPackages = visibleCollection("booking-packages");
  const displayedBookingPackages = cmsBookingPackages.length ? cmsBookingPackages.map((entry) => ({
    icon: entry.tag || "♪", title: entry.title, detail: entry.excerpt, price: entry.price || "Liên hệ",
    showPrice: Boolean(entry.price && entry.price.toLocaleLowerCase("vi") !== "liên hệ"), features: lines(entry.content),
  })) : bookingPackages;
  const cmsRecordingInstruments = visibleCollection("recording-instruments");
  const displayedRecordingInstruments = cmsRecordingInstruments.length ? cmsRecordingInstruments.map((entry) => ({
    icon: entry.tag || "♪", title: entry.title, tone: entry.excerpt, price: entry.price || "Liên hệ",
    showPrice: Boolean(entry.price && entry.price.toLocaleLowerCase("vi") !== "liên hệ"),
  })) : recordingInstruments;
  const cmsFluteTabs = visibleCollection("flute-tabs");
  const displayedFluteTabs = cmsFluteTabs.length ? cmsFluteTabs.map((entry) => ({
    title: entry.title,
    fullTitle: entry.excerpt || entry.title,
    tone: entry.tag || "Cảm âm sáo trúc",
    lines: lines(entry.content).map((line) => {
      const separator = line.indexOf("|");
      return separator >= 0
        ? { lyric: line.slice(0, separator).trim(), notes: line.slice(separator + 1).trim() }
        : { lyric: "", notes: line };
    }),
  })) : fluteTabs;
  const cmsFreeGuides = visibleCollection("free-guides");
  const displayedFreeGuides = cmsFreeGuides.length ? cmsFreeGuides.map((entry) => ({
    platform: entry.tag || "Bài viết",
    icon: entry.tag.toLocaleLowerCase("vi").includes("youtube") ? "▶" : entry.tag.toLocaleLowerCase("vi").includes("tiktok") ? "♪" : "✎",
    topic: entry.price || "Hướng dẫn miễn phí",
    title: entry.title,
    description: entry.excerpt,
    href: entry.content || "#contact",
  })) : freeGuides;
  const searchItems = services
    .map((item) => ({ title: item.title, type: "Danh mục", href: item.href }))
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
    try {
      const response = await fetch("/api/contact-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          interest: data.get("interest"),
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
    setPaymentAmount(price);
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
      <div className="top-contact-bar" aria-label="Thông tin liên hệ nhanh">
        <a className="top-address" href="#contact" onClick={(e) => { e.preventDefault(); openService("#contact"); }}><span>⌖</span><span>{contactAddress}</span></a>
        <a className="top-phone" href={`tel:${contactPhone.replace(/\D/g, "")}`}><span>☎</span><span>{contactPhone}</span><small>Hotline / Zalo</small></a>
      </div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Hồng Việt - Trang chủ">
          <img src="data:image/jpeg;base64,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" alt="Logo Hồng Việt" width={46} height={46} style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 8, flex: "0 0 auto" }} />
          <span><b>{brandName}</b><small>{brandTagline}</small></span>
        </a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Mở menu" aria-expanded={menuOpen}>☰</button>
        <nav className={menuOpen ? "open" : ""} aria-label="Điều hướng chính">
          <a href="#top" onClick={() => setMenuOpen(false)}>Trang chủ</a>
          <button className="nav-search" onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}>⌕ Tìm kiếm</button>
          <a href="/tin-tuc" onClick={() => setMenuOpen(false)}>Tin tức</a>
          <a href="#classes" onClick={(e) => { e.preventDefault(); openService("#classes"); }}>Lớp học</a>
          <a href="/cam-am" onClick={() => setMenuOpen(false)}>Cảm âm</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); openService("#contact"); }}>Liên hệ</a>
        </nav>
        <button className="button button-gold header-cta" onClick={() => openService("#contact")}>✦ Đăng ký học</button>
        {searchOpen && <div className="search-panel"><div className="search-box"><span>⌕</span><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm lớp học, khóa học, dịch vụ..." aria-label="Tìm kiếm nội dung" /><button onClick={() => { setSearchOpen(false); setQuery(""); }} aria-label="Đóng tìm kiếm">×</button></div>{query && <div className="search-results">{searchItems.length ? searchItems.slice(0, 6).map((item) => <a key={`${item.type}-${item.title}`} href={item.href} onClick={(e) => { e.preventDefault(); openService(item.href); }}><small>{item.type}</small><span>{item.title}</span><b>→</b></a>) : <p>Không tìm thấy nội dung phù hợp.</p>}</div>}</div>}
      </header>

      <section className="hero" id="top">
        {slides.map((slide, i) => <div key={slide.image} className={`hero-image hero-slide-${i + 1}${currentSlide === i ? " slide-active" : ""}`} style={{ backgroundImage: `url(${slide.image})` }} aria-hidden="true" />)}
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="brand-slogan"><span className="slogan-text">Hơi Thở Thành Âm</span><span className="slogan-divider">—</span><span className="slogan-text">Tâm Hồn Thành Nhạc</span></p>
          <p className="eyebrow">{slides[currentSlide].eyebrow}</p>
          <p className="slide-count">0{currentSlide + 1} <span>/ 05</span></p>
          <h1>{slides[currentSlide].title}</h1>
          <p className="hero-copy">{slides[currentSlide].copy}</p>
          <div className="hero-actions">
            <a className="button button-gold hero-link" href={slides[currentSlide].href}>Khám phá bộ môn</a>
            <button className="button button-outline" onClick={() => openService("#contact")}>Đăng ký học</button>
          </div>
        </div>
        <div className="hero-features" aria-label="Điểm nổi bật">
          <div><i>♫</i><span>Phương pháp khoa học,<br />trọng tâm, dễ hiểu</span></div>
          <div><i>●</i><span>Giáo viên<br />chuyên nghiệp</span></div>
          <div><i>★</i><span>Dạy Offline tại TP.HCM,<br />Online cho học viên ở xa</span></div>
          <div><i>♥</i><span>Đồng hành – Tận tâm<br />– Truyền cảm hứng</span></div>
        </div>
        <button className="slider-arrow slider-prev" onClick={() => { setSliderPaused(true); setCurrentSlide((currentSlide - 1 + slides.length) % slides.length); }} aria-label="Ảnh trước">‹</button>
        <button className="slider-arrow slider-next" onClick={() => { setSliderPaused(true); setCurrentSlide((currentSlide + 1) % slides.length); }} aria-label="Ảnh tiếp theo">›</button>
        <div className="slider-dots" aria-label="Chọn ảnh quảng cáo">{slides.map((slide, i) => <button key={slide.title} className={currentSlide === i ? "active" : ""} onClick={() => { setSliderPaused(true); setCurrentSlide(i); }} aria-label={`Xem ${slide.title}`} />)}</div>
      </section>

      <section className="intro section" id="about">
        <div><p className="eyebrow">CÂU CHUYỆN HỒNG VIỆT</p><h2>Học đúng phương pháp.<br />Tìm thấy tiếng sáo của riêng bạn.</h2></div>
        <div className="intro-copy"><p>Hồng Việt tạo nên một không gian học tập gần gũi, nơi kỹ thuật vững vàng đi cùng cảm xúc âm nhạc. Mỗi lộ trình được thiết kế theo mục tiêu và tốc độ riêng của học viên.</p><div className="metrics"><span><b>1:1</b><small>Lộ trình cá nhân</small></span><span><b>07+</b><small>Bộ môn đào tạo</small></span><span><b>HD</b><small>Bài giảng rõ nét</small></span></div></div>
      </section>

      <section className="section" id="services">
        <div className="section-heading"><span /><div><p className="eyebrow">HỆ SINH THÁI ÂM NHẠC</p><h2>Dịch vụ của chúng tôi</h2></div><span /></div>
        <div className="service-grid">{services.map((service) => <article className={`service-card${activeService === service.href.slice(1) ? " is-selected" : ""}`} key={service.no}><div className="card-top"><span className="card-no">{service.no}</span><span className="card-icon">{service.icon}</span></div><h3>{service.title}</h3><p>{service.text}</p>{service.price && <strong className="price">{service.price}</strong>}<a href={service.href} onClick={(e) => { e.preventDefault(); openService(service.href); }}>{activeService === service.href.slice(1) ? "Đang xem chi tiết" : service.cta}<span>→</span></a></article>)}</div>
      </section>

      {activeService && <div className="service-detail-bar" id="service-detail">
        <div><small>NỘI DUNG ĐANG XEM</small><b>{services.find((service) => service.href === `#${activeService}`)?.title}</b></div>
        <button onClick={closeService}>← Quay lại 8 danh mục</button>
      </div>}

      {activeService === "classes" && <section className="courses section" id="classes">
        <div className="courses-head"><div><p className="eyebrow">CÁC BỘ MÔN GIẢNG DẠY</p><h2>Chọn thanh âm<br />phù hợp với bạn</h2></div><p>Mỗi bộ môn có một màu sắc riêng. Bấm “Xem thêm” để khám phá nội dung học, đối tượng phù hợp và đăng ký tư vấn.</p></div>
        <div className="discipline-grid">{displayedDisciplines.map((item, i) => <article className={openDiscipline === i ? "discipline-card is-open" : "discipline-card"} key={item.title}><button className="discipline-summary" onClick={() => setOpenDiscipline(openDiscipline === i ? null : i)} aria-expanded={openDiscipline === i}><span className="discipline-photo"><img src={item.image} alt={item.imageAlt} width="640" height="420" loading="lazy" decoding="async" /><i>{item.icon}</i></span><span className="discipline-copy"><small>BỘ MÔN 0{i + 1}</small><h3>{item.title}</h3><p>{item.short}</p></span><b>{openDiscipline === i ? "Thu gọn −" : "Xem nhanh +"}</b></button>{openDiscipline === i && <div className="discipline-detail"><p>{item.intro}</p><div><span><small>NỘI DUNG HỌC</small><ul>{item.learn.map((point) => <li key={point}>{point}</li>)}</ul></span><span><small>PHÙ HỢP VỚI</small><p>{item.suitable}</p></span></div><div className="discipline-actions"><a className="article-link" href={`/bo-mon/${item.slug}`}>Xem bài giới thiệu đầy đủ →</a><button className="button button-wine" onClick={() => { setSelectedDiscipline(item.title); openService("#contact"); }}>Đăng ký bộ môn này</button></div></div>}</article>)}</div>
      </section>}

      {activeService === "courses" && <section className="recorded-section" id="courses">
        <div className="recorded-head"><div><p className="eyebrow">HỌC MỌI LÚC · XEM LẠI TRỌN ĐỜI</p><h2>Khóa học & video quay sẵn</h2></div><p>Chọn một lộ trình đầy đủ hoặc mua riêng từng video tác phẩm theo đúng nhạc cụ bạn đang chơi.</p></div>
        <div className="recorded-tabs" role="tablist" aria-label="Loại nội dung quay sẵn"><button className={courseTab === "courses" ? "active" : ""} onClick={() => setCourseTab("courses")} role="tab" aria-selected={courseTab === "courses"}>I. Khóa học theo bộ môn</button><button className={courseTab === "videos" ? "active" : ""} onClick={() => setCourseTab("videos")} role="tab" aria-selected={courseTab === "videos"}>II. Video quay từng bài</button></div>
        {courseTab === "courses" ? <div className="recorded-course-list">{displayedRecordedCourses.map((course, i) => <article className={openRecordedCourse === i ? "recorded-course is-open" : "recorded-course"} key={course.instrument}>
          <button className="recorded-course-summary" onClick={() => setOpenRecordedCourse(openRecordedCourse === i ? null : i)} aria-expanded={openRecordedCourse === i}>
            <span className="recorded-cover" style={{ backgroundImage: `linear-gradient(0deg,rgba(69,14,31,.82),transparent 70%),url(${course.image})` }}><small>KHÓA HỌC 0{i + 1}</small><h3>{course.instrument}</h3></span>
            <span className="recorded-summary-copy"><small>CHƯƠNG TRÌNH QUAY SẴN</small><b>Khóa học {course.instrument}</b><em>{course.items.length} nội dung · Học mọi lúc · Xem lại trọn đời</em></span><i>{openRecordedCourse === i ? "−" : "+"}</i>
          </button>
          {openRecordedCourse === i && <div className="recorded-lessons">{course.items.map((item, j) => <div key={item.name}><span>{i + 1}.{j + 1}</span><p><a className="catalog-detail-link" href={`/khoa-hoc/${item.slug}`}>{item.name}</a><small>{item.detail}</small></p><div className="purchase-action"><small>GIÁ KHÓA HỌC</small><strong>{item.showPrice ? item.price : "Liên hệ"}</strong><button onClick={() => openPayment(`Khóa học ${course.instrument} – ${item.name}`, item.showPrice ? item.price : "")}>Mua ngay qua VietQR</button></div></div>)}</div>}
        </article>)}</div> : <div className="single-video-catalog">
          <article className="custom-video-card"><div><span>✦</span><p><small>VIDEO CÁ NHÂN HÓA</small><b>Bài quay theo yêu cầu</b><em>Gửi tên bài, tone sáo và yêu cầu kỹ thuật. Hồng Việt sẽ quay video hướng dẫn riêng phù hợp với bạn.</em></p></div><strong>Liên hệ</strong><button onClick={() => openPayment("Bài quay theo yêu cầu")}>Gửi yêu cầu</button></article>
          <div className="video-group-list">{displayedSingleVideoGroups.map((group, i) => <article className={openVideoGroup === i ? "video-group is-open" : "video-group"} key={group.instrument}>
            <button className="video-group-button" onClick={() => setOpenVideoGroup(openVideoGroup === i ? null : i)} aria-expanded={openVideoGroup === i}><span className="video-group-image" style={{ backgroundImage: `linear-gradient(0deg,rgba(70,14,31,.58),transparent),url(${group.image})` }}><i>▶</i></span><span><small>NHẠC CỤ 0{i + 1}</small><b>{group.instrument}</b><em>{group.description}</em></span><strong>{group.songs.length} bài</strong><i>{openVideoGroup === i ? "−" : "+"}</i></button>
            {openVideoGroup === i && <div className="video-song-list">{group.songs.map((song, j) => <div key={song.name}><span>{String(j + 1).padStart(2,"0")}</span><p><a className="catalog-detail-link" href={`/video/${song.slug}`}>{song.name}</a><small>{song.detail}</small></p><div className="purchase-action"><small>GIÁ VIDEO</small><strong>{song.showPrice ? song.price : "Liên hệ"}</strong><button onClick={() => openPayment(`Video ${group.instrument} – ${song.name}`, song.showPrice ? song.price : "")}>Mua ngay qua VietQR</button></div></div>)}</div>}
          </article>)}</div>
        </div>}
        <div className="payment-note"><span>▣</span><p><b>Thanh toán nhanh bằng VietQR</b><small>Bấm “Mua khóa học” hoặc “Chọn video” để mở bảng thanh toán và chỉnh số tiền, nội dung chuyển khoản.</small></p></div>
      </section>}

      {paymentOpen && <div className="payment-modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setPaymentOpen(false); }}>
        <section className="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-title">
          <button className="payment-close" onClick={() => setPaymentOpen(false)} aria-label="Đóng bảng thanh toán">×</button>
          <header><h2 id="payment-title">Thanh Toán Qua VietQR</h2><p>{selectedPurchase}</p></header>
          <div className="payment-modal-grid">
            <div className="payment-left">
              <h3>THÔNG TIN CHUYỂN KHOẢN</h3>
              <div className="bank-info"><p><span>Ngân hàng:</span><b>STB · Sacombank</b></p><p><span>Số tài khoản:</span><b>030046023451</b><button type="button" onClick={() => navigator.clipboard?.writeText("030046023451")}>Sao chép</button></p><p><span>Chủ tài khoản:</span><b>QUACH HA VAN</b></p><label><span>Số tiền thanh toán:</span><input value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Nhập số tiền (VNĐ)" inputMode="numeric" /></label><label><span>Nội dung chuyển khoản:</span><input value={transferContent} onChange={(e) => setTransferContent(e.target.value)} placeholder="Nhập nội dung chuyển khoản" /><button type="button" onClick={() => navigator.clipboard?.writeText(transferContent)}>Sao chép</button></label></div>
              <h3>THÔNG TIN NGƯỜI MUA</h3>
              <form id="payment-form" onSubmit={confirmPayment}><label>Họ và tên <small>(không bắt buộc)</small><input name="buyerName" placeholder="Nhập họ tên của bạn" /></label><label>Số điện thoại / Zalo nhận file *<input required name="buyerPhone" type="tel" placeholder="Nhập số điện thoại Zalo" /></label><label>Email nhận khóa học<input name="buyerEmail" type="email" placeholder="Email của bạn (nếu có)" /></label></form>
            </div>
            <aside className="payment-qr"><img src="/vietqr-payment.png" alt="Mã thanh toán VietQR Sacombank" width="540" height="540" loading="eager" decoding="sync" /><a href="/vietqr-payment.png" target="_blank" rel="noreferrer">↓ Tải / Mở ảnh QR</a><button className="payment-confirm" type="submit" form="payment-form" disabled={paymentSubmitting || orderSent}>{paymentSubmitting ? "Đang gửi thông báo..." : orderSent ? "✓ Đã gửi xác nhận" : "● Xác nhận đã chuyển khoản"}</button>{orderSent && <p role="status">Đã gửi thông báo cho Hồng Việt. Giao dịch sẽ được kiểm tra trước khi cấp khóa học hoặc sản phẩm.</p>}{paymentError && <p className="payment-error" role="alert">{paymentError}</p>}</aside>
          </div>
        </section>
      </div>}

      {activeService === "products" && <section className="products-section" id="products">
        <div className="products-heading"><div><p className="eyebrow">SÁO & PHỤ KIỆN</p><h2>Chọn nhạc cụ phù hợp<br />với thanh âm của bạn.</h2></div><p>Mỗi nhóm nhạc cụ có nhiều chất liệu và cấu hình khác nhau. Bấm vào từng mục để xem mô tả, hình ảnh và thông tin giá.</p></div>
        <div className="product-category-list">{displayedProductCategories.map((category, i) => <article className={openProductCategory === i ? "product-category is-open" : "product-category"} key={category.title}>
          <button className="product-category-button" onClick={() => setOpenProductCategory(openProductCategory === i ? null : i)} aria-expanded={openProductCategory === i}>
            <span className="product-category-image" style={{ backgroundImage: `linear-gradient(90deg,rgba(65,13,30,.18),rgba(65,13,30,.02)),url(${category.image})` }} />
            <span><small>NHÓM SẢN PHẨM 0{i + 1}</small><b>{category.title}</b><em>{category.intro}</em></span><i>{openProductCategory === i ? "−" : "+"}</i>
          </button>
          {openProductCategory === i && <div className="product-detail-grid">{category.products.map((product) => <div className="product-item" key={product.name}>
            <div className="product-thumb" style={{ backgroundImage: `url(${"image" in product && product.image ? product.image : category.image})` }}><span>{product.name}</span></div>
            <div className="product-item-copy"><h3>{product.name}</h3><p>{product.description}</p><div><strong>{product.price}</strong><button onClick={() => { setSelectedDiscipline("Mua sáo & phụ kiện"); openService("#contact"); }}>Nhận tư vấn →</button></div></div>
          </div>)}</div>}
        </article>)}</div>
      </section>}

      {activeService === "studio" && <section className="studio-section" id="studio">
        <div className="studio-head"><div><p className="eyebrow">THU ÂM & QUAY VIDEO</p><h2>Biến phần trình diễn<br />thành một sản phẩm đẹp.</h2></div><p>Từ một bản thu mộc đến MV hoàn chỉnh, Hồng Việt đồng hành ở cả âm thanh, hình ảnh và cách thể hiện để giữ được màu sắc riêng của người biểu diễn.</p></div>
        <div className="studio-package-grid">{displayedStudioPackages.map((item) => <article className="studio-package" key={item.title}><div className="studio-package-top"><span>{item.icon}</span><div><small>{item.subtitle}</small><h3>{item.title}</h3></div></div><ul>{item.features.map((feature) => <li key={feature}>✓ <span>{feature}</span></li>)}</ul><div className="studio-buy"><small>GIÁ THAM KHẢO</small><strong>{item.showPrice ? item.price : "Liên hệ báo giá"}</strong>{item.showPrice ? <button onClick={() => openPayment(`Đặt cọc ${item.title}`, item.price)}>Đặt cọc qua VietQR</button> : <button onClick={() => { setSelectedDiscipline("Thu âm / Booking biểu diễn"); scrollToId("contact"); }}>Nhận báo giá qua Zalo</button>}</div></article>)}</div>
        <div className="studio-info-grid"><article><p className="eyebrow">QUY TRÌNH THỰC HIỆN</p><h3>Rõ ràng trong từng bước</h3><ol>{studioSteps.map((step, i) => <li key={step}><span>{String(i + 1).padStart(2, "0")}</span>{step}</li>)}</ol></article><article><p className="eyebrow">THÔNG TIN CẦN GỬI</p><h3>Để nhận báo giá chính xác</h3><ul><li>Tên tác phẩm và nhạc cụ sử dụng</li><li>Beat hoặc bản phối hiện có</li><li>Thu âm, quay video hay gói trọn bộ</li><li>Địa điểm và thời gian mong muốn</li><li>Phong cách hình ảnh tham khảo</li></ul><button onClick={() => { setSelectedDiscipline("Thu âm / Booking biểu diễn"); scrollToId("contact"); }}>Gửi yêu cầu tư vấn →</button></article><article><p className="eyebrow">SẢN PHẨM BÀN GIAO</p><h3>Đầy đủ để lưu giữ & chia sẻ</h3><ul><li>Âm thanh WAV và MP3 chất lượng cao</li><li>Video Full HD hoặc 4K theo thỏa thuận</li><li>Bản ngang cho YouTube/Facebook</li><li>Bản dọc TikTok/Reels khi đăng ký</li><li>Ảnh bìa hoặc thumbnail theo gói</li></ul><small>Chi phí địa điểm, beat bản quyền, nhạc công, trang phục và trang điểm sẽ được báo riêng nếu phát sinh.</small></article></div>
        <div className="studio-note"><b>Lưu ý trước khi đặt lịch</b><span>Mỗi gói có phạm vi, số lần chỉnh sửa và thời gian bàn giao khác nhau. Lịch chỉ được giữ sau khi hai bên thống nhất nội dung và đặt cọc.</span></div>
      </section>}

      {activeService === "booking" && <section className="booking-section" id="booking">
        <div className="booking-head"><div><p className="eyebrow">BOOKING NGHỆ SĨ</p><h2>Âm nhạc phù hợp<br />cho từng khoảnh khắc.</h2></div><p>Độc tấu, song tấu, hòa tấu hoặc ban nhạc dân tộc được tư vấn theo quy mô, không gian và tinh thần riêng của mỗi sự kiện.</p></div>
        <div className="booking-events">{bookingEvents.map((event) => <span key={event}>✦ {event}</span>)}</div>
        <div className="booking-package-grid">{displayedBookingPackages.map((item) => <article className="booking-package" key={item.title}><span className="booking-icon">{item.icon}</span><small>{item.detail}</small><h3>{item.title}</h3><ul>{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><div><small>GIÁ THAM KHẢO</small><strong>{item.showPrice ? item.price : "Liên hệ báo giá"}</strong>{item.showPrice ? <button onClick={() => openPayment(`Đặt cọc booking – ${item.title}`, item.price)}>Kiểm tra lịch & đặt cọc</button> : <button onClick={() => { setSelectedDiscipline("Thu âm / Booking biểu diễn"); scrollToId("contact"); }}>Nhận báo giá qua Zalo</button>}</div></article>)}</div>
        <button className="booking-detail-toggle" onClick={() => setBookingDetailsOpen(!bookingDetailsOpen)} aria-expanded={bookingDetailsOpen}><span><small>THÔNG TIN BOOKING</small><b>{bookingDetailsOpen ? "Ẩn quy trình và điều khoản" : "Xem quy trình, yêu cầu và điều khoản"}</b></span><i>{bookingDetailsOpen ? "−" : "+"}</i></button>
        {bookingDetailsOpen && <div className="booking-detail-grid"><article><small>QUY TRÌNH BOOKING</small><h3>8 bước xác nhận lịch</h3><ol><li>Gửi thông tin sự kiện</li><li>Kiểm tra lịch nghệ sĩ</li><li>Tư vấn tiết mục và đội hình</li><li>Gửi báo giá</li><li>Xác nhận hợp đồng, đặt cọc</li><li>Thống nhất kịch bản và kỹ thuật</li><li>Biểu diễn tại sự kiện</li><li>Thanh toán phần còn lại</li></ol></article><article><small>THÔNG TIN CẦN GỬI</small><h3>Để báo giá chính xác</h3><ul><li>Tên đơn vị và số điện thoại/Zalo</li><li>Loại sự kiện, ngày giờ, địa điểm</li><li>Số tiết mục hoặc thời lượng</li><li>Đội hình và danh sách bài dự kiến</li><li>Yêu cầu trang phục, âm thanh</li><li>Ngân sách dự kiến</li></ul></article><article><small>CHI PHÍ & ĐIỀU KHOẢN</small><h3>Cần thống nhất trước</h3><ul><li>Di chuyển, lưu trú ngoài tỉnh</li><li>Tập luyện, chuyển soạn bài mới</li><li>Thiết bị, trang phục đặc biệt</li><li>Chính sách đổi ngày hoặc hủy lịch</li><li>Giờ thử âm thanh và thời lượng phát sinh</li><li>Quyền quay phim, livestream và sử dụng hình ảnh</li></ul></article></div>}
        <div className="booking-cta"><div><small>SẴN SÀNG CHO SỰ KIỆN CỦA BẠN?</small><b>Gửi ngày, địa điểm và đội hình mong muốn để kiểm tra lịch.</b></div><button onClick={() => { setSelectedDiscipline("Thu âm / Booking biểu diễn"); scrollToId("contact"); }}>Nhận báo giá qua Zalo →</button></div>
      </section>}

      {activeService === "instrument-recording" && <section className="instrument-recording" id="instrument-recording">
        <div className="instrument-recording-head"><div><p className="eyebrow">THU ÂM NHẠC CỤ THẬT</p><h2>Chất liệu âm thanh thật<br />cho bản phối của bạn.</h2></div><p>Dành cho ca sĩ, nhạc sĩ, nhà sản xuất và người làm nội dung cần một track nhạc cụ giàu cảm xúc, đúng tone, BPM và sẵn sàng đưa vào dự án.</p></div>
        <div className="recording-instrument-grid">{displayedRecordingInstruments.map((item) => <article key={item.title}><span>{item.icon}</span><small>NHẠC CỤ NHẬN THU</small><h3>{item.title}</h3><p>{item.tone}</p><div><small>GIÁ TỪ</small><strong>{item.showPrice ? item.price : "Liên hệ"}</strong>{item.showPrice ? <button onClick={() => openPayment(`Đặt thu âm ${item.title}`, item.price)}>Đặt thu qua VietQR</button> : <button onClick={() => { setSelectedDiscipline("Thu âm / Booking biểu diễn"); scrollToId("contact"); }}>Gửi yêu cầu riêng</button>}</div></article>)}</div>
        <div className="recording-package-row">{recordingPackages.map((item, i) => <article key={item.title}><span>0{i + 1}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div><strong>{item.price}</strong></article>)}</div>
        <div className="recording-brief"><div><small>KHÁCH HÀNG CẦN GỬI</small><h3>Beat, BPM, tone và phần tham chiếu</h3><p>Gửi file WAV/MP3, sheet, MIDI hoặc audio mẫu; ghi rõ vị trí cần nhạc cụ, cảm xúc, kỹ thuật mong muốn và thời hạn nhận file.</p></div><button onClick={() => { setSelectedDiscipline("Thu âm / Booking biểu diễn"); scrollToId("contact"); }}>Gửi beat & nhận báo giá →</button></div>
        <button className="recording-detail-toggle" onClick={() => setRecordingDetailsOpen(!recordingDetailsOpen)} aria-expanded={recordingDetailsOpen}><span><small>THÔNG TIN CHUYÊN MÔN</small><b>{recordingDetailsOpen ? "Ẩn quy trình và chính sách" : "Xem quy trình, file bàn giao và bản quyền"}</b></span><i>{recordingDetailsOpen ? "−" : "+"}</i></button>
        {recordingDetailsOpen && <div className="recording-detail-grid"><article><small>HÌNH THỨC THU</small><h3>Linh hoạt theo dự án</h3><ul><li>Thu theo sheet hoàn chỉnh</li><li>Thu theo MIDI hoặc audio mẫu</li><li>Ứng tấu theo hợp âm và phong cách</li><li>Thu bè hoặc nhiều lớp âm thanh</li><li>Thu đoạn ngắn hoặc toàn bộ tác phẩm</li></ul></article><article><small>QUY TRÌNH</small><h3>Từ brief đến file gốc</h3><ol><li>Gửi beat và yêu cầu</li><li>Kiểm tra tone, BPM, độ khó</li><li>Tư vấn và báo giá</li><li>Đặt cọc, tiến hành thu</li><li>Gửi bản nghe thử</li><li>Chỉnh sửa và bàn giao</li></ol></article><article><small>FILE BÀN GIAO</small><h3>Sẵn sàng cho producer</h3><ul><li>WAV riêng từng nhạc cụ</li><li>MP3 nghe thử</li><li>Track khớp BPM và timeline</li><li>Bản dry/wet theo gói</li><li>Các take lựa chọn khi đăng ký</li></ul></article><article><small>CHỈNH SỬA & BẢN QUYỀN</small><h3>Minh bạch trước khi thu</h3><ul><li>Ghi rõ số lần chỉnh sửa miễn phí</li><li>Đổi tone, BPM hoặc phối có thể tính phí thu lại</li><li>Thống nhất quyền sử dụng thương mại</li><li>Bảo mật tác phẩm chưa phát hành</li><li>Chỉ dùng làm sản phẩm mẫu khi được đồng ý</li></ul></article></div>}
        <div className="recording-footer-cta"><div><small>CẦN THU GẤP HOẶC NHIỀU NHẠC CỤ?</small><b>Gửi dự án để được tư vấn đội hình và thời gian bàn giao.</b></div><button onClick={() => { setSelectedDiscipline("Thu âm / Booking biểu diễn"); scrollToId("contact"); }}>Liên hệ thu gấp →</button></div>
      </section>}

      {activeService === "classes" && <section className="articles section" id="articles">
        <div className="articles-head"><div><p className="eyebrow">KIẾN THỨC & CẢM HỨNG</p><h2>Bài viết mới</h2></div><p>Những hướng dẫn ngắn gọn, dễ áp dụng để bạn hiểu nhạc cụ và luyện tập đúng cách.</p></div>
        <div className="article-grid">{articles.map((article, i) => <article key={article.title}><div className="article-visual"><span>0{i + 1}</span><b>♪</b></div><div className="article-body"><small>{article.tag} · {article.date}</small><h3>{article.title}</h3><p>{article.excerpt}</p><a href={`/tin-tuc/${article.slug}`}>Đọc bài viết <span>→</span></a></div></article>)}</div>
      </section>}

      {activeService === "classes" && <section className="free-guides-section" id="free-guides">
        <div className="free-guides-head">
          <div><p className="eyebrow">CHIA SẺ KIẾN THỨC · HOÀN TOÀN MIỄN PHÍ</p><h2>Hướng dẫn miễn phí</h2></div>
          <p>Nơi tổng hợp video YouTube, TikTok và bài viết hữu ích. Bạn chỉ cần thay đường dẫn trong từng nội dung để giới thiệu kênh và chia sẻ kiến thức tới học viên.</p>
        </div>
        <div className="free-guides-grid">
          {displayedFreeGuides.map((guide) => <article key={`${guide.platform}-${guide.title}`}>
            <div className="guide-visual"><span>{guide.icon}</span><small>{guide.platform}</small></div>
            <div className="guide-copy"><small>{guide.topic}</small><h3>{guide.title}</h3><p>{guide.description}</p><a href={guide.href} target={guide.href.startsWith("http") ? "_blank" : undefined} rel={guide.href.startsWith("http") ? "noreferrer" : undefined} onClick={(e) => { if (guide.href === "#contact") { e.preventDefault(); openService("#contact"); } }}>{guide.platform === "Bài viết" ? "Đọc bài viết" : `Xem trên ${guide.platform}`} <span>→</span></a></div>
          </article>)}
        </div>
        <div className="free-guides-note"><span>✦</span><p><b>Sẵn sàng để gắn nội dung của bạn</b><small>Thay các đường dẫn mẫu bằng link YouTube, TikTok hoặc bài viết thật; bố cục sẽ tự thích ứng trên máy tính và điện thoại.</small></p><button onClick={() => openService("#contact")}>Gửi link cần cập nhật</button></div>
      </section>}

      {activeService === "flute-tabs" && <section className="flute-tabs-section" id="cam-am-sao-truc">
        <div className="flute-tabs-head"><div><p className="eyebrow">LỜI BÀI HÁT · NỐT CẢM ÂM</p><h2>Cảm âm sáo trúc</h2></div><p>Chọn tên bài và bấm dấu “+” để xem lời cùng nốt cảm âm. Bấm “−” để thu gọn khi không cần sử dụng.</p></div>
        <div className="flute-tab-list">{displayedFluteTabs.map((song, i) => <article className={openFluteTab === i ? "flute-tab is-open" : "flute-tab"} key={song.title}>
          <button className="flute-tab-summary" onClick={() => setOpenFluteTab(openFluteTab === i ? null : i)} aria-expanded={openFluteTab === i}><span><small>BÀI CẢM ÂM {String(i + 1).padStart(2,"0")}</small><b>{song.title}</b></span><i aria-hidden="true">{openFluteTab === i ? "−" : "+"}</i></button>
          {openFluteTab === i && <div className="flute-tab-detail"><header><div><small>TÊN ĐẦY ĐỦ</small><h3>{song.fullTitle}</h3></div><span>{song.tone}</span></header><div className="notation-lines">{song.lines.map((line, j) => <div key={`${song.title}-${j}`}><span>{String(j + 1).padStart(2,"0")}</span><p className="lyric-line">{line.lyric}</p><p className="note-line">{line.notes}</p></div>)}</div><footer><span>♪</span><p><b>Hướng dẫn đọc:</b> Dấu “—” là ngân dài; số ² là nốt ở quãng cao. Bạn có thể thay nội dung mẫu bằng lời và cảm âm của từng bài.</p></footer></div>}
        </article>)}</div>
        <div className="flute-tab-request"><div><small>CHƯA CÓ BÀI BẠN CẦN?</small><b>Yêu cầu cảm âm một bài mới</b><p>Gửi tên bài, tone sáo và đường dẫn nghe để được tư vấn.</p></div><button onClick={() => { setSelectedDiscipline("Cảm âm sáo trúc"); scrollToId("contact"); }}>Liên hệ yêu cầu →</button></div>
      </section>}

      {activeService === "materials" && <section className="materials-section" id="materials">
        <div className="materials-head"><div><p className="eyebrow">GIÁO TRÌNH & SHEET CHUYỂN SOẠN</p><h2>Tài liệu học tập<br />theo từng bộ môn.</h2></div><p>Chọn bộ môn để xem chi tiết. Mỗi tài liệu đều có giá phía trên nút mua VietQR; các mục ẩn giá sẽ hiển thị “Liên hệ”.</p></div>
        <div className="recorded-tabs" role="tablist"><button role="tab" className={materialTab === "curriculum" ? "active" : ""} onClick={() => { setMaterialTab("curriculum"); setOpenMaterialGroup(0); }}>I. Giáo trình</button><button role="tab" className={materialTab === "sheets" ? "active" : ""} onClick={() => { setMaterialTab("sheets"); setOpenMaterialGroup(0); }}>II. Sheet chuyển soạn</button></div>
        <div className="material-groups">{(materialTab === "curriculum" ? displayedCurriculumGroups : displayedSheetGroups).map((group, i) => <article className={openMaterialGroup === i ? "material-group is-open" : "material-group"} key={`${materialTab}-${group.instrument}`}>
          <button className="material-group-button" onClick={() => setOpenMaterialGroup(openMaterialGroup === i ? null : i)} aria-expanded={openMaterialGroup === i}><span className="material-cover" style={{ backgroundImage: `linear-gradient(90deg,rgba(60,10,28,.15),rgba(60,10,28,.25)),url(${group.image})` }} /><span><small>{materialTab === "curriculum" ? "BỘ MÔN GIÁO TRÌNH" : "BỘ MÔN SHEET"}</small><b>{group.instrument}</b><em>{group.items.length} tài liệu hiện có</em></span><i>{openMaterialGroup === i ? "−" : "+"}</i></button>
          {openMaterialGroup === i && <div className="material-items">{group.items.map((item, j) => <div key={item.name}><span>{String(j + 1).padStart(2, "0")}</span><p><a className="catalog-detail-link" href={`/${materialTab === "curriculum" ? "giao-trinh" : "sheet"}/${item.slug}`}>{item.name}</a><small>{item.detail}</small></p><div className="purchase-action"><small>GIÁ TÀI LIỆU</small><strong>{item.showPrice ? item.price : "Liên hệ"}</strong><button onClick={() => openPayment(`${materialTab === "curriculum" ? "Giáo trình" : "Sheet"} ${group.instrument} – ${item.name}`, item.showPrice ? item.price : "")}>Mua ngay qua VietQR</button></div></div>)}</div>}
        </article>)}</div>
        {materialTab === "sheets" && <div className="custom-sheet-card"><span>✎</span><div><small>DỊCH VỤ CHUYỂN SOẠN RIÊNG</small><h3>Yêu cầu sheet theo bài</h3><p>Gửi tên bài, tone sáo và yêu cầu ký âm; Hồng Việt sẽ tư vấn giá và thời gian hoàn thiện qua Zalo.</p></div><button onClick={() => { setSelectedDiscipline("Sheet nhạc & giáo trình"); scrollToId("contact"); }}>Liên hệ qua Zalo →</button></div>}
      </section>}

      <section className="social section" id="mang-xa-hoi">
        <div className="section-heading"><span /><div><p className="eyebrow">THEO DÕI HỒNG VIỆT</p><h2>Kết nối với chúng tôi</h2></div><span /></div>
        <div className="social-grid">{displayedSocialLinks.map((item) => <a href={item.href} className={item.slug} target="_blank" rel="noreferrer" key={item.slug}><b>{item.icon}</b><span><small>{item.platform}</small>{item.title}</span><i>↗</i></a>)}</div>
      </section>

      {activeService === "contact" && <section className="contact section" id="contact">
        <div className="contact-copy"><p className="eyebrow">BẮT ĐẦU HÀNH TRÌNH</p><h2>Để tiếng sáo cất lời.</h2><p>Để lại thông tin, Hồng Việt sẽ liên hệ tư vấn lớp học, chọn sáo hoặc dịch vụ phù hợp.</p><ul><li>{contactAddress}</li><li>Hotline / Zalo: {contactPhone}</li><li>Email: {contactEmail}</li></ul></div>
        <form onSubmit={submitForm}><label>Họ và tên<input required name="name" placeholder="Tên của bạn" /></label><label>Số điện thoại<input required name="phone" type="tel" placeholder="Số điện thoại liên hệ" /></label><label className="full">Bộ môn bạn quan tâm<select name="interest" value={selectedDiscipline} onChange={(e) => setSelectedDiscipline(e.target.value)}>{displayedDisciplines.map((item) => <option key={item.title}>{item.title}</option>)}<option>Mua sáo & phụ kiện</option><option>Sheet nhạc & giáo trình</option><option>Thu âm / Booking biểu diễn</option></select></label><label className="full">Lời nhắn<textarea name="message" rows={3} placeholder="Mục tiêu hoặc nhu cầu của bạn" /></label><button className="button button-wine full" type="submit" disabled={requestSubmitting}>{requestSubmitting ? "Đang gửi…" : "Gửi yêu cầu →"}</button>{sent && <p className="success full" role="status">Yêu cầu đã được gửi thành công. Hồng Việt sẽ liên hệ lại với bạn sớm nhất.</p>}{requestError && <p className="payment-error full" role="alert">{requestError}</p>}</form>
      </section>}

      <footer><div className="brand"><img src="data:image/jpeg;base64,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" alt="Logo Hồng Việt" width={46} height={46} style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 8, flex: "0 0 auto" }} /><span><b>{brandName}</b><small>{brandTagline}</small></span></div><p>Đam mê làm nên giá trị · Chất lượng tạo nên uy tín</p><small>© 2026 Hồng Việt. All rights reserved.</small></footer>
    </main>
  );
}
