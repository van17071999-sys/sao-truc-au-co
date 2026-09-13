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
      <section className="relative overflow-hidden bg-[#FAF6EE] border-b border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          
          {/* Main Panoramic Hero Banner with Interactive Hotspots */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-[#E0D5C3] bg-[#FAF6EE]">
            <img
              src="/hero-banner.jpg"
              alt="Dạy Thổi Sáo Tại TP.HCM & Online – Sáo Trúc Âu Cơ"
              className="w-full h-auto block select-none"
            />

            {/* Clickable Overlay Hotspots for Hero Action Buttons */}
            <div className="absolute inset-0 pointer-events-none">
              
              {/* Button: Khám phá bộ môn */}
              <a
                href="#bo-mon"
                title="Khám phá bộ môn"
                className="pointer-events-auto absolute left-[12%] top-[60%] w-[17%] h-[15%] rounded-lg cursor-pointer transition-all hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-[#7A1618]"
                aria-label="Khám phá bộ môn"
              >
                <span className="sr-only">Khám phá bộ môn</span>
              </a>

              {/* Button: Đăng ký học */}
              <Link
                href="/dang-ky-hoc"
                title="Đăng ký học"
                className="pointer-events-auto absolute left-[30.5%] top-[60%] w-[16.5%] h-[15%] rounded-lg cursor-pointer transition-all hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-[#7A1618]"
                aria-label="Đăng ký học"
              >
                <span className="sr-only">Đăng ký học</span>
              </Link>

              {/* Bottom 4 Badges as Clickable Areas */}
              <Link
                href="/huong-dan"
                title="Phương pháp khoa học"
                className="pointer-events-auto absolute left-[8%] bottom-[3%] w-[20%] h-[18%] rounded-xl cursor-pointer hover:bg-black/5"
                aria-label="Phương pháp khoa học"
              >
                <span className="sr-only">Phương pháp khoa học</span>
              </Link>

              <Link
                href="/lop-hoc"
                title="Giáo viên chuyên nghiệp"
                className="pointer-events-auto absolute left-[29.5%] bottom-[3%] w-[20%] h-[18%] rounded-xl cursor-pointer hover:bg-black/5"
                aria-label="Giáo viên chuyên nghiệp"
              >
                <span className="sr-only">Giáo viên chuyên nghiệp</span>
              </Link>

              <Link
                href="/lop-hoc"
                title="Dạy Offline tại TP.HCM"
                className="pointer-events-auto absolute left-[51%] bottom-[3%] w-[20%] h-[18%] rounded-xl cursor-pointer hover:bg-black/5"
                aria-label="Dạy Offline tại TP.HCM"
              >
                <span className="sr-only">Dạy Offline tại TP.HCM</span>
              </Link>

              <Link
                href="/dang-ky-hoc"
                title="Đồng hành – Tận tâm"
                className="pointer-events-auto absolute left-[72.5%] bottom-[3%] w-[20%] h-[18%] rounded-xl cursor-pointer hover:bg-black/5"
                aria-label="Đồng hành – Tận tâm"
              >
                <span className="sr-only">Đồng hành – Tận tâm</span>
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* ================= 4. ABOUT STUDIO / CLASSROOM SECTION ================= */}
      <section className="py-10 sm:py-14 bg-white border-b border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Studio Image */}
            <div className="lg:col-span-4 rounded-2xl overflow-hidden shadow-sm border border-[#E0D5C3]">
              <img
                src="/studio-classroom.jpg"
                alt="Không gian phòng học Sáo Trúc Âu Cơ Tân Phú"
                className="w-full h-56 sm:h-64 object-cover object-center hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Middle: Studio Description & CTA Button */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#7A1618] leading-tight">
                Lớp Dạy Thổi Sáo Tại TP.HCM – Sáo Trúc Âu Cơ
              </h2>
              <p className="text-xs sm:text-sm text-[#4A423F] leading-relaxed">
                Trung tâm Sáo Trúc Âu Cơ dạy thổi sáo trực tiếp tại Tân Phú, TP.HCM, hỗ trợ từ người mới bắt đầu đến trình độ nâng cao. Chúng tôi giảng dạy sáo trúc Việt Nam, Dizi, Recorder, Flute, Tiêu và các loại sáo dân tộc khác, với hình thức học linh hoạt: học tại lớp, học online 1 kèm 1 và gia sư tại nhà.
              </p>
              <div>
                <Link
                  href="/lop-hoc"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7A1618] hover:bg-[#600f11] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs hover:shadow transition-all"
                >
                  <span>Xem lớp học tại TP.HCM</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </Link>
              </div>
            </div>

            {/* Right: Callout Quote Box */}
            <div className="lg:col-span-3 p-5 bg-[#FAF6EE] rounded-2xl border border-[#E0D5C3] shadow-xs text-center space-y-2">
              <p className="font-serif italic text-xs sm:text-sm text-[#5A4D46] leading-relaxed">
                “ Mỗi người đều có thể thổi được những giai điệu đẹp chỉ cần bắt đầu đúng cách. ”
              </p>
              <div className="text-amber-700/60 text-xs">―― ❖ ――</div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= 5. CÁC BỘ MÔN GIẢNG DẠY ================= */}
      <section id="bo-mon" className="py-12 sm:py-16 bg-[#FAF6EE] border-b border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#E0D5C3]">
            <div className="flex items-center gap-2 text-[#7A1618]">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1618]">
                Các Bộ Môn Giảng Dạy
              </h2>
              <span className="text-amber-700 text-sm hidden sm:inline">―― ❖ ――</span>
            </div>
            <p className="text-xs sm:text-sm text-[#8C7B72] italic">
              Khám phá thế giới âm thanh dân tộc và hiện đại
            </p>
          </div>

          {/* 6 Instrument Cards Grid with Diagonal Flute Placement */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {disciplinesList.map((inst) => (
              <Link
                key={inst.id}
                href={inst.href}
                className="group p-3 sm:p-3.5 bg-white rounded-2xl border border-[#E0D5C3] hover:border-[#7A1618] hover:shadow-md transition-all flex flex-col justify-start text-center"
              >
                {/* Diagonal Slanted Flute Image Container */}
                <div className="h-24 sm:h-28 rounded-xl bg-[#FAF6EE] overflow-hidden flex items-center justify-center p-1 border border-[#EADBCA] group-hover:bg-red-50/30 transition-colors">
                  <img
                    src={inst.image}
                    alt={inst.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Title and Subtitle */}
                <div className="mt-3 space-y-1">
                  <h3 className="font-serif font-bold text-xs sm:text-[14px] text-[#7A1618] group-hover:text-[#600f11] transition-colors leading-snug">
                    {inst.title}
                  </h3>
                  <p className="text-[11px] sm:text-[11.5px] text-[#5C524E] leading-relaxed">
                    {inst.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 6. VÌ SAO HỌC VIÊN CHỌN SÁO TRÚC ÂU CƠ ================= */}
      <section className="py-12 sm:py-16 bg-white border-b border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Section Header */}
          <div className="flex items-center gap-2 text-[#7A1618] pb-3 border-b border-[#E0D5C3]">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1618]">
              Vì Sao Học Viên Chọn Sáo Trúc Âu Cơ?
            </h2>
            <span className="text-amber-700 text-sm hidden sm:inline">―― ❖ ――</span>
          </div>

          {/* 4 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {whyChooseUsList.map((item, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 bg-[#FAF6EE] rounded-2xl border border-[#E0D5C3] hover:border-[#7A1618] hover:shadow-xs transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-[#7A1618] flex items-center justify-center text-lg shadow-xs border border-[#EADBCA] shrink-0">
                  <i className={item.icon}></i>
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#7A1618]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5C524E] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 7. DỊCH VỤ CỦA CHÚNG TÔI ================= */}
      <section className="py-12 sm:py-16 bg-[#FAF6EE] border-b border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#E0D5C3]">
            <div className="flex items-center gap-2 text-[#7A1618]">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1618]">
                Dịch vụ của chúng tôi
              </h2>
              <span className="text-amber-700 text-sm hidden sm:inline">―― ❖ ――</span>
            </div>
            <p className="text-xs sm:text-sm text-[#8C7B72] italic">
              Đa dạng dịch vụ – Đồng hành cùng đam mê âm nhạc của bạn
            </p>
          </div>

          {/* 8 Services Grid (4x2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {servicesList.map((srv, idx) => (
              <Link
                key={idx}
                href={srv.href}
                className="group p-4 bg-white rounded-2xl border border-[#E0D5C3] hover:border-[#7A1618] hover:shadow-sm transition-all flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#7A1618] flex items-center justify-center text-base shrink-0 border border-red-100 group-hover:bg-[#7A1618] group-hover:text-white transition-colors">
                  <i className={srv.icon}></i>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="font-serif font-bold text-xs sm:text-[13.5px] text-[#7A1618] group-hover:text-[#600f11] transition-colors truncate">
                    {srv.title}
                  </h3>
                  <p className="text-[11px] text-[#6B605A] leading-tight">
                    {srv.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 8. LOCATION & PHOTOS OF CLASSROOM ================= */}
      <section className="py-12 sm:py-16 bg-white border-b border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 6 Columns: Address, Methods & Mini Map Card */}
            <div className="lg:col-span-6 space-y-5">
              
              <div className="space-y-1.5">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#7A1618]">
                  Học Thổi Sáo Tại Tân Phú, TP.HCM
                </h2>
                <p className="text-xs sm:text-sm text-[#2B2624] font-semibold flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-[#7A1618]"></i>
                  <span>106/72 Hòa Bình, P. Tân Phú, TP.HCM</span>
                </p>
                <p className="text-xs text-[#6B605A]">
                  Không gian học thân thiện, yên tĩnh, dễ di chuyển, phù hợp cho mọi lứa tuổi.
                </p>
              </div>

              {/* 3 Modality Badges */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 bg-[#FAF6EE] rounded-xl border border-[#E0D5C3]">
                  <i className="fa-solid fa-chalkboard-user text-[#7A1618] text-base mb-1 block"></i>
                  <strong className="text-xs font-bold text-[#2B2624] block">Học tại lớp</strong>
                  <span className="text-[10px] text-[#776C66]">Tại trung tâm</span>
                </div>
                <div className="p-2.5 bg-[#FAF6EE] rounded-xl border border-[#E0D5C3]">
                  <i className="fa-solid fa-bullseye text-[#7A1618] text-base mb-1 block"></i>
                  <strong className="text-xs font-bold text-[#2B2624] block">Online 1 kèm 1</strong>
                  <span className="text-[10px] text-[#776C66]">Linh hoạt thời gian</span>
                </div>
                <div className="p-2.5 bg-[#FAF6EE] rounded-xl border border-[#E0D5C3]">
                  <i className="fa-solid fa-house-chimney text-[#7A1618] text-base mb-1 block"></i>
                  <strong className="text-xs font-bold text-[#2B2624] block">Gia sư tại nhà</strong>
                  <span className="text-[10px] text-[#776C66]">Tiện lợi, cá nhân hóa</span>
                </div>
              </div>

              {/* Embedded Interactive Map Card */}
              <div className="rounded-2xl overflow-hidden border border-[#E0D5C3] shadow-xs relative group bg-[#FAF6EE]">
                <img
                  src="/map-tanphu.jpg"
                  alt="Bản đồ chỉ đường đến Sáo Trúc Âu Cơ Tân Phú"
                  className="w-full h-44 sm:h-48 object-cover object-center group-hover:scale-102 transition-transform duration-300"
                />
                <div className="p-3 bg-white border-t border-[#EADBCA] flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="font-bold text-[#7A1618] block">Sáo Trúc Âu Cơ</span>
                    <span className="text-[11px] text-[#6B605A]">106/72 Hòa Bình, Tân Phú, TP.HCM</span>
                  </div>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=106%2F72+Ho%C3%A0+B%C3%ACnh%2C+T%C3%A2n+Ph%C3%BA%2C+H%E1%BB%93+Ch%C3%AD+Minh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-[#223326] hover:bg-[#162219] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
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
                    className="w-7 h-7 rounded-full border border-[#D9CDBB] hover:border-[#7A1618] text-[#292421] hover:text-[#7A1618] flex items-center justify-center transition-colors text-xs"
                    aria-label="Previous photo"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="w-7 h-7 rounded-full border border-[#D9CDBB] hover:border-[#7A1618] text-[#292421] hover:text-[#7A1618] flex items-center justify-center transition-colors text-xs"
                    aria-label="Next photo"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>

              {/* 3 Photos Grid */}
              <div className="grid grid-cols-3 gap-3">
                {studentPhotos.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPhotoCarouselIndex(idx)}
                    className={`rounded-2xl overflow-hidden border transition-all cursor-pointer bg-[#FAF6EE] shadow-xs ${
                      photoCarouselIndex === idx ? "border-[#7A1618] ring-2 ring-[#7A1618]/20" : "border-[#E0D5C3] hover:border-[#7A1618]"
                    }`}
                  >
                    <div className="h-32 sm:h-36 overflow-hidden bg-stone-100">
                      <img
                        src={item.image}
                        alt={item.caption}
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2 text-center bg-white">
                      <p className="text-[10.5px] sm:text-[11px] font-semibold text-[#5C524E] line-clamp-2">
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
      <section className="py-12 sm:py-16 bg-[#FAF6EE] border-b border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 6 Columns: FAQs Accordion */}
            <div className="lg:col-span-6 space-y-4">
              
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1618]">
                  Câu hỏi thường gặp
                </h2>
                <p className="text-xs text-[#8C7B72] italic">Giải đáp nhanh các thắc mắc của học viên mới</p>
              </div>

              <div className="space-y-2.5">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-[#E0D5C3] overflow-hidden shadow-xs transition-all"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-[#2B2624] hover:text-[#7A1618] transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <i
                          className={`fa-solid fa-chevron-down text-xs text-[#7A1618] transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        ></i>
                      </button>
                      {isOpen && (
                        <div className="px-3.5 pb-3.5 pt-1 text-xs sm:text-sm text-[#5C524E] leading-relaxed border-t border-[#F0E6D2]">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right 6 Columns: Social Channels Connection */}
            <div className="lg:col-span-6 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-1 border-b border-[#E0D5C3]">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1618]">
                  Kết nối với chúng tôi
                </h2>
                <p className="text-xs text-[#8C7B72] italic">
                  Cùng lan tỏa tình yêu âm nhạc dân tộc
                </p>
              </div>

              {/* 4 Social Cards (2x2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {socialLinks.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 bg-white rounded-2xl border ${item.borderColor} shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-2.5`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl ${item.bgColor} ${item.textColor} flex items-center justify-center text-lg`}>
                          <i className={item.icon}></i>
                        </div>
                        <h3 className="font-serif font-bold text-sm sm:text-base text-[#1A1A1A]">
                          {item.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[#5C524E] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-white hover:bg-[#7A1618] text-[#7A1618] hover:text-white border border-[#7A1618] rounded-xl text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5"
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
