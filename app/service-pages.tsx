"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLanguage, LanguageSwitcher } from "./i18n-context";
import { buildVietQrUrl } from "./vietqr-helper";
import { PriceTag, parsePrice } from "./price-helper";

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

function slugify(value: string) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const defaultProductGroupSlugs: Record<string, string> = {
  "Sáo ngang Việt Nam": "sao-ngang-viet-nam",
  "Sáo Dizi Trung Quốc": "sao-dizi-trung-quoc",
  "Sáo mèo": "sao-meo",
  "Tiêu & Xiao": "tieu-xiao",
  "Recorder": "recorder",
  "Flute": "flute",
  "Sáo dọc": "sao-doc",
};

const allInterestOptions = [
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
];

function renderAddressLine(line: string) {
  const trimmed = line.trim();
  const match = trimmed.match(/^((?:CN\s*\d+|Chi\s*nhánh\s*\d+|Cơ\s*sở\s*\d+|Trụ\s*sở(?:\s*chính)?):?)\s*(.*)$/i);
  if (match) {
    return (
      <>
        <span className="branch-tag">{match[1]}</span> {match[2]}
      </>
    );
  }
  return trimmed;
}

export function ServicePageHeader() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [addressText, setAddressText] = useState("106/72 Hòa Bình, P. Tân Phú, TP.HCM");
  const [phoneText, setPhoneText] = useState("0374 261 368");

  useEffect(() => {
    let active = true;
    fetch("/api/cms/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { entries?: CmsEntry[] } | null) => {
        if (!active || !data?.entries) return;
        const general = data.entries.find((e) => e.collection === "settings" && e.slug === "general");
        if (general?.content) setAddressText(general.content);
        if (general?.price) setPhoneText(general.price);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const addressLines = (addressText || "106/72 Hòa Bình, P. Tân Phú, TP.HCM")
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <>
      <div className="top-contact-bar" aria-label={t("Thông tin liên hệ nhanh", "Quick contact info")}>
        <Link className="top-address" href="/dang-ky-hoc">
          <span className="top-address-icon">⌖</span>
          <span className="top-address-list">
            {addressLines.length > 0 ? (
              addressLines.map((line, idx) => (
                <span key={idx} className="top-address-line">
                  {renderAddressLine(line)}
                </span>
              ))
            ) : (
              <span className="top-address-line">106/72 Hòa Bình, P. Tân Phú, TP.HCM</span>
            )}
          </span>
        </Link>
        <a className="top-phone" href={`tel:${phoneText.replace(/\D/g, "")}`}>
          <span>☎</span>
          <span>{phoneText}</span>
          <small>{t("Hotline / Zalo", "Hotline / Zalo")}</small>
        </a>
        <LanguageSwitcher className="lang-switcher-top" compact />
      </div>
      <header className="site-header service-page-header">
        <Link className="brand" href="/" aria-label={t("Sáo Trúc Âu Cơ - Trang chủ", "Au Co Bamboo Flute - Home")}>
          <img src="/logo.jpg" alt="Logo Sáo Trúc Âu Cơ" width={46} height={46} style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 8, flex: "0 0 auto" }} />
          <span><b>{t("SÁO TRÚC ÂU CƠ", "AU CO BAMBOO FLUTE")}</b><small>{t("ÂM NHẠC DÂN TỘC & ĐÀO TẠO CHUYÊN NGHIỆP", "TRADITIONAL MUSIC & PROFESSIONAL TRAINING")}</small></span>
        </Link>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={t("Mở menu", "Open menu")} aria-expanded={menuOpen}>☰</button>
        <nav className={menuOpen ? "open" : ""} aria-label={t("Điều hướng chính", "Main navigation")}>
          <Link href="/" onClick={() => setMenuOpen(false)}>{t("Trang chủ", "Home")}</Link>
          <Link href="/lop-hoc" onClick={() => setMenuOpen(false)}>{t("Lớp học", "Classes")}</Link>
          <Link href="/sao-va-phu-kien" onClick={() => setMenuOpen(false)}>{t("Sáo & Phụ kiện", "Flutes")}</Link>
          <Link href="/khoa-hoc-quay-san" onClick={() => setMenuOpen(false)}>{t("Khóa học", "Courses")}</Link>
          <Link href="/bai-viet" onClick={() => setMenuOpen(false)}>{t("Bài viết", "Articles")}</Link>
          <Link href="/huong-dan" onClick={() => setMenuOpen(false)}>{t("Hướng dẫn", "Tutorials")}</Link>
          <Link href="/cam-am" onClick={() => setMenuOpen(false)}>{t("Cảm âm", "Flute Tabs")}</Link>
          <Link href="/dang-ky-hoc" onClick={() => setMenuOpen(false)}>{t("Liên hệ", "Contact")}</Link>
        </nav>
        <Link className="button button-gold header-cta" href="/dang-ky-hoc">{t("✦ Đăng ký học", "✦ Enroll Now")}</Link>
      </header>
    </>
  );
}

export function ServicePageFooter() {
  const { t } = useLanguage();
  return (
    <footer className="service-page-footer">
      <div className="brand">
        <img src="/logo.jpg" alt="Logo Sáo Trúc Âu Cơ" width={46} height={46} style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 8, flex: "0 0 auto" }} />
        <span><b>{t("SÁO TRÚC ÂU CƠ", "AU CO BAMBOO FLUTE")}</b><small>{t("ÂM NHẠC DÂN TỘC & ĐÀO TẠO CHUYÊN NGHIỆP", "TRADITIONAL MUSIC & PROFESSIONAL TRAINING")}</small></span>
      </div>
      <p>{t("Đam mê làm nên giá trị · Chất lượng tạo nên uy tín", "Passion creates value · Quality builds trust")}</p>
      <small>{t("© 2026 Sáo Trúc Âu Cơ. All rights reserved.", "© 2026 Au Co Bamboo Flute. All rights reserved.")}</small>
    </footer>
  );
}

function useServiceData() {
  const [cmsEntries, setCmsEntries] = useState<CmsEntry[]>([]);
  useEffect(() => {
    let active = true;
    fetch("/api/cms/content")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("cms_unavailable")))
      .then((data: { entries?: CmsEntry[] }) => { if (active && Array.isArray(data.entries)) setCmsEntries(data.entries); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const visibleCollection = (name: string) => cmsEntries
    .filter((entry) => entry.collection === name && entry.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const paymentSettings = cmsEntries.find((entry) => entry.collection === "settings" && entry.slug === "payment" && entry.visible);
  const generalSettings = cmsEntries.find((entry) => entry.collection === "settings" && entry.slug === "general" && entry.visible);
  const tuitionSettings = cmsEntries.find((entry) => entry.collection === "settings" && entry.slug === "tuition");

  return {
    cmsEntries,
    visibleCollection,
    paymentSettings,
    generalSettings,
    tuitionSettings,
  };
}

// 01. LỚP HỌC CÁC BỘ MÔN
export function ClassesPage() {
  const { t, translate } = useLanguage();

  const disciplines = [
    {
      code: "BỘ MÔN 01",
      slug: "sao-truc-viet-nam",
      title: "Sáo trúc Việt Nam",
      image: "/class-saotruc-vn.webp",
      desc: "Khám phá vẻ đẹp của sáo trúc Việt qua những làn điệu dân tộc, từ cơ bản đến nâng cao.",
      href: "/bo-mon/sao-truc-viet-nam",
      suitable: "Người mới",
      type: "1 kèm 1",
      format: "Online / Trực tiếp",
    },
    {
      code: "BỘ MÔN 02",
      slug: "sao-dizi",
      title: "Sáo Dizi",
      image: "/class-dizi.webp",
      desc: "Sáo ngang Trung Quốc với âm thanh đặc trưng, giàu biểu cảm và kỹ thuật đa dạng.",
      href: "/bo-mon/sao-dizi",
      suitable: "Người mới",
      type: "1 kèm 1",
      format: "Online / Trực tiếp",
    },
    {
      code: "BỘ MÔN 03",
      slug: "sao-recorder",
      title: "Sáo Recorder",
      image: "/class-recorder.webp",
      desc: "Dễ tiếp cận, phù hợp cho trẻ em và người mới bắt đầu làm quen với âm nhạc.",
      href: "/bo-mon/sao-recorder",
      suitable: "Người mới",
      type: "1 kèm 1",
      format: "Online / Trực tiếp",
    },
    {
      code: "BỘ MÔN 04",
      slug: "dong-tieu-xiao",
      title: "Động tiêu & Xiao",
      image: "/class-tieu-xiao.webp",
      desc: "Âm thanh trầm ấm, sâu lắng, mang đậm tinh thần phương Đông và giá trị thiền.",
      href: "/bo-mon/dong-tieu-xiao",
      suitable: "Người mới",
      type: "1 kèm 1",
      format: "Online / Trực tiếp",
    },
    {
      code: "BỘ MÔN 05",
      slug: "flute",
      title: "Flute",
      image: "/class-flute.webp",
      desc: "Kỹ thuật phương Tây bài bản, âm sắc trong trẻo, linh hoạt, phù hợp nhiều thể loại.",
      href: "/bo-mon/flute",
      suitable: "Người mới",
      type: "1 kèm 1",
      format: "Online / Trực tiếp",
    },
    {
      code: "BỘ MÔN 06",
      slug: "sao-hmong",
      title: "Sáo H'Mông",
      image: "/class-hmong.webp",
      desc: "Khám phá âm hưởng Tây Bắc mộc mạc, độc đáo qua tiếng sáo của núi rừng.",
      href: "/bo-mon/sao-hmong",
      suitable: "Người mới",
      type: "1 kèm 1",
      format: "Online / Trực tiếp",
    },
  ];

  const whyUsPillars = [
    {
      icon: "fa-solid fa-users",
      title: "1 kèm 1",
      desc: "Giáo viên đồng hành sát sao, chỉnh sửa chi tiết theo năng lực của bạn.",
    },
    {
      icon: "fa-solid fa-chart-line",
      title: "Lộ trình riêng",
      desc: "Chương trình cá nhân hóa theo mục tiêu và sở thích.",
    },
    {
      icon: "fa-solid fa-laptop",
      title: "Online & trực tiếp",
      desc: "Linh hoạt hình thức học, dễ dàng sắp xếp thời gian.",
    },
    {
      icon: "fa-solid fa-clipboard-check",
      title: "Theo dõi từng buổi học",
      desc: "Nhận xét và đánh giá định hướng rõ ràng để tiến bộ nhanh hơn.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAF6F0] text-[#2B2624] selection:bg-[#70141D] selection:text-white">
      <ServicePageHeader />

      {/* 1. HERO & 6 BỘ MÔN SECTION - DARK ORIENTAL BACKDROP CHUẨN MÔ TẢ HÌNH ẢNH */}
      <section className="bg-[#0A0706] text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#291816] relative overflow-hidden">
        {/* Subtle background ambiance glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#70141D]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
        
        <div className="max-w-[1380px] mx-auto space-y-8 relative z-10">
          
          {/* Header row with Title box & Oriental Art */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3.5 max-w-3xl">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#FAF5EE] text-[#70141D] text-xs font-bold uppercase tracking-wider shadow-sm">
                Lớp học
              </span>

              {/* Title Pill Frame */}
              <div>
                <h1 className="inline-block px-6 sm:px-8 py-3 rounded-2xl sm:rounded-full bg-[#FAF5EE] text-[#70141D] font-serif font-bold text-2xl sm:text-3xl lg:text-4xl shadow-md border border-[#EADBCA] leading-tight">
                  Các Bộ Môn Sáo Giảng Dạy Tại TP.HCM & Online
                </h1>
              </div>

              {/* Description Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5EE]/95 text-[#4D3F3A] border border-[#EADBCA] shadow-sm max-w-2xl">
                <p className="text-xs sm:text-sm leading-relaxed">
                  Khám phá thế giới âm nhạc qua những nhạc cụ đặc sắc từ Việt Nam và các nền văn hóa khác. Mỗi khóa học được thiết kế bài bản, phù hợp với mọi lứa tuổi và trình độ, cùng bạn trên hành trình nuôi dưỡng đam mê âm nhạc.
                </p>
              </div>
            </div>

            {/* Right Decorative Art (Sun, Mountains, Bamboo & Au Co Seal) */}
            <div className="hidden lg:block shrink-0 relative w-80 h-44 pointer-events-none select-none">
              <img
                src="/class-hero-art.webp"
                alt="Minh họa nghệ thuật Sáo Trúc Âu Cơ"
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </div>
          </div>

          {/* 6 Disciplines Grid (3 columns x 2 rows) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pt-2">
            {disciplines.map((item) => (
              <div
                key={item.slug}
                className="bg-[#FAF5EE] rounded-2xl sm:rounded-3xl border border-[#E8DFD3] p-3 sm:p-3.5 flex gap-3.5 sm:gap-4 items-stretch hover:border-[#70141D] hover:shadow-xl transition-all duration-300 group"
              >
                {/* Thumbnail Image */}
                <div className="w-28 sm:w-32 aspect-square rounded-xl sm:rounded-2xl overflow-hidden shrink-0 shadow-xs relative bg-[#EDE4D8]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0 space-y-1.5">
                  <div className="space-y-1">
                    <span className="block text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#8C1B26]">
                      {item.code}
                    </span>
                    <h2 className="font-serif font-bold text-base sm:text-lg text-[#70141D] group-hover:text-[#8C1B26] transition-colors leading-snug truncate">
                      <Link href={item.href}>
                        {item.title}
                      </Link>
                    </h2>
                    <p className="text-[11px] sm:text-xs text-[#5C4D47] leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  {/* Attributes & Button */}
                  <div className="space-y-2 pt-1 border-t border-[#E8DFD3]/80">
                    <div className="text-[9.5px] sm:text-[10px] text-[#7A6963] font-medium flex items-center flex-wrap gap-x-1.5 gap-y-0.5">
                      <span>👤 {item.suitable}</span>
                      <span>•</span>
                      <span>👥 {item.type}</span>
                      <span>•</span>
                      <span>💻 {item.format}</span>
                    </div>

                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#70141D] hover:bg-[#8C1B26] text-white text-[11px] sm:text-xs font-bold transition-all shadow-xs w-fit"
                    >
                      <span>Xem chương trình</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. VÌ SAO NÊN HỌC TẠI CHÚNG TÔI - HỌC TẠI SÁO TRÚC ÂU CƠ */}
      <section className="py-12 sm:py-16 bg-[#FAF5ED] border-b border-[#EADBCA] relative overflow-hidden">
        {/* Subtle decorative corners */}
        <div className="absolute left-0 top-0 w-24 sm:w-28 opacity-40 pointer-events-none select-none">
          <img src="/why-us-bamboo.webp" alt="Minh họa trúc" className="w-full h-auto" />
        </div>
        <div className="absolute right-0 bottom-0 w-28 sm:w-32 opacity-40 pointer-events-none select-none">
          <img src="/why-us-boat.webp" alt="Minh họa sông núi" className="w-full h-auto" />
        </div>

        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 pb-4 border-b border-[#E0D5C3]">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#8C1B26] block mb-1">
                VÌ SAO NÊN HỌC TẠI CHÚNG TÔI
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#70141D]">
                Học tại Sáo Trúc Âu Cơ
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#6E5D57] leading-relaxed italic max-w-xl">
              Không chỉ là những bài học âm nhạc, mà còn là hành trình nuôi dưỡng tâm hồn, kết nối văn hóa và lan tỏa những giá trị đẹp đẽ của âm nhạc dân tộc.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#E0D5C3]">
            {whyUsPillars.map((pillar, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-4 ${idx !== 0 ? "pt-4 sm:pt-0 sm:pl-6" : ""}`}
              >
                <div className="w-12 h-12 rounded-full bg-[#70141D] text-white flex items-center justify-center text-lg shrink-0 shadow-sm mt-0.5">
                  <i className={pillar.icon}></i>
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-base text-[#70141D]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#6B5A53] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. INTERNAL LINKS Ở CHÂN TRANG: GIÁO TRÌNH, CHUYỂN SOẠN SHEET, CÁC SẢN PHẨM SÁO */}
      <section className="py-12 sm:py-16 bg-[#F5EFE6] border-b border-[#EADBCA]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[#A87932] block">
              ✦ HỆ SINH THÁI TÀI LIỆU & NHẠC CỤ ĐỒNG HÀNH ✦
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#70141D]">
              Tài Liệu & Nhạc Cụ Đồng Hành Cùng Bạn
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5751] leading-relaxed">
              Trung tâm hỗ trợ trọn gói từ giáo trình chuẩn, dịch vụ ký âm chuyển soạn bài bản đến các sản phẩm sáo trúc tuyển chọn chuẩn âm hòa tấu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Internal Link 1: Giáo trình sáo trúc */}
            <Link
              href="/giao-trinh-va-sheet"
              className="group bg-white rounded-2xl p-6 border border-[#E0D5C3] shadow-xs hover:shadow-xl hover:border-[#70141D]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#70141D]/10 text-[#70141D] flex items-center justify-center text-2xl border border-[#70141D]/20 group-hover:scale-110 transition-transform">
                  📖
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#A87932] block">
                  TÀI LIỆU HỌC TẬP BÀI BẢN
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#70141D] transition-colors leading-snug">
                  Giáo Trình Sáo Trúc
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bộ giáo trình tự học bài bản từ vỡ lòng, kỹ thuật bấm ngón, luyện hơi đến các bài luyện ngón chuyên sâu có video và hướng dẫn chi tiết.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#70141D] group-hover:translate-x-1 transition-transform">
                <span>Xem giáo trình sáo trúc</span>
                <span>→</span>
              </div>
            </Link>

            {/* Internal Link 2: Chuyển soạn sheet nhạc */}
            <Link
              href="/giao-trinh-va-sheet"
              className="group bg-white rounded-2xl p-6 border border-[#E0D5C3] shadow-xs hover:shadow-xl hover:border-[#70141D]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#70141D]/10 text-[#70141D] flex items-center justify-center text-2xl border border-[#70141D]/20 group-hover:scale-110 transition-transform">
                  🎼
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#A87932] block">
                  DỊCH VỤ CHUYÊN NGHIỆP
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#70141D] transition-colors leading-snug">
                  Chuyển Soạn Sheet Nhạc & Cảm Âm
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dịch vụ ký âm chuyên nghiệp, chuyển soạn sheet nhạc nốt hoa, cảm âm sáo trúc chuẩn hòa tấu và beat nhạc nền độc quyền cho mọi ca khúc bạn yêu thích.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#70141D] group-hover:translate-x-1 transition-transform">
                <span>Xem dịch vụ chuyển soạn sheet</span>
                <span>→</span>
              </div>
            </Link>

            {/* Internal Link 3: Các sản phẩm sáo */}
            <Link
              href="/sao-va-phu-kien"
              className="group bg-white rounded-2xl p-6 border border-[#E0D5C3] shadow-xs hover:shadow-xl hover:border-[#70141D]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#70141D]/10 text-[#70141D] flex items-center justify-center text-2xl border border-[#70141D]/20 group-hover:scale-110 transition-transform">
                  🎋
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#A87932] block">
                  NHẠC CỤ CHUẨN ÂM HÒA TẤU
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#70141D] transition-colors leading-snug">
                  Các Sản Phẩm Sáo & Phụ Kiện
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cung cấp sáo nứa Bắc, nứa Nam, sáo Dizi, động tiêu, sáo mèo chuẩn âm hòa tấu, được chính nghệ sĩ tuyển chọn và căn chỉnh, bảo hành trọn đời.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#70141D] group-hover:translate-x-1 transition-transform">
                <span>Xem các sản phẩm sáo</span>
                <span>→</span>
              </div>
            </Link>
          </div>

        </div>
      </section>

      {/* 4. FOOTER & HOME RETURN */}
      <div className="py-8 text-center bg-[#FAF5EE]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#70141D] text-[#70141D] hover:bg-[#70141D] hover:text-white transition-all text-xs font-bold uppercase tracking-wider shadow-xs"
        >
          <span>← Quay lại trang chủ</span>
        </Link>
      </div>

      <ServicePageFooter />
    </main>
  );
}

export function ContactSection({ initialSubject, id }: { initialSubject?: string; id?: string }) {
  const { t, translate } = useLanguage();
  const { generalSettings, visibleCollection, tuitionSettings } = useServiceData();
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>(["Sáo trúc Việt Nam"]);
  const [sent, setSent] = useState(false);
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");

  const parsedTuition = useMemo(() => {
    const content = tuitionSettings?.content || "";
    const sectionLines: Record<string, string[]> = {};
    if (content && content.includes("[")) {
      let current = "";
      for (const line of content.split("\n")) {
        const match = line.trim().match(/^\[([A-ZÀ-Ỹ0-9\s_]+)\]$/i);
        if (match) {
          current = match[1]
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9]/g, "_");
          sectionLines[current] = [];
        } else if (current) {
          sectionLines[current].push(line);
        }
      }
    }
    const sections: Record<string, string> = {};
    for (const [key, lines] of Object.entries(sectionLines)) {
      sections[key] = lines.join("\n").trim();
    }
    return {
      title: tuitionSettings?.tag || t("Bảng mục học phí", "Tuition Fee Table"),
      fee1: tuitionSettings?.title || "2.400.000đ – 3.200.000đ",
      sessions1: sections["buoi_1"] || "8 buổi",
      fee2: tuitionSettings?.excerpt || "4.800.000đ – 6.400.000đ",
      sessions2: sections["buoi_2"] || "16 buổi",
      fee3: tuitionSettings?.price || "7.200.000đ",
      sessions3: sections["buoi_3"] || "24 buổi",
      duration: sections["thoi_luong"] || tuitionSettings?.imageUrl || t("Thời gian mỗi buổi 60 phút.", "60 minutes per session."),
      promo: sections["uu_dai"] || (content && !content.includes("[") ? content : t("giảm 10% – 15%, tặng MV Video thổi sáo khi hết khoá.", "10% – 15% discount, complimentary flute music video upon completion.")),
      note: sections["luu_y"] || t("Học phí đã đăng ký không hoàn lại trong mọi trường hợp. Nếu học viên có việc phát sinh và chưa thể tiếp tục học, số buổi còn lại sẽ được bảo lưu để học viên sắp xếp học lại sau.", "Tuition is non-refundable. Remaining sessions can be preserved if postponed."),
    };
  }, [tuitionSettings, t]);

  const pageContact = visibleCollection("page-contact")[0];
  const pageEyebrow = translate(pageContact?.tag || "BẮT ĐẦU HÀNH TRÌNH");

  const parsedContact = useMemo(() => {
    if (!pageContact?.content) return null;
    const content = pageContact.content;
    const sections: Record<string, string> = {};
    if (content.includes("[") && content.includes("]")) {
      let current = "desc";
      for (const line of content.split("\n")) {
        const match = line.trim().match(/^\[([A-ZÀ-Ỹ0-9\s_]+)\]$/i);
        if (match) {
          current = match[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]/g, "_");
          if (!sections[current]) sections[current] = "";
        } else {
          if (!sections[current]) sections[current] = "";
          sections[current] += (sections[current] ? "\n" : "") + line;
        }
      }
      return {
        blockTitle: sections["tieu_de_khoi"] || sections["title"] || "Đăng Kí Học Sáo, Tư Vấn Các Dịch Vụ",
        blockDesc: sections["mo_ta_khoi"] || sections["desc"] || "Học tại trung tâm (TP.HCM), gia sư tại nhà hoặc online 1 kèm 1 linh động cho học viên ở xa và nước ngoài.",
        address: sections["dia_chi"] || sections["address"] || generalSettings?.content || "106/72 Hòa Bình, P. Tân Phú, TP.HCM",
        email: sections["email"] || generalSettings?.tag || "van17071999@gmail.com",
        interestTitle: sections["tieu_de_bo_mon"] || sections["interest_title"] || "Đăng ký bộ môn or Tư vấn dịch vụ, sản phẩm",
        interestNote: sections["ghi_chu_bo_mon"] || sections["interest_note"] || "(Bấm để chọn nhiều mục)",
        interestItems: sections["danh_sach_bo_mon"] || sections["interest_items"] || "",
        buttonLabel: sections["nut_gui"] || sections["button_label"] || "GỬI YÊU CẦU ĐĂNG KÝ →",
        successMsg: sections["thong_bao_thanh_cong"] || sections["success_msg"] || "Yêu cầu đã được gửi thành công. Sáo Trúc Âu Cơ sẽ liên hệ lại với bạn sớm nhất.",
      };
    }
    const lines = content.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    return {
      blockTitle: lines[0] || "Đăng Kí Học Sáo, Tư Vấn Các Dịch Vụ",
      blockDesc: lines[1] || "Học tại trung tâm (TP.HCM), gia sư tại nhà hoặc online 1 kèm 1 linh động cho học viên ở xa và nước ngoài.",
      address: lines[2] || generalSettings?.content || "106/72 Hòa Bình, P. Tân Phú, TP.HCM",
      email: lines[3] || generalSettings?.tag || "van17071999@gmail.com",
      interestTitle: "Đăng ký bộ môn or Tư vấn dịch vụ, sản phẩm",
      interestNote: "(Bấm để chọn nhiều mục)",
      interestItems: "",
      buttonLabel: "GỬI YÊU CẦU ĐĂNG KÝ →",
      successMsg: "Yêu cầu đã được gửi thành công. Sáo Trúc Âu Cơ sẽ liên hệ lại với bạn sớm nhất.",
    };
  }, [pageContact, generalSettings]);

  const blockTitle = translate(parsedContact?.blockTitle || "Đăng Kí Học Sáo, Tư Vấn Các Dịch Vụ");
  const blockDesc = translate(parsedContact?.blockDesc || "Học tại trung tâm (TP.HCM), gia sư tại nhà hoặc online 1 kèm 1 linh động cho học viên ở xa và nước ngoài.");
  const contactAddress = translate(parsedContact?.address || generalSettings?.content || "106/72 Hòa Bình, P. Tân Phú, TP.HCM");
  const contactPhone = pageContact?.price || generalSettings?.price || "0374 261 368";
  const contactEmail = parsedContact?.email || generalSettings?.tag || "van17071999@gmail.com";

  const allInterestOptions = useMemo(() => {
    if (parsedContact?.interestItems && parsedContact.interestItems.trim()) {
      return parsedContact.interestItems.split(/\n+/).map((s) => s.trim()).filter(Boolean);
    }
    return [
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
    ];
  }, [parsedContact?.interestItems]);

  useEffect(() => {
    if (initialSubject) {
      const match = allInterestOptions.find(
        (opt) =>
          opt.toLowerCase() === initialSubject.toLowerCase() ||
          opt.toLowerCase().includes(initialSubject.toLowerCase().replace("sáo ", "").trim()) ||
          initialSubject.toLowerCase().includes(opt.toLowerCase().replace("sáo ", "").trim())
      );
      setSelectedDisciplines([match || initialSubject]);
    } else if (typeof window !== "undefined") {
      const requested = new URLSearchParams(window.location.search).get("subject");
      if (requested) setSelectedDisciplines([requested]);
    }
  }, [initialSubject, allInterestOptions]);

  function toggleInterest(item: string) {
    setSelectedDisciplines((prev) => {
      if (prev.includes(item)) {
        return prev.length > 1 ? prev.filter((d) => d !== item) : prev;
      }
      return [...prev, item];
    });
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
          discipline: interestsString,
          interest: interestsString,
          message: data.get("message") || "",
          type: "Đăng ký học / Tư vấn chung",
        }),
      });
      if (response.ok) {
        setSent(true);
        form.reset();
      } else {
        const resJson = await response.json().catch(() => ({}));
        setRequestError(resJson.error || "Gửi yêu cầu không thành công. Vui lòng thử lại hoặc gọi Hotline / Zalo.");
      }
    } catch {
      setRequestError("Lỗi kết nối. Vui lòng liên hệ trực tiếp qua số Hotline / Zalo.");
    } finally {
      setRequestSubmitting(false);
    }
  }

  return (
    <section className="contact section" id={id || "contact"}>
      <div className="contact-copy">
        <p className="eyebrow">{pageEyebrow || t("THÔNG TIN LIÊN HỆ", "CONTACT INFORMATION")}</p>
        <h2 className="contact-title-refined">{blockTitle}</h2>
        <p className="contact-intro">{blockDesc}</p>
        <ul className="contact-bullet-list">
          {((contactAddress || "").split(/\n+/).map((l) => l.trim()).filter(Boolean)).map((line, idx) => (
            <li key={idx}><span style={{ color: "#ddb268" }}>⌖</span> {renderAddressLine(line)}</li>
          ))}
          <li><span style={{ color: "#ddb268" }}>☎</span> {t("Hotline / Zalo:", "Hotline / Zalo:")} <a href={`tel:${contactPhone.replace(/\D/g, "")}`} style={{ color: "inherit", fontWeight: 700 }}>{contactPhone}</a></li>
          <li><span style={{ color: "#ddb268" }}>✉</span> Email: {contactEmail}</li>
        </ul>

        <div className="tuition-card">
          <div className="tuition-card-head">
            <h3 className="tuition-card-title"><span>✦</span>{parsedTuition.title}</h3>
            <span className="tuition-duration-tag">⏱ {parsedTuition.duration}</span>
          </div>
          <div className="tuition-grid">
            <div className="tuition-row">
              <span className="tuition-duration">{t("Khóa 1 tháng", "1-Month Course")} <small className="tuition-sessions">({parsedTuition.sessions1})</small></span>
              <span className="tuition-fee">{parsedTuition.fee1}</span>
            </div>
            <div className="tuition-row">
              <span className="tuition-duration">{t("Khóa 2 tháng", "2-Month Course")} <small className="tuition-sessions">({parsedTuition.sessions2})</small></span>
              <span className="tuition-fee">{parsedTuition.fee2}</span>
            </div>
            <div className="tuition-row">
              <span className="tuition-duration">{t("Khóa 3 tháng", "3-Month Course")} <small className="tuition-sessions">({parsedTuition.sessions3})</small></span>
              <span className="tuition-fee">{parsedTuition.fee3}</span>
            </div>
          </div>
          {parsedTuition.promo && (
            <div className="tuition-promo">
              <div className="tuition-promo-title"><span>🎁</span>{t("Ưu đãi khi đăng ký khóa 2, 3 tháng:", "Special offers for 2 & 3-month courses:")}</div>
              <div>{parsedTuition.promo}</div>
            </div>
          )}
          {parsedTuition.note && (
            <div className="tuition-note">
              <b>📌 {t("Lưu ý:", "Note:")}</b> {parsedTuition.note}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={submitForm}>
        <div className="contact-form-row-2">
          <label>{t("Họ và tên", "Full Name")}<input required name="name" placeholder={t("Tên của bạn", "Your full name")} /></label>
          <label>{t("Số điện thoại / Zalo", "Phone / Zalo")}<input required name="phone" type="tel" placeholder={t("Số điện thoại liên hệ", "Your phone/Zalo")} /></label>
        </div>
        
        <div className="full interest-selection-group">
          <span className="interest-group-label">
            {translate(parsedContact?.interestTitle || "Đăng ký bộ môn or Tư vấn dịch vụ, sản phẩm")}
            <small style={{ display: "inline-block", marginLeft: 6, color: "#8a7e72", fontWeight: 400 }}>
              {translate(parsedContact?.interestNote || "(Bấm để chọn nhiều mục)")}
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

        <label className="full">{t("Lời nhắn", "Message")}<textarea name="message" rows={2} placeholder={t("Mục tiêu, trình độ hiện tại hoặc nhu cầu của bạn", "Your goals, current experience, or questions")} /></label>
        <button className="button button-wine full" type="submit" disabled={requestSubmitting}>
          {requestSubmitting ? t("Đang gửi…", "Sending…") : translate(parsedContact?.buttonLabel || "GỬI YÊU CẦU ĐĂNG KÝ →")}
        </button>
        {sent && <p className="success full" role="status">{translate(parsedContact?.successMsg || "Yêu cầu đã được gửi thành công. Sáo Trúc Âu Cơ sẽ liên hệ lại với bạn sớm nhất.")}</p>}
        {requestError && <p className="payment-error full" role="alert">{requestError}</p>}
      </form>
    </section>
  );
}

export function ContactPage() {
  return (
    <main className="subject-page content-page contact-page-wrapper">
      <ServicePageHeader />
      <div className="contact-page-container">
        <ContactSection />
      </div>
      <ServicePageFooter />
    </main>
  );
}

// Reusable Payment Modal for sales pages
export function PaymentModal({
  isOpen, onClose, purchaseTitle, defaultAmount,
  paymentBank, paymentAccount, paymentAccountName, customQrUrl,
}: {
  isOpen: boolean; onClose: () => void; purchaseTitle: string; defaultAmount: string;
  paymentBank: string; paymentAccount: string; paymentAccountName: string; customQrUrl?: string;
}) {
  const { t } = useLanguage();
  const [paymentAmount, setPaymentAmount] = useState(defaultAmount);
  const [transferContent, setTransferContent] = useState("");
  const [orderSent, setOrderSent] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    setPaymentAmount(defaultAmount);
    setTransferContent(`SAOTRUC ${purchaseTitle.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, " ").trim().slice(0, 24).toUpperCase()}`);
    setOrderSent(false);
    setPaymentError("");
  }, [purchaseTitle, defaultAmount, isOpen]);

  const paymentQrUrl = buildVietQrUrl({
    bank: paymentBank, account: paymentAccount, accountName: paymentAccountName,
    amount: paymentAmount, memo: transferContent, customImageUrl: customQrUrl,
  });

  async function confirmPayment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPaymentSubmitting(true);
    setPaymentError("");
    const data = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/payment-notification", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: purchaseTitle,
          purchase: purchaseTitle,
          amount: paymentAmount,
          transferContent: transferContent,
          memo: transferContent,
          buyerName: data.get("buyerName"),
          buyerPhone: data.get("buyerPhone"),
          buyerEmail: data.get("buyerEmail"),
        }),
      });
      if (!response.ok) throw new Error("notify_failed");
      setOrderSent(true);
    } catch {
      setPaymentError(t("Chưa gửi được thông báo. Vui lòng thử lại hoặc liên hệ Zalo 0374 261 368.", "Could not send notification. Please try again or contact Zalo (+84) 374 261 368."));
    } finally {
      setPaymentSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="payment-modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-title">
        <button className="payment-close" onClick={onClose} aria-label={t("Đóng bảng thanh toán", "Close payment modal")}>×</button>
        <header><h2 id="payment-title">{t("Thanh Toán Qua VietQR", "VietQR Instant Payment")}</h2><p>{purchaseTitle}</p></header>
        <div className="payment-modal-grid">
          <div className="payment-left">
            <h3>{t("THÔNG TIN CHUYỂN KHOẢN", "BANK TRANSFER DETAILS")}</h3>
            <div className="bank-info">
              <p><span>{t("Ngân hàng:", "Bank:")}</span><b>{paymentBank}</b></p>
              <p><span>{t("Số tài khoản:", "Account No.:")}</span><b>{paymentAccount}</b><button type="button" onClick={() => navigator.clipboard?.writeText(paymentAccount)}>{t("Sao chép", "Copy")}</button></p>
              <p><span>{t("Chủ tài khoản:", "Account Holder:")}</span><b>{paymentAccountName}</b></p>
              <label><span>{t("Số tiền thanh toán:", "Amount to pay:")}</span><input value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder={t("Nhập số tiền (VNĐ)", "Enter amount (VND)")} inputMode="numeric" /></label>
              <label><span>{t("Nội dung chuyển khoản:", "Transfer memo:")}</span><input value={transferContent} onChange={(e) => setTransferContent(e.target.value)} placeholder={t("Nhập nội dung chuyển khoản", "Enter transfer memo")} /><button type="button" onClick={() => navigator.clipboard?.writeText(transferContent)}>{t("Sao chép", "Copy")}</button></label>
            </div>
            <h3>{t("THÔNG TIN NGƯỜI MUA", "CUSTOMER INFORMATION")}</h3>
            <form id="payment-form" onSubmit={confirmPayment}>
              <label>{t("Họ và tên", "Full Name")} <small>({t("không bắt buộc", "optional")})</small><input name="buyerName" placeholder={t("Nhập họ tên của bạn", "Enter your full name")} /></label>
              <label>{t("Số điện thoại / Zalo nhận file *", "Phone / Zalo to receive file *")}<input required name="buyerPhone" type="tel" placeholder={t("Nhập số điện thoại Zalo", "Enter phone or Zalo number")} /></label>
              <label>{t("Email nhận khóa học", "Email to receive course files")}<input name="buyerEmail" type="email" placeholder={t("Email của bạn (nếu có)", "Your email (optional)")} /></label>
            </form>
          </div>
          <aside className="payment-qr">
            <img src={paymentQrUrl} alt={`Mã thanh toán VietQR ${paymentBank}`} width="540" height="540" loading="eager" decoding="sync" />
            <a href={paymentQrUrl} target="_blank" rel="noreferrer">{t("↓ Tải / Mở ảnh QR", "↓ Download / Open QR")}</a>
            <button className="payment-confirm" type="submit" form="payment-form" disabled={paymentSubmitting || orderSent}>{paymentSubmitting ? t("Đang gửi thông báo...", "Sending notification...") : orderSent ? t("✓ Đã gửi xác nhận", "✓ Confirmation Sent") : t("● Xác nhận đã chuyển khoản", "● Confirm Payment Completed")}</button>
            {orderSent && <p role="status">{t("Đã gửi thông báo cho Sáo Trúc Âu Cơ. Giao dịch sẽ được kiểm tra trước khi cấp khóa học hoặc sản phẩm.", "Notification sent to Au Co Bamboo Flute. Your order will be verified and delivered shortly.")}</p>}
            {paymentError && <p className="payment-error" role="alert">{paymentError}</p>}
          </aside>
        </div>
      </section>
    </div>
  );
}

// 03. SÁO & PHỤ KIỆN
export function ProductsPage() {
  const { t, translate } = useLanguage();
  const { visibleCollection, paymentSettings } = useServiceData();
  const [openCategory, setOpenCategory] = useState<number | null>(0);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentTitle, setPaymentTitle] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const fallbackCategories = [
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
  ];

  const cmsProductGroups = visibleCollection("product-groups");
  const cmsProductItems = visibleCollection("product-items");
  const rawProductCats = cmsProductGroups.length ? cmsProductGroups.map((group) => {
    const customItems = cmsProductItems.filter((item) => item.tag === group.slug);
    const defaultCat = fallbackCategories.find((c) => defaultProductGroupSlugs[c.title] === group.slug || c.title === group.title);
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
  }) : fallbackCategories.map((cat) => {
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

  return (
    <main className="subject-page content-page">
      <ServicePageHeader />
      <section className="content-list-hero">
        <p className="eyebrow">{t("SÁO & PHỤ KIỆN TUYỂN CHỌN", "HANDPICKED FLUTES & ACCESSORIES")}</p>
        <h1>{t("Sáo & Phụ kiện", "Flutes & Accessories")}</h1>
        <p>{t("Mỗi nhóm nhạc cụ có nhiều chất liệu và cấu hình khác nhau. Bấm vào từng mục để xem mô tả, hình ảnh và thông tin giá.", "Each instrument family comes in diverse materials and keys. Click to view descriptions, photos, and pricing.")}</p>
      </section>

      <section className="products-section section" style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 20px 60px" }}>
        <div className="product-category-list">
          {displayedProductCategories.map((category, i) => (
            <article className={openCategory === i ? "product-category is-open" : "product-category"} key={category.title}>
              <button className="product-category-button" onClick={() => setOpenCategory(openCategory === i ? null : i)} aria-expanded={openCategory === i}>
                <span className="product-category-image" style={{ backgroundImage: `linear-gradient(90deg,rgba(65,13,30,.18),rgba(65,13,30,.02)),url(${category.image})` }} />
                <span><small>{t("NHÓM SẢN PHẨM", "PRODUCT GROUP")} 0{i + 1}</small><b>{category.title}</b><em>{category.intro}</em></span>
                <i>{openCategory === i ? "−" : "+"}</i>
              </button>
              {openCategory === i && (
                <div className="product-detail-grid">
                  {category.products.map((product) => (
                    <div className="product-item" key={product.name}>
                      <div className="product-thumb" style={{ backgroundImage: `url(${"image" in product && product.image ? product.image : category.image})` }}><span>{product.name}</span></div>
                      <div className="product-item-copy">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <div>
                          <PriceTag price={product.price} />
                          {parsePrice(product.price).effectiveAmount ? (
                            <button className="button button-wine" onClick={() => { setPaymentTitle(product.name); setPaymentAmount(parsePrice(product.price).effectiveAmount); setPaymentOpen(true); }}>{t("Mua qua VietQR", "Buy via VietQR")}</button>
                          ) : (
                            <Link className="button button-wine" href={`/dang-ky-hoc?subject=${encodeURIComponent(`Mua sáo - ${product.name}`)}`}>{t("Nhận tư vấn →", "Get Consultation →")}</Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        purchaseTitle={paymentTitle}
        defaultAmount={paymentAmount}
        paymentBank={paymentSettings?.tag || "STB · Sacombank"}
        paymentAccount={paymentSettings?.price || "030046023451"}
        paymentAccountName={paymentSettings?.excerpt || "QUACH HA VAN"}
        customQrUrl={paymentSettings?.imageUrl}
      />

      <div style={{ textAlign: "center", paddingBottom: 40 }}>
        <Link className="button button-outline" href="/">{t("← Quay lại trang chủ", "← Back to Homepage")}</Link>
      </div>
      <ServicePageFooter />
    </main>
  );
}

// 04. KHÓA HỌC QUAY SẴN & VIDEO TỪNG BÀI
export function RecordedCoursesPage() {
  const { t, translate } = useLanguage();
  const { visibleCollection, paymentSettings } = useServiceData();
  const [courseTab, setCourseTab] = useState<"courses" | "videos">("courses");
  const [openRecordedCourse, setOpenRecordedCourse] = useState<number | null>(0);
  const [openVideoGroup, setOpenVideoGroup] = useState<number | null>(0);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentTitle, setPaymentTitle] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const cmsCourseGroups = visibleCollection("course-groups");
  const cmsCourseItems = visibleCollection("course-items");
  const fallbackCourses = [
    { instrument: "Sáo trúc", image: "/carousel-saotruc.webp", items: [
      { name: "Dân ca & nhạc cổ ba miền", detail: "Tác phẩm tiêu biểu miền Bắc, Trung và Nam; hướng dẫn luyến láy, hơi và phong cách.", price: "399.000đ", showPrice: true, slug: "dan-ca-nhac-co-ba-mien" },
      { name: "Nhạc âm hưởng dân ca, dân gian", detail: "Xử lý các ca khúc mới mang màu sắc dân gian Việt Nam.", price: "399.000đ", showPrice: true, slug: "nhac-am-huong-dan-ca" },
      { name: "Nhạc trữ tình & Bolero", detail: "Kỹ thuật rung hơi, nhả chữ và tạo câu nhạc mềm mại, tình cảm.", price: "399.000đ", showPrice: true, slug: "nhac-tru-tinh-bolero" },
      { name: "Nhạc trẻ", detail: "Chuyển soạn và trình diễn các ca khúc hiện đại trên sáo trúc.", price: "399.000đ", showPrice: true, slug: "nhac-tre" },
    ]},
    { instrument: "Sáo Dizi", image: "/carousel-dizi.webp", items: [
      { name: "Dizi cơ bản & 15 nhạc phẩm Trung Quốc", detail: "Từ dán màng rung, hệ ngón đến 15 tác phẩm kinh điển.", price: "599.000đ", showPrice: true, slug: "dizi-co-ban-15-tac-pham" },
      { name: "Nhạc Hoa lời Việt", detail: "Tuyển tập ca khúc quen thuộc với hướng dẫn diễn cảm chi tiết.", price: "399.000đ", showPrice: true, slug: "nhac-hoa-loi-viet" },
    ]},
    { instrument: "Sáo mèo", image: "/carousel-saotruc.webp", items: [
      { name: "Sáo mèo từ cơ bản đến biểu diễn", detail: "Làm chủ lam đồng, hệ ngón và phong cách âm nhạc vùng cao.", price: "499.000đ", showPrice: true, slug: "sao-meo-co-ban" },
    ]},
    { instrument: "Recorder", image: "/carousel-recorder.webp", items: [
      { name: "Nhạc ngũ cung Việt Nam", detail: "Giai điệu Việt Nam được chuyển soạn phù hợp cho recorder.", price: "299.000đ", showPrice: true, slug: "recorder-ngu-cung-viet-nam" },
      { name: "Giáo trình Steiner", detail: "Lộ trình cảm thụ, hơi, ngón và đọc nhạc theo từng cấp độ.", price: "399.000đ", showPrice: true, slug: "giao-trinh-steiner" },
    ]},
  ];

  const rawRecordedCourses = cmsCourseGroups.length ? cmsCourseGroups.map((group) => ({
    instrument: group.title, image: group.imageUrl || "/carousel-saotruc.webp",
    items: cmsCourseItems.filter((item) => item.tag === group.slug).map((item) => ({
      slug: item.slug, name: item.title, detail: item.excerpt, price: item.price || "Liên hệ", showPrice: Boolean(item.price && item.price.toLocaleLowerCase("vi") !== "liên hệ"),
    })),
  })) : fallbackCourses;

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
  const fallbackSingleVideoGroups = [
    { instrument: "Sáo trúc", image: "/carousel-saotruc.webp", description: "Dân ca, nhạc trữ tình và nhạc trẻ chuyển soạn cho sáo trúc.", songs: [{ name: "Bèo dạt mây trôi", slug: "beo-dat-may-troi", detail: "Video HD · Sheet nốt chuẩn · Hướng dẫn luyến láy", price: "99.000đ", showPrice: true }, { name: "Về quê", slug: "ve-que", detail: "Video HD · Sheet nốt chuẩn · Hướng dẫn luyến láy", price: "99.000đ", showPrice: true }, { name: "Tình ca Tây Bắc", slug: "tinh-ca-tay-bac", detail: "Video HD · Sheet nốt chuẩn · Hướng dẫn luyến láy", price: "99.000đ", showPrice: true }] },
    { instrument: "Sáo Dizi", image: "/carousel-dizi.webp", description: "Nhạc Trung Hoa kinh điển với màng rung và kỹ thuật luyến láy.", songs: [{ name: "Đại Ngư", slug: "dai-ngu", detail: "Video HD · Kỹ thuật màng rung & luyến láy cổ phong", price: "129.000đ", showPrice: true }, { name: "Thần Thoại", slug: "than-thoai", detail: "Video HD · Kỹ thuật màng rung & luyến láy cổ phong", price: "129.000đ", showPrice: true }] },
  ];

  const displayedSingleVideoGroups = cmsSingleVideos.length ? [
    {
      instrument: "Tuyển tập video hướng dẫn", image: "/carousel-saotruc.webp", description: "Video hướng dẫn từng bài tác phẩm chọn lọc",
      songs: cmsSingleVideos.map((v) => ({
        name: translate(v.title), slug: v.slug, detail: translate(v.excerpt) || "Video bài học chất lượng cao",
        price: translate(v.price) || "99.000đ", showPrice: Boolean(v.price && v.price.toLowerCase() !== "liên hệ"),
      })),
    }
  ] : fallbackSingleVideoGroups.map((g) => ({
    ...g,
    instrument: translate(g.instrument),
    description: translate(g.description),
    songs: g.songs.map((s) => ({ ...s, name: translate(s.name), detail: translate(s.detail), price: translate(s.price) })),
  }));

  function openPayment(title: string, price?: string) {
    setPaymentTitle(title);
    setPaymentAmount(price ? parsePrice(price).effectiveAmount : "");
    setPaymentOpen(true);
  }

  return (
    <main className="subject-page content-page">
      <ServicePageHeader />
      <section className="content-list-hero">
        <p className="eyebrow">{t("HỌC MỌI LÚC · XEM LẠI TRỌN ĐỜI", "LEARN ANYTIME · LIFETIME ACCESS")}</p>
        <h1>{t("Khóa học & video quay sẵn", "Video Courses & Masterclasses")}</h1>
        <p>{t("Chọn một lộ trình đầy đủ hoặc mua riêng từng video tác phẩm theo đúng nhạc cụ bạn đang chơi.", "Select structured roadmaps or individual song masterclasses tailored to your instrument.")}</p>
      </section>

      <section className="recorded-section section" style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 20px 60px" }}>
        <div className="recorded-tabs" role="tablist" aria-label={t("Loại nội dung quay sẵn", "Recorded content types")}>
          <button className={courseTab === "courses" ? "active" : ""} onClick={() => setCourseTab("courses")} role="tab" aria-selected={courseTab === "courses"}>{t("I. Khóa học theo bộ môn", "I. Courses by Instrument")}</button>
          <button className={courseTab === "videos" ? "active" : ""} onClick={() => setCourseTab("videos")} role="tab" aria-selected={courseTab === "videos"}>{t("II. Video quay từng bài", "II. Individual Song Videos")}</button>
        </div>

        {courseTab === "courses" ? (
          <div className="recorded-course-list">
            {displayedRecordedCourses.map((course, i) => (
              <article className={openRecordedCourse === i ? "recorded-course is-open" : "recorded-course"} key={course.instrument}>
                <button className="recorded-course-summary" onClick={() => setOpenRecordedCourse(openRecordedCourse === i ? null : i)} aria-expanded={openRecordedCourse === i}>
                  <span className="recorded-cover" style={{ backgroundImage: `linear-gradient(0deg,rgba(69,14,31,.82),transparent 70%),url(${course.image})` }}><small>{t("KHÓA HỌC", "COURSE")} 0{i + 1}</small><h3>{course.instrument}</h3></span>
                  <span className="recorded-summary-copy"><small>{t("CHƯƠNG TRÌNH QUAY SẴN", "RECORDED PROGRAM")}</small><b>{t("Khóa học", "Course")} {course.instrument}</b><em>{course.items.length} {t("nội dung · Học mọi lúc · Xem lại trọn đời", "lessons · Learn anytime · Lifetime access")}</em></span>
                  <i>{openRecordedCourse === i ? "−" : "+"}</i>
                </button>
                {openRecordedCourse === i && (
                  <div className="recorded-lessons">
                    {course.items.map((item, j) => (
                      <div key={item.name}>
                        <span>{i + 1}.{j + 1}</span>
                        <p><Link className="catalog-detail-link" href={`/khoa-hoc/${item.slug}`}>{item.name}</Link><small>{item.detail}</small></p>
                        <div className="purchase-action">
                          <small>{t("GIÁ KHÓA HỌC", "COURSE TUITION")}</small>
                          <PriceTag price={item.price} />
                          {parsePrice(item.price).effectiveAmount ? (
                            <button onClick={() => openPayment(`${t("Khóa học", "Course")} ${course.instrument} – ${item.name}`, item.price)}>{t("Mua ngay qua VietQR", "Buy via VietQR")}</button>
                          ) : (
                            <Link className="button button-wine" href={`/dang-ky-hoc?subject=${encodeURIComponent(`Khóa học ${course.instrument} - ${item.name}`)}`}>{t("Nhận tư vấn →", "Get Consultation →")}</Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="single-video-catalog">
            <article className="custom-video-card">
              <div>
                <span>✦</span>
                <p>
                  <small>{t("VIDEO CÁ NHÂN HÓA", "CUSTOM VIDEO LESSON")}</small>
                  <b>{t("Bài quay theo yêu cầu", "Custom Video on Demand")}</b>
                  <em>{t("Gửi tên bài, tone sáo và yêu cầu kỹ thuật. Sáo Trúc Âu Cơ sẽ quay video hướng dẫn riêng phù hợp với bạn.", "Send song title, key, and level. Au Co Bamboo Flute will record a tailored tutorial video for you.")}</em>
                </p>
              </div>
              <strong>{t("Liên hệ", "Contact")}</strong>
              <button onClick={() => openPayment(t("Bài quay theo yêu cầu", "Custom Video on Demand"))}>{t("Gửi yêu cầu", "Send Request")}</button>
            </article>
            <div className="video-group-list">
              {displayedSingleVideoGroups.map((group, i) => (
                <article className={openVideoGroup === i ? "video-group is-open" : "video-group"} key={group.instrument}>
                  <button className="video-group-button" onClick={() => setOpenVideoGroup(openVideoGroup === i ? null : i)} aria-expanded={openVideoGroup === i}>
                    <span className="video-group-image" style={{ backgroundImage: `linear-gradient(0deg,rgba(70,14,31,.58),transparent),url(${group.image})` }}><i>▶</i></span>
                    <span><small>{t("NHẠC CỤ", "INSTRUMENT")} 0{i + 1}</small><b>{group.instrument}</b><em>{group.description}</em></span>
                    <strong>{group.songs.length} {t("bài", "songs")}</strong>
                    <i>{openVideoGroup === i ? "−" : "+"}</i>
                  </button>
                  {openVideoGroup === i && (
                    <div className="video-song-list">
                      {group.songs.map((song, j) => (
                        <div key={song.name}>
                          <span>{String(j + 1).padStart(2, "0")}</span>
                          <p><Link className="catalog-detail-link" href={`/video/${song.slug}`}>{song.name}</Link><small>{song.detail}</small></p>
                          <div className="purchase-action">
                            <small>{t("GIÁ VIDEO", "VIDEO PRICE")}</small>
                            <PriceTag price={song.price} />
                            {parsePrice(song.price).effectiveAmount ? (
                              <button onClick={() => openPayment(`Video ${group.instrument} – ${song.name}`, song.price)}>{t("Mua ngay qua VietQR", "Buy via VietQR")}</button>
                            ) : (
                              <Link className="button button-wine" href={`/dang-ky-hoc?subject=${encodeURIComponent(`Video ${group.instrument} - ${song.name}`)}`}>{t("Nhận tư vấn →", "Get Consultation →")}</Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        purchaseTitle={paymentTitle}
        defaultAmount={paymentAmount}
        paymentBank={paymentSettings?.tag || "STB · Sacombank"}
        paymentAccount={paymentSettings?.price || "030046023451"}
        paymentAccountName={paymentSettings?.excerpt || "QUACH HA VAN"}
        customQrUrl={paymentSettings?.imageUrl}
      />

      <div style={{ textAlign: "center", paddingBottom: 40 }}>
        <Link className="button button-outline" href="/">{t("← Quay lại trang chủ", "← Back to Homepage")}</Link>
      </div>
      <ServicePageFooter />
    </main>
  );
}

// 05. GIÁO TRÌNH & SHEET CHUYỂN SOẠN
export function MaterialsPage() {
  const { t, translate } = useLanguage();
  const { visibleCollection, paymentSettings } = useServiceData();
  const [materialTab, setMaterialTab] = useState<"curriculum" | "sheets">("curriculum");
  const [openGroup, setOpenGroup] = useState<number | null>(0);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentTitle, setPaymentTitle] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const fallbackCurriculums = [
    { instrument: "Sáo trúc", image: "/carousel-saotruc.webp", items: [
      { name: "Giáo trình tổng hợp", detail: "Lộ trình đầy đủ từ nhập môn đến xử lý tác phẩm.", price: "499.000đ", showPrice: true, slug: "giao-trinh-tong-hop" },
      { name: "Giáo trình cơ bản", detail: "Tư thế, khẩu hình, hơi, ngón và đọc nhạc nền tảng.", price: "249.000đ", showPrice: true, slug: "giao-trinh-co-ban" },
      { name: "Giáo trình nâng cao", detail: "Rung hơi, luyến láy, kỹ thuật nhanh và biểu cảm.", price: "399.000đ", showPrice: true, slug: "giao-trinh-nang-cao" },
      { name: "Giáo trình gam & etude", detail: "Hệ thống bài luyện gam, ngón và etude theo cấp độ.", price: "299.000đ", showPrice: true, slug: "giao-trinh-gam-etude" },
      { name: "Giáo trình dân ca", detail: "Dân ca ba miền cùng hướng dẫn xử lý phong cách.", price: "299.000đ", showPrice: true, slug: "giao-trinh-dan-ca" },
    ]},
    { instrument: "Sáo Dizi", image: "/carousel-dizi.webp", items: [
      { name: "Giáo trình tổng hợp Dizi", detail: "Từ dán màng rung đến hoàn thiện tác phẩm Dizi.", price: "599.000đ", showPrice: true, slug: "giao-trinh-dizi-tong-hop" },
      { name: "Giáo trình cơ bản Dizi", detail: "Hơi, ngón, màng rung và kỹ thuật nền tảng.", price: "299.000đ", showPrice: true, slug: "giao-trinh-co-ban-dizi" },
      { name: "Giáo trình nâng cao Dizi", detail: "Luyến, láy, rung và kỹ thuật biểu diễn cổ phong.", price: "449.000đ", showPrice: true, slug: "giao-trinh-nang-cao-dizi" },
      { name: "Giáo trình gam & etude Dizi", detail: "Bài luyện gam và etude riêng cho hệ Dizi.", price: "299.000đ", showPrice: true, slug: "giao-trinh-gam-etude-dizi" },
      { name: "Giáo trình dân ca Dizi", detail: "Tác phẩm dân gian Trung Hoa tuyển chọn.", price: "349.000đ", showPrice: true, slug: "giao-trinh-dan-ca-dizi" },
    ]},
    { instrument: "Sáo Recorder", image: "/carousel-recorder.webp", items: [
      { name: "Giáo trình tổng hợp Recorder", detail: "Chương trình Recorder toàn diện theo từng cấp độ.", price: "399.000đ", showPrice: true, slug: "giao-trinh-tong-hop-sao-recorder" },
      { name: "Giáo trình cơ bản Recorder", detail: "Hơi, ngón, nhịp và đọc bản nhạc cho người mới.", price: "199.000đ", showPrice: true, slug: "giao-trinh-co-ban-sao-recorder" },
      { name: "Giáo trình nâng cao Recorder", detail: "Kỹ thuật nâng cao, hòa tấu và xử lý tác phẩm.", price: "349.000đ", showPrice: true, slug: "giao-trinh-nang-cao-sao-recorder" },
    ]},
  ];

  const fallbackSheets = [
    { instrument: "Sáo trúc", image: "/carousel-saotruc.webp", items: [
      { name: "Tuyển tập sheet sáo trúc", detail: "Dân ca, trữ tình, nhạc trẻ và tác phẩm biểu diễn.", price: "79.000đ", showPrice: true, slug: "tuyen-tap-sheet-sao-truc" },
      { name: "Sheet kèm ngón bấm", detail: "Bản nhạc trình bày rõ ràng, có ký hiệu ngón hỗ trợ.", price: "99.000đ", showPrice: true, slug: "sheet-kem-ngon-bam" },
    ]},
    { instrument: "Sáo Dizi", image: "/carousel-dizi.webp", items: [
      { name: "Tuyển tập sheet Dizi", detail: "Nhạc Hoa, cổ phong và nhạc phim chuyển soạn cho Dizi.", price: "99.000đ", showPrice: true, slug: "tuyen-tap-sheet-dizi" },
      { name: "Sheet kèm kỹ thuật", detail: "Đánh dấu hơi, luyến láy và vị trí xử lý màng rung.", price: "129.000đ", showPrice: true, slug: "sheet-kem-ky-thuat-dizi" },
    ]},
    { instrument: "Sáo Recorder", image: "/carousel-recorder.webp", items: [
      { name: "Tuyển tập sheet Recorder", detail: "Nhạc thiếu nhi, nhạc phim và ngũ cung Việt Nam.", price: "69.000đ", showPrice: true, slug: "tuyen-tap-sheet-recorder" },
      { name: "Sheet hòa tấu Recorder", detail: "Bản song tấu và hòa tấu phân bè theo trình độ.", price: "Liên hệ", showPrice: false, slug: "sheet-hoa-tau-recorder" },
    ]},
  ];

  const rawCurriculums = visibleCollection("curriculums");
  const rawSheets = visibleCollection("sheets");
  const rawMaterials = visibleCollection("materials");

  const allCurriculumEntries = [...rawCurriculums, ...rawMaterials.filter((m) => m.tag.startsWith("giao-trinh:") || !m.tag.startsWith("sheet:"))];
  const allSheetEntries = [...rawSheets, ...rawMaterials.filter((m) => m.tag.startsWith("sheet:"))];

  const disciplineInfo: Record<string, { name: string; image: string }> = {
    "sao-truc": { name: "Sáo trúc Việt Nam", image: "/carousel-saotruc.webp" },
    "sao-dizi": { name: "Sáo Dizi", image: "/carousel-dizi.webp" },
    "sao-recorder": { name: "Sáo Recorder", image: "/carousel-recorder.webp" },
    "recorder": { name: "Sáo Recorder", image: "/carousel-recorder.webp" },
    "tieu-xiao": { name: "Tiêu & Xiao", image: "/carousel-tieu.webp" },
    "dong-tieu-xiao": { name: "Tiêu & Xiao", image: "/carousel-tieu.webp" },
    "flute": { name: "Flute", image: "/carousel-flute.webp" },
    "sao-meo": { name: "Sáo mèo", image: "/carousel-saotruc.webp" },
    "sao-hmong": { name: "Sáo H’Mông", image: "/carousel-saotruc.webp" },
  };

  function groupEntriesByDiscipline(entriesList: CmsEntry[], fallbackList: typeof fallbackCurriculums) {
    if (!entriesList.length) return fallbackList;
    const groupsMap: Record<string, { instrument: string; image: string; items: Array<{ name: string; detail: string; price: string; showPrice: boolean; slug: string }> }> = {};

    for (const e of entriesList) {
      const cleanTag = e.tag.replace(/^(giao-trinh|sheet):/, "").trim() || "sao-truc";
      const info = disciplineInfo[cleanTag] || { name: e.tag || "Bộ môn khác", image: e.imageUrl || "/carousel-saotruc.webp" };
      if (!groupsMap[cleanTag]) {
        groupsMap[cleanTag] = {
          instrument: info.name,
          image: info.image,
          items: [],
        };
      }
      groupsMap[cleanTag].items.push({
        name: e.title,
        detail: e.excerpt || "Tài liệu đào tạo chuẩn",
        price: e.price || "Liên hệ",
        showPrice: Boolean(e.price && e.price.toLowerCase() !== "liên hệ" && e.price.toLowerCase() !== "contact"),
        slug: e.slug,
      });
    }

    return Object.values(groupsMap);
  }

  const displayedCurriculumGroups = groupEntriesByDiscipline(allCurriculumEntries, fallbackCurriculums).map((g) => ({
    ...g,
    instrument: translate(g.instrument),
    items: g.items.map((it) => ({ ...it, name: translate(it.name), detail: translate(it.detail), price: translate(it.price) })),
  }));

  const displayedSheetGroups = groupEntriesByDiscipline(allSheetEntries, fallbackSheets).map((g) => ({
    ...g,
    instrument: translate(g.instrument),
    items: g.items.map((it) => ({ ...it, name: translate(it.name), detail: translate(it.detail), price: translate(it.price) })),
  }));

  function openPayment(title: string, price?: string) {
    setPaymentTitle(title);
    setPaymentAmount(price ? parsePrice(price).effectiveAmount : "");
    setPaymentOpen(true);
  }

  return (
    <main className="subject-page content-page">
      <ServicePageHeader />
      <section className="content-list-hero">
        <p className="eyebrow">{t("GIÁO TRÌNH & SHEET CHUYỂN SOẠN", "CURRICULUM & ARRANGED SHEETS")}</p>
        <h1>{t("Giáo trình & Sheet nhạc", "Curriculum & Sheet Music")}</h1>
        <p>{t("Chọn bộ môn để xem chi tiết. Mỗi tài liệu đều có giá phía trên nút mua VietQR; các mục ẩn giá sẽ hiển thị “Liên hệ”.", "Select a discipline for details. Pricing is displayed above each VietQR purchase button.")}</p>
      </section>

      <section className="materials-section section" style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 20px 60px" }}>
        <div className="recorded-tabs" role="tablist">
          <button role="tab" className={materialTab === "curriculum" ? "active" : ""} onClick={() => { setMaterialTab("curriculum"); setOpenGroup(0); }}>{t("I. Giáo trình", "I. Curriculums")}</button>
          <button role="tab" className={materialTab === "sheets" ? "active" : ""} onClick={() => { setMaterialTab("sheets"); setOpenGroup(0); }}>{t("II. Sheet chuyển soạn", "II. Arranged Sheet Music")}</button>
        </div>

        <div className="material-groups">
          {(materialTab === "curriculum" ? displayedCurriculumGroups : displayedSheetGroups).map((group, i) => (
            <article className={openGroup === i ? "material-group is-open" : "material-group"} key={`${materialTab}-${group.instrument}`}>
              <button className="material-group-button" onClick={() => setOpenGroup(openGroup === i ? null : i)} aria-expanded={openGroup === i}>
                <span className="material-cover" style={{ backgroundImage: `linear-gradient(90deg,rgba(60,10,28,.15),rgba(60,10,28,.25)),url(${group.image})` }} />
                <span><small>{materialTab === "curriculum" ? t("BỘ MÔN GIÁO TRÌNH", "CURRICULUM DISCIPLINE") : t("BỘ MÔN SHEET", "SHEET MUSIC DISCIPLINE")}</small><b>{group.instrument}</b><em>{group.items.length} {t("tài liệu hiện có", "documents available")}</em></span>
                <i>{openGroup === i ? "−" : "+"}</i>
              </button>
              {openGroup === i && (
                <div className="material-items">
                  {group.items.map((item, j) => (
                    <div key={item.name}>
                      <span>{String(j + 1).padStart(2, "0")}</span>
                      <p><Link className="catalog-detail-link" href={`/${materialTab === "curriculum" ? "giao-trinh" : "sheet"}/${item.slug}`}>{item.name}</Link><small>{item.detail}</small></p>
                      <div className="purchase-action">
                        <small>{t("GIÁ TÀI LIỆU", "MATERIAL PRICE")}</small>
                        <PriceTag price={item.price} />
                        {parsePrice(item.price).effectiveAmount ? (
                          <button onClick={() => openPayment(`${materialTab === "curriculum" ? t("Giáo trình", "Curriculum") : t("Sheet", "Sheet")} ${group.instrument} – ${item.name}`, item.price)}>{t("Mua ngay qua VietQR", "Buy via VietQR")}</button>
                        ) : (
                          <Link className="button button-wine" href={`/dang-ky-hoc?subject=${encodeURIComponent(`${materialTab === "curriculum" ? "Giáo trình" : "Sheet"} ${group.instrument} - ${item.name}`)}`}>{t("Nhận tư vấn →", "Get Consultation →")}</Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        {materialTab === "sheets" && (
          <div className="custom-sheet-card" style={{ marginTop: 24 }}>
            <span>✎</span>
            <div>
              <small>{t("DỊCH VỤ CHUYỂN SOẠN RIÊNG", "CUSTOM ARRANGEMENT SERVICE")}</small>
              <h3>{t("Yêu cầu sheet theo bài", "Custom Sheet Arrangement")}</h3>
              <p>{t("Gửi tên bài, tone sáo và yêu cầu ký âm; Sáo Trúc Âu Cơ sẽ tư vấn giá và thời gian hoàn thiện qua Zalo.", "Send song title, key, and notation requirements; Au Co Bamboo Flute will advise pricing and timeline via Zalo.")}</p>
            </div>
            <Link className="button button-wine" href="/dang-ky-hoc?subject=Yêu%20cầu%20soạn%20sheet">{t("Liên hệ qua Zalo →", "Contact via Zalo →")}</Link>
          </div>
        )}
      </section>

      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        purchaseTitle={paymentTitle}
        defaultAmount={paymentAmount}
        paymentBank={paymentSettings?.tag || "STB · Sacombank"}
        paymentAccount={paymentSettings?.price || "030046023451"}
        paymentAccountName={paymentSettings?.excerpt || "QUACH HA VAN"}
        customQrUrl={paymentSettings?.imageUrl}
      />

      <div style={{ textAlign: "center", paddingBottom: 40 }}>
        <Link className="button button-outline" href="/">{t("← Quay lại trang chủ", "← Back to Homepage")}</Link>
      </div>
      <ServicePageFooter />
    </main>
  );
}

// 06. THU ÂM & QUAY VIDEO (STUDIO)
export function StudioPage() {
  const { t, translate } = useLanguage();
  const { visibleCollection, paymentSettings } = useServiceData();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentTitle, setPaymentTitle] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const fallbackStudioPackages = [
    { icon: "◉", title: "Thu âm cơ bản", subtitle: "Một nhạc cụ · Một tác phẩm", price: "900.000đ", showPrice: true, features: ["Thu một nhạc cụ tại studio", "Chỉnh sửa lỗi và lọc tạp âm", "Mixing & mastering cơ bản", "Bàn giao WAV và MP3", "01 lần chỉnh sửa"] },
    { icon: "♫", title: "Thu âm hoàn chỉnh", subtitle: "Bản thu sẵn sàng phát hành", price: "1.500.000đ", showPrice: true, features: ["Tư vấn tone và cấu trúc bài", "Thu nhiều lượt, chọn take tốt", "Mixing & mastering hoàn chỉnh", "Ghép beat hoặc piano có sẵn", "Bàn giao WAV, MP3 và instrumental"] },
    { icon: "▶", title: "Quay video biểu diễn", subtitle: "Hình ảnh chỉn chu, giàu cảm xúc", price: "1.800.000đ", showPrice: true, features: ["Quay Full HD với nhiều góc máy", "Hỗ trợ bố cục và diễn xuất", "Dựng video, chỉnh màu cơ bản", "01 bản ngang YouTube/Facebook", "01 lần chỉnh sửa"] },
    { icon: "◆", title: "MV trọn gói", subtitle: "Thu âm · Quay hình · Hậu kỳ", price: "Liên hệ", showPrice: false, features: ["Lên ý tưởng và kịch bản hình ảnh", "Thu âm, mixing & mastering", "Quay studio hoặc ngoại cảnh", "Dựng MV, chỉnh màu, chèn tiêu đề", "Có thể thêm bản dọc TikTok/Reels"] },
    { icon: "★", title: "Video kỷ niệm học viên", subtitle: "Lưu lại dấu mốc âm nhạc", price: "1.200.000đ", showPrice: true, features: ["Tư vấn chọn bài phù hợp", "Thu âm hoặc thu tiếng trực tiếp", "Quay video biểu diễn", "Dựng clip hoàn chỉnh", "Tặng ảnh bìa video"] },
  ];

  const cmsStudioPackages = visibleCollection("studio-packages");
  const displayedStudioPackages = (cmsStudioPackages.length ? cmsStudioPackages.map((entry) => ({
    icon: entry.tag || "♪", title: entry.title, subtitle: entry.excerpt, price: entry.price || "Liên hệ",
    showPrice: Boolean(entry.price && entry.price.toLocaleLowerCase("vi") !== "liên hệ"), features: entry.content.split(/\n+/).map((f) => f.trim()).filter(Boolean),
  })) : fallbackStudioPackages).map((p) => ({
    ...p, title: translate(p.title), subtitle: translate(p.subtitle), price: translate(p.price),
    features: p.features.map((f) => translate(f)),
  }));

  const studioSteps = ["Gửi bài & yêu cầu", "Tư vấn tone, beat, ý tưởng", "Báo giá & đặt lịch", "Thu âm hoặc quay hình", "Duyệt bản nháp", "Hoàn thiện & bàn giao"];

  function openPayment(title: string, price?: string) {
    setPaymentTitle(title);
    setPaymentAmount(price ? parsePrice(price).effectiveAmount : "");
    setPaymentOpen(true);
  }

  return (
    <main className="subject-page content-page">
      <ServicePageHeader />
      <section className="content-list-hero">
        <p className="eyebrow">{t("THU ÂM & QUAY VIDEO", "AUDIO RECORDING & MV PRODUCTION")}</p>
        <h1>{t("Thu âm & Quay MV Studio", "Studio Recording & Music Videos")}</h1>
        <p>{t("Từ một bản thu mộc đến MV hoàn chỉnh, Sáo Trúc Âu Cơ đồng hành ở cả âm thanh, hình ảnh và cách thể hiện để giữ được màu sắc riêng của người biểu diễn.", "From raw acoustic tracks to full music videos, Au Co Bamboo Flute accompanies you through audio, visuals, and expression to preserve your unique identity.")}</p>
      </section>

      <section className="studio-section section" style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 20px 60px" }}>
        <div className="studio-package-grid">
          {displayedStudioPackages.map((item) => (
            <article className="studio-package" key={item.title}>
              <div className="studio-package-top"><span>{item.icon}</span><div><small>{item.subtitle}</small><h3>{item.title}</h3></div></div>
              <ul>{item.features.map((feature) => <li key={feature}>✓ <span>{feature}</span></li>)}</ul>
              <div className="studio-buy">
                <small>{t("GIÁ THAM KHẢO", "STARTING PRICE")}</small>
                <PriceTag price={item.price} />
                {parsePrice(item.price).effectiveAmount ? (
                  <button onClick={() => openPayment(`${t("Đặt cọc", "Deposit")} ${item.title}`, item.price)}>{t("Đặt cọc qua VietQR", "Deposit via VietQR")}</button>
                ) : (
                  <Link className="button button-wine" href={`/dang-ky-hoc?subject=${encodeURIComponent(`Thu âm - ${item.title}`)}`}>{t("Nhận báo giá qua Zalo", "Get Quote via Zalo")}</Link>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="studio-info-grid" style={{ marginTop: 40 }}>
          <article>
            <p className="eyebrow">{t("QUY TRÌNH THỰC HIỆN", "WORKFLOW PROCESS")}</p>
            <h3>{t("Rõ ràng trong từng bước", "Clear step-by-step milestones")}</h3>
            <ol>{studioSteps.map((step, i) => <li key={step}><span>{String(i + 1).padStart(2, "0")}</span>{translate(step)}</li>)}</ol>
          </article>
          <article>
            <p className="eyebrow">{t("LƯU Ý DÀNH CHO KHÁCH HÀNG", "CLIENT GUIDELINES")}</p>
            <h3>{t("Chuẩn bị trước buổi thu", "Pre-session checklist")}</h3>
            <ul>
              <li>{t("Gửi trước bản thu nháp, sheet, beat hoặc ca khúc cần thực hiện.", "Send your demo, sheet, backing track or song in advance.")}</li>
              <li>{t("Mang theo nhạc cụ quen tay (nếu tự thể hiện phần nhạc cụ).", "Bring your own instrument if you perform your own track.")}</li>
              <li>{t("Trao đổi trước về tone, phong cách phối khí và yêu cầu dựng hình.", "Discuss key, arrangement style, and video editing needs.")}</li>
              <li>{t("Hỗ trợ chỉnh sửa và hoàn thiện bản thu theo yêu cầu.", "Revisions and final polish supported according to agreement.")}</li>
            </ul>
          </article>
        </div>
      </section>

      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        purchaseTitle={paymentTitle}
        defaultAmount={paymentAmount}
        paymentBank={paymentSettings?.tag || "STB · Sacombank"}
        paymentAccount={paymentSettings?.price || "030046023451"}
        paymentAccountName={paymentSettings?.excerpt || "QUACH HA VAN"}
        customQrUrl={paymentSettings?.imageUrl}
      />

      <div style={{ textAlign: "center", paddingBottom: 40 }}>
        <Link className="button button-outline" href="/">{t("← Quay lại trang chủ", "← Back to Homepage")}</Link>
      </div>
      <ServicePageFooter />
    </main>
  );
}

// 07. BOOKING NGHỆ SĨ BIỂU DIỄN
export function BookingPage() {
  const { t, translate } = useLanguage();
  const { visibleCollection, paymentSettings } = useServiceData();
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentTitle, setPaymentTitle] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const fallbackBookingPackages = [
    { icon: "✦", title: "Độc tấu sáo trúc", detail: "1 nghệ sĩ · 3-5 bài hoặc set 45 phút", price: "Từ 1.500.000đ", showPrice: true, features: ["Sáo trúc, Dizi, Tiêu hoặc Flute", "Trang phục truyền thống hoặc hiện đại", "Tự chuẩn bị nhạc nền / beat chất lượng cao", "Phù hợp tiệc gia đình, khai trương, trà đạo"] },
    { icon: "◆", title: "Song tấu / Tam tấu", detail: "2-3 nghệ sĩ · Set 60 phút", price: "Từ 3.000.000đ", showPrice: true, features: ["Sáo trúc + Đàn tranh / Guitar / Piano", "Hòa tấu giao thoa truyền thống & đương đại", "Biểu diễn đón khách hoặc tiết mục đinh", "Phù hợp tiệc cưới, hội nghị, gala dinner"] },
    { icon: "★", title: "Ban nhạc dân tộc", detail: "4-6 nghệ sĩ · Trọn gói sự kiện", price: "Từ 6.000.000đ", showPrice: true, features: ["Sáo, Tranh, Bầu, Nhị, Bộ gõ dân tộc", "Hòa tấu trọn gói: đón khách + khai mạc + tiệc", "Chuyển soạn bài hát riêng theo yêu cầu", "Phù hợp festival, lễ hội, sự kiện quốc tế"] },
  ];

  const cmsBookingPackages = visibleCollection("booking-packages");
  const rawBookingPackages = cmsBookingPackages.length ? cmsBookingPackages.map((entry) => ({
    icon: entry.tag || "♪", title: entry.title, detail: entry.excerpt, price: entry.price || "Liên hệ",
    showPrice: Boolean(entry.price && entry.price.toLocaleLowerCase("vi") !== "liên hệ"), features: entry.content.split(/\n+/).map((f) => f.trim()).filter(Boolean),
  })) : fallbackBookingPackages;
  const displayedBookingPackages = rawBookingPackages.map((b) => ({
    ...b, title: translate(b.title), detail: translate(b.detail), price: translate(b.price),
    features: b.features.map((f) => translate(f)),
  }));

  const bookingEvents = ["Khai trương & khánh thành", "Tiệc cưới & lễ gia tiên", "Hội nghị & gala dinner", "Festival & lễ hội văn hóa", "Sự kiện trường học", "Chương trình nghệ thuật", "Lễ tưởng niệm & truyền thống", "Quay phim & quảng cáo"];

  function openPayment(title: string, price?: string) {
    setPaymentTitle(title);
    setPaymentAmount(price ? parsePrice(price).effectiveAmount : "");
    setPaymentOpen(true);
  }

  return (
    <main className="subject-page content-page">
      <ServicePageHeader />
      <section className="content-list-hero">
        <p className="eyebrow">{t("BOOKING NGHỆ SĨ", "ARTIST BOOKING")}</p>
        <h1>{t("Booking nghệ sĩ biểu diễn", "Artist Performance Booking")}</h1>
        <p>{t("Độc tấu, song tấu, hòa tấu hoặc ban nhạc dân tộc được tư vấn theo quy mô, không gian và tinh thần riêng của mỗi sự kiện.", "Solo, duet, ensemble, or full traditional bands tailored to the scale, acoustic space, and ambiance of your event.")}</p>
      </section>

      <section className="booking-section section" style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 20px 60px" }}>
        <div className="booking-events">{bookingEvents.map((event) => <span key={event}>✦ {translate(event)}</span>)}</div>
        <div className="booking-package-grid">
          {displayedBookingPackages.map((item) => (
            <article className="booking-package" key={item.title}>
              <span className="booking-icon">{item.icon}</span>
              <small>{item.detail}</small>
              <h3>{item.title}</h3>
              <ul>{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              <div>
                <small>{t("GIÁ THAM KHẢO", "STARTING PRICE")}</small>
                <PriceTag price={item.price} />
                {parsePrice(item.price).effectiveAmount ? (
                  <button onClick={() => openPayment(`${t("Đặt cọc booking", "Booking Deposit")} – ${item.title}`, item.price)}>{t("Kiểm tra lịch & đặt cọc", "Check availability & deposit")}</button>
                ) : (
                  <Link className="button button-wine" href={`/dang-ky-hoc?subject=${encodeURIComponent(`Booking - ${item.title}`)}`}>{t("Nhận báo giá qua Zalo", "Get Quote via Zalo")}</Link>
                )}
              </div>
            </article>
          ))}
        </div>

        <button className="booking-detail-toggle" onClick={() => setBookingDetailsOpen(!bookingDetailsOpen)} aria-expanded={bookingDetailsOpen} style={{ marginTop: 30 }}>
          <span><small>{t("THÔNG TIN BOOKING", "BOOKING DETAILS")}</small><b>{bookingDetailsOpen ? t("Ẩn quy trình và điều khoản", "Hide workflow and terms") : t("Xem quy trình, yêu cầu và điều khoản", "View workflow, requirements & terms")}</b></span>
          <i>{bookingDetailsOpen ? "−" : "+"}</i>
        </button>

        {bookingDetailsOpen && (
          <div className="booking-detail-grid">
            <article>
              <small>{t("QUY TRÌNH BOOKING", "BOOKING WORKFLOW")}</small>
              <h3>{t("8 bước xác nhận lịch", "8 steps to schedule confirmation")}</h3>
              <ol>
                <li>{t("Gửi thông tin sự kiện", "Submit event information")}</li>
                <li>{t("Kiểm tra lịch nghệ sĩ", "Check artist availability")}</li>
                <li>{t("Tư vấn tiết mục và đội hình", "Advise repertoire and lineup")}</li>
                <li>{t("Gửi báo giá", "Provide formal quote")}</li>
                <li>{t("Xác nhận hợp đồng, đặt cọc", "Sign agreement & deposit")}</li>
                <li>{t("Thống nhất kịch bản và kỹ thuật", "Align script & soundcheck")}</li>
                <li>{t("Biểu diễn tại sự kiện", "Live performance at event")}</li>
                <li>{t("Thanh toán phần còn lại", "Final balance settlement")}</li>
              </ol>
            </article>
            <article>
              <small>{t("THÔNG TIN CẦN GỬI", "INFORMATION REQUIRED")}</small>
              <h3>{t("Để báo giá chính xác", "For an accurate quotation")}</h3>
              <ul>
                <li>{t("Tên đơn vị và số điện thoại/Zalo", "Organization name & contact phone/Zalo")}</li>
                <li>{t("Loại sự kiện, ngày giờ, địa điểm", "Event type, date, time & venue location")}</li>
                <li>{t("Số tiết mục hoặc thời lượng", "Number of performances or duration")}</li>
                <li>{t("Đội hình và danh sách bài dự kiến", "Preferred lineup and setlist")}</li>
                <li>{t("Yêu cầu trang phục, âm thanh", "Sound system and costume requirements")}</li>
                <li>{t("Ngân sách dự kiến", "Estimated budget range")}</li>
              </ul>
            </article>
            <article>
              <small>{t("CHI PHÍ & ĐIỀU KHOẢN", "EXPENSES & TERMS")}</small>
              <h3>{t("Cần thống nhất trước", "To be agreed beforehand")}</h3>
              <ul>
                <li>{t("Di chuyển, lưu trú ngoài tỉnh", "Travel and lodging for out-of-town events")}</li>
                <li>{t("Tập luyện, chuyển soạn bài mới", "Rehearsal and custom arrangements")}</li>
                <li>{t("Thiết bị, trang phục đặc biệt", "Special stage equipment and outfits")}</li>
                <li>{t("Chính sách đổi ngày hoặc hủy lịch", "Rescheduling and cancellation policies")}</li>
                <li>{t("Giờ thử âm thanh và thời lượng phát sinh", "Soundcheck schedule and overtime terms")}</li>
                <li>{t("Quyền quay phim, livestream và sử dụng hình ảnh", "Media recording, broadcast and livestream rights")}</li>
              </ul>
            </article>
          </div>
        )}
      </section>

      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        purchaseTitle={paymentTitle}
        defaultAmount={paymentAmount}
        paymentBank={paymentSettings?.tag || "STB · Sacombank"}
        paymentAccount={paymentSettings?.price || "030046023451"}
        paymentAccountName={paymentSettings?.excerpt || "QUACH HA VAN"}
        customQrUrl={paymentSettings?.imageUrl}
      />

      <div style={{ textAlign: "center", paddingBottom: 40 }}>
        <Link className="button button-outline" href="/">{t("← Quay lại trang chủ", "← Back to Homepage")}</Link>
      </div>
      <ServicePageFooter />
    </main>
  );
}

// 08. THU ÂM NHẠC CỤ THẬT
export function InstrumentRecordingPage() {
  const { t, translate } = useLanguage();
  const { visibleCollection, paymentSettings } = useServiceData();
  const [recordingDetailsOpen, setRecordingDetailsOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentTitle, setPaymentTitle] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const fallbackInstruments = [
    { icon: "♫", title: "Sáo trúc Việt Nam", tone: "Đô C5, La A4, Sol G4, Rê D5, Mi E5...", price: "Từ 500.000đ", showPrice: true },
    { icon: "◉", title: "Sáo Dizi", tone: "Tone C, D, E, F, G (màng rung sáng/trầm)", price: "Từ 500.000đ", showPrice: true },
    { icon: "♬", title: "Tiêu & Xiao", tone: "Tiêu trúc, Xiao trúc hệ 6/8 lỗ", price: "Từ 500.000đ", showPrice: true },
    { icon: "♩", title: "Sáo mèo & Sáo H'Mông", tone: "Sáo mèo đơn, sáo mèo kép, lam đồng", price: "Từ 500.000đ", showPrice: true },
    { icon: "♪", title: "Recorder & Flute", tone: "Soprano, Alto, Concert Flute", price: "Từ 500.000đ", showPrice: true },
    { icon: "≋", title: "Đàn tranh, Đàn bầu, Đàn nhị", tone: "Nhạc cụ dây truyền thống", price: "Liên hệ", showPrice: false },
  ];

  const cmsRecordingInstruments = visibleCollection("recording-instruments");
  const rawRecordingInstruments = cmsRecordingInstruments.length ? cmsRecordingInstruments.map((entry) => ({
    icon: entry.tag || "♪", title: entry.title, tone: entry.excerpt, price: entry.price || "Liên hệ",
    showPrice: Boolean(entry.price && entry.price.toLocaleLowerCase("vi") !== "liên hệ"),
  })) : fallbackInstruments;
  const displayedRecordingInstruments = rawRecordingInstruments.map((r) => ({
    ...r, title: translate(r.title), tone: translate(r.tone), price: translate(r.price),
  }));

  const recordingPackages = [
    { title: "Đoạn ngắn", detail: "Intro, solo, fill, outro hoặc hiệu ứng · tối đa 60 giây", price: "Từ 500.000đ" },
    { title: "Một track hoàn chỉnh", detail: "Một nhạc cụ xuyên suốt toàn bộ tác phẩm", price: "Từ 900.000đ" },
    { title: "Thu nhiều lớp", detail: "Từ hai lớp âm thanh để tạo chiều sâu cho bản phối", price: "Liên hệ" },
    { title: "Phối nhạc cụ dân tộc", detail: "Đề xuất câu nhạc, cách vào bài và xử lý phong cách", price: "Liên hệ" },
  ];

  function openPayment(title: string, price?: string) {
    setPaymentTitle(title);
    setPaymentAmount(price ? parsePrice(price).effectiveAmount : "");
    setPaymentOpen(true);
  }

  return (
    <main className="subject-page content-page">
      <ServicePageHeader />
      <section className="content-list-hero">
        <p className="eyebrow">{t("THU ÂM NHẠC CỤ THẬT", "REAL INSTRUMENT RECORDING")}</p>
        <h1>{t("Thu âm nhạc cụ thật", "Acoustic Instrument Studio Recording")}</h1>
        <p>{t("Dành cho ca sĩ, nhạc sĩ, nhà sản xuất và người làm nội dung cần một track nhạc cụ giàu cảm xúc, đúng tone, BPM và sẵn sàng đưa vào dự án.", "For singers, songwriters, producers, and creators needing expressive instrument tracks with exact key, BPM, and project readiness.")}</p>
      </section>

      <section className="instrument-recording section" style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 20px 60px" }}>
        <div className="recording-instrument-grid">
          {displayedRecordingInstruments.map((item) => (
            <article key={item.title}>
              <span>{item.icon}</span>
              <small>{t("NHẠC CỤ NHẬN THU", "RECORDING INSTRUMENTS")}</small>
              <h3>{item.title}</h3>
              <p>{item.tone}</p>
              <div>
                <small>{t("GIÁ TỪ", "PRICE FROM")}</small>
                <strong>{item.showPrice ? item.price : t("Liên hệ", "Contact")}</strong>
                {item.showPrice ? (
                  <button onClick={() => openPayment(`${t("Đặt thu âm", "Book recording")} ${item.title}`, item.price)}>{t("Đặt thu qua VietQR", "Book recording via VietQR")}</button>
                ) : (
                  <Link className="button button-wine" href={`/dang-ky-hoc?subject=${encodeURIComponent(`Thu âm nhạc cụ - ${item.title}`)}`}>{t("Gửi yêu cầu riêng", "Send custom request")}</Link>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="recording-package-row" style={{ marginTop: 24 }}>
          {recordingPackages.map((item, i) => (
            <article key={item.title}>
              <span>0{i + 1}</span>
              <div><h3>{translate(item.title)}</h3><p>{translate(item.detail)}</p></div>
              <strong>{translate(item.price)}</strong>
            </article>
          ))}
        </div>

        <div className="recording-brief" style={{ marginTop: 30 }}>
          <div>
            <small>{t("KHÁCH HÀNG CẦN GỬI", "WHAT CLIENTS PROVIDE")}</small>
            <h3>{t("Beat, BPM, tone và phần tham chiếu", "Backing track, BPM, Key & Reference audio")}</h3>
            <p>{t("Gửi file WAV/MP3, sheet, MIDI hoặc audio mẫu; ghi rõ vị trí cần nhạc cụ, cảm xúc, kỹ thuật mong muốn và thời hạn nhận file.", "Send WAV/MP3, sheet, MIDI, or demo audio with desired instrument cues, mood, and deadline.")}</p>
          </div>
          <Link className="button button-wine" href="/dang-ky-hoc?subject=Gửi%20beat%20thu%20nhạc%20cụ">{t("Gửi beat & nhận báo giá →", "Send beat & get quote →")}</Link>
        </div>

        <button className="recording-detail-toggle" onClick={() => setRecordingDetailsOpen(!recordingDetailsOpen)} aria-expanded={recordingDetailsOpen} style={{ marginTop: 30 }}>
          <span><small>{t("THÔNG TIN CHUYÊN MÔN", "TECHNICAL SPECIFICATIONS")}</small><b>{recordingDetailsOpen ? t("Ẩn quy trình và chính sách", "Hide process and policies") : t("Xem quy trình, file bàn giao và bản quyền", "View process, deliverables & licensing")}</b></span>
          <i>{recordingDetailsOpen ? "−" : "+"}</i>
        </button>

        {recordingDetailsOpen && (
          <div className="recording-detail-grid">
            <article>
              <small>{t("HÌNH THỨC THU", "RECORDING MODES")}</small>
              <h3>{t("Linh hoạt theo dự án", "Flexible to project needs")}</h3>
              <ul>
                <li>{t("Thu theo sheet hoàn chỉnh", "Track recorded from full sheet music")}</li>
                <li>{t("Thu theo MIDI hoặc audio mẫu", "Track aligned to MIDI guide or demo")}</li>
                <li>{t("Ứng tấu theo hợp âm và phong cách", "Improvised over chord progressions & mood")}</li>
                <li>{t("Thu bè hoặc nhiều lớp âm thanh", "Layered harmony stems and multitracks")}</li>
                <li>{t("Thu đoạn ngắn hoặc toàn bộ tác phẩm", "Short solo hooks or full-length arrangements")}</li>
              </ul>
            </article>
            <article>
              <small>{t("QUY TRÌNH", "WORKFLOW")}</small>
              <h3>{t("Từ brief đến file gốc", "From brief to master stems")}</h3>
              <ol>
                <li>{t("Gửi beat và yêu cầu", "Send project brief and backing track")}</li>
                <li>{t("Kiểm tra tone, BPM, độ khó", "Verify key, BPM, and complexity")}</li>
                <li>{t("Tư vấn và báo giá", "Consult arrangement and provide quote")}</li>
                <li>{t("Đặt cọc, tiến hành thu", "Confirm deposit and commence recording")}</li>
                <li>{t("Gửi bản nghe thử", "Deliver review sample")}</li>
                <li>{t("Chỉnh sửa và bàn giao", "Revisions and master stems delivery")}</li>
              </ol>
            </article>
            <article>
              <small>{t("FILE BÀN GIAO", "DELIVERABLES")}</small>
              <h3>{t("Sẵn sàng cho producer", "Ready for producers")}</h3>
              <ul>
                <li>{t("WAV riêng từng nhạc cụ", "24-bit/48kHz isolated WAV tracks")}</li>
                <li>{t("MP3 nghe thử", "MP3 preview mix")}</li>
                <li>{t("Track khớp BPM và timeline", "Timeline-aligned stems locked to project grid")}</li>
                <li>{t("Bản dry/wet theo gói", "Dry acoustic and processed wet options")}</li>
                <li>{t("Các take lựa chọn khi đăng ký", "Alternative solo takes upon request")}</li>
              </ul>
            </article>
            <article>
              <small>{t("CHỈNH SỬA & BẢN QUYỀN", "REVISIONS & LICENSING")}</small>
              <h3>{t("Minh bạch trước khi thu", "Transparent before recording")}</h3>
              <ul>
                <li>{t("Ghi rõ số lần chỉnh sửa miễn phí", "Defined complimentary revision rounds")}</li>
                <li>{t("Đổi tone, BPM hoặc phối có thể tính phí thu lại", "Key/tempo changes post-recording quoted separately")}</li>
                <li>{t("Thống nhất quyền sử dụng thương mại", "Commercial release rights guaranteed")}</li>
                <li>{t("Bảo mật tác phẩm chưa phát hành", "Strict NDA for unreleased productions")}</li>
                <li>{t("Chỉ dùng làm sản phẩm mẫu khi được đồng ý", "Portfolio showcase only with client consent")}</li>
              </ul>
            </article>
          </div>
        )}
      </section>

      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        purchaseTitle={paymentTitle}
        defaultAmount={paymentAmount}
        paymentBank={paymentSettings?.tag || "STB · Sacombank"}
        paymentAccount={paymentSettings?.price || "030046023451"}
        paymentAccountName={paymentSettings?.excerpt || "QUACH HA VAN"}
        customQrUrl={paymentSettings?.imageUrl}
      />

      <div style={{ textAlign: "center", paddingBottom: 40 }}>
        <Link className="button button-outline" href="/">{t("← Quay lại trang chủ", "← Back to Homepage")}</Link>
      </div>
      <ServicePageFooter />
    </main>
  );
}
