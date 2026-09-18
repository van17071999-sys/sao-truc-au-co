"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

const defaultHomeIntro = {
  id: "home-intro-01",
  collection: "home-intro",
  title: "Lớp Dạy Thổi Sáo Tại TP.HCM – Sáo Trúc Âu Cơ",
  excerpt: "Trung tâm Sáo Trúc Âu Cơ dạy thổi sáo trực tiếp tại Tân Phú, TP.HCM, hỗ trợ từ người mới bắt đầu đến trình độ nâng cao. Chúng tôi giảng dạy sáo trúc Việt Nam, Dizi, Recorder, Flute, Tiêu và các loại sáo dân tộc khác, với hình thức học linh hoạt: học tại lớp, học online 1 kèm 1 và gia sư tại nhà.",
  imageUrl: "/intro-portrait.jpg",
  price: "Giới thiệu nhà sáng lập",
  content: "/gioi-thieu-admin",
  tag: "Mỗi người đều có thể thổi được những giai điệu đẹp chỉ cần bắt đầu đúng cách.",
  visible: true,
};

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
    title: "Lớp Học Các Bộ Môn",
    desc: "Học Trực Tiếp & Online",
    href: "/lop-hoc",
  },
  {
    icon: "fa-solid fa-calendar-check",
    title: "Đăng Ký Lớp Học",
    desc: "Tư Vấn & Xếp Lớp Nhanh",
    href: "/dang-ky-hoc",
  },
  {
    icon: "fa-solid fa-wand-magic-sparkles",
    title: "Sáo & Phụ Kiện",
    desc: "Sáo Chất Lượng, Phụ Kiện Chính Hãng",
    href: "/sao-va-phu-kien",
  },
  {
    icon: "fa-solid fa-circle-play",
    title: "Khóa Học Quay Sẵn",
    desc: "Học Mọi Lúc, Mọi Nơi",
    href: "/khoa-hoc-quay-san",
  },
  {
    icon: "fa-solid fa-book-open",
    title: "Giáo Trình & Sheet",
    desc: "Tài Liệu Bài Bản, Dễ Hiểu",
    href: "/giao-trinh-va-sheet",
  },
  {
    icon: "fa-solid fa-microphone-lines",
    title: "Thu Âm & Quay MV",
    desc: "Ghi Lại Hành Trình Âm Nhạc",
    href: "/thu-am-va-quay-video",
  },
  {
    icon: "fa-solid fa-people-group",
    title: "Booking Nghệ Sĩ",
    desc: "Biểu Diễn, Sự Kiện, Giao Lưu",
    href: "/booking-nghe-si",
  },
  {
    icon: "fa-solid fa-sliders",
    title: "Thu Âm Nhạc Cụ Thật",
    desc: "Âm Thanh Mộc Mạc, Chân Thực",
    href: "/thu-am-nhac-cu-that",
  },
];

const defaultClassroomPhotos = [
  {
    id: "photo-class-01",
    image: "/class-lesson.jpg",
    caption: "Giờ học kèm sáo trúc trực tiếp tại trung tâm",
    title: "Lớp học sáo trúc kèm 1:1 tại TP.HCM",
    href: "/lop-hoc",
  },
  {
    id: "photo-class-02",
    image: "/class-group.jpg",
    caption: "Học viên các bộ môn sáo tại Sáo Trúc Âu Cơ",
    title: "Học viên lớp sáo trúc và nhạc cụ dân tộc",
    href: "/lop-hoc",
  },
  {
    id: "photo-class-03",
    image: "/class-student.jpg",
    caption: "Học viên tự tin biểu diễn sáo sau khóa học",
    title: "Học viên tiến bộ nhanh sau khóa học sáo trúc",
    href: "/lop-hoc",
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
      "Lớp học trực tiếp tọa lạc tại địa chỉ: 106/72 Hòa Bình, Tân Phú, Hồ Chí Minh, Việt Nam. Không gian học yên tĩnh, đầy đủ nhạc cụ chuẩn âm, giá để bài và môi trường truyền cảm hứng.",
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
    borderColor: "border-[#E0D5C3]",
    desc: "Video hướng dẫn, biểu diễn và chia sẻ kiến thức.",
    href: "https://www.youtube.com/@saotrucauco",
  },
  {
    name: "Facebook",
    icon: "fa-brands fa-facebook",
    color: "#1877F2",
    bgColor: "bg-blue-50",
    textColor: "text-[#1877F2]",
    borderColor: "border-[#E0D5C3]",
    desc: "Cập nhật tin tức, lớp học và hoạt động mới nhất.",
    href: "https://www.facebook.com/saotrucauco",
  },
  {
    name: "TikTok",
    icon: "fa-brands fa-tiktok",
    color: "#000000",
    bgColor: "bg-stone-100",
    textColor: "text-stone-900",
    borderColor: "border-[#E0D5C3]",
    desc: "Những giai điệu ngắn đầy cảm hứng.",
    href: "https://www.tiktok.com/@saotrucauco",
  },
  {
    name: "Instagram",
    icon: "fa-brands fa-instagram",
    color: "#E4405F",
    bgColor: "bg-pink-50",
    textColor: "text-[#E4405F]",
    borderColor: "border-[#E0D5C3]",
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
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [classroomPhotos, setClassroomPhotos] = useState(defaultClassroomPhotos);
  const [photoSlideIndex, setPhotoSlideIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<null | { image: string; caption: string; title: string; href?: string }>(null);
  const [disciplines, setDisciplines] = useState(disciplinesList);
  const [homeIntro, setHomeIntro] = useState(defaultHomeIntro);
  const [mapConfig, setMapConfig] = useState({
    title: "Lớp Sáo Trúc Âu Cơ",
    address: "106/72 Hòa Bình, Tân Phú, Hồ Chí Minh, Việt Nam",
    desc: "Không gian học thân thiện, yên tĩnh, dễ di chuyển, phù hợp cho mọi lứa tuổi.",
    imageUrl: "/map-tanphu.jpg",
    mapUrl: "https://maps.app.goo.gl/LEoydb9aZkdu2M6J6",
    directionsUrl: "https://maps.app.goo.gl/LEoydb9aZkdu2M6J6",
    buttonText: "Chỉ đường trên Google Maps",
  });

  useEffect(() => {
    let active = true;
    fetch("/api/cms/content")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("cms_unavailable"))))
      .then((data: { entries?: Array<{ collection: string; id: string; slug: string; title: string; excerpt: string; imageUrl: string; price?: string; tag?: string; content: string; visible: boolean; sortOrder: number }> }) => {
        if (!active) return;
        const cmsItems = (data.entries || [])
          .filter((e) => e.collection === "home-disciplines" && e.visible !== false)
          .sort((a, b) => a.sortOrder - b.sortOrder);
        if (cmsItems.length > 0) {
          setDisciplines(
            cmsItems.map((e) => ({
              id: e.slug || e.id,
              title: e.title,
              subtitle: e.excerpt,
              image: e.imageUrl || "/inst-saotruc.jpg",
              href: e.content || `/bo-mon/${e.slug}`,
            }))
          );
        }
        const intro = (data.entries || []).find((e) => e.collection === "home-intro");
        if (intro) {
          setHomeIntro({
            id: intro.id,
            collection: "home-intro",
            title: intro.title || defaultHomeIntro.title,
            excerpt: intro.excerpt || defaultHomeIntro.excerpt,
            imageUrl: intro.imageUrl || defaultHomeIntro.imageUrl,
            price: intro.price || defaultHomeIntro.price,
            content: intro.content || defaultHomeIntro.content,
            tag: intro.tag || defaultHomeIntro.tag,
            visible: intro.visible !== false,
          });
        }
        const mapEntry = (data.entries || []).find((e) => e.collection === "home-map" || (e.collection === "settings" && e.slug === "map"));
        if (mapEntry) {
          const rawAddress = mapEntry.content?.trim() || "106/72 Hòa Bình, Tân Phú, Hồ Chí Minh, Việt Nam";
          const customUrl = mapEntry.tag?.trim();
          const isOldSearchUrl = !customUrl || customUrl.includes("google.com/maps/search") || customUrl.includes("google.com/maps/dir");
          const targetUrl = isOldSearchUrl ? "https://maps.app.goo.gl/LEoydb9aZkdu2M6J6" : customUrl;
          setMapConfig({
            title: mapEntry.title || "Lớp Sáo Trúc Âu Cơ",
            address: rawAddress,
            desc: mapEntry.excerpt || "Không gian học thân thiện, yên tĩnh, dễ di chuyển, phù hợp cho mọi lứa tuổi.",
            imageUrl: mapEntry.imageUrl || "/map-tanphu.jpg",
            mapUrl: targetUrl,
            directionsUrl: targetUrl,
            buttonText: mapEntry.price || "Chỉ đường trên Google Maps",
          });
        }
        const cmsPhotos = (data.entries || [])
          .filter((e) => e.collection === "classroom-photos" && e.visible !== false)
          .sort((a, b) => a.sortOrder - b.sortOrder);
        if (cmsPhotos.length > 0) {
          setClassroomPhotos(
            cmsPhotos.map((p) => ({
              id: p.id || p.slug,
              image: p.imageUrl || "/class-lesson.jpg",
              caption: p.excerpt || p.title,
              title: p.title,
              href: p.content || "",
            }))
          );
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

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
    if (classroomPhotos.length <= 1) return;
    setPhotoSlideIndex((prev) => (prev + 1) % classroomPhotos.length);
  };

  const prevPhoto = () => {
    if (classroomPhotos.length <= 1) return;
    setPhotoSlideIndex((prev) => (prev - 1 + classroomPhotos.length) % classroomPhotos.length);
  };

  const displayedPhotos = useMemo(() => {
    if (classroomPhotos.length <= 3) return classroomPhotos;
    const list = [];
    for (let i = 0; i < 3; i++) {
      list.push(classroomPhotos[(photoSlideIndex + i) % classroomPhotos.length]);
    }
    return list;
  }, [classroomPhotos, photoSlideIndex]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2825] font-sans antialiased selection:bg-[#70141D] selection:text-white">
      
      {/* ================= 1. TOP UTILITY BAR ================= */}
      <div className="bg-[#70141D] text-white text-[12px] py-2 px-4 sm:px-6 lg:px-8 border-b border-[#5a0e16]">
        <div className="w-full max-w-[1560px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-white text-xs"></i>
            <a
              href={mapConfig.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline transition-all"
              title="Xem trên Google Maps"
            >
              {mapConfig.address}
            </a>
          </div>
          <div className="flex items-center gap-4 font-normal">
            <a
              href="tel:0374261368"
              className="hover:underline transition-all flex items-center gap-1.5"
            >
              <i className="fa-solid fa-phone text-white text-xs"></i>
              <span>Hotline / Zalo: 0374 261 368</span>
            </a>
          </div>
        </div>
      </div>

      {/* ================= 2. MAIN HEADER NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EADBCA] shadow-2xs">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3.5 group shrink-0">
            <BrandLogo size={46} radius={999} className="border border-[#70141D]/30 shadow-2xs group-hover:scale-105 transition-transform" />
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-wide text-[#70141D] uppercase leading-none">
                SÁO TRÚC ÂU CƠ
              </span>
              <span className="block text-[10px] sm:text-xs text-[#70141D] font-medium tracking-wider uppercase mt-1">
                SÁO TRÚC & ÂM NHẠC DÂN TỘC
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-[14.5px] font-medium text-[#2D2825]">
            <Link
              href="/"
              className="text-[#70141D] font-bold border-b-2 border-[#70141D] pb-1"
            >
              Trang chủ
            </Link>
            <button
              onClick={() => setSearchModalOpen(true)}
              className="hover:text-[#70141D] transition-colors cursor-pointer border-b-2 border-transparent pb-1"
            >
              Tìm kiếm
            </button>
            <Link href="/bai-viet" className="hover:text-[#70141D] transition-colors border-b-2 border-transparent pb-1">
              Bài viết
            </Link>
            <Link href="/huong-dan" className="hover:text-[#70141D] transition-colors border-b-2 border-transparent pb-1">
              Hướng dẫn
            </Link>
            <Link href="/lop-hoc" className="hover:text-[#70141D] transition-colors border-b-2 border-transparent pb-1">
              Lớp học
            </Link>
            <Link href="/cam-am" className="hover:text-[#70141D] transition-colors border-b-2 border-transparent pb-1">
              Cảm âm
            </Link>
            <Link href="/dang-ky-hoc" className="hover:text-[#70141D] transition-colors border-b-2 border-transparent pb-1">
              Liên hệ
            </Link>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/dang-ky-hoc"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 bg-[#70141D] hover:bg-[#5a0e16] text-white text-xs sm:text-sm font-semibold rounded-md shadow-2xs hover:shadow transition-all"
            >
              Đăng ký học
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-[#2D2825] hover:bg-[#EADBCA] transition-colors"
              aria-label="Toggle Menu"
            >
              <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7F2] border-b border-[#EADBCA] px-6 py-4 space-y-3 shadow-lg">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#70141D] font-bold py-1.5"
            >
              <i className="fa-solid fa-house w-6 text-[#70141D]"></i> Trang chủ
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-full text-left text-[#2D2825] hover:text-[#70141D] font-medium py-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-magnifying-glass w-6 text-[#70141D]"></i> Tìm kiếm
            </button>
            <Link
              href="/bai-viet"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#2D2825] hover:text-[#70141D] font-medium py-1.5"
            >
              <i className="fa-solid fa-newspaper w-6 text-[#70141D]"></i> Bài viết
            </Link>
            <Link
              href="/huong-dan"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#2D2825] hover:text-[#70141D] font-medium py-1.5"
            >
              <i className="fa-solid fa-compass w-6 text-[#70141D]"></i> Hướng dẫn
            </Link>
            <Link
              href="/lop-hoc"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#2D2825] hover:text-[#70141D] font-medium py-1.5"
            >
              <i className="fa-solid fa-graduation-cap w-6 text-[#70141D]"></i> Lớp học
            </Link>
            <Link
              href="/cam-am"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#2D2825] hover:text-[#70141D] font-medium py-1.5"
            >
              <i className="fa-solid fa-music w-6 text-[#70141D]"></i> Cảm âm
            </Link>
            <Link
              href="/dang-ky-hoc"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#2D2825] hover:text-[#70141D] font-medium py-1.5"
            >
              <i className="fa-solid fa-address-book w-6 text-[#70141D]"></i> Liên hệ
            </Link>
            <div className="pt-2">
              <Link
                href="/dang-ky-hoc"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 bg-[#70141D] text-white text-center rounded-md font-semibold text-xs block shadow"
              >
                Đăng ký học ngay
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ================= 3. HERO SECTION (LOCKED SVG PIXEL ACCURACY) ================= */}
      <section className="relative overflow-hidden bg-[#FAF7F2] border-b border-[#EADBCA]">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          
          {/* Master Responsive Container with Exact Aspect Ratio (2048 / 676) */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-[#E0D5C3] bg-[#FAF7F2]">
            <svg
              viewBox="0 0 2048 676"
              className="w-full h-auto block select-none"
              style={{ aspectRatio: "2048 / 676" }}
            >
              {/* Authentic High-Res Banner Artwork with User Portrait & Master Typography */}
              <image href="/hero-banner.jpg" width="2048" height="676" preserveAspectRatio="none" />

              {/* Exact Locked Hotspot: Button 1 'Khám phá bộ môn' */}
              <a href="#bo-mon" aria-label="Khám phá bộ môn">
                <rect
                  x="236"
                  y="334"
                  width="285"
                  height="64"
                  rx="10"
                  fill="transparent"
                  cursor="pointer"
                  className="hover:opacity-15 hover:fill-white transition-opacity"
                >
                  <title>Khám phá bộ môn</title>
                </rect>
              </a>

              {/* Exact Locked Hotspot: Button 2 'Đăng ký học' */}
              <a href="/dang-ky-hoc" aria-label="Đăng ký học">
                <rect
                  x="541"
                  y="334"
                  width="245"
                  height="64"
                  rx="10"
                  fill="transparent"
                  cursor="pointer"
                  className="hover:opacity-15 hover:fill-black transition-opacity"
                >
                  <title>Đăng ký học</title>
                </rect>
              </a>
            </svg>
          </div>

        </div>
      </section>

      {/* ================= 4. ABOUT STUDIO / CLASSROOM SECTION ================= */}
      {homeIntro.visible && (
        <section id="gioi-thieu" className="py-10 sm:py-14 bg-transparent border-b border-[#EADBCA]">
          <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left: Callout Quote Box */}
              <div className="order-3 lg:order-1 lg:col-span-3 p-5 bg-transparent text-center space-y-3">
                <p className="font-serif italic text-xs sm:text-[13.5px] text-[#5A4D46] leading-relaxed">
                  “ {homeIntro.tag || "Mỗi người đều có thể thổi được những giai điệu đẹp chỉ cần bắt đầu đúng cách."} ”
                </p>
                <div className="text-amber-700/60 text-xs">―― ❖ ――</div>
              </div>

              {/* Middle: Studio Description & CTA Button */}
              <div className="order-2 lg:order-2 lg:col-span-5 space-y-4">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#70141D] leading-tight">
                  {homeIntro.title}
                </h1>
                <p className="text-xs sm:text-[13.5px] text-[#4A423F] leading-relaxed whitespace-pre-line">
                  {homeIntro.excerpt}
                </p>
                <div>
                  <Link
                    href={(!homeIntro.content || homeIntro.content === "/lop-hoc") ? "/gioi-thieu-admin" : homeIntro.content}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#70141D] hover:bg-[#5a0e16] text-white text-xs sm:text-sm font-semibold rounded-md shadow-2xs hover:shadow transition-all"
                  >
                    <span>{(!homeIntro.price || homeIntro.price === "Xem lớp học tại TP.HCM") ? "Giới thiệu nhà sáng lập" : homeIntro.price}</span>
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </Link>
                </div>
              </div>

              {/* Right: Teacher Portrait / Studio Image */}
              <div className="order-1 lg:order-3 lg:col-span-4 rounded-xl overflow-hidden shadow-2xs border border-[#E0D5C3] bg-[#FAF7F2]">
                <img
                  src={homeIntro.imageUrl || "/intro-portrait.jpg"}
                  alt={homeIntro.title}
                  className="w-full h-56 sm:h-64 object-cover object-center hover:scale-103 transition-transform duration-500"
                />
              </div>

            </div>

          </div>
        </section>
      )}

      {/* ================= 5. CÁC BỘ MÔN GIẢNG DẠY ================= */}
      <section id="bo-mon" className="py-12 sm:py-16 bg-transparent border-b border-[#EADBCA]">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#E0D5C3]">
            <div className="flex items-center gap-2 text-[#70141D]">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#70141D]">
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
            {disciplines.map((inst) => (
              <Link
                key={inst.id}
                href={inst.href}
                className="group p-3 sm:p-3.5 bg-white rounded-xl border border-[#ECE5DC] hover:border-[#70141D] hover:shadow-md transition-all flex flex-col justify-start text-center"
              >
                {/* Diagonal Slanted Flute Image Container */}
                <div className="h-24 sm:h-28 rounded-lg bg-[#FAF7F2] overflow-hidden flex items-center justify-center p-1 border border-[#EADBCA] group-hover:bg-red-50/20 transition-colors">
                  <img
                    src={inst.image}
                    alt={inst.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Title and Subtitle */}
                <div className="mt-3 space-y-1">
                  <h3 className="font-serif font-bold text-xs sm:text-[14px] text-[#70141D] group-hover:text-[#5a0e16] transition-colors leading-snug">
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
      <section className="py-12 sm:py-16 bg-transparent border-b border-[#EADBCA]">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Section Header */}
          <div className="flex items-center gap-2 text-[#70141D] pb-3 border-b border-[#E0D5C3]">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#70141D]">
              Vì Sao Học Viên Chọn Sáo Trúc Âu Cơ?
            </h2>
            <span className="text-amber-700 text-sm hidden sm:inline">―― ❖ ――</span>
          </div>

          {/* 4 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {whyChooseUsList.map((item, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 bg-white rounded-xl border border-[#ECE5DC] hover:border-[#70141D] hover:shadow-2xs transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-red-50 text-[#70141D] flex items-center justify-center text-lg shadow-2xs border border-red-100 shrink-0">
                  <i className={item.icon}></i>
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#70141D]">
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
      <section className="py-12 sm:py-16 bg-transparent border-b border-[#EADBCA]">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#E0D5C3]">
            <div className="flex items-center gap-2 text-[#70141D]">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#70141D]">
                Dịch vụ của chúng tôi
              </h2>
              <span className="text-amber-700 text-sm hidden sm:inline">―― ❖ ――</span>
            </div>
            <p className="text-xs sm:text-sm text-[#8C7B72] italic">
              Đa dạng dịch vụ – Đồng hành cùng đam mê âm nhạc của bạn
            </p>
          </div>

          {/* 8 Services Grid (4x2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5">
            {servicesList.map((srv, idx) => (
              <Link
                key={idx}
                href={srv.href}
                className="group p-4 sm:p-5 bg-white rounded-2xl border border-[#E2D8CC] hover:border-[#70141D] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-red-50/90 text-[#70141D] flex items-center justify-center text-xl shrink-0 border border-red-100 group-hover:bg-[#70141D] group-hover:text-white group-hover:scale-105 transition-all duration-200 shadow-2xs">
                  <i className={srv.icon}></i>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif font-bold text-base sm:text-[17px] text-[#70141D] group-hover:text-[#8C1B26] transition-colors leading-snug line-clamp-1">
                    {srv.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#6B605A] leading-relaxed font-medium mt-1 line-clamp-1">
                    {srv.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 8. LOCATION & PHOTOS OF CLASSROOM (3-COLUMN DESKTOP ROW) ================= */}
      <section className="py-12 sm:py-16 bg-transparent border-b border-[#EADBCA]">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
            
            {/* Column 1 (Left 4 cols): Address Info & 3 Modality Badges */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#70141D]">
                  Học Thổi Sáo Tại Tân Phú, TP.HCM
                </h2>
                <p className="text-xs sm:text-sm text-[#2B2624] font-semibold flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-[#70141D]"></i>
                  <span>{mapConfig.address}</span>
                </p>
                <p className="text-xs text-[#6B605A] leading-relaxed">
                  {mapConfig.desc}
                </p>
              </div>

              {/* 3 Modality Badges */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-3 bg-white rounded-xl border border-[#ECE5DC] flex flex-col items-center justify-center">
                  <i className="fa-solid fa-chalkboard-user text-[#70141D] text-lg mb-1.5 block"></i>
                  <strong className="text-xs font-bold text-[#2B2624] block">Học tại lớp</strong>
                  <span className="text-[10px] text-[#776C66] mt-0.5">Tại trung tâm</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#ECE5DC] flex flex-col items-center justify-center">
                  <i className="fa-solid fa-bullseye text-[#70141D] text-lg mb-1.5 block"></i>
                  <strong className="text-xs font-bold text-[#2B2624] block">Online 1 kèm 1</strong>
                  <span className="text-[10px] text-[#776C66] mt-0.5">Linh hoạt thời gian</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#ECE5DC] flex flex-col items-center justify-center">
                  <i className="fa-solid fa-house-chimney text-[#70141D] text-lg mb-1.5 block"></i>
                  <strong className="text-xs font-bold text-[#2B2624] block">Gia sư tại nhà</strong>
                  <span className="text-[10px] text-[#776C66] mt-0.5">Tiện lợi, cá nhân hóa</span>
                </div>
              </div>
            </div>

            {/* Column 2 (Center 4 cols): Embedded Map Card */}
            <div id="ban-do" className="lg:col-span-4 flex flex-col">
              <div className="rounded-xl overflow-hidden border border-[#ECE5DC] shadow-2xs relative group bg-white h-full flex flex-col justify-between">
                {/* Map Area */}
                <div className="relative h-44 sm:h-48 overflow-hidden bg-stone-100 grow">
                  {/* Clickable Map Background */}
                  <a
                    href={mapConfig.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full cursor-pointer"
                    title="Bấm vào bản đồ để chuyển sang Google Maps"
                  >
                    <picture>
                      <source srcSet="/map-tanphu.webp" type="image/webp" />
                      <img
                        src={mapConfig.imageUrl}
                        alt={`Bản đồ chỉ đường đến ${mapConfig.title}`}
                        className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
                      />
                    </picture>
                  </a>

                  {/* Clickable Pill: Sáo Trúc Âu Cơ -> Mở trực tiếp Google Maps */}
                  <a
                    href={mapConfig.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-md hover:shadow-xl border border-[#EADBCA] hover:border-[#70141D]/50 text-xs sm:text-[13px] font-bold text-[#70141D] flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer z-10 select-none group/pin"
                    title={`Bấm vào chữ ${mapConfig.title} để mở Google Maps`}
                  >
                    <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <i className="fa-solid fa-location-dot text-red-600 text-xs relative"></i>
                    </span>
                    <span className="tracking-tight hover:underline">{mapConfig.title}</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-[#70141D]/70 group-hover/pin:text-[#70141D] group-hover/pin:translate-x-0.5 transition-all"></i>
                  </a>
                </div>

                <div className="p-3 bg-white border-t border-[#EADBCA] flex items-center justify-between gap-2 shrink-0">
                  <a
                    href={mapConfig.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs min-w-0 group/info cursor-pointer block"
                    title="Bấm để xem trên Google Maps"
                  >
                    <span className="font-bold text-[#70141D] block truncate group-hover/info:underline">{mapConfig.title}</span>
                    <span className="text-[10.5px] text-[#6B605A] block truncate" title={mapConfig.address}>
                      {mapConfig.address}
                    </span>
                  </a>
                  <a
                    href={mapConfig.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-[#70141D] hover:bg-[#580f16] active:bg-[#43090f] text-white text-[11px] font-semibold rounded-md transition-all duration-200 flex items-center gap-1.5 shrink-0 shadow-xs hover:shadow hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    title="Chuyển qua Google Maps chỉ đường"
                  >
                    <span>{mapConfig.buttonText}</span>
                    <i className="fa-solid fa-arrow-right text-[9px]"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 3 (Right 4 cols): Student & Classroom Photos (Dynamic list with counter & preview) */}
            <div id="hinh-anh-lop-hoc" className="lg:col-span-4 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#E0D5C3]">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#70141D]">
                    Hình ảnh lớp học / Học viên
                  </h2>
                  {classroomPhotos.length > 3 && (
                    <span className="text-[10.5px] font-medium text-[#70141D] bg-[#70141D]/10 px-1.5 py-0.5 rounded border border-[#70141D]/20">
                      {photoSlideIndex + 1}/{classroomPhotos.length}
                    </span>
                  )}
                </div>
                {classroomPhotos.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={prevPhoto}
                      className="w-6 h-6 rounded-full border border-[#D9CDBB] hover:border-[#70141D] text-[#2D2825] hover:text-[#70141D] flex items-center justify-center transition-colors text-[10px] cursor-pointer"
                      aria-label="Previous photo"
                      title="Ảnh trước"
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="w-6 h-6 rounded-full border border-[#D9CDBB] hover:border-[#70141D] text-[#2D2825] hover:text-[#70141D] flex items-center justify-center transition-colors text-[10px] cursor-pointer"
                      aria-label="Next photo"
                      title="Ảnh tiếp theo"
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </div>

              {/* Photos Grid Row */}
              <div className="grid grid-cols-3 gap-2.5">
                {displayedPhotos.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    onClick={() => setSelectedPhoto(item)}
                    className="group rounded-xl overflow-hidden border border-[#ECE5DC] hover:border-[#70141D] transition-all cursor-pointer bg-white shadow-2xs hover:shadow-md flex flex-col"
                  >
                    <div className="h-32 sm:h-36 overflow-hidden bg-stone-100 relative">
                      <img
                        src={item.image}
                        alt={item.caption}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                          <i className="fa-solid fa-magnifying-glass-plus text-[9px]"></i>
                          <span>Xem</span>
                        </span>
                      </div>
                    </div>
                    <div className="p-1.5 text-center bg-white min-h-[42px] flex items-center justify-center grow">
                      <p className="text-[10px] font-semibold text-[#5C524E] group-hover:text-[#70141D] line-clamp-2 leading-tight transition-colors">
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
      <section className="py-12 sm:py-16 bg-transparent border-b border-[#EADBCA]">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left 5 Columns: FAQs Accordion */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#70141D]">
                  Câu hỏi thường gặp
                </h2>
                <p className="text-xs text-[#8C7B72] italic">Giải đáp nhanh các thắc mắc của học viên mới</p>
              </div>

              <div className="space-y-2">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-lg border border-[#ECE5DC] overflow-hidden shadow-2xs transition-all"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-[13px] font-semibold text-[#2B2624] hover:text-[#70141D] transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <i
                          className={`fa-solid fa-chevron-down text-xs text-[#70141D] transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        ></i>
                      </button>
                      {isOpen && (
                        <div className="px-3.5 pb-3.5 pt-1 text-xs sm:text-[12.5px] text-[#5C524E] leading-relaxed border-t border-[#F0E6D2]">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right 7 Columns: Social Channels Connection (Single Horizontal 4-Card Row) */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-1 border-b border-[#E0D5C3]">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#70141D]">
                  Kết nối với chúng tôi
                </h2>
                <p className="text-xs text-[#8C7B72] italic">
                  Cùng lan tỏa tình yêu âm nhạc dân tộc
                </p>
              </div>

              {/* 4 Social Cards in a single row */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {socialLinks.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 bg-white rounded-xl border ${item.borderColor} shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3`}
                  >
                    <div className="space-y-2">
                      <div className="flex flex-col items-center text-center gap-1.5">
                        <div className={`w-10 h-10 rounded-lg ${item.bgColor} ${item.textColor} flex items-center justify-center text-xl`}>
                          <i className={item.icon}></i>
                        </div>
                        <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">
                          {item.name}
                        </h3>
                      </div>
                      <p className="text-[11px] text-[#5C524E] text-center leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 bg-white hover:bg-[#70141D] text-[#70141D] hover:text-white border border-[#70141D] rounded-md text-[11px] font-semibold transition-all text-center flex items-center justify-center gap-1"
                    >
                      <span>Theo dõi</span>
                      <i className="fa-solid fa-arrow-right text-[9px]"></i>
                    </a>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= 10. MAIN FOOTER ================= */}
      <footer className="site-main-footer w-full bg-[#FAF7F2] text-[#4A3834] border-t border-[#EADBCA]">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Main Content Grid: 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-[#EADBCA]">
            
            {/* Column 1: Brand & Introduction (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="flex items-center gap-3.5">
                <BrandLogo size={50} radius={999} className="border-2 border-[#C29B38]/50 shadow-xs" />
                <div>
                  <span className="block font-serif text-xl sm:text-2xl font-bold tracking-wide text-[#70141D] uppercase leading-tight">
                    SÁO TRÚC ÂU CƠ
                  </span>
                  <span className="block text-xs text-[#A87932] font-semibold tracking-wider uppercase mt-1">
                    Sáo Trúc & Âm Nhạc Dân Tộc
                  </span>
                </div>
              </div>

              <p className="font-serif italic text-base text-[#70141D] font-medium leading-relaxed">
                “ Đam mê làm nên giá trị · Chất lượng tạo nên uy tín ”
              </p>

              <p className="text-sm text-[#6B5751] leading-relaxed">
                Không gian học tập và thực hành nhạc cụ dân tộc truyền thống uy tín tại TP.HCM. Đào tạo từ căn bản đến nâng cao cho mọi lứa tuổi, dạy trực tiếp và online.
              </p>

              {/* Tra cứu điểm danh học viên */}
              <div className="pt-2">
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E0D5C3] shadow-xs space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#70141D]/10 text-[#70141D] flex items-center justify-center text-sm font-bold border border-[#70141D]/20 shrink-0">
                      🎓
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#70141D] uppercase tracking-wide leading-tight">
                        Tra Cứu Điểm Danh Học Viên
                      </h4>
                      <p className="text-[11px] text-[#8C6E66] mt-0.5">
                        Xem lịch sử buổi học, học phí & hóa đơn điện tử
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const input = (form.elements.namedItem("studentLookup") as HTMLInputElement)?.value.trim();
                      if (!input) return;
                      router.push(`/diem-danh?search=${encodeURIComponent(input)}`);
                    }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          name="studentLookup"
                          required
                          placeholder="Nhập SĐT hoặc Mã học viên..."
                          className="w-full pl-8 pr-3 py-2 bg-[#FAF7F2] border border-[#E0D5C3] rounded-xl text-xs text-[#4A3834] placeholder:text-[#A89890] focus:outline-none focus:ring-2 focus:ring-[#70141D] font-medium"
                        />
                        <span className="absolute left-2.5 top-2 text-[#A89890] text-xs">🔍</span>
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#70141D] hover:bg-[#8e1d28] text-white text-xs font-bold rounded-xl transition-colors shadow-xs shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        <span>Tra cứu</span>
                        <span>→</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-[#8C6E66] italic">
                      * Nhập đúng số điện thoại đã đăng ký hoặc mã HV để tra cứu nhanh.
                    </p>
                  </form>
                </div>
              </div>
            </div>

            {/* Column 2: KHUNG TIN CHÂN TRANG - THÔNG TIN LIÊN HỆ (lg:col-span-5) */}
            <div className="lg:col-span-5">
              <div className="bg-white/85 rounded-2xl p-6 sm:p-7 border border-[#E0D5C3] shadow-xs space-y-4">
                {/* SĐT */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF0E4] border border-[#E2D2BE] flex items-center justify-center text-[#70141D] shrink-0 mt-0.5">
                      <i className="fa-solid fa-phone text-sm"></i>
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-[#8C6E66] uppercase tracking-wider">
                        Số điện thoại / Zalo:
                      </span>
                      <a
                        href="tel:0374261368"
                        className="text-lg font-bold text-[#70141D] hover:text-[#961c29] transition-colors tracking-wide inline-block"
                      >
                        0374 261 368
                      </a>
                    </div>
                  </div>

                  {/* Địa chỉ */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF0E4] border border-[#E2D2BE] flex items-center justify-center text-[#70141D] shrink-0 mt-0.5">
                      <i className="fa-solid fa-location-dot text-sm"></i>
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-[#8C6E66] uppercase tracking-wider">
                        Địa chỉ lớp học:
                      </span>
                      <a
                        href={mapConfig.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[#3D2925] hover:text-[#70141D] transition-colors leading-relaxed block"
                      >
                        {mapConfig.address}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF0E4] border border-[#E2D2BE] flex items-center justify-center text-[#70141D] shrink-0 mt-0.5">
                      <i className="fa-solid fa-envelope text-sm"></i>
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-[#8C6E66] uppercase tracking-wider">
                        Email liên hệ:
                      </span>
                      <a
                        href="mailto:saotrucauco@gmail.com"
                        className="text-sm font-semibold text-[#3D2925] hover:text-[#70141D] transition-colors break-all inline-block"
                      >
                        saotrucauco@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Thời gian làm việc */}
                  <div className="flex items-start gap-3.5 pt-2 border-t border-[#F2E8DC]">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF0E4] border border-[#E2D2BE] flex items-center justify-center text-[#70141D] shrink-0 mt-0.5">
                      <i className="fa-solid fa-clock text-sm"></i>
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-[#8C6E66] uppercase tracking-wider">
                        Thời gian hoạt động:
                      </span>
                      <span className="text-sm text-[#3D2925] font-medium">
                        08:00 – 21:00 (Tất cả các ngày trong tuần)
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            {/* Column 3: Liên kết nhanh & Đăng ký (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="font-serif text-base font-bold text-[#70141D] uppercase tracking-wider border-b border-[#EADBCA] pb-2.5">
                Liên Kết Nhanh
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/" className="text-[#5C4540] hover:text-[#70141D] transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-angle-right text-xs text-[#C29B38]"></i>
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link href="/lop-hoc" className="text-[#5C4540] hover:text-[#70141D] transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-angle-right text-xs text-[#C29B38]"></i>
                    Khóa học sáo trúc
                  </Link>
                </li>
                <li>
                  <Link href="/bai-viet" className="text-[#5C4540] hover:text-[#70141D] transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-angle-right text-xs text-[#C29B38]"></i>
                    Kho cảm âm & Kiến thức
                  </Link>
                </li>
                <li>
                  <Link href="/dang-ky-hoc" className="text-[#5C4540] hover:text-[#70141D] transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-angle-right text-xs text-[#C29B38]"></i>
                    Đăng ký tư vấn khóa học
                  </Link>
                </li>
                <li>
                  <a href="#bo-mon" className="text-[#5C4540] hover:text-[#70141D] transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-angle-right text-xs text-[#C29B38]"></i>
                    Khám phá các bộ môn
                  </a>
                </li>
              </ul>

              {/* Quick CTA button */}
              <div className="pt-2">
                <Link
                  href="/dang-ky-hoc"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#70141D] hover:bg-[#8e1d28] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs text-center"
                >
                  <i className="fa-solid fa-calendar-check text-sm"></i>
                  Đăng ký học ngay
                </Link>
              </div>
            </div>

          </div>

          {/* Copyright Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C766F]">
            <p className="normal-case tracking-normal">
              © 2026 <strong className="text-[#70141D] font-bold">Sáo Trúc Âu Cơ</strong>. Tất cả các quyền được bảo lưu.
            </p>
            <p className="normal-case tracking-normal text-[#9E8982]">
              {mapConfig.address} · Hotline: 0374 261 368
            </p>
          </div>

        </div>
      </footer>

      {/* ================= 11. SEARCH MODAL ================= */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:pt-20">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#E0D5C3] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header & Input */}
            <div className="p-4 sm:p-5 border-b border-[#EADBCA] flex items-center gap-3 bg-[#FAF7F2]">
              <i className="fa-solid fa-magnifying-glass text-[#70141D] text-lg"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm lớp học, loại sáo, giáo trình, cảm âm..."
                className="w-full bg-transparent border-0 outline-none text-sm sm:text-base font-medium text-[#2D2825] placeholder:text-[#8C827A]"
                autoFocus
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#EADBCA] hover:bg-[#D9CDBB] text-[#2D2825] flex items-center justify-center transition-colors text-xs cursor-pointer"
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
                      className="p-3 bg-[#FAF7F2] hover:bg-red-50/70 rounded-xl border border-[#E0D5C3] hover:border-[#70141D] transition-all flex items-center justify-between gap-2 group"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-[#2D2825] group-hover:text-[#70141D] transition-colors truncate block">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[#6B625B]">
                          {item.cat}
                        </span>
                      </div>
                      <i className="fa-solid fa-arrow-right text-[10px] text-stone-400 group-hover:text-[#70141D] transition-colors"></i>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-[#FAF7F2] border-t border-[#EADBCA] text-right text-[11px] text-[#6B625B]">
              Nhấn ESC hoặc bấm X để đóng
            </div>

          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#EADBCA]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors text-xs cursor-pointer"
              aria-label="Đóng"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="max-h-[70vh] bg-stone-900 flex items-center justify-center overflow-hidden">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.caption}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2]">
              <div>
                <h3 className="font-serif font-bold text-base text-[#70141D]">{selectedPhoto.title || selectedPhoto.caption}</h3>
                <p className="text-xs text-[#5C524E] mt-0.5">{selectedPhoto.caption}</p>
              </div>
              {selectedPhoto.href && (
                <Link
                  href={selectedPhoto.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#70141D] hover:bg-[#5a0e16] text-white text-xs font-semibold rounded-md shadow-xs transition-colors shrink-0"
                >
                  <span>Xem chi tiết</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
