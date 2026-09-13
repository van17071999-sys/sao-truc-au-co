"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import BrandLogo from "./brand-logo";

// ================= DATA DEFINITIONS =================

const disciplinesList = [
  {
    id: "sao-truc",
    title: "Sáo trúc Việt Nam",
    subtitle: "Âm thanh thuần Việt, gần gũi và giàu cảm xúc.",
    image: "/inst-saotruc.jpg",
    href: "/bo-mon/sao-truc-viet-nam",
  },
  {
    id: "sao-dizi",
    title: "Sáo Dizi",
    subtitle: "Âm sắc sáng, mạnh mẽ, đậm chất Trung Hoa.",
    image: "/inst-dizi.jpg",
    href: "/bo-mon/sao-dizi",
  },
  {
    id: "recorder",
    title: "Recorder",
    subtitle: "Dễ học, phù hợp mọi lứa tuổi, thích hợp cho người mới bắt đầu.",
    image: "/inst-recorder.jpg",
    href: "/bo-mon/sao-recorder",
  },
  {
    id: "dong-tieu",
    title: "Động tiêu & Xiao",
    subtitle: "Trầm lắng, sâu sắc, đậm chất thiền.",
    image: "/inst-tieu.jpg",
    href: "/bo-mon/dong-tieu-xiao",
  },
  {
    id: "flute",
    title: "Flute",
    subtitle: "Âm thanh trong trẻo, hiện đại và linh hoạt.",
    image: "/inst-flute.jpg",
    href: "/bo-mon/flute",
  },
  {
    id: "sao-hmong",
    title: "Sáo H'Mông / Sáo mèo",
    subtitle: "Âm sắc mộc mạc, đậm đà bản sắc vùng cao.",
    image: "/inst-hmong.jpg",
    href: "/bo-mon/sao-hmong",
  },
];

const whyChooseUsList = [
  {
    icon: "fa-solid fa-chart-line",
    title: "Lộ trình rõ ràng",
    desc: "Từ cơ bản đến nâng cao, phù hợp mục tiêu của từng học viên.",
  },
  {
    icon: "fa-solid fa-graduation-cap",
    title: "Học theo trình độ",
    desc: "Giáo trình cá nhân hóa, tiến bộ theo đúng khả năng.",
  },
  {
    icon: "fa-solid fa-display",
    title: "Học trực tiếp hoặc online",
    desc: "Linh hoạt thời gian, phù hợp cho người bận rộn và học viên ở xa.",
  },
  {
    icon: "fa-solid fa-music",
    title: "Ứng dụng vào bài hát sớm",
    desc: "Học lý thuyết đi đôi thực hành, sớm thổi được những bài yêu thích.",
  },
];

const servicesList = [
  {
    icon: "fa-solid fa-users",
    title: "Lớp học các bộ môn",
    desc: "Học trực tiếp & online",
    href: "/lop-hoc",
  },
  {
    icon: "fa-solid fa-calendar-check",
    title: "Đăng ký lớp học",
    desc: "Tư vấn & xếp lớp nhanh",
    href: "/dang-ky-hoc",
  },
  {
    icon: "fa-solid fa-wand-magic-sparkles",
    title: "Sáo & phụ kiện",
    desc: "Sáo chất lượng, phụ kiện chính hãng",
    href: "/sao-va-phu-kien",
  },
  {
    icon: "fa-solid fa-play",
    title: "Khóa học quay sẵn",
    desc: "Học mọi lúc, mọi nơi",
    href: "/khoa-hoc-quay-san",
  },
  {
    icon: "fa-solid fa-book-open",
    title: "Giáo trình & sheet",
    desc: "Tài liệu bài bản, dễ hiểu",
    href: "/giao-trinh-va-sheet",
  },
  {
    icon: "fa-solid fa-microphone-lines",
    title: "Thu âm & quay video",
    desc: "Ghi lại hành trình âm nhạc",
    href: "/thu-am-va-quay-video",
  },
  {
    icon: "fa-solid fa-people-group",
    title: "Booking nghệ sĩ",
    desc: "Biểu diễn, sự kiện, giao lưu",
    href: "/booking-nghe-si",
  },
  {
    icon: "fa-solid fa-sliders",
    title: "Thu âm nhạc cụ thật",
    desc: "Âm thanh mộc mạc, chân thực",
    href: "/thu-am-nhac-cu-that",
  },
];

const studentPhotos = [
  {
    image: "/class-lesson.jpg",
    caption: "Giờ học trực tiếp tại trung tâm",
  },
  {
    image: "/class-group.jpg",
    caption: "Học viên của Sáo Trúc Âu Cơ",
  },
  {
    image: "/class-student.jpg",
    caption: "Học viên tiến bộ sau 3 tháng",
  },
];

const faqs = [
  {
    question: "Người chưa biết nhạc có học được không?",
    answer:
      "Hoàn toàn được! Giáo trình tại Sáo Trúc Âu Cơ được thiết kế chuyên biệt cho người mới bắt đầu từ con số 0, không cần biết nhạc lý trước. Bạn sẽ được hướng dẫn tạo âm trong 15 phút đầu tiên và thực hành ghép nốt vào các bài dân ca quen thuộc sau vài buổi học.",
  },
  {
    question: "Lớp học ở đâu?",
    answer:
      "Lớp học trực tiếp tọa lạc tại địa chỉ: 106/72 Hòa Bình, Phường Tân Phú, TP. Hồ Chí Minh. Không gian học yên tĩnh, đầy đủ nhạc cụ chuẩn âm, giá để bài và môi trường truyền cảm hứng.",
  },
  {
    question: "Có học online không?",
    answer:
      "Có! Sáo Trúc Âu Cơ cung cấp hình thức học Online 1 kèm 1 chất lượng cao qua Video Call (Google Meet, Zalo, Zoom). Giảng viên trực tiếp sửa khẩu hình, luồng hơi, thế ngón và cao độ cho học viên tại các tỉnh thành và học viên ở nước ngoài.",
  },
  {
    question: "Bao lâu có thể thổi được một bài?",
    answer:
      "Với phương pháp giảng dạy thực tế, thông thường chỉ sau 2 đến 4 tuần (khoảng 4 - 8 buổi học), học viên đã có thể thổi trọn vẹn và đúng nhịp các bài hát cơ bản như Bèo dạt mây trôi, Luyện hơi buổi sáng, Nữ nhi tình...",
  },
  {
    question: "Nên bắt đầu bằng sáo tone nào?",
    answer:
      "Người mới bắt đầu được khuyến nghị sử dụng Sáo Nứa tone Đô (C5). Đây là tone sáo tiêu chuẩn có khoảng cách ngón tay vừa vặn, lỗ thổi nhẹ, dễ bắt hơi và có kho cảm âm, giáo trình phong phú nhất.",
  },
];

const socialLinks = [
  {
    name: "YouTube",
    icon: "fa-brands fa-youtube",
    color: "#CC0000",
    bgColor: "bg-red-50",
    textColor: "text-[#CC0000]",
    borderColor: "border-red-200 hover:border-[#CC0000]",
    desc: "Video hướng dẫn, biểu diễn và chia sẻ kiến thức.",
    href: "https://www.youtube.com/@saotrucauco",
  },
  {
    name: "Facebook",
    icon: "fa-brands fa-facebook",
    color: "#1877F2",
    bgColor: "bg-blue-50",
    textColor: "text-[#1877F2]",
    borderColor: "border-blue-200 hover:border-[#1877F2]",
    desc: "Cập nhật tin tức, lớp học và hoạt động mới nhất.",
    href: "https://www.facebook.com/saotrucauco",
  },
  {
    name: "TikTok",
    icon: "fa-brands fa-tiktok",
    color: "#000000",
    bgColor: "bg-stone-100",
    textColor: "text-stone-900",
    borderColor: "border-stone-200 hover:border-black",
    desc: "Những giai điệu ngắn đầy cảm hứng.",
    href: "https://www.tiktok.com/@saotrucauco",
  },
  {
    name: "Instagram",
    icon: "fa-brands fa-instagram",
    color: "#E4405F",
    bgColor: "bg-pink-50",
    textColor: "text-[#E4405F]",
    borderColor: "border-pink-200 hover:border-[#E4405F]",
    desc: "Hình ảnh, khoảnh khắc và đời sống lớp học.",
    href: "https://www.instagram.com/saotrucauco",
  },
];

// Search database items
const searchIndexItems = [
  { title: "Khóa học Sáo trúc Việt Nam", cat: "Lớp học", href: "/lop-hoc" },
  { title: "Khóa học Sáo Dizi Trung Hoa", cat: "Lớp học", href: "/lop-hoc" },
  { title: "Khóa học Sáo Recorder", cat: "Lớp học", href: "/lop-hoc" },
  { title: "Khóa học Động Tiêu & Xiao", cat: "Lớp học", href: "/lop-hoc" },
  { title: "Khóa học Sáo Flute", cat: "Lớp học", href: "/lop-hoc" },
  { title: "Khóa học Sáo H'Mông / Sáo Mèo", cat: "Lớp học", href: "/lop-hoc" },
  { title: "Sáo Nứa C5 Tone Đô Chuẩn Âm", cat: "Sản phẩm", href: "/sao-va-phu-kien" },
  { title: "Sáo Dizi Trúc Đen Cổ Phong", cat: "Sản phẩm", href: "/sao-va-phu-kien" },
  { title: "Động Tiêu Trúc Tím 8 Lỗ", cat: "Sản phẩm", href: "/sao-va-phu-kien" },
  { title: "Giáo trình tự học sáo trúc từ số 0", cat: "Giáo trình", href: "/giao-trinh-va-sheet" },
  { title: "Kho Cảm Âm Sáo Trúc Chuẩn 2 Dòng", cat: "Cảm âm", href: "/cam-am" },
  { title: "5 bước tạo tiếng sáo trong và ổn định", cat: "Bài viết", href: "/bai-viet" },
  { title: "Người mới nên bắt đầu với sáo tone nào?", cat: "Bài viết", href: "/bai-viet" },
  { title: "Đăng ký học trực tiếp & Online", cat: "Đăng ký", href: "/dang-ky-hoc" },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [photoCarouselIndex, setPhotoCarouselIndex] = useState(0);

  // Search Results
  const filteredSearch = useMemo(() => {
    if (!searchQuery.trim()) return searchIndexItems.slice(0, 6);
    const q = searchQuery.toLowerCase();
    return searchIndexItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.cat.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const nextPhoto = () => {
    setPhotoCarouselIndex((prev) => (prev + 1) % studentPhotos.length);
  };

  const prevPhoto = () => {
    setPhotoCarouselIndex((prev) => (prev - 1 + studentPhotos.length) % studentPhotos.length);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#292421] font-sans antialiased selection:bg-[#7A1618] selection:text-white">
      
      {/* ================= 1. TOP UTILITY BAR ================= */}
      <div className="bg-[#7A1618] text-white/95 text-xs py-2 px-4 sm:px-8 border-b border-[#600f11]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-amber-300"></i>
            <span>106/72 Hòa Bình, P. Tân Phú, TP.HCM</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <a
              href="tel:0374261368"
              className="hover:text-amber-200 transition-colors flex items-center gap-1.5"
            >
              <i className="fa-solid fa-phone text-amber-300"></i>
              <span>Hotline / Zalo: <strong>0374 261 368</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* ================= 2. MAIN HEADER NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#E8DFC8] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3.5 group shrink-0">
            <BrandLogo size={48} radius={999} className="border border-[#7A1618]/30 shadow-sm group-hover:scale-105 transition-transform" />
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-wide text-[#7A1618] uppercase leading-none">
                SÁO TRÚC ÂU CƠ
              </span>
              <span className="block text-[10px] sm:text-xs text-[#193822] font-semibold tracking-wider uppercase mt-1">
                SÁO TRÚC & ÂM NHẠC DÂN TỘC
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-[15px] font-medium text-[#292421]">
            <Link
              href="/"
              className="text-[#7A1618] font-bold border-b-2 border-[#7A1618] pb-1 transition-colors"
            >
              Trang chủ
            </Link>
            <button
              onClick={() => setSearchModalOpen(true)}
              className="hover:text-[#7A1618] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Tìm kiếm</span>
            </button>
            <Link href="/bai-viet" className="hover:text-[#7A1618] transition-colors">
              Bài viết
            </Link>
            <Link href="/huong-dan" className="hover:text-[#7A1618] transition-colors">
              Hướng dẫn
            </Link>
            <Link href="/lop-hoc" className="hover:text-[#7A1618] transition-colors">
              Lớp học
            </Link>
            <Link href="/cam-am" className="hover:text-[#7A1618] transition-colors">
              Cảm âm
            </Link>
            <Link href="/dang-ky-hoc" className="hover:text-[#7A1618] transition-colors">
              Liên hệ
            </Link>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/dang-ky-hoc"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 bg-[#7A1618] hover:bg-[#600f11] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
            >
              Đăng ký học
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-[#292421] hover:bg-[#EADBCA] transition-colors"
              aria-label="Toggle Menu"
            >
              <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF6EE] border-b border-[#E8DFC8] px-6 py-4 space-y-3 shadow-lg">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#7A1618] font-bold py-1.5"
            >
              <i className="fa-solid fa-house w-6 text-[#7A1618]"></i> Trang chủ
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-full text-left text-[#292421] hover:text-[#7A1618] font-medium py-1.5"
            >
              <i className="fa-solid fa-magnifying-glass w-6 text-[#7A1618]"></i> Tìm kiếm
            </button>
            <Link
              href="/bai-viet"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#292421] hover:text-[#7A1618] font-medium py-1.5"
            >
              <i className="fa-solid fa-newspaper w-6 text-[#7A1618]"></i> Bài viết
            </Link>
            <Link
              href="/huong-dan"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#292421] hover:text-[#7A1618] font-medium py-1.5"
            >
              <i className="fa-solid fa-compass w-6 text-[#7A1618]"></i> Hướng dẫn
            </Link>
            <Link
              href="/lop-hoc"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#292421] hover:text-[#7A1618] font-medium py-1.5"
            >
              <i className="fa-solid fa-graduation-cap w-6 text-[#7A1618]"></i> Lớp học
            </Link>
            <Link
              href="/cam-am"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#292421] hover:text-[#7A1618] font-medium py-1.5"
            >
              <i className="fa-solid fa-music w-6 text-[#7A1618]"></i> Cảm âm
            </Link>
            <Link
              href="/dang-ky-hoc"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#292421] hover:text-[#7A1618] font-medium py-1.5"
            >
              <i className="fa-solid fa-address-book w-6 text-[#7A1618]"></i> Liên hệ
            </Link>
            <div className="pt-2">
              <Link
                href="/dang-ky-hoc"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 bg-[#7A1618] text-white text-center rounded-lg font-semibold text-xs block shadow"
              >
                Đăng ký học ngay
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ================= 3. HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F5EADB]/70 via-[#FAF6EE] to-[#FAF6EE] py-12 sm:py-16 lg:py-20 border-b border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column (Hero Content) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D9A779] bg-[#FAF6EE] shadow-xs">
                <span className="text-[11px] font-bold text-[#7A1618] tracking-widest uppercase">
                  BỘ MÔN TRUYỀN THỐNG
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#7A1618] leading-[1.18] tracking-tight">
                Dạy Thổi Sáo Tại TP.HCM & Online – <br className="hidden sm:inline" />
                <span className="text-[#292421]">Sáo Trúc Âu Cơ</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#5C524A] font-normal leading-relaxed max-w-xl">
                Từ hơi thở đầu tiên đến tiếng sáo giàu cảm xúc.
              </p>

              {/* Action CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#bo-mon"
                  className="px-6 py-3 bg-[#7A1618] hover:bg-[#600f11] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all inline-flex items-center gap-2"
                >
                  <span>Khám phá bộ môn</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </a>
                <Link
                  href="/dang-ky-hoc"
                  className="px-6 py-3 bg-white hover:bg-[#FAF6EE] border border-[#D9CDBB] hover:border-[#7A1618] text-[#292421] hover:text-[#7A1618] text-sm font-semibold rounded-lg shadow-xs transition-all inline-flex items-center gap-2"
                >
                  <i className="fa-regular fa-calendar-check text-[#7A1618]"></i>
                  <span>Đăng ký học</span>
                </Link>
              </div>

            </div>

            {/* Right Column (Hero Visual Artwork & Calligraphy) */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center relative">
              
              <div className="relative w-full max-w-md">
                
                {/* Artist Photo in Artistic Round Frame */}
                <div className="relative aspect-square rounded-full overflow-hidden border-4 border-[#E8DFC8] shadow-xl bg-[#F0E6D2]">
                  <img
                    src="/hero-artist.jpg"
                    alt="Nghệ sĩ sáo trúc - Sáo Trúc Âu Cơ"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                </div>

                {/* Poetic Calligraphy Quote Box */}
                <div className="absolute -top-4 -left-6 sm:-left-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-[#E0D5C3] shadow-lg max-w-[210px] space-y-1">
                  <p className="font-serif italic text-sm text-[#7A1618] font-bold leading-snug">
                    “ Hơi Thở Thành Âm <br />
                    Tâm Hồn Thành Nhạc ”
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-[#6B625B] font-medium">Sáo Trúc Âu Cơ</span>
                    <span className="w-5 h-5 rounded bg-[#881B1B] text-white text-[10px] font-serif flex items-center justify-center shadow-xs">
                      歐
                    </span>
                  </div>
                </div>

                {/* Vertical Cultural Callout Banner */}
                <div className="absolute -bottom-3 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md py-3 px-3.5 rounded-xl border border-[#E0D5C3] shadow-md text-center">
                  <p className="text-xs font-serif text-[#193822] font-bold leading-tight">
                    Âm nhạc dân tộc <br />
                    <span className="text-[#7A1618]">kết nối tâm hồn Việt</span>
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Bottom 4 Feature Pills in a Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-[#E8DFC8]/80">
            
            {/* Feature 1 */}
            <div className="flex items-center gap-3.5 p-3.5 bg-white/80 rounded-2xl border border-[#EADBCA] shadow-xs">
              <div className="w-11 h-11 rounded-full bg-red-50 text-[#7A1618] flex items-center justify-center text-lg shrink-0 border border-red-100">
                <i className="fa-solid fa-compass"></i>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#292421] leading-snug">Phương pháp khoa học</h4>
                <p className="text-[11px] text-[#6B625B]">Dễ hiểu – Dễ áp dụng</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3.5 p-3.5 bg-white/80 rounded-2xl border border-[#EADBCA] shadow-xs">
              <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center text-lg shrink-0 border border-amber-100">
                <i className="fa-solid fa-user-tie"></i>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#292421] leading-snug">Giáo viên chuyên nghiệp</h4>
                <p className="text-[11px] text-[#6B625B]">Giàu kinh nghiệm – Tận tâm</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3.5 p-3.5 bg-white/80 rounded-2xl border border-[#EADBCA] shadow-xs">
              <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#193822] flex items-center justify-center text-lg shrink-0 border border-emerald-100">
                <i className="fa-solid fa-laptop-code"></i>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#292421] leading-snug">Dạy Offline tại TP.HCM</h4>
                <p className="text-[11px] text-[#6B625B]">Online cho học viên ở xa</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-3.5 p-3.5 bg-white/80 rounded-2xl border border-[#EADBCA] shadow-xs">
              <div className="w-11 h-11 rounded-full bg-red-50 text-[#7A1618] flex items-center justify-center text-lg shrink-0 border border-red-100">
                <i className="fa-solid fa-hand-holding-heart"></i>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#292421] leading-snug">Đồng hành – Tận tâm</h4>
                <p className="text-[11px] text-[#6B625B]">Cùng bạn trên hành trình âm nhạc</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= 4. ABOUT STUDIO / CLASSROOM SECTION ================= */}
      <section className="py-14 sm:py-18 bg-white border-b border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Studio Image */}
            <div className="lg:col-span-4 rounded-2xl overflow-hidden shadow-md border border-[#E0D5C3]">
              <img
                src="/studio-classroom.jpg"
                alt="Không gian phòng học Sáo Trúc Âu Cơ Tân Phú"
                className="w-full h-64 sm:h-72 object-cover object-center hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Right: Studio Description and Quote */}
            <div className="lg:col-span-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div className="space-y-4 max-w-xl">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1618] leading-tight">
                  Lớp Dạy Thổi Sáo Tại TP.HCM – Sáo Trúc Âu Cơ
                </h2>
                <p className="text-xs sm:text-sm text-[#59524B] leading-relaxed">
                  Trung tâm Sáo Trúc Âu Cơ dạy thổi sáo trực tiếp tại Tân Phú, TP.HCM, hỗ trợ từ người mới bắt đầu đến trình độ nâng cao. Chúng tôi giảng dạy sáo trúc Việt Nam, Dizi, Recorder, Flute, Tiêu và các loại sáo dân tộc khác, với hình thức học linh hoạt: học tại lớp, học online 1 kèm 1 và gia sư tại nhà.
                </p>
                <div>
                  <Link
                    href="/lop-hoc"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7A1618] hover:bg-[#600f11] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all"
                  >
                    <span>Xem lớp học tại TP.HCM</span>
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </Link>
                </div>
              </div>

              {/* Callout Quote Box */}
              <div className="p-5 bg-[#FAF6EE] rounded-2xl border-l-4 border-[#7A1618] border-y border-r border-[#E0D5C3] max-w-xs shrink-0 shadow-xs">
                <p className="font-serif italic text-xs sm:text-sm text-[#423C36] leading-relaxed">
                  “ Mỗi người đều có thể thổi được những giai điệu đẹp chỉ cần bắt đầu đúng cách. ”
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= 5. CÁC BỘ MÔN GIẢNG DẠY ================= */}
      <section id="bo-mon" className="py-16 sm:py-20 bg-[#FAF6EE] border-b border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-[#E0D5C3]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#7A1618]">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1618]">
                  Các Bộ Môn Giảng Dạy
                </h2>
                <span className="text-amber-700 text-sm hidden sm:inline">―― ❖ ――</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#6B625B] font-medium italic">
              Khám phá thế giới âm thanh dân tộc và hiện đại
            </p>
          </div>

          {/* 6 Instrument Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5">
            {disciplinesList.map((inst) => (
              <Link
                key={inst.id}
                href={inst.href}
                className="group p-4 bg-white rounded-2xl border border-[#E0D5C3] hover:border-[#7A1618] hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-3 text-center">
                  <div className="h-28 rounded-xl bg-[#FAF6EE] overflow-hidden flex items-center justify-center p-2 border border-[#EADBCA] group-hover:bg-red-50/40 transition-colors">
                    <img
                      src={inst.image}
                      alt={inst.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#7A1618] group-hover:text-[#600f11] transition-colors">
                      {inst.title}
                    </h3>
                    <p className="text-[11px] text-[#6B625B] mt-1.5 leading-relaxed line-clamp-3">
                      {inst.subtitle}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-2 border-t border-[#F0E6D2] text-[10px] font-bold text-[#7A1618] flex items-center justify-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Chi tiết</span>
                  <i className="fa-solid fa-chevron-right text-[8px]"></i>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 6. VÌ SAO HỌC VIÊN CHỌN SÁO TRÚC ÂU CƠ ================= */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1618] flex items-center justify-center gap-3">
              <span>Vì Sao Học Viên Chọn Sáo Trúc Âu Cơ?</span>
              <span className="text-amber-700 text-sm hidden sm:inline">―― ❖ ――</span>
            </h2>
          </div>

          {/* 4 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyChooseUsList.map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#FAF6EE] rounded-2xl border border-[#E0D5C3] hover:border-[#7A1618] hover:shadow-md transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-white text-[#7A1618] flex items-center justify-center text-xl shadow-xs border border-[#EADBCA]">
                  <i className={item.icon}></i>
                </div>
                <h3 className="font-serif font-bold text-base text-[#292421]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6B625B] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 7. DỊCH VỤ CỦA CHÚNG TÔI ================= */}
      <section className="py-16 sm:py-20 bg-[#FAF6EE] border-b border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-[#E0D5C3]">
            <div className="flex items-center gap-2 text-[#7A1618]">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1618]">
                Dịch vụ của chúng tôi
              </h2>
              <span className="text-amber-700 text-sm hidden sm:inline">―― ❖ ――</span>
            </div>
            <p className="text-xs sm:text-sm text-[#6B625B] font-medium italic">
              Đa dạng dịch vụ – Đồng hành cùng đam mê âm nhạc của bạn
            </p>
          </div>

          {/* 8 Services Grid (4x2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {servicesList.map((srv, idx) => (
              <Link
                key={idx}
                href={srv.href}
                className="group p-5 bg-white rounded-2xl border border-[#E0D5C3] hover:border-[#7A1618] hover:shadow-md transition-all flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-red-50 text-[#7A1618] flex items-center justify-center text-lg shrink-0 border border-red-100 group-hover:bg-[#7A1618] group-hover:text-white transition-colors">
                  <i className={srv.icon}></i>
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="font-serif font-bold text-sm text-[#292421] group-hover:text-[#7A1618] transition-colors truncate">
                    {srv.title}
                  </h3>
                  <p className="text-[11px] text-[#6B625B] leading-snug">
                    {srv.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 8. LOCATION & PHOTOS OF CLASSROOM ================= */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left 6 Columns: Address, Methods & Mini Map Card */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="space-y-2">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1618]">
                  Học Thổi Sáo Tại Tân Phú, TP.HCM
                </h2>
                <p className="text-xs sm:text-sm text-[#292421] font-semibold flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-[#7A1618]"></i>
                  <span>106/72 Hòa Bình, P. Tân Phú, TP.HCM</span>
                </p>
                <p className="text-xs text-[#6B625B]">
                  Không gian học thân thiện, yên tĩnh, dễ di chuyển, phù hợp cho mọi lứa tuổi.
                </p>
              </div>

              {/* 3 Modality Badges */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-[#FAF6EE] rounded-xl border border-[#E0D5C3]">
                  <i className="fa-solid fa-chalkboard-user text-[#7A1618] text-base mb-1 block"></i>
                  <strong className="text-xs font-bold text-[#292421] block">Học tại lớp</strong>
                  <span className="text-[10px] text-[#6B625B]">Tại trung tâm</span>
                </div>
                <div className="p-3 bg-[#FAF6EE] rounded-xl border border-[#E0D5C3]">
                  <i className="fa-solid fa-video text-[#193822] text-base mb-1 block"></i>
                  <strong className="text-xs font-bold text-[#292421] block">Online 1 kèm 1</strong>
                  <span className="text-[10px] text-[#6B625B]">Linh hoạt thời gian</span>
                </div>
                <div className="p-3 bg-[#FAF6EE] rounded-xl border border-[#E0D5C3]">
                  <i className="fa-solid fa-house-user text-amber-800 text-base mb-1 block"></i>
                  <strong className="text-xs font-bold text-[#292421] block">Gia sư tại nhà</strong>
                  <span className="text-[10px] text-[#6B625B]">Tiện lợi, cá nhân hóa</span>
                </div>
              </div>

              {/* Embedded Interactive Map Card */}
              <div className="rounded-2xl overflow-hidden border border-[#E0D5C3] shadow-sm relative group bg-[#FAF6EE]">
                <img
                  src="/map-tanphu.jpg"
                  alt="Bản đồ chỉ đường đến Sáo Trúc Âu Cơ Tân Phú"
                  className="w-full h-52 object-cover object-center group-hover:scale-102 transition-transform duration-300"
                />
                <div className="p-3.5 bg-white border-t border-[#EADBCA] flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="font-bold text-[#7A1618] block">Sáo Trúc Âu Cơ</span>
                    <span className="text-[11px] text-[#6B625B]">106/72 Hòa Bình, Tân Phú, TP.HCM</span>
                  </div>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=106%2F72+Ho%C3%A0+B%C3%ACnh%2C+T%C3%A2n+Ph%C3%BA%2C+H%E1%BB%93+Ch%C3%AD+Minh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-[#193822] hover:bg-[#112517] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <span>Chỉ đường trên Google Maps</span>
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </a>
                </div>
              </div>

            </div>

            {/* Right 6 Columns: Student & Classroom Photos Carousel */}
            <div className="lg:col-span-6 space-y-4">
              
              <div className="flex items-center justify-between pb-2 border-b border-[#E0D5C3]">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#7A1618]">
                  Hình ảnh lớp học / Học viên
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevPhoto}
                    className="w-8 h-8 rounded-full border border-[#D9CDBB] hover:border-[#7A1618] text-[#292421] hover:text-[#7A1618] flex items-center justify-center transition-colors text-xs"
                    aria-label="Previous photo"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="w-8 h-8 rounded-full border border-[#D9CDBB] hover:border-[#7A1618] text-[#292421] hover:text-[#7A1618] flex items-center justify-center transition-colors text-xs"
                    aria-label="Next photo"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>

              {/* 3 Photos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {studentPhotos.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPhotoCarouselIndex(idx)}
                    className={`rounded-2xl overflow-hidden border transition-all cursor-pointer bg-[#FAF6EE] shadow-xs ${
                      photoCarouselIndex === idx ? "border-[#7A1618] ring-2 ring-[#7A1618]/20" : "border-[#E0D5C3] hover:border-[#7A1618]"
                    }`}
                  >
                    <div className="h-44 sm:h-36 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.caption}
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2.5 text-center bg-white">
                      <p className="text-[11px] font-semibold text-[#292421] line-clamp-2">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= 9. FAQ & SOCIAL CONNECTION SECTION ================= */}
      <section className="py-16 sm:py-20 bg-[#FAF6EE] border-b border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left 6 Columns: FAQs Accordion */}
            <div className="lg:col-span-6 space-y-5">
              
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1618]">
                  Câu hỏi thường gặp
                </h2>
                <p className="text-xs text-[#6B625B]">Giải đáp nhanh các thắc mắc của học viên mới</p>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-[#E0D5C3] overflow-hidden shadow-xs transition-all"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#292421] hover:text-[#7A1618] transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <i
                          className={`fa-solid fa-chevron-down text-xs text-[#7A1618] transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        ></i>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[#59524B] leading-relaxed border-t border-[#F0E6D2]">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right 6 Columns: Social Channels Connection */}
            <div className="lg:col-span-6 space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-1 border-b border-[#E0D5C3]">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1618]">
                  Kết nối với chúng tôi
                </h2>
                <p className="text-xs text-[#6B625B] italic">
                  Cùng lan tỏa tình yêu âm nhạc dân tộc
                </p>
              </div>

              {/* 4 Social Cards (2x2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {socialLinks.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-5 bg-white rounded-2xl border ${item.borderColor} shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${item.bgColor} ${item.textColor} flex items-center justify-center text-xl`}>
                          <i className={item.icon}></i>
                        </div>
                        <h3 className="font-serif font-bold text-base text-[#292421]">
                          {item.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[#6B625B] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-[#FAF6EE] hover:bg-[#7A1618] text-[#292421] hover:text-white border border-[#E0D5C3] hover:border-[#7A1618] rounded-xl text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <span>Theo dõi</span>
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </a>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= 10. MAIN FOOTER ================= */}
      <footer className="bg-[#7A1618] text-white/85 pt-12 pb-8 border-t border-[#600f11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-8 border-b border-white/15">
            
            {/* Logo and Brand */}
            <div className="flex items-center gap-3.5">
              <BrandLogo size={48} radius={999} className="border border-white/30 shadow" />
              <div>
                <span className="block font-serif text-xl font-bold tracking-wide text-white uppercase leading-none">
                  SÁO TRÚC ÂU CƠ
                </span>
                <span className="block text-[10px] text-amber-200/90 font-medium tracking-wider uppercase mt-1">
                  SÁO TRÚC & ÂM NHẠC DÂN TỘC
                </span>
              </div>
            </div>

            {/* Slogan in Calligraphy Style */}
            <div className="text-center">
              <p className="font-serif italic text-base sm:text-lg text-amber-200 tracking-wide">
                Đam mê làm nên giá trị · Chất lượng tạo nên uy tín
              </p>
            </div>

            {/* Footer Nav Links & Socials */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-medium text-white/90">
              <div className="flex items-center gap-3">
                <Link href="/" className="hover:text-amber-300 transition-colors">
                  Trang chủ
                </Link>
                <span>|</span>
                <Link href="/bai-viet" className="hover:text-amber-300 transition-colors">
                  Bài viết
                </Link>
                <span>|</span>
                <Link href="/lop-hoc" className="hover:text-amber-300 transition-colors">
                  Lớp học
                </Link>
                <span>|</span>
                <Link href="/dang-ky-hoc" className="hover:text-amber-300 transition-colors">
                  Liên hệ
                </Link>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-2.5 text-sm ml-2">
                <a
                  href="https://www.youtube.com/@saotrucauco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="YouTube"
                >
                  <i className="fa-brands fa-youtube"></i>
                </a>
                <a
                  href="https://www.facebook.com/saotrucauco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Facebook"
                >
                  <i className="fa-brands fa-facebook"></i>
                </a>
                <a
                  href="https://www.tiktok.com/@saotrucauco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="TikTok"
                >
                  <i className="fa-brands fa-tiktok"></i>
                </a>
                <a
                  href="https://www.instagram.com/saotrucauco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Instagram"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
              </div>

            </div>

          </div>

          {/* Copyright Bottom Bar */}
          <div className="text-center text-xs text-white/60">
            <p>© 2024 Sáo Trúc Âu Cơ. All rights reserved.</p>
          </div>

        </div>
      </footer>

      {/* ================= 11. SEARCH MODAL ================= */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:pt-20">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-[#E0D5C3] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header & Input */}
            <div className="p-4 sm:p-5 border-b border-[#EADBCA] flex items-center gap-3 bg-[#FAF6EE]">
              <i className="fa-solid fa-magnifying-glass text-[#7A1618] text-lg"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm lớp học, loại sáo, giáo trình, cảm âm..."
                className="w-full bg-transparent border-0 outline-none text-sm sm:text-base font-medium text-[#292421] placeholder:text-[#8C827A]"
                autoFocus
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#EADBCA] hover:bg-[#D9CDBB] text-[#292421] flex items-center justify-center transition-colors text-xs cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Results */}
            <div className="p-4 sm:p-6 max-h-96 overflow-y-auto space-y-2">
              <span className="text-[11px] font-bold text-[#6B625B] uppercase tracking-wider block mb-3">
                {searchQuery.trim() ? "Kết quả tìm kiếm" : "Gợi ý phổ biến"}
              </span>

              {filteredSearch.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#6B625B]">
                  Không tìm thấy kết quả phù hợp với "{searchQuery}".
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredSearch.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setSearchModalOpen(false)}
                      className="p-3 bg-[#FAF6EE] hover:bg-red-50/70 rounded-xl border border-[#E0D5C3] hover:border-[#7A1618] transition-all flex items-center justify-between gap-2 group"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-[#292421] group-hover:text-[#7A1618] transition-colors truncate block">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[#6B625B]">
                          {item.cat}
                        </span>
                      </div>
                      <i className="fa-solid fa-arrow-right text-[10px] text-stone-400 group-hover:text-[#7A1618] transition-colors"></i>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-[#FAF6EE] border-t border-[#EADBCA] text-right text-[11px] text-[#6B625B]">
              Nhấn ESC hoặc bấm X để đóng
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
