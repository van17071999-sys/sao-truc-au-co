"use client";

import { FormEvent, useEffect, useState } from "react";

const services = [
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

const articles = [
  { tag: "Kỹ thuật", title: "5 bước tạo tiếng sáo trong và ổn định", excerpt: "Từ tư thế, khẩu hình đến luồng hơi — nền tảng dành cho người mới bắt đầu.", date: "08.08.2026" },
  { tag: "Chọn nhạc cụ", title: "Người mới nên bắt đầu với sáo tone nào?", excerpt: "So sánh sáo Đô C5, La A4 và Sol G4 để chọn cây sáo phù hợp với mục tiêu học.", date: "02.08.2026" },
  { tag: "Luyện tập", title: "Cách luyện hơi dài mà không bị căng", excerpt: "Một lịch tập ngắn, an toàn và hiệu quả để cải thiện cột hơi mỗi ngày.", date: "28.07.2026" },
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

function scrollToId(id: string) {
  document.getElementById(id.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
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

  useEffect(() => {
    if (sliderPaused) return;
    const timer = window.setInterval(() => setCurrentSlide((current) => (current + 1) % slides.length), 5500);
    return () => window.clearInterval(timer);
  }, [sliderPaused]);

  const searchItems = [
    ...articles.map((item) => ({ title: item.title, type: "Bài viết", href: "#articles" })),
    ...fluteTabs.map((item) => ({ title: item.title, type: "Cảm âm", href: "#cam-am-sao-truc" })),
    ...services.map((item) => ({ title: item.title, type: "Dịch vụ", href: item.href })),
  ].filter((item) => item.title.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi")));

  function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const summary = [
      "Xin chào Hồng Việt, tôi muốn đăng ký tư vấn.",
      `Họ tên: ${data.get("name") ?? ""}`,
      `Số điện thoại: ${data.get("phone") ?? ""}`,
      `Nhu cầu: ${data.get("interest") ?? ""}`,
      `Lời nhắn: ${data.get("message") ?? ""}`,
    ].join("\n");

    void navigator.clipboard?.writeText(summary).catch(() => undefined);
    setSent(true);
    window.open("https://zalo.me/0374261368", "_blank", "noopener,noreferrer");
  }

  function openPayment(product: string, price = "") {
    setSelectedPurchase(product);
    setPaymentAmount(price);
    setTransferContent(product.toLocaleUpperCase("vi").replace(/[^A-Z0-9À-Ỹ]+/g, "_").slice(0, 32));
    setOrderSent(false);
    setPaymentOpen(true);
  }

  return (
    <main>
      <div className="top-contact-bar" aria-label="Thông tin liên hệ nhanh">
        <a className="top-address" href="#contact"><span>⌖</span><span>106/72 Hòa Bình, P. Tân Phú, TP.HCM</span></a>
        <a className="top-phone" href="tel:0374261368"><span>☎</span><span>0374 261 368</span><small>Hotline / Zalo</small></a>
      </div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Hồng Việt - Trang chủ">
          <span className="brand-mark">〽</span>
          <span><b>HỒNG VIỆT</b><small>SÁO TRÚC & ÂM NHẠC DÂN TỘC</small></span>
        </a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Mở menu" aria-expanded={menuOpen}>☰</button>
        <nav className={menuOpen ? "open" : ""} aria-label="Điều hướng chính">
          <a href="#top" onClick={() => setMenuOpen(false)}>Trang chủ</a>
          <button className="nav-search" onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}>⌕ Tìm kiếm</button>
          <a href="#articles" onClick={() => setMenuOpen(false)}>Bài viết</a>
          <a href="#free-guides" onClick={() => setMenuOpen(false)}>Hướng dẫn miễn phí</a>
          <a href="#cam-am-sao-truc" onClick={() => setMenuOpen(false)}>Cảm âm sáo trúc</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Dịch vụ</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Liên hệ</a>
        </nav>
        <button className="button button-gold header-cta" onClick={() => scrollToId("contact")}>✦ Đăng ký học</button>
        {searchOpen && <div className="search-panel"><div className="search-box"><span>⌕</span><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm bài viết, khóa học, dịch vụ..." aria-label="Tìm kiếm nội dung" /><button onClick={() => { setSearchOpen(false); setQuery(""); }} aria-label="Đóng tìm kiếm">×</button></div>{query && <div className="search-results">{searchItems.length ? searchItems.slice(0, 6).map((item) => <a key={`${item.type}-${item.title}`} href={item.href} onClick={() => { setSearchOpen(false); setQuery(""); }}><small>{item.type}</small><span>{item.title}</span><b>→</b></a>) : <p>Không tìm thấy nội dung phù hợp.</p>}</div>}</div>}
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
            <button className="button button-outline" onClick={() => scrollToId("contact")}>Đăng ký học</button>
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
        <div className="service-grid">{services.map((service) => <article className="service-card" key={service.no}><div className="card-top"><span className="card-no">{service.no}</span><span className="card-icon">{service.icon}</span></div><h3>{service.title}</h3><p>{service.text}</p>{service.price && <strong className="price">{service.price}</strong>}<a href={service.href}>{service.cta}<span>→</span></a></article>)}</div>
      </section>

      <section className="courses section" id="classes">
        <div className="courses-head"><div><p className="eyebrow">CÁC BỘ MÔN GIẢNG DẠY</p><h2>Chọn thanh âm<br />phù hợp với bạn</h2></div><p>Mỗi bộ môn có một màu sắc riêng. Bấm “Xem thêm” để khám phá nội dung học, đối tượng phù hợp và đăng ký tư vấn.</p></div>
        <div className="discipline-grid">{disciplines.map((item, i) => <article className={openDiscipline === i ? "discipline-card is-open" : "discipline-card"} key={item.title}><button className="discipline-summary" onClick={() => setOpenDiscipline(openDiscipline === i ? null : i)} aria-expanded={openDiscipline === i}><span className="discipline-photo"><img src={item.image} alt={item.imageAlt} width="640" height="420" loading="lazy" decoding="async" /><i>{item.icon}</i></span><span className="discipline-copy"><small>BỘ MÔN 0{i + 1}</small><h3>{item.title}</h3><p>{item.short}</p></span><b>{openDiscipline === i ? "Thu gọn −" : "Xem nhanh +"}</b></button>{openDiscipline === i && <div className="discipline-detail"><p>{item.intro}</p><div><span><small>NỘI DUNG HỌC</small><ul>{item.learn.map((point) => <li key={point}>{point}</li>)}</ul></span><span><small>PHÙ HỢP VỚI</small><p>{item.suitable}</p></span></div><div className="discipline-actions"><a className="article-link" href={`/bo-mon/${item.slug}`}>Xem bài giới thiệu đầy đủ →</a><button className="button button-wine" onClick={() => { setSelectedDiscipline(item.title); scrollToId("contact"); }}>Đăng ký bộ môn này</button></div></div>}</article>)}</div>
      </section>

      <section className="recorded-section" id="courses">
        <div className="recorded-head"><div><p className="eyebrow">HỌC MỌI LÚC · XEM LẠI TRỌN ĐỜI</p><h2>Khóa học & video quay sẵn</h2></div><p>Chọn một lộ trình đầy đủ hoặc mua riêng từng video tác phẩm theo đúng nhạc cụ bạn đang chơi.</p></div>
        <div className="recorded-tabs" role="tablist" aria-label="Loại nội dung quay sẵn"><button className={courseTab === "courses" ? "active" : ""} onClick={() => setCourseTab("courses")} role="tab" aria-selected={courseTab === "courses"}>I. Khóa học theo bộ môn</button><button className={courseTab === "videos" ? "active" : ""} onClick={() => setCourseTab("videos")} role="tab" aria-selected={courseTab === "videos"}>II. Video quay từng bài</button></div>
        {courseTab === "courses" ? <div className="recorded-course-list">{recordedCourses.map((course, i) => <article className={openRecordedCourse === i ? "recorded-course is-open" : "recorded-course"} key={course.instrument}>
          <button className="recorded-course-summary" onClick={() => setOpenRecordedCourse(openRecordedCourse === i ? null : i)} aria-expanded={openRecordedCourse === i}>
            <span className="recorded-cover" style={{ backgroundImage: `linear-gradient(0deg,rgba(69,14,31,.82),transparent 70%),url(${course.image})` }}><small>KHÓA HỌC 0{i + 1}</small><h3>{course.instrument}</h3></span>
            <span className="recorded-summary-copy"><small>CHƯƠNG TRÌNH QUAY SẴN</small><b>Khóa học {course.instrument}</b><em>{course.items.length} nội dung · Học mọi lúc · Xem lại trọn đời</em></span><i>{openRecordedCourse === i ? "−" : "+"}</i>
          </button>
          {openRecordedCourse === i && <div className="recorded-lessons">{course.items.map((item, j) => <div key={item.name}><span>{i + 1}.{j + 1}</span><p><b>{item.name}</b><small>{item.detail}</small></p><div className="purchase-action"><small>GIÁ KHÓA HỌC</small><strong>{item.showPrice ? item.price : "Liên hệ"}</strong><button onClick={() => openPayment(`Khóa học ${course.instrument} – ${item.name}`, item.showPrice ? item.price : "")}>Mua ngay qua VietQR</button></div></div>)}</div>}
        </article>)}</div> : <div className="single-video-catalog">
          <article className="custom-video-card"><div><span>✦</span><p><small>VIDEO CÁ NHÂN HÓA</small><b>Bài quay theo yêu cầu</b><em>Gửi tên bài, tone sáo và yêu cầu kỹ thuật. Hồng Việt sẽ quay video hướng dẫn riêng phù hợp với bạn.</em></p></div><strong>Liên hệ</strong><button onClick={() => openPayment("Bài quay theo yêu cầu")}>Gửi yêu cầu</button></article>
          <div className="video-group-list">{singleVideoGroups.map((group, i) => <article className={openVideoGroup === i ? "video-group is-open" : "video-group"} key={group.instrument}>
            <button className="video-group-button" onClick={() => setOpenVideoGroup(openVideoGroup === i ? null : i)} aria-expanded={openVideoGroup === i}><span className="video-group-image" style={{ backgroundImage: `linear-gradient(0deg,rgba(70,14,31,.58),transparent),url(${group.image})` }}><i>▶</i></span><span><small>NHẠC CỤ 0{i + 1}</small><b>{group.instrument}</b><em>{group.description}</em></span><strong>{group.songs.length} bài</strong><i>{openVideoGroup === i ? "−" : "+"}</i></button>
            {openVideoGroup === i && <div className="video-song-list">{group.songs.map((song, j) => <div key={song.name}><span>{String(j + 1).padStart(2,"0")}</span><p><b>{song.name}</b><small>Video hướng dẫn từng câu · Sheet nhạc · Ngón bấm · Kỹ thuật</small></p><div className="purchase-action"><small>GIÁ VIDEO</small><strong>{song.showPrice ? song.price : "Liên hệ"}</strong><button onClick={() => openPayment(`Video ${group.instrument} – ${song.name}`, song.showPrice ? song.price : "")}>Mua ngay qua VietQR</button></div></div>)}</div>}
          </article>)}</div>
        </div>}
        <div className="payment-note"><span>▣</span><p><b>Thanh toán nhanh bằng VietQR</b><small>Bấm “Mua khóa học” hoặc “Chọn video” để mở bảng thanh toán và chỉnh số tiền, nội dung chuyển khoản.</small></p></div>
      </section>

      {paymentOpen && <div className="payment-modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setPaymentOpen(false); }}>
        <section className="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-title">
          <button className="payment-close" onClick={() => setPaymentOpen(false)} aria-label="Đóng bảng thanh toán">×</button>
          <header><h2 id="payment-title">Thanh Toán Qua VietQR</h2><p>{selectedPurchase}</p></header>
          <div className="payment-modal-grid">
            <div className="payment-left">
              <h3>THÔNG TIN CHUYỂN KHOẢN</h3>
              <div className="bank-info"><p><span>Ngân hàng:</span><b>STB · Sacombank</b></p><p><span>Số tài khoản:</span><b>030046023451</b><button type="button" onClick={() => navigator.clipboard?.writeText("030046023451")}>Sao chép</button></p><p><span>Chủ tài khoản:</span><b>QUACH HA VAN</b></p><label><span>Số tiền thanh toán:</span><input value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Nhập số tiền (VNĐ)" inputMode="numeric" /></label><label><span>Nội dung chuyển khoản:</span><input value={transferContent} onChange={(e) => setTransferContent(e.target.value)} placeholder="Nhập nội dung chuyển khoản" /><button type="button" onClick={() => navigator.clipboard?.writeText(transferContent)}>Sao chép</button></label></div>
              <h3>THÔNG TIN NGƯỜI MUA</h3>
              <form id="payment-form" onSubmit={(e) => { e.preventDefault(); setOrderSent(true); }}><label>Họ và tên <small>(không bắt buộc)</small><input name="buyerName" placeholder="Nhập họ tên của bạn" /></label><label>Số điện thoại / Zalo nhận file *<input required name="buyerPhone" type="tel" placeholder="Nhập số điện thoại Zalo" /></label><label>Email nhận khóa học<input name="buyerEmail" type="email" placeholder="Email của bạn (nếu có)" /></label></form>
            </div>
            <aside className="payment-qr"><img src="/vietqr-payment.png" alt="Mã thanh toán VietQR Sacombank" width="540" height="540" loading="eager" decoding="sync" /><a href="/vietqr-payment.png" target="_blank" rel="noreferrer">↓ Tải / Mở ảnh QR</a><button className="payment-confirm" type="submit" form="payment-form">● Xác nhận đã chuyển khoản</button>{orderSent && <p role="status">Đã ghi nhận trên trang. Vui lòng gửi ảnh giao dịch qua Zalo 0374 261 368 để Hồng Việt kiểm tra và cấp khóa học.</p>}</aside>
          </div>
        </section>
      </div>}

      <section className="products-section" id="products">
        <div className="products-heading"><div><p className="eyebrow">SÁO & PHỤ KIỆN</p><h2>Chọn nhạc cụ phù hợp<br />với thanh âm của bạn.</h2></div><p>Mỗi nhóm nhạc cụ có nhiều chất liệu và cấu hình khác nhau. Bấm vào từng mục để xem mô tả, hình ảnh và thông tin giá.</p></div>
        <div className="product-category-list">{productCategories.map((category, i) => <article className={openProductCategory === i ? "product-category is-open" : "product-category"} key={category.title}>
          <button className="product-category-button" onClick={() => setOpenProductCategory(openProductCategory === i ? null : i)} aria-expanded={openProductCategory === i}>
            <span className="product-category-image" style={{ backgroundImage: `linear-gradient(90deg,rgba(65,13,30,.18),rgba(65,13,30,.02)),url(${category.image})` }} />
            <span><small>NHÓM SẢN PHẨM 0{i + 1}</small><b>{category.title}</b><em>{category.intro}</em></span><i>{openProductCategory === i ? "−" : "+"}</i>
          </button>
          {openProductCategory === i && <div className="product-detail-grid">{category.products.map((product) => <div className="product-item" key={product.name}>
            <div className="product-thumb" style={{ backgroundImage: `url(${category.image})` }}><span>{product.name}</span></div>
            <div className="product-item-copy"><h3>{product.name}</h3><p>{product.description}</p><div><strong>{product.price}</strong><button onClick={() => { setSelectedDiscipline("Mua sáo & phụ kiện"); scrollToId("contact"); }}>Nhận tư vấn →</button></div></div>
          </div>)}</div>}
        </article>)}</div>
      </section>

      <section className="studio-section" id="studio">
        <div className="studio-head"><div><p className="eyebrow">THU ÂM & QUAY VIDEO</p><h2>Biến phần trình diễn<br />thành một sản phẩm đẹp.</h2></div><p>Từ một bản thu mộc đến MV hoàn chỉnh, Hồng Việt đồng hành ở cả âm thanh, hình ảnh và cách thể hiện để giữ được màu sắc riêng của người biểu diễn.</p></div>
        <div className="studio-package-grid">{studioPackages.map((item) => <article className="studio-package" key={item.title}><div className="studio-package-top"><span>{item.icon}</span><div><small>{item.subtitle}</small><h3>{item.title}</h3></div></div><ul>{item.features.map((feature) => <li key={feature}>✓ <span>{feature}</span></li>)}</ul><div className="studio-buy"><small>GIÁ THAM KHẢO</small><strong>{item.showPrice ? item.price : "Liên hệ báo giá"}</strong>{item.showPrice ? <button onClick={() => openPayment(`Đặt cọc ${item.title}`, item.price)}>Đặt cọc qua VietQR</button> : <button onClick={() => { setSelectedDiscipline("Thu âm / Booking biểu diễn"); scrollToId("contact"); }}>Nhận báo giá qua Zalo</button>}</div></article>)}</div>
        <div className="studio-info-grid"><article><p className="eyebrow">QUY TRÌNH THỰC HIỆN</p><h3>Rõ ràng trong từng bước</h3><ol>{studioSteps.map((step, i) => <li key={step}><span>{String(i + 1).padStart(2, "0")}</span>{step}</li>)}</ol></article><article><p className="eyebrow">THÔNG TIN CẦN GỬI</p><h3>Để nhận báo giá chính xác</h3><ul><li>Tên tác phẩm và nhạc cụ sử dụng</li><li>Beat hoặc bản phối hiện có</li><li>Thu âm, quay video hay gói trọn bộ</li><li>Địa điểm và thời gian mong muốn</li><li>Phong cách hình ảnh tham khảo</li></ul><button onClick={() => { setSelectedDiscipline("Thu âm / Booking biểu diễn"); scrollToId("contact"); }}>Gửi yêu cầu tư vấn →</button></article><article><p className="eyebrow">SẢN PHẨM BÀN GIAO</p><h3>Đầy đủ để lưu giữ & chia sẻ</h3><ul><li>Âm thanh WAV và MP3 chất lượng cao</li><li>Video Full HD hoặc 4K theo thỏa thuận</li><li>Bản ngang cho YouTube/Facebook</li><li>Bản dọc TikTok/Reels khi đăng ký</li><li>Ảnh bìa hoặc thumbnail theo gói</li></ul><small>Chi phí địa điểm, beat bản quyền, nhạc công, trang phục và trang điểm sẽ được báo riêng nếu phát sinh.</small></article></div>
        <div className="studio-note"><b>Lưu ý trước khi đặt lịch</b><span>Mỗi gói có phạm vi, số lần chỉnh sửa và thời gian bàn giao khác nhau. Lịch chỉ được giữ sau khi hai bên thống nhất nội dung và đặt cọc.</span></div>
      </section>

      <section className="booking-section" id="booking">
        <div className="booking-head"><div><p className="eyebrow">BOOKING NGHỆ SĨ</p><h2>Âm nhạc phù hợp<br />cho từng khoảnh khắc.</h2></div><p>Độc tấu, song tấu, hòa tấu hoặc ban nhạc dân tộc được tư vấn theo quy mô, không gian và tinh thần riêng của mỗi sự kiện.</p></div>
        <div className="booking-events">{bookingEvents.map((event) => <span key={event}>✦ {event}</span>)}</div>
        <div className="booking-package-grid">{bookingPackages.map((item) => <article className="booking-package" key={item.title}><span className="booking-icon">{item.icon}</span><small>{item.detail}</small><h3>{item.title}</h3><ul>{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><div><small>GIÁ THAM KHẢO</small><strong>{item.showPrice ? item.price : "Liên hệ báo giá"}</strong>{item.showPrice ? <button onClick={() => openPayment(`Đặt cọc booking – ${item.title}`, item.price)}>Kiểm tra lịch & đặt cọc</button> : <button onClick={() => { setSelectedDiscipline("Thu âm / Booking biểu diễn"); scrollToId("contact"); }}>Nhận báo giá qua Zalo</button>}</div></article>)}</div>
        <button className="booking-detail-toggle" onClick={() => setBookingDetailsOpen(!bookingDetailsOpen)} aria-expanded={bookingDetailsOpen}><span><small>THÔNG TIN BOOKING</small><b>{bookingDetailsOpen ? "Ẩn quy trình và điều khoản" : "Xem quy trình, yêu cầu và điều khoản"}</b></span><i>{bookingDetailsOpen ? "−" : "+"}</i></button>
        {bookingDetailsOpen && <div className="booking-detail-grid"><article><small>QUY TRÌNH BOOKING</small><h3>8 bước xác nhận lịch</h3><ol><li>Gửi thông tin sự kiện</li><li>Kiểm tra lịch nghệ sĩ</li><li>Tư vấn tiết mục và đội hình</li><li>Gửi báo giá</li><li>Xác nhận hợp đồng, đặt cọc</li><li>Thống nhất kịch bản và kỹ thuật</li><li>Biểu diễn tại sự kiện</li><li>Thanh toán phần còn lại</li></ol></article><article><small>THÔNG TIN CẦN GỬI</small><h3>Để báo giá chính xác</h3><ul><li>Tên đơn vị và số điện thoại/Zalo</li><li>Loại sự kiện, ngày giờ, địa điểm</li><li>Số tiết mục hoặc thời lượng</li><li>Đội hình và danh sách bài dự kiến</li><li>Yêu cầu trang phục, âm thanh</li><li>Ngân sách dự kiến</li></ul></article><article><small>CHI PHÍ & ĐIỀU KHOẢN</small><h3>Cần thống nhất trước</h3><ul><li>Di chuyển, lưu trú ngoài tỉnh</li><li>Tập luyện, chuyển soạn bài mới</li><li>Thiết bị, trang phục đặc biệt</li><li>Chính sách đổi ngày hoặc hủy lịch</li><li>Giờ thử âm thanh và thời lượng phát sinh</li><li>Quyền quay phim, livestream và sử dụng hình ảnh</li></ul></article></div>}
        <div className="booking-cta"><div><small>SẴN SÀNG CHO SỰ KIỆN CỦA BẠN?</small><b>Gửi ngày, địa điểm và đội hình mong muốn để kiểm tra lịch.</b></div><button onClick={() => { setSelectedDiscipline("Thu âm / Booking biểu diễn"); scrollToId("contact"); }}>Nhận báo giá qua Zalo →</button></div>
      </section>

      <section className="instrument-recording" id="instrument-recording">
        <div className="instrument-recording-head"><div><p className="eyebrow">THU ÂM NHẠC CỤ THẬT</p><h2>Chất liệu âm thanh thật<br />cho bản phối của bạn.</h2></div><p>Dành cho ca sĩ, nhạc sĩ, nhà sản xuất và người làm nội dung cần một track nhạc cụ giàu cảm xúc, đúng tone, BPM và sẵn sàng đưa vào dự án.</p></div>
        <div className="recording-instrument-grid">{recordingInstruments.map((item) => <article key={item.title}><span>{item.icon}</span><small>NHẠC CỤ NHẬN THU</small><h3>{item.title}</h3><p>{item.tone}</p><div><small>GIÁ TỪ</small><strong>{item.showPrice ? item.price : "Liên hệ"}</strong>{item.showPrice ? <button onClick={() => openPayment(`Đặt thu âm ${item.title}`, item.price)}>Đặt thu qua VietQR</button> : <button onClick={() => { setSelectedDiscipline("Thu âm / Booking biểu diễn"); scrollToId("contact"); }}>Gửi yêu cầu riêng</button>}</div></article>)}</div>
        <div className="recording-package-row">{recordingPackages.map((item, i) => <article key={item.title}><span>0{i + 1}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div><strong>{item.price}</strong></article>)}</div>
        <div className="recording-brief"><div><small>KHÁCH HÀNG CẦN GỬI</small><h3>Beat, BPM, tone và phần tham chiếu</h3><p>Gửi file WAV/MP3, sheet, MIDI hoặc audio mẫu; ghi rõ vị trí cần nhạc cụ, cảm xúc, kỹ thuật mong muốn và thời hạn nhận file.</p></div><button onClick={() => { setSelectedDiscipline("Thu âm / Booking biểu diễn"); scrollToId("contact"); }}>Gửi beat & nhận báo giá →</button></div>
        <button className="recording-detail-toggle" onClick={() => setRecordingDetailsOpen(!recordingDetailsOpen)} aria-expanded={recordingDetailsOpen}><span><small>THÔNG TIN CHUYÊN MÔN</small><b>{recordingDetailsOpen ? "Ẩn quy trình và chính sách" : "Xem quy trình, file bàn giao và bản quyền"}</b></span><i>{recordingDetailsOpen ? "−" : "+"}</i></button>
        {recordingDetailsOpen && <div className="recording-detail-grid"><article><small>HÌNH THỨC THU</small><h3>Linh hoạt theo dự án</h3><ul><li>Thu theo sheet hoàn chỉnh</li><li>Thu theo MIDI hoặc audio mẫu</li><li>Ứng tấu theo hợp âm và phong cách</li><li>Thu bè hoặc nhiều lớp âm thanh</li><li>Thu đoạn ngắn hoặc toàn bộ tác phẩm</li></ul></article><article><small>QUY TRÌNH</small><h3>Từ brief đến file gốc</h3><ol><li>Gửi beat và yêu cầu</li><li>Kiểm tra tone, BPM, độ khó</li><li>Tư vấn và báo giá</li><li>Đặt cọc, tiến hành thu</li><li>Gửi bản nghe thử</li><li>Chỉnh sửa và bàn giao</li></ol></article><article><small>FILE BÀN GIAO</small><h3>Sẵn sàng cho producer</h3><ul><li>WAV riêng từng nhạc cụ</li><li>MP3 nghe thử</li><li>Track khớp BPM và timeline</li><li>Bản dry/wet theo gói</li><li>Các take lựa chọn khi đăng ký</li></ul></article><article><small>CHỈNH SỬA & BẢN QUYỀN</small><h3>Minh bạch trước khi thu</h3><ul><li>Ghi rõ số lần chỉnh sửa miễn phí</li><li>Đổi tone, BPM hoặc phối có thể tính phí thu lại</li><li>Thống nhất quyền sử dụng thương mại</li><li>Bảo mật tác phẩm chưa phát hành</li><li>Chỉ dùng làm sản phẩm mẫu khi được đồng ý</li></ul></article></div>}
        <div className="recording-footer-cta"><div><small>CẦN THU GẤP HOẶC NHIỀU NHẠC CỤ?</small><b>Gửi dự án để được tư vấn đội hình và thời gian bàn giao.</b></div><button onClick={() => { setSelectedDiscipline("Thu âm / Booking biểu diễn"); scrollToId("contact"); }}>Liên hệ thu gấp →</button></div>
      </section>

      <section className="articles section" id="articles">
        <div className="articles-head"><div><p className="eyebrow">KIẾN THỨC & CẢM HỨNG</p><h2>Bài viết mới</h2></div><p>Những hướng dẫn ngắn gọn, dễ áp dụng để bạn hiểu nhạc cụ và luyện tập đúng cách.</p></div>
        <div className="article-grid">{articles.map((article, i) => <article key={article.title}><div className="article-visual"><span>0{i + 1}</span><b>♪</b></div><div className="article-body"><small>{article.tag} · {article.date}</small><h3>{article.title}</h3><p>{article.excerpt}</p><a href="#contact">Đọc bài viết <span>→</span></a></div></article>)}</div>
      </section>

      <section className="free-guides-section" id="free-guides">
        <div className="free-guides-head">
          <div><p className="eyebrow">CHIA SẺ KIẾN THỨC · HOÀN TOÀN MIỄN PHÍ</p><h2>Hướng dẫn miễn phí</h2></div>
          <p>Nơi tổng hợp video YouTube, TikTok và bài viết hữu ích. Bạn chỉ cần thay đường dẫn trong từng nội dung để giới thiệu kênh và chia sẻ kiến thức tới học viên.</p>
        </div>
        <div className="free-guides-grid">
          {freeGuides.map((guide) => <article key={guide.platform}>
            <div className="guide-visual"><span>{guide.icon}</span><small>{guide.platform}</small></div>
            <div className="guide-copy"><small>{guide.topic}</small><h3>{guide.title}</h3><p>{guide.description}</p><a href={guide.href}>{guide.platform === "Bài viết" ? "Đọc bài viết" : `Xem trên ${guide.platform}`} <span>→</span></a></div>
          </article>)}
        </div>
        <div className="free-guides-note"><span>✦</span><p><b>Sẵn sàng để gắn nội dung của bạn</b><small>Thay các đường dẫn mẫu bằng link YouTube, TikTok hoặc bài viết thật; bố cục sẽ tự thích ứng trên máy tính và điện thoại.</small></p><button onClick={() => scrollToId("contact")}>Gửi link cần cập nhật</button></div>
      </section>

      <section className="flute-tabs-section" id="cam-am-sao-truc">
        <div className="flute-tabs-head"><div><p className="eyebrow">LỜI BÀI HÁT · NỐT CẢM ÂM</p><h2>Cảm âm sáo trúc</h2></div><p>Chọn tên bài và bấm dấu “+” để xem lời cùng nốt cảm âm. Bấm “−” để thu gọn khi không cần sử dụng.</p></div>
        <div className="flute-tab-list">{fluteTabs.map((song, i) => <article className={openFluteTab === i ? "flute-tab is-open" : "flute-tab"} key={song.title}>
          <button className="flute-tab-summary" onClick={() => setOpenFluteTab(openFluteTab === i ? null : i)} aria-expanded={openFluteTab === i}><span><small>BÀI CẢM ÂM {String(i + 1).padStart(2,"0")}</small><b>{song.title}</b></span><i aria-hidden="true">{openFluteTab === i ? "−" : "+"}</i></button>
          {openFluteTab === i && <div className="flute-tab-detail"><header><div><small>TÊN ĐẦY ĐỦ</small><h3>{song.fullTitle}</h3></div><span>{song.tone}</span></header><div className="notation-lines">{song.lines.map((line, j) => <div key={`${song.title}-${j}`}><span>{String(j + 1).padStart(2,"0")}</span><p className="lyric-line">{line.lyric}</p><p className="note-line">{line.notes}</p></div>)}</div><footer><span>♪</span><p><b>Hướng dẫn đọc:</b> Dấu “—” là ngân dài; số ² là nốt ở quãng cao. Bạn có thể thay nội dung mẫu bằng lời và cảm âm của từng bài.</p></footer></div>}
        </article>)}</div>
        <div className="flute-tab-request"><div><small>CHƯA CÓ BÀI BẠN CẦN?</small><b>Yêu cầu cảm âm một bài mới</b><p>Gửi tên bài, tone sáo và đường dẫn nghe để được tư vấn.</p></div><button onClick={() => { setSelectedDiscipline("Cảm âm sáo trúc"); scrollToId("contact"); }}>Liên hệ yêu cầu →</button></div>
      </section>

      <section className="materials-section" id="materials">
        <div className="materials-head"><div><p className="eyebrow">GIÁO TRÌNH & SHEET CHUYỂN SOẠN</p><h2>Tài liệu học tập<br />theo từng bộ môn.</h2></div><p>Chọn bộ môn để xem chi tiết. Mỗi tài liệu đều có giá phía trên nút mua VietQR; các mục ẩn giá sẽ hiển thị “Liên hệ”.</p></div>
        <div className="recorded-tabs" role="tablist"><button role="tab" className={materialTab === "curriculum" ? "active" : ""} onClick={() => { setMaterialTab("curriculum"); setOpenMaterialGroup(0); }}>I. Giáo trình</button><button role="tab" className={materialTab === "sheets" ? "active" : ""} onClick={() => { setMaterialTab("sheets"); setOpenMaterialGroup(0); }}>II. Sheet chuyển soạn</button></div>
        <div className="material-groups">{(materialTab === "curriculum" ? curriculumGroups : sheetGroups).map((group, i) => <article className={openMaterialGroup === i ? "material-group is-open" : "material-group"} key={`${materialTab}-${group.instrument}`}>
          <button className="material-group-button" onClick={() => setOpenMaterialGroup(openMaterialGroup === i ? null : i)} aria-expanded={openMaterialGroup === i}><span className="material-cover" style={{ backgroundImage: `linear-gradient(90deg,rgba(60,10,28,.15),rgba(60,10,28,.25)),url(${group.image})` }} /><span><small>{materialTab === "curriculum" ? "BỘ MÔN GIÁO TRÌNH" : "BỘ MÔN SHEET"}</small><b>{group.instrument}</b><em>{group.items.length} tài liệu hiện có</em></span><i>{openMaterialGroup === i ? "−" : "+"}</i></button>
          {openMaterialGroup === i && <div className="material-items">{group.items.map((item, j) => <div key={item.name}><span>{String(j + 1).padStart(2, "0")}</span><p><b>{item.name}</b><small>{item.detail}</small></p><div className="purchase-action"><small>GIÁ TÀI LIỆU</small><strong>{item.showPrice ? item.price : "Liên hệ"}</strong><button onClick={() => openPayment(`${materialTab === "curriculum" ? "Giáo trình" : "Sheet"} ${group.instrument} – ${item.name}`, item.showPrice ? item.price : "")}>Mua ngay qua VietQR</button></div></div>)}</div>}
        </article>)}</div>
        {materialTab === "sheets" && <div className="custom-sheet-card"><span>✎</span><div><small>DỊCH VỤ CHUYỂN SOẠN RIÊNG</small><h3>Yêu cầu sheet theo bài</h3><p>Gửi tên bài, tone sáo và yêu cầu ký âm; Hồng Việt sẽ tư vấn giá và thời gian hoàn thiện qua Zalo.</p></div><button onClick={() => { setSelectedDiscipline("Sheet nhạc & giáo trình"); scrollToId("contact"); }}>Liên hệ qua Zalo →</button></div>}
      </section>

      <section className="social section">
        <div className="section-heading"><span /><div><p className="eyebrow">THEO DÕI HỒNG VIỆT</p><h2>Kết nối với chúng tôi</h2></div><span /></div>
        <div className="social-grid"><a href="#contact" className="youtube"><b>▶</b><span><small>YOUTUBE</small>Kênh Sáo Hồng Việt</span><i>↗</i></a><a href="#contact" className="facebook"><b>f</b><span><small>FACEBOOK</small>Hồng Việt Sáo Trúc</span><i>↗</i></a><a href="#contact" className="tiktok"><b>♪</b><span><small>TIKTOK</small>@hongvietsao</span><i>↗</i></a><a href="#contact" className="instagram"><b>◎</b><span><small>INSTAGRAM</small>@hongviet.music</span><i>↗</i></a></div>
      </section>

      <section className="contact section" id="contact">
        <div className="contact-copy"><p className="eyebrow">BẮT ĐẦU HÀNH TRÌNH</p><h2>Để tiếng sáo cất lời.</h2><p>Để lại thông tin, Hồng Việt sẽ liên hệ tư vấn lớp học, chọn sáo hoặc dịch vụ phù hợp.</p><ul><li>106/72 Hòa Bình, P. Tân Phú, TP.HCM</li><li>Hotline / Zalo: 0374 261 368</li><li>Email: vanquach999x@gmail.com</li></ul></div>
        <form onSubmit={submitForm}><label>Họ và tên<input required name="name" placeholder="Tên của bạn" /></label><label>Số điện thoại<input required name="phone" type="tel" placeholder="Số điện thoại liên hệ" /></label><label className="full">Bộ môn bạn quan tâm<select name="interest" value={selectedDiscipline} onChange={(e) => setSelectedDiscipline(e.target.value)}>{disciplines.map((item) => <option key={item.title}>{item.title}</option>)}<option>Mua sáo & phụ kiện</option><option>Sheet nhạc & giáo trình</option><option>Thu âm / Booking biểu diễn</option></select></label><label className="full">Lời nhắn<textarea name="message" rows={3} placeholder="Mục tiêu hoặc nhu cầu của bạn" /></label><button className="button button-wine full" type="submit">Gửi qua Zalo →</button>{sent && <p className="success full" role="status">Nội dung đã được sao chép và Zalo đã được mở. Hãy dán nội dung vào cuộc trò chuyện để gửi đăng ký.</p>}</form>
      </section>

      <footer><div className="brand"><span className="brand-mark">〽</span><span><b>HỒNG VIỆT</b><small>SÁO TRÚC & ÂM NHẠC DÂN TỘC</small></span></div><p>Đam mê làm nên giá trị · Chất lượng tạo nên uy tín</p><small>© 2026 Hồng Việt. All rights reserved.</small></footer>
    </main>
  );
}
