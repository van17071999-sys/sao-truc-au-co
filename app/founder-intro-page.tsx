"use client";

import Link from "next/link";
import { ServicePageHeader, ServicePageFooter } from "./service-pages";

export function FounderIntroPage() {
  const coreValues = [
    {
      icon: "fa-solid fa-graduation-cap",
      title: "1. Tiếp Cận Từ Số 0",
      color: "text-[#70141D] bg-[#70141D]/10",
      desc: "Giáo trình được chia nhỏ thành các chặng logic, không đòi hỏi kiến thức nhạc lý hàn lâm phức tạp, từ trẻ nhỏ đến người lớn tuổi đều học được dễ dàng.",
    },
    {
      icon: "fa-solid fa-hand-holding-heart",
      title: "2. Đồng Hành Tận Tâm",
      color: "text-[#193822] bg-[#193822]/10",
      desc: "Chỉnh sửa tỉ mỉ từng hơi thở, khẩu hình, tư thế bấm ngón và cảm xúc biểu diễn. Học viên được theo sát tiến độ để tiến bộ vững chắc.",
    },
    {
      icon: "fa-solid fa-certificate",
      title: "3. Chuẩn Âm Tuyệt Đối",
      color: "text-amber-800 bg-amber-500/10",
      desc: "Cảm âm, giáo trình và mọi cây sáo cung cấp đều được kiểm định bằng máy đo tần số chuẩn quốc tế 440Hz, đảm bảo hòa âm hòa tấu chuẩn xác.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAF6F0] text-[#2B2624] selection:bg-[#70141D] selection:text-white flex flex-col justify-between">
      <div>
        <ServicePageHeader />

        <div className="py-10 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#6B625B]">
            <Link href="/" className="hover:text-[#70141D] transition-colors flex items-center gap-1">
              <i className="fa-solid fa-house"></i>
              <span>Trang chủ</span>
            </Link>
            <span>/</span>
            <span className="text-[#70141D] font-semibold">Giới thiệu nhà sáng lập</span>
          </nav>

          {/* Hero Header Section */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#EADBCA] text-xs font-bold text-[#70141D] uppercase tracking-wider shadow-2xs">
              <i className="fa-solid fa-award text-amber-700"></i> Người Sáng Lập & Chủ Nhiệm
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#70141D] tracking-tight leading-tight">
              Sứ Mệnh Lan Tỏa Âm Sắc Sáo Trúc Việt Nam
            </h1>
            <p className="text-base sm:text-lg text-[#5C4D47] leading-relaxed">
              <strong className="text-[#2B2624]">Sáo Trúc Âu Cơ</strong> được sáng lập bởi{" "}
              <span className="text-[#70141D] font-bold">Thầy Quách Hạ Văn</span> với tâm nguyện gìn giữ, phát triển và xây dựng một hệ thống học sáo trúc bài bản, dễ hiểu và truyền cảm hứng nhất cho người yêu âm nhạc dân tộc.
            </p>
          </div>

          {/* Founder Detailed Profile Card */}
          <div className="bg-gradient-to-br from-[#FAF6F0] via-[#F6ECE0] to-[#EADBCA] rounded-3xl p-6 sm:p-10 border-2 border-[#D9C4A6] shadow-xl overflow-hidden relative">
            <div className="relative z-10 space-y-8">
              
              {/* Card Header Tag & Seal */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-[#70141D] font-bold bg-[#70141D]/10 px-4 py-1.5 rounded-full border border-[#70141D]/20 flex items-center gap-2 shadow-xs">
                  <i className="fa-solid fa-user-tie text-[#70141D]"></i> Người Sáng Lập & Giảng Viên
                </span>
                <div className="w-11 h-14 border-2 border-[#70141D] text-[#70141D] flex flex-col items-center justify-center text-[10px] font-bold tracking-tighter bg-red-50/80 rotate-2 shadow-inner rounded-sm">
                  <span>ÂU</span>
                  <span>CƠ</span>
                </div>
              </div>

              {/* Profile Main Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Left: Avatar & Title */}
                <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
                  <div className="relative">
                    <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#EDE4D8]">
                      <img
                        src="/intro-portrait.jpg"
                        alt="Thầy Quách Hạ Văn - Người sáng lập Sáo Trúc Âu Cơ"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <span className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#70141D] text-white text-base flex items-center justify-center font-bold shadow-lg border-2 border-white">
                      <i className="fa-solid fa-music"></i>
                    </span>
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#292421]">
                      Thầy Quách Hạ Văn
                    </h2>
                    <span className="text-xs font-bold text-[#70141D] uppercase tracking-wider block mt-1">
                      Chủ nhiệm & Người sáng lập Sáo Trúc Âu Cơ
                    </span>
                    <span className="inline-block text-[11px] text-[#6B5A53] mt-0.5">
                      Hotline / Zalo: 0374 261 368
                    </span>
                  </div>
                </div>

                {/* Right: Bio, Method & Quote */}
                <div className="md:col-span-8 space-y-4 text-sm sm:text-base text-[#59524B] leading-relaxed">
                  <p>
                    Hơn <strong>8 năm tâm huyết</strong> nghiên cứu, giảng dạy và chế tác sáo trúc chuyên nghiệp, Thầy Quách Hạ Văn từng tham gia biểu diễn và lan tỏa văn hóa âm nhạc truyền thống trên các kênh truyền hình lớn (THVL, HTV).
                  </p>
                  <p>
                    Phương pháp giảng dạy độc quyền tại <strong className="text-[#70141D]">Sáo Trúc Âu Cơ</strong> kết hợp trực quan giữa <em>hệ thống cảm âm 2 dòng nốt - lời</em>, hình ảnh ngón bấm chi tiết và kỹ thuật luyện hơi thực chiến, giúp người mới bắt đầu có thể thổi kêu và chơi trọn vẹn bài hát đầu tiên chỉ sau vài ngày tự luyện tập.
                  </p>
                  <div className="p-4 sm:p-5 bg-white/95 rounded-2xl border border-[#D9CDBB] italic text-xs sm:text-sm text-[#292421] leading-relaxed shadow-xs">
                    <i className="fa-solid fa-quote-left text-[#70141D]/40 text-base mr-2"></i>
                    “ Mỗi người đều có thể thổi được những giai điệu đẹp chỉ cần bắt đầu đúng cách. Âm nhạc dân tộc Việt Nam có sức sống trường tồn mãnh liệt, và sứ mệnh của chúng tôi là xóa bỏ mọi rào cản về nhạc lý phức tạp để bất kỳ ai yêu tiếng sáo đều có thể tự học một cách dễ dàng và bài bản nhất. ”
                  </div>
                </div>

              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-[#D9CDBB]">
                <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-[#D9CDBB] text-center shadow-xs">
                  <div className="font-serif font-bold text-[#70141D] text-2xl sm:text-3xl">5.000+</div>
                  <div className="text-xs font-bold text-[#292421] mt-1">Học viên toàn quốc</div>
                  <p className="text-[10.5px] text-[#6B625B] mt-0.5">Trực tiếp & Online</p>
                </div>
                <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-[#D9CDBB] text-center shadow-xs">
                  <div className="font-serif font-bold text-[#193822] text-2xl sm:text-3xl">8+ Năm</div>
                  <div className="text-xs font-bold text-[#292421] mt-1">Kinh nghiệm đào tạo</div>
                  <p className="text-[10.5px] text-[#6B625B] mt-0.5">Biểu diễn chuyên nghiệp</p>
                </div>
                <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-[#D9CDBB] text-center shadow-xs">
                  <div className="font-serif font-bold text-amber-800 text-2xl sm:text-3xl">500+</div>
                  <div className="text-xs font-bold text-[#292421] mt-1">Cảm âm chuẩn 2 dòng</div>
                  <p className="text-[10.5px] text-[#6B625B] mt-0.5">Kho tài liệu bài bản</p>
                </div>
                <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-[#D9CDBB] text-center shadow-xs">
                  <div className="font-serif font-bold text-[#70141D] text-2xl sm:text-3xl">100%</div>
                  <div className="text-xs font-bold text-[#292421] mt-1">Kiểm âm chuẩn 440Hz</div>
                  <p className="text-[10.5px] text-[#6B625B] mt-0.5">Đo kiểm tần số tuyệt đối</p>
                </div>
              </div>

            </div>
          </div>

          {/* Core Values Section */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#70141D] text-center">
              3 Giá Trị Cốt Lõi Tại Sáo Trúc Âu Cơ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coreValues.map((val, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-xs space-y-3 hover:shadow-md hover:border-[#70141D]/30 transition-all">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${val.color}`}>
                    <i className={val.icon}></i>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#292421]">{val.title}</h3>
                  <p className="text-xs text-[#59524B] leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Center & Contact Info Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs uppercase font-bold text-[#70141D] tracking-wider block">
                Thông Tin Trung Tâm & Lớp Học
              </span>
              <h3 className="font-serif text-xl font-bold text-[#292421]">
                Lớp Học Sáo Trúc Âu Cơ (TP. Hồ Chí Minh)
              </h3>
              <p className="text-xs sm:text-sm text-[#59524B] leading-relaxed">
                📍 Địa chỉ: <strong>106/72 Hoà Bình, P. Tân Phú, TP.HCM</strong><br />
                📞 Hotline / Zalo Thầy Văn: <strong>0374 261 368</strong> • ✉️ Email: <strong>saotrucauco@gmail.com</strong>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <a
                href="https://zalo.me/0374261368"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#70141D] hover:bg-[#8C1B26] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-phone"></i>
                <span>Liên hệ Zalo Thầy Văn</span>
              </a>
              <Link
                href="/dang-ky-hoc"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#FAF6EE] hover:bg-[#EADBCA] text-[#292421] border border-[#D9CDBB] text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-graduation-cap"></i>
                <span>Đăng ký học ngay</span>
              </Link>
            </div>
          </div>

          {/* Internal Links Section */}
          <section className="pt-8 border-t border-[#EADBCA] space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest font-bold text-[#A87932] block">
                ✦ TÀI LIỆU & BỘ MÔN ĐÀO TẠO ✦
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#70141D]">
                Khám Phá Thêm Cùng Sáo Trúc Âu Cơ
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Link
                href="/lop-hoc"
                className="group bg-white rounded-2xl p-5 border border-[#E0D5C3] shadow-2xs hover:shadow-md hover:border-[#70141D]/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <span className="text-xl">🎓</span>
                  <h4 className="font-serif text-base font-bold text-slate-900 group-hover:text-[#70141D] transition-colors">
                    Các Lớp Học Sáo Trúc
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Khám phá 6 bộ môn sáo: Sáo trúc Việt Nam, Dizi, Recorder, Động tiêu, Flute và Sáo Mèo.
                  </p>
                </div>
                <div className="text-xs font-bold text-[#70141D] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Xem các bộ môn</span>
                  <span>→</span>
                </div>
              </Link>

              <Link
                href="/giao-trinh-va-sheet"
                className="group bg-white rounded-2xl p-5 border border-[#E0D5C3] shadow-2xs hover:shadow-md hover:border-[#70141D]/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <span className="text-xl">📖</span>
                  <h4 className="font-serif text-base font-bold text-slate-900 group-hover:text-[#70141D] transition-colors">
                    Giáo Trình & Sheet Nhạc
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Giáo trình tự học sáo độc quyền, chuyển soạn cảm âm và ký âm chuyên nghiệp cho mọi ca khúc.
                  </p>
                </div>
                <div className="text-xs font-bold text-[#70141D] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Xem tài liệu & sheet</span>
                  <span>→</span>
                </div>
              </Link>

              <Link
                href="/sao-va-phu-kien"
                className="group bg-white rounded-2xl p-5 border border-[#E0D5C3] shadow-2xs hover:shadow-md hover:border-[#70141D]/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <span className="text-xl">🎋</span>
                  <h4 className="font-serif text-base font-bold text-slate-900 group-hover:text-[#70141D] transition-colors">
                    Các Sản Phẩm Sáo Trúc
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sáo nứa Bắc, nứa Nam, Dizi, tiêu bát khổng do chính Thầy Quách Hạ Văn tuyển chọn và căn chỉnh chuẩn âm.
                  </p>
                </div>
                <div className="text-xs font-bold text-[#70141D] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Xem kho nhạc cụ</span>
                  <span>→</span>
                </div>
              </Link>
            </div>
          </section>

        </div>
      </div>

      <ServicePageFooter />
    </main>
  );
}
