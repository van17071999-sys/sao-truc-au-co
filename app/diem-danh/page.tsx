"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// ================= TYPES =================
export interface AttendanceRecord {
  date: string;
  status: string;
  note: string;
}

export interface StudentData {
  id: string;
  name: string;
  status: "Đang học" | "Hết buổi" | "Bảo lưu" | string;
  phone: string;
  course: string;
  packageSessions: number;
  tuition: string;
  attendedSessions: number;
  classId?: string;
  teacherName?: string;
  invoiceCode: string;
  invoiceDate: string;
  unitPrice: string;
  totalAmount: string;
  paidAmount: string;
  debtAmount: string;
  paymentStatus: "Đã thanh toán" | "Chưa thanh toán" | "Còn nợ" | string;
  attendanceList: AttendanceRecord[];
}

export interface ClassData {
  id: string;
  name: string;
  teacher: string;
  scheduleTime: string;
  status: "Đang mở" | "Sắp mở" | "Kết thúc";
  studentIds: string[];
}

export interface ScheduleItem {
  id: string;
  date: string;
  time: string;
  studentId: string;
  studentName: string;
  course: string;
  teacher: string;
  status: "Đã học" | "Chưa học" | "Hủy" | "Bảo lưu";
}

export interface TeacherData {
  id: string;
  name: string;
  phone: string;
  disciplines: string;
  classes: string[];
}

export interface CenterSettings {
  centerName: string;
  hotline: string;
  address: string;
  bankName: string;
  bankAccount: string;
  accountName: string;
  invoicePrefix: string;
  defaultPackages: string;
  policyNote: string;
}

// ================= DEFAULT DATA =================
const DEFAULT_SETTINGS: CenterSettings = {
  centerName: "Sáo Trúc Âu Cơ",
  hotline: "0374 261 368",
  address: "106/72 Hòa Bình, Tân Phú, Hồ Chí Minh, Việt Nam",
  bankName: "STB · Sacombank",
  bankAccount: "030046023451",
  accountName: "QUACH HA VAN",
  invoicePrefix: "HD-2026-",
  defaultPackages: "8, 12, 16, 24",
  policyNote: "Học phí đã đăng ký không hoàn lại trong mọi trường hợp. Nếu học viên có việc phát sinh và chưa thể tiếp tục học, số buổi còn lại sẽ được bảo lưu để học viên sắp xếp học lại sau. Thời hạn bảo lưu sẽ tùy trường hợp nghỉ học và giáo viên sẽ thông báo cụ thể.",
};

const INITIAL_STUDENTS: StudentData[] = [
  {
    id: "HV-2026-00128",
    name: "Nguyễn Văn An",
    status: "Đang học",
    phone: "0934 567 890",
    course: "Sáo trúc cơ bản",
    packageSessions: 12,
    tuition: "3.600.000đ",
    attendedSessions: 8,
    classId: "LOP-01",
    teacherName: "Quách Hà Vân",
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
  },
  {
    id: "HV-2026-00129",
    name: "Trần Minh Đức",
    status: "Đang học",
    phone: "0912 345 678",
    course: "Sáo Dizi nâng cao",
    packageSessions: 12,
    tuition: "3.600.000đ",
    attendedSessions: 11, // Sắp hết buổi (còn 1 buổi)
    classId: "LOP-02",
    teacherName: "Quách Hà Vân",
    invoiceCode: "HD-2026-00129",
    invoiceDate: "10/08/2026",
    unitPrice: "300.000đ",
    totalAmount: "3.600.000đ",
    paidAmount: "3.600.000đ",
    debtAmount: "0đ",
    paymentStatus: "Đã thanh toán",
    attendanceList: [
      { date: "14/09/2026", status: "Đã học", note: "Bài cổ phong" },
      { date: "11/09/2026", status: "Đã học", note: "-" },
    ],
  },
  {
    id: "HV-2026-00130",
    name: "Lê Hoàng Yến",
    status: "Bảo lưu",
    phone: "0978 999 123",
    course: "Recorder nhập môn",
    packageSessions: 8,
    tuition: "2.400.000đ",
    attendedSessions: 3,
    classId: "LOP-03",
    teacherName: "Thầy Hưng",
    invoiceCode: "HD-2026-00130",
    invoiceDate: "01/09/2026",
    unitPrice: "300.000đ",
    totalAmount: "2.400.000đ",
    paidAmount: "1.200.000đ",
    debtAmount: "1.200.000đ",
    paymentStatus: "Còn nợ",
    attendanceList: [
      { date: "07/09/2026", status: "Đã học", note: "Buổi 3" },
    ],
  },
];

const INITIAL_CLASSES: ClassData[] = [
  {
    id: "LOP-01",
    name: "Sáo trúc cơ bản - Khóa K1",
    teacher: "Quách Hà Vân",
    scheduleTime: "Thứ 3, 5, 7 (19:00 - 20:00)",
    status: "Đang mở",
    studentIds: ["HV-2026-00128"],
  },
  {
    id: "LOP-02",
    name: "Sáo Dizi biểu diễn",
    teacher: "Quách Hà Vân",
    scheduleTime: "Thứ 2, 4, 6 (18:00 - 19:00)",
    status: "Đang mở",
    studentIds: ["HV-2026-00129"],
  },
  {
    id: "LOP-03",
    name: "Recorder & Flute cơ bản",
    teacher: "Thầy Hưng",
    scheduleTime: "Thứ 7, CN (09:00 - 10:30)",
    status: "Đang mở",
    studentIds: ["HV-2026-00130"],
  },
];

const INITIAL_SCHEDULES: ScheduleItem[] = [
  {
    id: "SCH-01",
    date: "16/09/2026",
    time: "19:00",
    studentId: "HV-2026-00128",
    studentName: "Nguyễn Văn An",
    course: "Sáo trúc cơ bản",
    teacher: "Quách Hà Vân",
    status: "Chưa học",
  },
  {
    id: "SCH-02",
    date: "16/09/2026",
    time: "18:00",
    studentId: "HV-2026-00129",
    studentName: "Trần Minh Đức",
    course: "Sáo Dizi nâng cao",
    teacher: "Quách Hà Vân",
    status: "Chưa học",
  },
  {
    id: "SCH-03",
    date: "15/09/2026",
    time: "19:00",
    studentId: "HV-2026-00128",
    studentName: "Nguyễn Văn An",
    course: "Sáo trúc cơ bản",
    teacher: "Quách Hà Vân",
    status: "Đã học",
  },
];

const INITIAL_TEACHERS: TeacherData[] = [
  {
    id: "GV-01",
    name: "Quách Hà Vân",
    phone: "0374 261 368",
    disciplines: "Sáo trúc Việt Nam, Dizi, Tiêu & Xiao",
    classes: ["LOP-01", "LOP-02"],
  },
  {
    id: "GV-02",
    name: "Thầy Hưng",
    phone: "0908 123 456",
    disciplines: "Recorder, Flute, Nhạc lý",
    classes: ["LOP-03"],
  },
];

type ActiveTab = "hoc-vien" | "lop-hoc" | "lich-day" | "hoa-don" | "giao-vien" | "bao-cao" | "cai-dat";

function StudentPortalContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id") || "";
  const isAdminParam = searchParams.get("admin") === "1";

  // Data States
  const [students, setStudents] = useState<StudentData[]>(INITIAL_STUDENTS);
  const [classes, setClasses] = useState<ClassData[]>(INITIAL_CLASSES);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [teachers, setTeachers] = useState<TeacherData[]>(INITIAL_TEACHERS);
  const [settings, setSettings] = useState<CenterSettings>(DEFAULT_SETTINGS);

  // UI States
  const [activeTab, setActiveTab] = useState<ActiveTab>("hoc-vien");
  const [selectedStudentId, setSelectedStudentId] = useState<string>(studentId || INITIAL_STUDENTS[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<StudentData | null>(null);
  const [showAllAttendance, setShowAllAttendance] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // Modals
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");
  const [newStudentCourse, setNewStudentCourse] = useState("Sáo trúc cơ bản");
  const [newStudentPackage, setNewStudentPackage] = useState(12);
  const [newStudentTuition, setNewStudentTuition] = useState("3.600.000đ");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Load from CMS if available
  useEffect(() => {
    fetch("/api/cms/content")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const entries: any[] = data.entries || [];
        const studentEntries = entries.filter((e) => e.collection === "students");
        if (studentEntries.length > 0) {
          const parsed = studentEntries.map((entry) => {
            try {
              const content = typeof entry.content === "string" ? JSON.parse(entry.content) : {};
              return {
                id: entry.slug || entry.id,
                name: entry.title,
                status: content.status || "Đang học",
                phone: entry.excerpt || content.phone || "09xxxxxxx",
                course: content.course || "Sáo trúc cơ bản",
                packageSessions: Number(content.packageSessions || 12),
                tuition: entry.price || content.tuition || "3.600.000đ",
                attendedSessions: Number(content.attendedSessions || 0),
                classId: content.classId || "LOP-01",
                teacherName: content.teacherName || "Quách Hà Vân",
                invoiceCode: content.invoiceCode || `HD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                invoiceDate: content.invoiceDate || "15/09/2026",
                unitPrice: content.unitPrice || "300.000đ",
                totalAmount: content.totalAmount || entry.price || "3.600.000đ",
                paidAmount: content.paidAmount || entry.price || "3.600.000đ",
                debtAmount: content.debtAmount || "0đ",
                paymentStatus: content.paymentStatus || "Đã thanh toán",
                attendanceList: Array.isArray(content.attendanceList) ? content.attendanceList : [],
              };
            } catch {
              return null;
            }
          }).filter(Boolean) as StudentData[];

          if (parsed.length > 0) {
            setStudents(parsed);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Sync selectedStudentId when URL changes
  useEffect(() => {
    if (studentId) {
      setSelectedStudentId(studentId);
    }
  }, [studentId]);

  // Current active student
  const activeStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0] || INITIAL_STUDENTS[0];
  }, [students, selectedStudentId]);

  // Filtered student list
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone.includes(searchTerm) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [students, searchTerm, statusFilter]);

  // Copy link
  const copyLink = (sId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/diem-danh?id=${sId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast(`Đã sao chép link tra cứu của ${sId} vào bộ nhớ tạm!`);
    }
  };

  // Check in 1 student
  const handleCheckIn = (sId: string, customNote = "Đã điểm danh") => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== sId) return s;
        if (s.attendanceList.some((a) => a.date === formattedDate)) {
          showToast(`Học viên ${s.name} đã được điểm danh hôm nay (${formattedDate}) rồi!`);
          return s;
        }
        const updatedAttended = s.attendedSessions + 1;
        const newStatus = updatedAttended >= s.packageSessions ? "Hết buổi" : s.status;
        const updatedList: AttendanceRecord[] = [{ date: formattedDate, status: "Đã học", note: customNote }, ...s.attendanceList];
        showToast(`✓ Đã điểm danh thành công cho ${s.name} (Buổi ${updatedAttended}/${s.packageSessions})!`);
        return {
          ...s,
          attendedSessions: updatedAttended,
          status: newStatus,
          attendanceList: updatedList,
        };
      })
    );
  };

  // Check in whole class
  const handleCheckInClass = (cId: string) => {
    const targetClass = classes.find((c) => c.id === cId);
    if (!targetClass) return;
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

    let count = 0;
    setStudents((prev) =>
      prev.map((s) => {
        if (!targetClass.studentIds.includes(s.id)) return s;
        if (s.attendanceList.some((a) => a.date === formattedDate)) return s;
        count++;
        return {
          ...s,
          attendedSessions: s.attendedSessions + 1,
          attendanceList: [{ date: formattedDate, status: "Đã học", note: `Điểm danh lớp ${targetClass.name}` }, ...s.attendanceList],
        };
      })
    );
    showToast(`✓ Đã điểm danh đồng loạt cho ${count} học viên thuộc lớp "${targetClass.name}"!`);
  };

  // Update schedule status
  const handleScheduleStatus = (scheduleId: string, newStatus: ScheduleItem["status"]) => {
    setSchedules((prev) =>
      prev.map((item) => {
        if (item.id !== scheduleId) return item;
        if (newStatus === "Đã học" && item.status !== "Đã học") {
          handleCheckIn(item.studentId, `Theo lịch dạy ${item.time} - ${item.date}`);
        }
        return { ...item, status: newStatus };
      })
    );
    showToast(`Đã cập nhật trạng thái buổi học thành: ${newStatus}`);
  };

  // Add new student
  const handleAddNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    const newId = `HV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newInvoice = `${settings.invoicePrefix}${Math.floor(10000 + Math.random() * 90000)}`;
    const todayStr = new Date().toLocaleDateString("vi-VN");

    const created: StudentData = {
      id: newId,
      name: newStudentName.trim(),
      status: "Đang học",
      phone: newStudentPhone.trim() || "Chưa có",
      course: newStudentCourse,
      packageSessions: Number(newStudentPackage) || 12,
      tuition: newStudentTuition,
      attendedSessions: 0,
      classId: "LOP-01",
      teacherName: "Quách Hà Vân",
      invoiceCode: newInvoice,
      invoiceDate: todayStr,
      unitPrice: "300.000đ",
      totalAmount: newStudentTuition,
      paidAmount: newStudentTuition,
      debtAmount: "0đ",
      paymentStatus: "Đã thanh toán",
      attendanceList: [],
    };

    setStudents([created, ...students]);
    setSelectedStudentId(newId);
    setShowAddStudentModal(false);
    setNewStudentName("");
    setNewStudentPhone("");
    showToast(`Đã thêm thành công học viên mới: ${created.name} (${newId})!`);
  };

  // If viewed as single student with no admin mode, show student personal card
  const isPersonalStudentView = Boolean(studentId) && !isAdminParam;

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col md:flex-row text-[#1E293B] font-sans antialiased">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1E293B] text-white px-4 py-2.5 rounded-xl shadow-2xl text-sm flex items-center gap-2.5 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <i className="fa-solid fa-circle-check text-emerald-400"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= LEFT SIDEBAR (7 TABS) ================= */}
      <aside className="w-full md:w-56 bg-[#4A101D] text-[#EAD5D8] shrink-0 flex md:flex-col justify-between p-3 sm:p-4 select-none shadow-xl border-r border-[#601726]">
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

          {/* Navigation Links (All 7 Tabs) */}
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 text-xs font-medium">
            <button
              onClick={() => setActiveTab("hoc-vien")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "hoc-vien"
                  ? "bg-[#70141D] text-white font-semibold shadow-inner border-l-3 border-[#E5A823]"
                  : "text-[#EAD5D8] hover:bg-white/10 hover:text-white"
              }`}
            >
              <i className="fa-solid fa-graduation-cap w-4 text-center text-[#E5A823]"></i>
              <span>Học viên</span>
            </button>

            <button
              onClick={() => setActiveTab("lop-hoc")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "lop-hoc"
                  ? "bg-[#70141D] text-white font-semibold shadow-inner border-l-3 border-[#E5A823]"
                  : "text-[#EAD5D8] hover:bg-white/10 hover:text-white"
              }`}
            >
              <i className="fa-solid fa-chalkboard-user w-4 text-center"></i>
              <span>Lớp học</span>
            </button>

            <button
              onClick={() => setActiveTab("lich-day")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "lich-day"
                  ? "bg-[#70141D] text-white font-semibold shadow-inner border-l-3 border-[#E5A823]"
                  : "text-[#EAD5D8] hover:bg-white/10 hover:text-white"
              }`}
            >
              <i className="fa-solid fa-calendar-days w-4 text-center"></i>
              <span>Lịch dạy</span>
            </button>

            <button
              onClick={() => setActiveTab("hoa-don")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "hoa-don"
                  ? "bg-[#70141D] text-white font-semibold shadow-inner border-l-3 border-[#E5A823]"
                  : "text-[#EAD5D8] hover:bg-white/10 hover:text-white"
              }`}
            >
              <i className="fa-solid fa-file-invoice-dollar w-4 text-center"></i>
              <span>Hóa đơn</span>
            </button>

            <button
              onClick={() => setActiveTab("giao-vien")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "giao-vien"
                  ? "bg-[#70141D] text-white font-semibold shadow-inner border-l-3 border-[#E5A823]"
                  : "text-[#EAD5D8] hover:bg-white/10 hover:text-white"
              }`}
            >
              <i className="fa-solid fa-users w-4 text-center"></i>
              <span>Giáo viên</span>
            </button>

            <button
              onClick={() => setActiveTab("bao-cao")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "bao-cao"
                  ? "bg-[#70141D] text-white font-semibold shadow-inner border-l-3 border-[#E5A823]"
                  : "text-[#EAD5D8] hover:bg-white/10 hover:text-white"
              }`}
            >
              <i className="fa-solid fa-chart-pie w-4 text-center"></i>
              <span>Báo cáo</span>
            </button>

            <button
              onClick={() => setActiveTab("cai-dat")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "cai-dat"
                  ? "bg-[#70141D] text-white font-semibold shadow-inner border-l-3 border-[#E5A823]"
                  : "text-[#EAD5D8] hover:bg-white/10 hover:text-white"
              }`}
            >
              <i className="fa-solid fa-gear w-4 text-center"></i>
              <span>Cài đặt</span>
            </button>
          </nav>
        </div>

        <div className="hidden md:block pt-4 border-t border-white/10 text-[11px] text-[#D8B4B8]/80 text-center">
          <Link href="/quan-tri" className="hover:underline text-amber-300">
            Trang Quản trị CMS ↗
          </Link>
          <div className="mt-1 text-[10px] text-slate-400">Hotline: {settings.hotline}</div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 p-3 sm:p-5 md:p-7 max-w-6xl mx-auto space-y-5 overflow-y-auto">

        {/* ---------------- 1. TAB HỌC VIÊN ---------------- */}
        {activeTab === "hoc-vien" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Search & Filter Bar */}
            <div className="bg-white p-3.5 sm:p-4 rounded-xl shadow-xs border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
                <div className="relative w-full max-w-md">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm theo Tên, SĐT hoặc Mã học viên..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#70141D]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="py-1.5 px-3 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Đang học">Đang học</option>
                  <option value="Hết buổi">Hết buổi</option>
                  <option value="Bảo lưu">Bảo lưu</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-3.5 py-1.5 bg-[#70141D] hover:bg-[#580f16] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>Thêm học viên mới</span>
                </button>
              </div>
            </div>

            {/* Quick Students Pills Switcher */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
              {filteredStudents.map((s) => {
                const isSelected = s.id === activeStudent.id;
                const remaining = Math.max(0, s.packageSessions - s.attendedSessions);
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudentId(s.id)}
                    className={`px-3 py-1.5 rounded-lg border text-left shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? "bg-white border-[#70141D] text-[#70141D] shadow-xs font-bold ring-2 ring-[#70141D]/10"
                        : "bg-white/80 border-slate-200 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <span>{s.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        remaining <= 2 ? "bg-amber-100 text-amber-800 font-bold" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {s.attendedSessions}/{s.packageSessions}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Top Header Student Card (Exact image 2 replica) */}
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
                        {activeStudent.name}
                      </h1>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          activeStudent.status === "Đang học"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : activeStudent.status === "Hết buổi"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-amber-100 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {activeStudent.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <i className="fa-solid fa-phone text-[#2563EB]"></i>
                        <span>{activeStudent.phone}</span>
                        <span className="text-slate-400 font-normal">Số điện thoại</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <i className="fa-solid fa-book-open text-[#2563EB]"></i>
                        <span className="font-semibold text-slate-800">{activeStudent.course}</span>
                        <span className="text-slate-400 font-normal">Khóa học</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <i className="fa-solid fa-layer-group text-[#2563EB]"></i>
                        <span className="font-semibold text-slate-800">{activeStudent.packageSessions} buổi</span>
                        <span className="text-slate-400 font-normal">Gói học</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <i className="fa-solid fa-sack-dollar text-[#2563EB]"></i>
                        <span className="font-bold text-[#70141D]">{activeStudent.tuition}</span>
                        <span className="text-slate-400 font-normal">Học phí</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Quick Stats */}
                <div className="flex items-center gap-6 sm:gap-8 self-end lg:self-center bg-slate-50/80 px-4 sm:px-6 py-2.5 rounded-xl border border-slate-100">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-medium flex items-center justify-end gap-1.5 mb-0.5">
                      <i className="fa-solid fa-graduation-cap text-[#2563EB]"></i>
                      <span>Đã học</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] tracking-tight">
                      {activeStudent.attendedSessions}{" "}
                      <span className="text-base sm:text-lg font-semibold text-slate-500">
                        / {activeStudent.packageSessions} buổi
                      </span>
                    </div>
                  </div>

                  <div className="w-[1px] h-10 bg-slate-200"></div>

                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-medium flex items-center justify-end gap-1.5 mb-0.5">
                      <i className="fa-regular fa-clock text-emerald-600"></i>
                      <span>Còn lại</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                      {Math.max(0, activeStudent.packageSessions - activeStudent.attendedSessions)}{" "}
                      <span className="text-base sm:text-lg font-semibold text-slate-500">buổi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleCheckIn(activeStudent.id)}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer hover:shadow"
                >
                  <i className="fa-solid fa-plus text-xs"></i>
                  <span>Điểm danh buổi hôm nay</span>
                </button>

                <button
                  onClick={() => {
                    setActiveInvoice(activeStudent);
                    setShowInvoiceModal(true);
                  }}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <i className="fa-regular fa-file-lines text-slate-500"></i>
                  <span>Tạo hóa đơn</span>
                </button>

                <button
                  onClick={() => copyLink(activeStudent.id)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-link text-slate-500"></i>
                  <span>Sao chép link học viên</span>
                </button>
              </div>
            </div>

            {/* 2 Main Columns (Điểm danh & Hóa đơn) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
              {/* Cột 1: Điểm danh */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-4">
                <div>
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
                      <span>
                        {activeStudent.attendedSessions} / {activeStudent.packageSessions} buổi (
                        {Math.min(100, Math.round((activeStudent.attendedSessions / activeStudent.packageSessions) * 100))}
                        %)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((activeStudent.attendedSessions / activeStudent.packageSessions) * 100)
                          )}%`,
                        }}
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
                        {activeStudent.attendanceList.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="py-4 text-center text-slate-400">
                              Chưa có buổi học nào được điểm danh.
                            </td>
                          </tr>
                        ) : (
                          (showAllAttendance
                            ? activeStudent.attendanceList
                            : activeStudent.attendanceList.slice(0, 5)
                          ).map((item, idx) => (
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
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100">
                  <span>Đã hoàn thành {activeStudent.attendedSessions} buổi học trực tiếp</span>
                  <span>Cập nhật mới nhất: {activeStudent.attendanceList[0]?.date || "15/09/2026"}</span>
                </div>
              </div>

              {/* Cột 2: Hóa đơn / Thanh toán */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 font-bold text-base sm:text-lg text-slate-800">
                      <i className="fa-regular fa-file-lines text-[#2563EB]"></i>
                      <span>Hóa đơn / Thanh toán</span>
                    </div>
                  </div>

                  <div className="py-3 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Mã hóa đơn:</span>
                      <span className="font-semibold text-slate-700">{activeStudent.invoiceCode}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Ngày tạo:</span>
                      <span className="font-medium text-slate-700">{activeStudent.invoiceDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Gói học:</span>
                      <span className="font-medium text-slate-700">{activeStudent.packageSessions} buổi</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Đơn giá:</span>
                      <span className="font-medium text-slate-700">{activeStudent.unitPrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-1 border-t border-slate-100">
                      <span className="text-slate-500 font-semibold">Tổng tiền:</span>
                      <span className="font-extrabold text-[#0F172A] text-base">{activeStudent.totalAmount}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400">Trạng thái:</span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        <i className="fa-solid fa-circle-check text-[10px]"></i>
                        <span>{activeStudent.paymentStatus}</span>
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <button
                      onClick={() => {
                        setActiveInvoice(activeStudent);
                        setShowInvoiceModal(true);
                      }}
                      className="py-2 px-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <i className="fa-regular fa-eye text-[11px]"></i>
                      <span className="truncate">Xem hóa đơn</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="py-2 px-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <i className="fa-solid fa-download text-[11px] text-slate-500"></i>
                      <span className="truncate">Tải PDF</span>
                    </button>
                    <button
                      onClick={() => copyLink(activeStudent.id)}
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
                      <div className="text-sm sm:text-base font-extrabold text-emerald-800">
                        {activeStudent.paidAmount}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center text-sm shrink-0">
                      <i className="fa-regular fa-clock"></i>
                    </div>
                    <div>
                      <div className="text-[10.5px] text-slate-500 font-medium">Còn nợ</div>
                      <div className="text-sm sm:text-base font-extrabold text-slate-800">
                        {activeStudent.debtAmount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Policy Warning (From Settings) */}
            <div className="bg-[#3B0E17] text-[#F3E7EA] rounded-xl p-4 sm:p-5 border border-[#601726] shadow-md flex items-start gap-3.5">
              <div className="text-lg text-[#F59E0B] shrink-0 mt-0.5">
                <i className="fa-solid fa-thumbtack"></i>
              </div>
              <p className="text-xs sm:text-[13px] leading-relaxed">
                <strong className="text-[#FBBF24] font-bold">Lưu ý:</strong> {settings.policyNote}
              </p>
            </div>
          </div>
        )}

        {/* ---------------- 2. TAB LỚP HỌC ---------------- */}
        {activeTab === "lop-hoc" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Quản lý Lớp học & Điểm danh cả lớp</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Xem danh sách học viên theo lớp và thực hiện điểm danh đồng loạt cho cả lớp 1 chạm.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {classes.map((cls) => {
                const enrolled = students.filter((s) => cls.studentIds.includes(s.id));
                return (
                  <div
                    key={cls.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#70141D] transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          {cls.status}
                        </span>
                        <span className="text-xs text-slate-400">{cls.studentIds.length} học viên</span>
                      </div>
                      <h3 className="font-bold text-base text-slate-800 mt-2">{cls.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        <i className="fa-solid fa-user-tie text-slate-400 mr-1.5"></i>
                        Giáo viên: <b>{cls.teacher}</b>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        <i className="fa-regular fa-clock text-slate-400 mr-1.5"></i>
                        Lịch học: {cls.scheduleTime}
                      </p>

                      {/* Danh sách học viên trong lớp */}
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                        <span className="text-[11px] font-semibold text-slate-600 block">Học viên trong lớp:</span>
                        {enrolled.map((st) => (
                          <div
                            key={st.id}
                            onClick={() => {
                              setSelectedStudentId(st.id);
                              setActiveTab("hoc-vien");
                            }}
                            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs cursor-pointer transition-colors"
                          >
                            <span className="font-medium text-slate-700">{st.name}</span>
                            <span className="text-[11px] text-[#2563EB] font-bold">
                              {st.attendedSessions}/{st.packageSessions} buổi
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCheckInClass(cls.id)}
                      className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <i className="fa-solid fa-users-check"></i>
                      <span>Điểm danh cả lớp hôm nay</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- 3. TAB LỊCH DẠY ---------------- */}
        {activeTab === "lich-day" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Lịch dạy & Điểm danh theo buổi</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đến giờ học, giáo viên bấm "Xác nhận đã học" để tự động cộng thêm 1 buổi cho học viên.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Thời gian</th>
                    <th className="p-3.5">Học viên</th>
                    <th className="p-3.5">Khóa học</th>
                    <th className="p-3.5">Giáo viên</th>
                    <th className="p-3.5">Trạng thái</th>
                    <th className="p-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedules.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-800">
                        {item.date} · {item.time}
                      </td>
                      <td className="p-3.5 font-semibold text-[#70141D]">{item.studentName}</td>
                      <td className="p-3.5">{item.course}</td>
                      <td className="p-3.5">{item.teacher}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            item.status === "Đã học"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "Hủy"
                              ? "bg-red-100 text-red-700"
                              : item.status === "Bảo lưu"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {item.status !== "Đã học" && (
                          <button
                            onClick={() => handleScheduleStatus(item.id, "Đã học")}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
                          >
                            ✓ Xác nhận đã học
                          </button>
                        )}
                        <button
                          onClick={() => handleScheduleStatus(item.id, "Bảo lưu")}
                          className="px-2.5 py-1 bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg text-[11px] cursor-pointer"
                        >
                          Bảo lưu
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- 4. TAB HÓA ĐƠN ---------------- */}
        {activeTab === "hoa-don" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Danh sách Hóa đơn Học phí</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Xem toàn bộ hóa đơn, tình trạng thanh toán và tải file PDF gửi học viên.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Mã HĐ</th>
                    <th className="p-3.5">Học viên</th>
                    <th className="p-3.5">Ngày tạo</th>
                    <th className="p-3.5">Gói học</th>
                    <th className="p-3.5">Tổng tiền</th>
                    <th className="p-3.5">Trạng thái</th>
                    <th className="p-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#70141D]">{st.invoiceCode}</td>
                      <td className="p-3.5 font-semibold text-slate-800">{st.name}</td>
                      <td className="p-3.5 text-slate-500">{st.invoiceDate}</td>
                      <td className="p-3.5">{st.packageSessions} buổi</td>
                      <td className="p-3.5 font-bold text-slate-900">{st.totalAmount}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            st.paymentStatus === "Đã thanh toán"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {st.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setActiveInvoice(st);
                            setShowInvoiceModal(true);
                          }}
                          className="px-3 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Xem HĐ
                        </button>
                        <button
                          onClick={() => copyLink(st.id)}
                          className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-[11px] cursor-pointer"
                        >
                          Sao chép link
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- 5. TAB GIÁO VIÊN ---------------- */}
        {activeTab === "giao-vien" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Danh sách Giáo viên & Lớp phụ trách</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quản lý giáo viên, bộ môn phụ trách và các lớp đang giảng dạy.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {teachers.map((gv) => (
                <div key={gv.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#FAF1F3] text-[#70141D] flex items-center justify-center text-xl font-bold border border-[#EEDBDF]">
                      <i className="fa-solid fa-user-tie"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-800">{gv.name}</h3>
                      <p className="text-xs text-slate-500">SĐT: {gv.phone}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5">
                    <div>
                      <span className="text-slate-400">Bộ môn phụ trách:</span>
                      <p className="font-semibold text-slate-700 mt-0.5">{gv.disciplines}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Số lớp đang dạy:</span>
                      <p className="font-semibold text-[#70141D] mt-0.5">{gv.classes.length} lớp học trực tiếp</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- 6. TAB BÁO CÁO ---------------- */}
        {activeTab === "bao-cao" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-xs text-slate-400 block font-medium">Học viên đang học</span>
                <b className="text-2xl font-extrabold text-[#2563EB] mt-1 block">
                  {students.filter((s) => s.status === "Đang học").length}
                </b>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-xs text-amber-600 block font-medium">Sắp hết buổi (≤ 2 buổi)</span>
                <b className="text-2xl font-extrabold text-amber-600 mt-1 block">
                  {students.filter((s) => s.packageSessions - s.attendedSessions <= 2 && s.packageSessions - s.attendedSessions > 0).length}
                </b>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-xs text-slate-400 block font-medium">Đã hết buổi</span>
                <b className="text-2xl font-extrabold text-slate-600 mt-1 block">
                  {students.filter((s) => s.attendedSessions >= s.packageSessions).length}
                </b>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-xs text-emerald-600 block font-medium">Học phí đã thu</span>
                <b className="text-2xl font-extrabold text-emerald-700 mt-1 block">7.200.000đ</b>
              </div>
            </div>

            {/* Mục đặc biệt hữu ích: Học viên sắp hết buổi cần nhắc gia hạn */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
                <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
                <span>Học viên sắp hết buổi cần chủ động nhắc gia hạn gói mới</span>
              </div>
              <p className="text-xs text-slate-600">
                Danh sách học viên chỉ còn 1 - 2 buổi học để bạn chủ động nhắn tin / gọi điện nhắc đăng ký khóa tiếp theo:
              </p>

              <div className="divide-y divide-slate-100">
                {students
                  .filter((s) => s.packageSessions - s.attendedSessions <= 2 && s.packageSessions - s.attendedSessions > 0)
                  .map((st) => {
                    const remaining = st.packageSessions - st.attendedSessions;
                    return (
                      <div key={st.id} className="py-3 flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <b className="text-sm text-slate-800">{st.name}</b>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Khóa: {st.course} · SĐT: <strong className="text-slate-700">{st.phone}</strong>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            Chỉ còn {remaining} buổi!
                          </span>
                          <a
                            href={`https://zalo.me/${st.phone.replace(/\s+/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold transition-colors"
                          >
                            Nhắc qua Zalo ↗
                          </a>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 7. TAB CÀI ĐẶT ---------------- */}
        {activeTab === "cai-dat" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
              <h2 className="text-lg font-bold text-slate-800">Cài đặt Hệ thống & Lưu ý Học viên</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Thiết lập thông tin trung tâm, định dạng hóa đơn và nội dung lưu ý bảo lưu học phí không cần sửa code.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tên trung tâm *</label>
                  <input
                    value={settings.centerName}
                    onChange={(e) => setSettings({ ...settings, centerName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hotline / Zalo *</label>
                  <input
                    value={settings.hotline}
                    onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ trung tâm *</label>
                  <input
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngân hàng thụ hưởng</label>
                  <input
                    value={settings.bankName}
                    onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số tài khoản thanh toán</label>
                  <input
                    value={settings.bankAccount}
                    onChange={(e) => setSettings({ ...settings, bankAccount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Tùy chỉnh nội dung văn bản Lưu ý bảo lưu học phí */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-[#70141D] mb-1.5">
                  ✦ Nội dung thông báo Lưu ý bảo lưu học phí (Hiển thị cho học viên):
                </label>
                <textarea
                  rows={4}
                  value={settings.policyNote}
                  onChange={(e) => setSettings({ ...settings, policyNote: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs leading-relaxed text-slate-800"
                />
                <small className="text-slate-400 text-[11px] block mt-1">
                  Đoạn lưu ý này sẽ tự động cập nhật vào thẻ của tất cả học viên mà không phải sửa code.
                </small>
              </div>

              <button
                onClick={() => showToast("✓ Đã lưu cài đặt trung tâm thành công!")}
                className="px-5 py-2.5 bg-[#70141D] hover:bg-[#580f16] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Lưu cài đặt
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ================= MODAL TẠO HỌC VIÊN MỚI ================= */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800">Thêm học viên mới</h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Họ và tên học viên *</label>
                <input
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Anh Tuấn"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số điện thoại *</label>
                <input
                  required
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Khóa học</label>
                  <select
                    value={newStudentCourse}
                    onChange={(e) => setNewStudentCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    <option value="Sáo trúc cơ bản">Sáo trúc cơ bản</option>
                    <option value="Sáo Dizi nâng cao">Sáo Dizi nâng cao</option>
                    <option value="Recorder nhập môn">Recorder nhập môn</option>
                    <option value="Động tiêu & Xiao">Động tiêu & Xiao</option>
                    <option value="Flute">Flute</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gói học (Số buổi)</label>
                  <input
                    type="number"
                    value={newStudentPackage}
                    onChange={(e) => setNewStudentPackage(Number(e.target.value) || 12)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Học phí</label>
                <input
                  value={newStudentTuition}
                  onChange={(e) => setNewStudentTuition(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#70141D] hover:bg-[#580f16] text-white rounded-xl font-semibold cursor-pointer"
                >
                  Xác nhận thêm
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL XEM HÓA ĐƠN ================= */}
      {showInvoiceModal && activeInvoice && (
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
              <h3 className="font-bold text-lg text-slate-800">{settings.centerName}</h3>
              <p className="text-xs text-slate-500">
                {settings.address} · Hotline: {settings.hotline}
              </p>
              <div className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-mono font-semibold text-slate-700 mt-2">
                Mã HĐ: {activeInvoice.invoiceCode}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Học viên:</span>
                <strong className="text-slate-800">{activeInvoice.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Số điện thoại:</span>
                <span>{activeInvoice.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Khóa học:</span>
                <span>{activeInvoice.course}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gói đào tạo:</span>
                <span>{activeInvoice.packageSessions} buổi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ngày đăng ký:</span>
                <span>{activeInvoice.invoiceDate}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                <span className="font-bold text-slate-700">Tổng thanh toán:</span>
                <strong className="text-[#70141D] font-extrabold text-base">{activeInvoice.totalAmount}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trạng thái:</span>
                <span className="font-bold text-emerald-600">{activeInvoice.paymentStatus}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-[#70141D] hover:bg-[#591017] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-print"></i>
                <span>In / Xuất PDF</span>
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center text-sm text-slate-500">
          Đang tải hệ thống quản lý học viên...
        </div>
      }
    >
      <StudentPortalContent />
    </Suspense>
  );
}
