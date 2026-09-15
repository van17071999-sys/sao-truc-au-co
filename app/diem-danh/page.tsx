"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface AttendanceRecord {
  date: string;
  status: string;
  note: string;
}

interface StudentData {
  id: string;
  name: string;
  status: string;
  phone: string;
  course: string;
  packageSessions: number;
  tuition: string;
  attendedSessions: number;
  invoiceCode: string;
  invoiceDate: string;
  unitPrice: string;
  totalAmount: string;
  paidAmount: string;
  debtAmount: string;
  paymentStatus: string;
  attendanceList: AttendanceRecord[];
}

const DEFAULT_STUDENT: StudentData = {
  id: "HV-2026-00128",
  name: "Nguyễn Văn An",
  status: "Đang học",
  phone: "09xxxxxxx",
  course: "Sáo trúc cơ bản",
  packageSessions: 12,
  tuition: "3.600.000đ",
  attendedSessions: 8,
  invoiceCode: "HD-2026-00128",
  invoiceDate: "15/09/2026",
  unitPrice: "300.000đ",
  totalAmount: "3.600.000đ",
  paidAmount: "3.600.000đ",
  debtAmount: "0đ",
  paymentStatus: "Đã thanh toán",
  attendanceList: [
    { date: "15/09/2026", status: "Đã học", note: "Đã điểm danh" },
    { date: "12/09/2026", status: "Đã học", note: "-" },
    { date: "08/09/2026", status: "Đã học", note: "-" },
    { date: "05/09/2026", status: "Đã học", note: "-" },
    { date: "01/09/2026", status: "Đã học", note: "-" },
    { date: "28/08/2026", status: "Đã học", note: "-" },
    { date: "25/08/2026", status: "Đã học", note: "-" },
    { date: "22/08/2026", status: "Đã học", note: "-" },
  ],
};

function StudentPortalContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id") || "";
  
  const [student, setStudent] = useState<StudentData | null>(null);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [lookupInput, setLookupInput] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showAllAttendance, setShowAllAttendance] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const parseStudentEntry = (target: any): StudentData => {
    try {
      const parsed = typeof target.content === "string" && target.content.startsWith("{") 
        ? JSON.parse(target.content) 
        : null;
      if (parsed) {
        return {
          id: target.id || DEFAULT_STUDENT.id,
          name: target.title || DEFAULT_STUDENT.name,
          status: parsed.status || DEFAULT_STUDENT.status,
          phone: target.excerpt || parsed.phone || DEFAULT_STUDENT.phone,
          course: target.slug || parsed.course || DEFAULT_STUDENT.course,
          packageSessions: Number(parsed.packageSessions || parsed.totalSessions || DEFAULT_STUDENT.packageSessions),
          tuition: target.price || parsed.tuition || DEFAULT_STUDENT.tuition,
          attendedSessions: Number(parsed.attendedSessions || DEFAULT_STUDENT.attendedSessions),
          invoiceCode: parsed.invoiceCode || DEFAULT_STUDENT.invoiceCode,
          invoiceDate: parsed.invoiceDate || DEFAULT_STUDENT.invoiceDate,
          unitPrice: parsed.unitPrice || DEFAULT_STUDENT.unitPrice,
          totalAmount: parsed.totalAmount || target.price || DEFAULT_STUDENT.totalAmount,
          paidAmount: parsed.paidAmount || DEFAULT_STUDENT.paidAmount,
          debtAmount: parsed.debtAmount || DEFAULT_STUDENT.debtAmount,
          paymentStatus: parsed.paymentStatus || DEFAULT_STUDENT.paymentStatus,
          attendanceList: Array.isArray(parsed.attendanceList) ? parsed.attendanceList : DEFAULT_STUDENT.attendanceList,
        };
      }
    } catch {}
    return {
      ...DEFAULT_STUDENT,
      id: target.id || DEFAULT_STUDENT.id,
      name: target.title || DEFAULT_STUDENT.name,
      course: target.slug || DEFAULT_STUDENT.course,
      phone: target.excerpt || DEFAULT_STUDENT.phone,
      tuition: target.price || DEFAULT_STUDENT.tuition,
    };
  };

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/cms/content")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const entries: any[] = data.entries || [];
        const studentEntries = entries.filter((e) => e.collection === "students");
        setAllStudents(studentEntries);
        if (studentId) {
          const query = studentId.toLowerCase().trim();
          const found = studentEntries.find((e) => 
            (e.id && e.id.toLowerCase() === query) ||
            (e.slug && e.slug.toLowerCase() === query) ||
            (e.tag && e.tag.toLowerCase() === query) ||
            (e.excerpt && e.excerpt.toLowerCase() === query) ||
            (e.title && e.title.toLowerCase().includes(query))
          );
          if (found) {
            setStudent(parseStudentEntry(found));
          } else if (query === "hv-2026-00128" || query === "default") {
            setStudent(DEFAULT_STUDENT);
          } else {
            setLookupError(`Không tìm thấy dữ liệu học viên với mã: "${studentId}"`);
          }
        }
      })
      .catch(() => {
        if (studentId) setStudent(DEFAULT_STUDENT);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [studentId]);

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError("");
    const query = lookupInput.trim().toLowerCase();
    if (!query) return;
    const found = allStudents.find((s) => 
      (s.id && s.id.toLowerCase() === query) ||
      (s.slug && s.slug.toLowerCase() === query) ||
      (s.tag && s.tag.toLowerCase() === query) ||
      (s.excerpt && s.excerpt.toLowerCase() === query) ||
      (s.title && s.title.toLowerCase().includes(query))
    );
    if (found) {
      setStudent(parseStudentEntry(found));
    } else if (query === "hv-2026-00128" || query.includes("nguyễn văn an") || query === "09xxxxxxx") {
      setStudent(DEFAULT_STUDENT);
    } else {
      setLookupError("Không tìm thấy học viên với thông tin này. Vui lòng kiểm tra lại Mã học viên hoặc Số điện thoại.");
    }
  };

  const copyStudentLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      showToast("Đã sao chép link học viên vào bộ nhớ tạm!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleQuickAttendance = async () => {
    if (!student) return;
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
    
    // Check if already checked in today
    if (student.attendanceList.some((a) => a.date === formattedDate)) {
      showToast(`Buổi học ngày hôm nay (${formattedDate}) đã được điểm danh rồi!`);
      return;
    }

    const updatedAttended = student.attendedSessions + 1;
    const updatedList = [{ date: formattedDate, status: "Đã học", note: "Đã điểm danh" }, ...student.attendanceList];
    
    const updatedStudent = {
      ...student,
      attendedSessions: updatedAttended,
      attendanceList: updatedList,
    };
    setStudent(updatedStudent);
    showToast(`Đã điểm danh thành công buổi hôm nay (${formattedDate})!`);

    // Persist to CMS
    try {
      await fetch("/api/cms/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          entry: {
            id: student.id,
            collection: "students",
            title: student.name,
            slug: student.course,
            excerpt: student.phone,
            price: student.tuition,
            content: JSON.stringify({
              status: student.status,
              phone: student.phone,
              course: student.course,
              packageSessions: student.packageSessions,
              tuition: student.tuition,
              attendedSessions: updatedAttended,
              invoiceCode: student.invoiceCode,
              invoiceDate: student.invoiceDate,
              unitPrice: student.unitPrice,
              totalAmount: student.totalAmount,
              paidAmount: student.paidAmount,
              debtAmount: student.debtAmount,
              paymentStatus: student.paymentStatus,
              attendanceList: updatedList,
            }),
            visible: true,
          },
        }),
      });
    } catch {
      // offline or view-only mode
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center text-sm text-slate-500">
        Đang tải thông tin học viên...
      </div>
    );
  }

  // PRIVATE ACCESS GATEWAY (When no student is selected or direct private access)
  if (!student) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl p-6 sm:p-8 shadow-xl border border-[#EADBCA] text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#FAF1F3] text-[#70141D] flex items-center justify-center mx-auto text-2xl border-2 border-[#EEDBDF]">
            <i className="fa-solid fa-user-lock"></i>
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#70141D] uppercase tracking-wider block mb-1">
              SÁO TRÚC ÂU CƠ · NỘI BỘ
            </span>
            <h1 className="text-xl font-bold text-[#2D2825]">Cổng Tra Cứu Điểm Danh & Học Viên</h1>
            <p className="text-xs text-[#7A6B65] mt-1.5 leading-relaxed">
              Trang nội bộ không hiển thị công khai. Vui lòng nhập <b>Mã học viên</b> hoặc <b>Số điện thoại</b> do trung tâm cung cấp để xem thông tin điểm danh và hóa đơn.
            </p>
          </div>
          <form onSubmit={handleLookupSubmit} className="space-y-3.5 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#4A3E39] mb-1.5">
                Mã học viên hoặc Số điện thoại:
              </label>
              <input
                type="text"
                value={lookupInput}
                onChange={(e) => setLookupInput(e.target.value)}
                placeholder="Ví dụ: HV-2026-00128 hoặc 09xxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDBB] text-sm focus:outline-none focus:border-[#70141D] focus:ring-1 focus:ring-[#70141D]"
                required
                autoFocus
              />
            </div>
            {lookupError && (
              <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {lookupError}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2.5 bg-[#70141D] hover:bg-[#580f16] text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-sm"
            >
              Tra cứu thông tin học viên →
            </button>
          </form>
          <div className="pt-3 border-t border-[#ECE5DC] flex items-center justify-between text-xs text-[#8C766F]">
            <Link href="/" className="hover:underline hover:text-[#70141D]">
              ← Quay về trang chủ
            </Link>
            <Link href="/quan-tri" className="text-[#70141D] font-semibold hover:underline">
              Quản trị viên đăng nhập ↗
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const remainingSessions = Math.max(0, student.packageSessions - student.attendedSessions);
  const progressPercent = Math.min(100, Math.round((student.attendedSessions / student.packageSessions) * 100));

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col md:flex-row text-[#1E293B] font-sans antialiased">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1E293B] text-white px-4 py-2.5 rounded-lg shadow-xl text-sm flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <i className="fa-solid fa-circle-check text-emerald-400"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR (Mô phỏng y hệt hình mẫu với nền đỏ mận Sáo Trúc Âu Cơ) */}
      <aside className="w-full md:w-56 bg-[#4A101D] text-[#EAD5D8] shrink-0 flex md:flex-col justify-between p-3 sm:p-4 select-none shadow-lg">
        <div>
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2.5 mb-6 px-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-bold border border-white/20">
              AC
            </div>
            <div>
              <div className="text-white font-serif font-bold text-sm tracking-wide leading-tight">Âu Cơ Music</div>
              <div className="text-[10px] text-[#D8B4B8]">Hệ thống đào tạo</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 text-xs font-medium">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#EAD5D8] hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
            >
              <i className="fa-solid fa-house w-4 text-center"></i>
              <span>Tổng quan</span>
            </Link>

            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#70141D] text-white font-semibold shadow-inner whitespace-nowrap border-l-3 border-[#E5A823]">
              <i className="fa-solid fa-graduation-cap w-4 text-center text-[#E5A823]"></i>
              <span>Học viên</span>
            </div>

            <Link
              href="/#lop-hoc"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#EAD5D8] hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
            >
              <i className="fa-solid fa-chalkboard-user w-4 text-center"></i>
              <span>Lớp học</span>
            </Link>

            <Link
              href="/#lop-hoc"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#EAD5D8] hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
            >
              <i className="fa-solid fa-calendar-days w-4 text-center"></i>
              <span>Lịch dạy</span>
            </Link>

            <button
              onClick={() => setShowInvoiceModal(true)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#EAD5D8] hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap text-left cursor-pointer"
            >
              <i className="fa-solid fa-file-invoice-dollar w-4 text-center"></i>
              <span>Hóa đơn</span>
            </button>

            <Link
              href="/#gioi-thieu"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#EAD5D8] hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
            >
              <i className="fa-solid fa-users w-4 text-center"></i>
              <span>Giáo viên</span>
            </Link>

            <Link
              href="/quan-tri"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#EAD5D8] hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
            >
              <i className="fa-solid fa-chart-pie w-4 text-center"></i>
              <span>Báo cáo</span>
            </Link>

            <Link
              href="/quan-tri"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#EAD5D8] hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
            >
              <i className="fa-solid fa-gear w-4 text-center"></i>
              <span>Cài đặt</span>
            </Link>
          </nav>
        </div>

        <div className="hidden md:block pt-4 border-t border-white/10 text-[11px] text-[#D8B4B8]/80 text-center">
          Hotline: 0374 261 368
        </div>
      </aside>

      {/* MAIN BODY CONTENT */}
      <main className="flex-1 p-3 sm:p-5 md:p-7 max-w-6xl mx-auto space-y-4 sm:space-y-6">
        
        {/* ================= 1. TOP HEADER STUDENT CARD ================= */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            {/* Left Avatar & Info */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FAF1F3] text-[#70141D] flex items-center justify-center text-2xl sm:text-3xl font-bold shrink-0 border-2 border-[#EEDBDF]">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                    {student.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    {student.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <i className="fa-solid fa-phone text-[#2563EB]"></i>
                    <span>{student.phone}</span>
                    <span className="text-slate-400 font-normal">Số điện thoại</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <i className="fa-solid fa-book-open text-[#2563EB]"></i>
                    <span className="font-semibold text-slate-800">{student.course}</span>
                    <span className="text-slate-400 font-normal">Khóa học</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <i className="fa-solid fa-layer-group text-[#2563EB]"></i>
                    <span className="font-semibold text-slate-800">{student.packageSessions} buổi</span>
                    <span className="text-slate-400 font-normal">Gói học</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <i className="fa-solid fa-sack-dollar text-[#2563EB]"></i>
                    <span className="font-bold text-[#70141D]">{student.tuition}</span>
                    <span className="text-slate-400 font-normal">Học phí</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Quick Stats (Big numbers 8 / 12 and 4 buổi) */}
            <div className="flex items-center gap-6 sm:gap-8 self-end lg:self-center bg-slate-50/80 px-4 sm:px-6 py-2.5 rounded-xl border border-slate-100">
              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium flex items-center justify-end gap-1.5 mb-0.5">
                  <i className="fa-solid fa-graduation-cap text-[#2563EB]"></i>
                  <span>Đã học</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] tracking-tight">
                  {student.attendedSessions} <span className="text-base sm:text-lg font-semibold text-slate-500">/ {student.packageSessions} buổi</span>
                </div>
              </div>

              <div className="w-[1px] h-10 bg-slate-200"></div>

              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium flex items-center justify-end gap-1.5 mb-0.5">
                  <i className="fa-regular fa-clock text-emerald-600"></i>
                  <span>Còn lại</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                  {remainingSessions} <span className="text-base sm:text-lg font-semibold text-slate-500">buổi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <button
              onClick={handleQuickAttendance}
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer hover:shadow"
            >
              <i className="fa-solid fa-plus text-xs"></i>
              <span>Điểm danh buổi hôm nay</span>
            </button>

            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <i className="fa-regular fa-file-lines text-slate-500"></i>
              <span>Tạo hóa đơn</span>
            </button>

            <button
              onClick={copyStudentLink}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-link text-slate-500"></i>
              <span>{copied ? "Đã sao chép ✓" : "Sao chép link học viên"}</span>
            </button>
          </div>
        </div>

        {/* ================= 2. TWO MAIN COLUMNS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          
          {/* LEFT 7 COLS: Điểm danh */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-4">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-base sm:text-lg text-slate-800">
                  <i className="fa-regular fa-calendar-check text-[#2563EB]"></i>
                  <span>Điểm danh</span>
                </div>
                <button
                  onClick={() => setShowAllAttendance(!showAllAttendance)}
                  className="text-xs text-[#2563EB] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>{showAllAttendance ? "Thu gọn" : "Xem tất cả"}</span>
                  <i className={`fa-solid ${showAllAttendance ? "fa-chevron-up" : "fa-arrow-right"} text-[10px]`}></i>
                </button>
              </div>

              {/* Progress bar */}
              <div className="py-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Tiến độ học tập</span>
                  <span>{student.attendedSessions} / {student.packageSessions} buổi ({progressPercent}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-[#F8FAFC] text-slate-500 font-semibold border-y border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Ngày</th>
                      <th className="py-2.5 px-3">Trạng thái</th>
                      <th className="py-2.5 px-3">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(showAllAttendance ? student.attendanceList : student.attendanceList.slice(0, 5)).map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-medium text-slate-800">{item.date}</td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <i className="fa-solid fa-circle-check text-[10px]"></i>
                            <span>{item.status}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{item.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100">
              <span>Đã hoàn thành {student.attendedSessions} buổi học trực tiếp</span>
              <span>Cập nhật mới nhất: {student.attendanceList[0]?.date || "15/09/2026"}</span>
            </div>
          </div>

          {/* RIGHT 5 COLS: Hóa đơn / Thanh toán */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-4">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-base sm:text-lg text-slate-800">
                  <i className="fa-regular fa-file-lines text-[#2563EB]"></i>
                  <span>Hóa đơn / Thanh toán</span>
                </div>
              </div>

              {/* Invoice Specs Table/Grid */}
              <div className="py-3 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Mã hóa đơn:</span>
                  <span className="font-semibold text-slate-700">{student.invoiceCode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Ngày tạo:</span>
                  <span className="font-medium text-slate-700">{student.invoiceDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Gói học:</span>
                  <span className="font-medium text-slate-700">{student.packageSessions} buổi</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Đơn giá:</span>
                  <span className="font-medium text-slate-700">{student.unitPrice}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-1 border-t border-slate-100">
                  <span className="text-slate-500 font-semibold">Tổng tiền:</span>
                  <span className="font-extrabold text-[#0F172A] text-base">{student.totalAmount}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">Trạng thái:</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <i className="fa-solid fa-circle-check text-[10px]"></i>
                    <span>{student.paymentStatus}</span>
                  </span>
                </div>
              </div>

              {/* Invoice Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="py-2 px-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <i className="fa-regular fa-eye text-[11px]"></i>
                  <span className="truncate">Xem hóa đơn</span>
                </button>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="py-2 px-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <i className="fa-solid fa-download text-[11px] text-slate-500"></i>
                  <span className="truncate">Tải PDF</span>
                </button>
                <button
                  onClick={copyStudentLink}
                  className="py-2 px-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <i className="fa-solid fa-link text-[11px] text-slate-500"></i>
                  <span className="truncate">Sao chép link</span>
                </button>
              </div>
            </div>

            {/* Financial Summary Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#F0FDF4] border border-[#DCFCE7] p-3 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm shrink-0">
                  <i className="fa-solid fa-credit-card"></i>
                </div>
                <div>
                  <div className="text-[10.5px] text-emerald-700 font-medium">Đã thanh toán</div>
                  <div className="text-sm sm:text-base font-extrabold text-emerald-800">{student.paidAmount}</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center text-sm shrink-0">
                  <i className="fa-regular fa-clock"></i>
                </div>
                <div>
                  <div className="text-[10.5px] text-slate-500 font-medium">Còn nợ</div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-800">{student.debtAmount}</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ================= 3. BOTTOM WARNING / NOTE BANNER ================= */}
        {/* Banner đỏ mận mạ vàng chuẩn theo thiết kế mẫu */}
        <div className="bg-[#3B0E17] text-[#F3E7EA] rounded-xl p-4 sm:p-5 border border-[#601726] shadow-md flex items-start gap-3.5">
          <div className="text-lg text-[#F59E0B] shrink-0 mt-0.5">
            <i className="fa-solid fa-thumbtack"></i>
          </div>
          <p className="text-xs sm:text-[13px] leading-relaxed">
            <strong className="text-[#FBBF24] font-bold">Lưu ý:</strong> Học phí đã đăng ký không hoàn lại trong mọi trường hợp. Nếu học viên có việc phát sinh và chưa thể tiếp tục học, số buổi còn lại sẽ được bảo lưu để học viên sắp xếp học lại sau. Thời hạn bảo lưu sẽ tùy trường hợp nghỉ học và giáo viên sẽ thông báo cụ thể.
          </p>
        </div>

      </main>

      {/* ================= INVOICE PREVIEW MODAL ================= */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#70141D]">
                <i className="fa-solid fa-file-invoice"></i>
                <span>HÓA ĐƠN HỌC PHÍ</span>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <h3 className="font-bold text-lg text-slate-800">TRUNG TÂM SÁO TRÚC ÂU CƠ</h3>
              <p className="text-xs text-slate-500">106/72 Hòa Bình, Tân Phú, Hồ Chí Minh · Hotline: 0374 261 368</p>
              <div className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-mono font-semibold text-slate-700 mt-2">
                Mã HĐ: {student.invoiceCode}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Học viên:</span><strong className="text-slate-800">{student.name}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Số điện thoại:</span><span>{student.phone}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Khóa học:</span><span>{student.course}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Gói đào tạo:</span><span>{student.packageSessions} buổi</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Ngày đăng ký:</span><span>{student.invoiceDate}</span></div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm"><span className="font-bold text-slate-700">Tổng thanh toán:</span><strong className="text-[#70141D] font-extrabold text-base">{student.totalAmount}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Trạng thái:</span><span className="font-bold text-emerald-600">{student.paymentStatus}</span></div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-[#70141D] hover:bg-[#591017] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-print"></i>
                <span>In hóa đơn</span>
              </button>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentPortalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center text-sm text-slate-500">Đang tải thông tin học viên...</div>}>
      <StudentPortalContent />
    </Suspense>
  );
}
