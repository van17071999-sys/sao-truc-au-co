"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// ================= TYPES =================
export interface AttendanceRecord {
  date: string;
  time?: string;
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
  policyNote: "Học phí đã đăng ký không hoàn lại dưới mọi hình thức; số buổi còn lại được bảo lưu; thời hạn bảo lưu tùy từng trường hợp nghỉ học và giáo viên sẽ thông báo cụ thể.",
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
      { date: "15/09/2026", time: "19:00", status: "Đã học", note: "Luyện âm thanh & nhịp cơ bản" },
      { date: "12/09/2026", time: "19:00", status: "Đã học", note: "Ngón bấm nốt Rê - Mi - Son" },
      { date: "08/09/2026", time: "19:00", status: "Đã học", note: "Kiểm tra bài tập về nhà" },
      { date: "05/09/2026", time: "19:00", status: "Đã học", note: "Thổi bài Bèo dạt mây trôi đoạn 1" },
      { date: "01/09/2026", time: "19:00", status: "Đã học", note: "Thực hành lấy hơi bụng" },
      { date: "28/08/2026", time: "19:00", status: "Đã học", note: "Kỹ thuật vuốt ngón cơ bản" },
      { date: "25/08/2026", time: "19:00", status: "Đã học", note: "Luyện thang âm Đô trưởng" },
      { date: "22/08/2026", time: "19:00", status: "Đã học", note: "Buổi đầu tiên: Làm quen cây sáo C5" },
    ],
  },
  {
    id: "HV-2026-00129",
    name: "Trần Minh Đức",
    status: "Đang học",
    phone: "0912 345 678",
    course: "Sáo Dizi nâng cao",
    packageSessions: 12,
    tuition: "4.200.000đ",
    attendedSessions: 11,
    classId: "LOP-02",
    teacherName: "Thầy Minh",
    invoiceCode: "HD-2026-00129",
    invoiceDate: "10/08/2026",
    unitPrice: "350.000đ",
    totalAmount: "4.200.000đ",
    paidAmount: "4.200.000đ",
    debtAmount: "0đ",
    paymentStatus: "Đã thanh toán",
    attendanceList: [
      { date: "14/09/2026", time: "19:30", status: "Đã học", note: "Kỹ thuật phi ngón & láy rền" },
      { date: "10/09/2026", time: "19:30", status: "Đã học", note: "Thực hành bài Thần thoại" },
    ],
  },
  {
    id: "HV-2026-00130",
    name: "Lê Hoàng Yến",
    status: "Bảo lưu",
    phone: "0988 765 432",
    course: "Động tiêu & Xiao",
    packageSessions: 12,
    tuition: "3.600.000đ",
    attendedSessions: 5,
    classId: "LOP-03",
    teacherName: "Cô Lan",
    invoiceCode: "HD-2026-00130",
    invoiceDate: "01/08/2026",
    unitPrice: "300.000đ",
    totalAmount: "3.600.000đ",
    paidAmount: "3.600.000đ",
    debtAmount: "0đ",
    paymentStatus: "Đã thanh toán",
    attendanceList: [
      { date: "15/08/2026", time: "18:00", status: "Đã học", note: "Bảo lưu từ ngày 20/08" },
    ],
  },
  {
    id: "HV-2026-00131",
    name: "Phạm Quốc Tuấn",
    status: "Hết buổi",
    phone: "0909 888 777",
    course: "Sáo trúc cơ bản",
    packageSessions: 12,
    tuition: "3.600.000đ",
    attendedSessions: 12,
    classId: "LOP-01",
    teacherName: "Quách Hà Vân",
    invoiceCode: "HD-2026-00131",
    invoiceDate: "01/07/2026",
    unitPrice: "300.000đ",
    totalAmount: "3.600.000đ",
    paidAmount: "3.600.000đ",
    debtAmount: "0đ",
    paymentStatus: "Đã thanh toán",
    attendanceList: [],
  },
  {
    id: "HV-2026-00132",
    name: "Vũ Bảo Ngọc",
    status: "Đang học",
    phone: "0977 123 456",
    course: "Sáo trúc cơ bản",
    packageSessions: 12,
    tuition: "3.600.000đ",
    attendedSessions: 10,
    classId: "LOP-01",
    teacherName: "Quách Hà Vân",
    invoiceCode: "HD-2026-00132",
    invoiceDate: "05/08/2026",
    unitPrice: "300.000đ",
    totalAmount: "3.600.000đ",
    paidAmount: "3.000.000đ",
    debtAmount: "600.000đ",
    paymentStatus: "Còn nợ",
    attendanceList: [
      { date: "15/09/2026", time: "19:00", status: "Đã học", note: "Luyện bài Mẹ yêu con" },
    ],
  },
];

const INITIAL_CLASSES: ClassData[] = [
  {
    id: "LOP-01",
    name: "Sáo trúc cơ bản K05",
    teacher: "Quách Hà Vân",
    scheduleTime: "Thứ 3 & Thứ 6 (19:00 - 20:30)",
    status: "Đang mở",
    studentIds: ["HV-2026-00128", "HV-2026-00131", "HV-2026-00132"],
  },
  {
    id: "LOP-02",
    name: "Sáo Dizi nâng cao K02",
    teacher: "Thầy Minh",
    scheduleTime: "Thứ 2 & Thứ 5 (19:30 - 21:00)",
    status: "Đang mở",
    studentIds: ["HV-2026-00129"],
  },
  {
    id: "LOP-03",
    name: "Động tiêu & Xiao K01",
    teacher: "Cô Lan",
    scheduleTime: "Thứ 7 & Chủ Nhật (09:00 - 10:30)",
    status: "Đang mở",
    studentIds: ["HV-2026-00130"],
  },
];

const INITIAL_SCHEDULES: ScheduleItem[] = [
  {
    id: "SCH-001",
    date: "16/09/2026",
    time: "19:00 - 20:30",
    studentId: "HV-2026-00128",
    studentName: "Nguyễn Văn An",
    course: "Sáo trúc cơ bản",
    teacher: "Quách Hà Vân",
    status: "Chưa học",
  },
  {
    id: "SCH-002",
    date: "16/09/2026",
    time: "19:30 - 21:00",
    studentId: "HV-2026-00129",
    studentName: "Trần Minh Đức",
    course: "Sáo Dizi nâng cao",
    teacher: "Thầy Minh",
    status: "Chưa học",
  },
  {
    id: "SCH-003",
    date: "15/09/2026",
    time: "19:00 - 20:30",
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
    disciplines: "Sáo trúc Việt Nam, Sáo mèo, Sáo bầu",
    classes: ["LOP-01"],
  },
  {
    id: "GV-02",
    name: "Thầy Minh",
    phone: "0987 112 233",
    disciplines: "Sáo Dizi Trung Quốc, Kỹ thuật nâng cao",
    classes: ["LOP-02"],
  },
  {
    id: "GV-03",
    name: "Cô Lan",
    phone: "0912 889 900",
    disciplines: "Động tiêu, Xiao, Flute phương Tây",
    classes: ["LOP-03"],
  },
];

type ActiveTab = "hoc-vien" | "lop-hoc" | "lich-day" | "hoa-don" | "giao-vien" | "bao-cao" | "cai-dat";

function StudentPortalContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("id") || "";
  const isAdminParam = searchParams.get("admin") === "1";

  // Data States (synced with localStorage)
  const [students, setStudents] = useState<StudentData[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem("auco_students_data");
        if (local) return JSON.parse(local);
      } catch (e) {}
    }
    return INITIAL_STUDENTS;
  });

  const [classes, setClasses] = useState<ClassData[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem("auco_classes_data");
        if (local) return JSON.parse(local);
      } catch (e) {}
    }
    return INITIAL_CLASSES;
  });

  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem("auco_schedules_data");
        if (local) return JSON.parse(local);
      } catch (e) {}
    }
    return INITIAL_SCHEDULES;
  });

  const [teachers, setTeachers] = useState<TeacherData[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem("auco_teachers_data");
        if (local) return JSON.parse(local);
      } catch (e) {}
    }
    return INITIAL_TEACHERS;
  });

  const [settings, setSettings] = useState<CenterSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem("auco_settings_data");
        if (local) return JSON.parse(local);
      } catch (e) {}
    }
    return DEFAULT_SETTINGS;
  });

  // Thanh quản trị (sidebar 7 mục) CHỈ HIỆN trong phần quản trị (khi có ?admin=1 và KHÔNG CÓ ?id=...)!
  // Khi mở link học viên (?id=HV-...), 100% người xem chỉ thấy duy nhất trang cá nhân, TUYỆT ĐỐI KHÔNG CÓ SIDEBAR.
  const isAdmin = isAdminParam && !studentId;


  // Save to localStorage when state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auco_students_data", JSON.stringify(students));
    }
  }, [students]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auco_classes_data", JSON.stringify(classes));
    }
  }, [classes]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auco_schedules_data", JSON.stringify(schedules));
    }
  }, [schedules]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auco_teachers_data", JSON.stringify(teachers));
    }
  }, [teachers]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auco_settings_data", JSON.stringify(settings));
    }
  }, [settings]);

  // UI States
  const [activeTab, setActiveTab] = useState<ActiveTab>("hoc-vien");
  const [selectedStudentId, setSelectedStudentId] = useState<string>(studentId || (students[0]?.id ?? "HV-2026-00128"));
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<StudentData | null>(null);
  const [showAllAttendance, setShowAllAttendance] = useState(false);

  // Modals: Add / Edit
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentData | null>(null);

  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);

  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);

  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<StudentData | null>(null);

  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherData | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Currently active student
  const currentStudent = useMemo(() => {
    return students.find((s) => s.id === (studentId || selectedStudentId)) || students[0];
  }, [students, studentId, selectedStudentId]);

  // Attendance +1
  const handleCheckIn = (stId: string, customNote?: string) => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
    const formattedTime = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== stId) return s;
        const newAttended = s.attendedSessions + 1;
        const newRecord: AttendanceRecord = {
          date: formattedDate,
          time: formattedTime,
          status: "Đã học",
          note: customNote || "Điểm danh tại trung tâm",
        };
        const newStatus = newAttended >= s.packageSessions ? "Hết buổi" : s.status;
        return {
          ...s,
          attendedSessions: newAttended,
          status: newStatus,
          attendanceList: [newRecord, ...s.attendanceList],
        };
      })
    );
    showToast(`✓ Đã điểm danh thành công buổi học cho ${currentStudent?.name || "học viên"}!`);
  };

  // Check in whole class
  const handleCheckInClass = (cId: string) => {
    const targetClass = classes.find((c) => c.id === cId);
    if (!targetClass) return;
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
    const formattedTime = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;

    let count = 0;
    setStudents((prev) =>
      prev.map((s) => {
        if (!targetClass.studentIds.includes(s.id)) return s;
        if (s.attendanceList.some((a) => a.date === formattedDate)) return s;
        count++;
        return {
          ...s,
          attendedSessions: s.attendedSessions + 1,
          attendanceList: [{ date: formattedDate, time: formattedTime, status: "Đã học", note: `Điểm danh lớp ${targetClass.name}` }, ...s.attendanceList],
        };
      })
    );
    showToast(`✓ Đã điểm danh đồng loạt cho ${count} học viên thuộc lớp "${targetClass.name}"!`);
  };

  // Delete student
  const handleDeleteStudent = (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa học viên này? Thao tác không thể hoàn tác.")) return;
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selectedStudentId === id) {
      const remaining = students.filter((s) => s.id !== id);
      if (remaining[0]) setSelectedStudentId(remaining[0].id);
    }
    showToast("Đã xóa học viên khỏi hệ thống.");
  };

  // Delete class
  const handleDeleteClass = (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa lớp học này?")) return;
    setClasses((prev) => prev.filter((c) => c.id !== id));
    showToast("Đã xóa lớp học.");
  };

  // Delete schedule
  const handleDeleteSchedule = (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa ca dạy này?")) return;
    setSchedules((prev) => prev.filter((sc) => sc.id !== id));
    showToast("Đã xóa ca dạy.");
  };

  // Delete teacher
  const handleDeleteTeacher = (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa giáo viên này?")) return;
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    showToast("Đã xóa giáo viên.");
  };

  // Copy private student link
  const copyStudentLink = (id: string) => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/diem-danh?id=${id}`;
    navigator.clipboard.writeText(url);
    showToast(`✓ Đã sao chép link tra cứu riêng: ${url}`);
  };

  // Filtered students for admin
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.phone.includes(searchTerm) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [students, searchTerm, statusFilter]);

  // =========================================================================
  // 1. TRƯỜNG HỢP HỌC VIÊN XEM (Chỉ xem duy nhất 1 link là học viên, KHÔNG có sidebar)
  // =========================================================================
  const isStudentOnlyView = !isAdmin;

  if (isStudentOnlyView) {
    const student = currentStudent;

    if (!student) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-xl border border-slate-200 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-2xl mb-4">
              🎓
            </div>
            <h1 className="text-xl font-bold text-slate-800 mb-2">Tra Cứu Tiến Độ Học Tập</h1>
            <p className="text-sm text-slate-500 mb-6">Vui lòng sử dụng đường link do giáo viên Sáo Trúc Âu Cơ cung cấp để xem hồ sơ của bạn.</p>
            <Link href="/" className="inline-block px-5 py-2.5 bg-[#4A101D] text-white text-sm font-semibold rounded-xl hover:bg-[#681829] transition-colors">
              ← Về Trang Chủ Sáo Trúc Âu Cơ
            </Link>
          </div>
        </div>
      );
    }

    const remainingSessions = Math.max(0, student.packageSessions - student.attendedSessions);
    const progressPercent = Math.min(100, Math.round((student.attendedSessions / student.packageSessions) * 100));

    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans antialiased py-6 px-3 sm:px-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-[#1E293B] text-white px-4 py-2.5 rounded-xl shadow-2xl text-sm flex items-center gap-2.5 border border-slate-700">
            <i className="fa-solid fa-circle-check text-emerald-400"></i>
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#4A101D] to-[#6E162A] text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#7D1B32]">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white text-2xl font-bold border border-white/20 shrink-0">
                ÂC
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-300">Trung Tâm Âm Nhạc Truyền Thống</span>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">Sáo Trúc Âu Cơ</h1>
                <p className="text-xs text-white/80 mt-0.5">Sổ Theo Dõi Học Tập & Điểm Danh Điện Tử</p>
              </div>
            </div>
            <div className="text-center sm:text-right shrink-0">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                student.status === "Đang học" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" :
                student.status === "Bảo lưu" ? "bg-amber-500/20 text-amber-300 border border-amber-400/30" :
                "bg-rose-500/20 text-rose-300 border border-rose-400/30"
              }`}>
                ● {student.status}
              </span>
              <div className="text-[11px] text-white/70 mt-1">Mã HV: <b className="text-white">{student.id}</b></div>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#4A101D]/10 text-[#4A101D] font-bold text-xl flex items-center justify-center border border-[#4A101D]/20">
                  {student.name.split(" ").slice(-1)[0]?.charAt(0) || "HV"}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
                  <p className="text-sm text-slate-500">Khóa học: <b className="text-slate-800">{student.course}</b></p>
                  <p className="text-xs text-slate-400">Giảng viên: {student.teacherName || "Quách Hà Vân"} · SĐT: {student.phone}</p>
                </div>
              </div>
            </div>

            {/* Sessions Progress */}
            <div className="pt-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tiến độ buổi học</span>
                  <div className="text-2xl sm:text-3xl font-bold text-[#4A101D]">
                    {student.attendedSessions} <span className="text-lg font-medium text-slate-400">/ {student.packageSessions} buổi</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-slate-500">Số buổi còn lại</span>
                  <div className={`text-xl font-bold ${remainingSessions <= 2 ? "text-rose-600" : "text-emerald-600"}`}>
                    {remainingSessions} buổi
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="bg-gradient-to-r from-[#4A101D] to-[#E5A823] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
                <span>Đã hoàn thành {progressPercent}% khóa học</span>
                <span>Gói đăng ký: {student.packageSessions} buổi</span>
              </div>
            </div>
          </div>

          {/* Attendance History */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-[#4A101D]">📅</span>
              <span>Lịch Sử Các Buổi Đã Học ({student.attendanceList.length} buổi)</span>
            </h3>

            {student.attendanceList.length === 0 ? (
              <p className="text-sm text-slate-400 italic py-4 text-center">Chưa có lịch sử điểm danh nào.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 bg-slate-50">
                      <th className="py-2.5 px-3">Buổi</th>
                      <th className="py-2.5 px-3">Ngày học</th>
                      <th className="py-2.5 px-3">Khung giờ</th>
                      <th className="py-2.5 px-3">Trạng thái</th>
                      <th className="py-2.5 px-3">Nội dung / Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {student.attendanceList.map((att, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3 font-semibold text-slate-700">#{student.attendanceList.length - idx}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-900">{att.date}</td>
                        <td className="py-2.5 px-3 text-slate-500">{att.time || "19:00"}</td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ {att.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 text-xs">{att.note || "Đã học xong"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Tuition & Invoice Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-[#4A101D]">🧾</span>
              <span>Thông Tin Học Phí & Hóa Đơn</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80 mb-4">
              <div>
                <span className="text-[11px] text-slate-500 block">Mã hóa đơn</span>
                <b className="text-sm text-slate-800">{student.invoiceCode}</b>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Học phí</span>
                <b className="text-sm text-[#4A101D]">{student.totalAmount}</b>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Đã thanh toán</span>
                <b className="text-sm text-emerald-700">{student.paidAmount}</b>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Tình trạng</span>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                  student.paymentStatus === "Đã thanh toán" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {student.paymentStatus}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveInvoice(student);
                setShowInvoiceModal(true);
              }}
              className="text-xs font-semibold text-[#4A101D] hover:underline flex items-center gap-1.5"
            >
              <span>📄 Xem chi tiết hóa đơn thu học phí</span>
            </button>
          </div>

          {/* Policy Notice (Always at bottom) */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 leading-relaxed shadow-sm">
            <div className="flex items-center gap-2 font-bold text-amber-800 mb-1.5 text-sm">
              <span>⚠️</span>
              <span>LƯU Ý VỀ HỌC PHÍ & BẢO LƯU:</span>
            </div>
            <p className="text-amber-950 font-medium">
              "{settings.policyNote}"
            </p>
          </div>

          {/* Footer Contact */}
          <div className="text-center text-xs text-slate-500 pt-4 pb-8 space-y-1">
            <p className="font-semibold text-slate-700">{settings.centerName} · Hotline: {settings.hotline}</p>
            <p>{settings.address}</p>
          </div>
        </div>

        {/* Invoice Modal for Student */}
        {showInvoiceModal && activeInvoice && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
              <div className="text-center border-b border-slate-200 pb-4 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A101D]">Hóa Đơn Thu Học Phí</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{settings.centerName}</h3>
                <p className="text-xs text-slate-500">{settings.address} · Hotline: {settings.hotline}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Mã hóa đơn:</span><b className="text-slate-800">{activeInvoice.invoiceCode}</b></div>
                <div className="flex justify-between"><span className="text-slate-500">Ngày lập:</span><span>{activeInvoice.invoiceDate}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Học viên:</span><b className="text-slate-800">{activeInvoice.name}</b></div>
                <div className="flex justify-between"><span className="text-slate-500">Khóa học:</span><span>{activeInvoice.course} ({activeInvoice.packageSessions} buổi)</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Tổng học phí:</span><b className="text-[#4A101D] text-sm">{activeInvoice.totalAmount}</b></div>
                <div className="flex justify-between"><span className="text-slate-500">Tình trạng:</span><b className="text-emerald-600">{activeInvoice.paymentStatus}</b></div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button onClick={() => window.print()} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-200">
                  🖨️ In hóa đơn
                </button>
                <button onClick={() => setShowInvoiceModal(false)} className="px-4 py-2 bg-[#4A101D] text-white font-semibold rounded-lg text-xs hover:bg-[#631728]">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. TRƯỜNG HỢP QUẢN TRỊ VIÊN (Toàn quyền quản lý 7 phân hệ với menu mận)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col md:flex-row text-[#1E293B] font-sans antialiased">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1E293B] text-white px-4 py-2.5 rounded-xl shadow-2xl text-sm flex items-center gap-2.5 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <i className="fa-solid fa-circle-check text-emerald-400"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= LEFT SIDEBAR (MÀU ĐỎ MẬN CHUẨN Y HỆT ẢNH) ================= */}
      <aside className="w-full md:w-[220px] bg-[#380c16] text-[#e2d5d8] shrink-0 flex md:flex-col justify-between p-3 sm:p-4 select-none shadow-2xl border-r border-[#4c1320]">
        <div>
          {/* Logo / Brand Header */}
          <div className="mb-6 px-2 flex items-center justify-between">
            <Link href="/quan-tri" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 text-sm font-bold border border-white/15">
                ÂC
              </div>
              <div>
                <div className="text-white font-serif font-bold text-sm leading-tight">Quản Trị Âu Cơ</div>
                <div className="text-[10px] text-amber-300/80 font-medium">Hệ thống đào tạo</div>
              </div>
            </Link>
          </div>

          {/* 7 Mục Sidebar y hệt hình ảnh đính kèm */}
          <nav className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 text-sm font-medium">
            {/* 1. Học viên */}
            <button
              onClick={() => setActiveTab("hoc-vien")}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "hoc-vien"
                  ? "bg-[#5e1627] text-white font-bold shadow-inner border-l-4 border-[#eab308]"
                  : "text-[#e2d5d8] hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={`text-base ${activeTab === "hoc-vien" ? "text-[#facc15]" : "text-[#e2d5d8]"}`}>🎓</span>
              <span>Học viên</span>
            </button>

            {/* 2. Lớp học */}
            <button
              onClick={() => setActiveTab("lop-hoc")}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "lop-hoc"
                  ? "bg-[#5e1627] text-white font-bold shadow-inner border-l-4 border-[#eab308]"
                  : "text-[#e2d5d8] hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={`text-base ${activeTab === "lop-hoc" ? "text-[#facc15]" : "text-[#e2d5d8]"}`}>🖥️</span>
              <span>Lớp học</span>
            </button>

            {/* 3. Lịch dạy */}
            <button
              onClick={() => setActiveTab("lich-day")}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "lich-day"
                  ? "bg-[#5e1627] text-white font-bold shadow-inner border-l-4 border-[#eab308]"
                  : "text-[#e2d5d8] hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={`text-base ${activeTab === "lich-day" ? "text-[#facc15]" : "text-[#e2d5d8]"}`}>📅</span>
              <span>Lịch dạy</span>
            </button>

            {/* 4. Hóa đơn */}
            <button
              onClick={() => setActiveTab("hoa-don")}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "hoa-don"
                  ? "bg-[#5e1627] text-white font-bold shadow-inner border-l-4 border-[#eab308]"
                  : "text-[#e2d5d8] hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={`text-base ${activeTab === "hoa-don" ? "text-[#facc15]" : "text-[#e2d5d8]"}`}>🧾</span>
              <span>Hóa đơn</span>
            </button>

            {/* 5. Giáo viên */}
            <button
              onClick={() => setActiveTab("giao-vien")}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "giao-vien"
                  ? "bg-[#5e1627] text-white font-bold shadow-inner border-l-4 border-[#eab308]"
                  : "text-[#e2d5d8] hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={`text-base ${activeTab === "giao-vien" ? "text-[#facc15]" : "text-[#e2d5d8]"}`}>👥</span>
              <span>Giáo viên</span>
            </button>

            {/* 6. Báo cáo */}
            <button
              onClick={() => setActiveTab("bao-cao")}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "bao-cao"
                  ? "bg-[#5e1627] text-white font-bold shadow-inner border-l-4 border-[#eab308]"
                  : "text-[#e2d5d8] hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={`text-base ${activeTab === "bao-cao" ? "text-[#facc15]" : "text-[#e2d5d8]"}`}>📊</span>
              <span>Báo cáo</span>
            </button>

            {/* 7. Cài đặt */}
            <button
              onClick={() => setActiveTab("cai-dat")}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === "cai-dat"
                  ? "bg-[#5e1627] text-white font-bold shadow-inner border-l-4 border-[#eab308]"
                  : "text-[#e2d5d8] hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={`text-base ${activeTab === "cai-dat" ? "text-[#facc15]" : "text-[#e2d5d8]"}`}>⚙️</span>
              <span>Cài đặt</span>
            </button>
          </nav>
        </div>

        {/* Footer Admin Links */}
        <div className="hidden md:block pt-4 border-t border-white/10 text-[11px] text-[#e2d5d8]/80 text-center">
          <Link href="/quan-tri" className="hover:underline text-amber-300 font-semibold block">
            ← Về CMS Quản Trị
          </Link>
          <div className="mt-1 text-[10px] text-slate-400">Sáo Trúc Âu Cơ Admin</div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 p-3 sm:p-5 md:p-7 max-w-6xl mx-auto space-y-5 overflow-y-auto">

        {/* ---------------- 1. TAB HỌC VIÊN ---------------- */}
        {activeTab === "hoc-vien" && (
          <>
            {/* Top Bar with Actions */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex flex-1 gap-2 items-center">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Tìm theo tên học viên, SĐT hoặc mã..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A101D]"
                  />
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 text-xs rounded-xl px-3 py-2 font-medium text-slate-700"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Đang học">Đang học</option>
                  <option value="Hết buổi">Hết buổi</option>
                  <option value="Bảo lưu">Bảo lưu</option>
                </select>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-4 py-2 bg-[#4A101D] hover:bg-[#631728] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <span>+ Thêm học viên</span>
                </button>
              </div>
            </div>

            {/* Students List Horizontal Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {filteredStudents.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudentId(s.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 border ${
                    currentStudent.id === s.id
                      ? "bg-[#4A101D] text-white border-[#4A101D] shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span>{s.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    s.status === "Đang học" ? "bg-emerald-500/20 text-emerald-400" :
                    s.status === "Bảo lưu" ? "bg-amber-500/20 text-amber-400" : "bg-rose-500/20 text-rose-300"
                  }`}>
                    {s.attendedSessions}/{s.packageSessions}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Student Full Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200 space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#4A101D]/10 text-[#4A101D] font-bold text-xl flex items-center justify-center border border-[#4A101D]/20">
                    {currentStudent.name.split(" ").slice(-1)[0]?.charAt(0) || "HV"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-bold text-slate-900">{currentStudent.name}</h2>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        currentStudent.status === "Đang học" ? "bg-emerald-100 text-emerald-800" :
                        currentStudent.status === "Bảo lưu" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {currentStudent.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mã: <b>{currentStudent.id}</b> · SĐT: <b>{currentStudent.phone}</b> · Lớp: <b>{currentStudent.course}</b>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Attendance Button */}
                  <button
                    onClick={() => handleCheckIn(currentStudent.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
                  >
                    <span>✓ Điểm danh hôm nay (+1)</span>
                  </button>

                  {/* Edit Student Button */}
                  <button
                    onClick={() => setEditingStudent(currentStudent)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                  >
                    ✏️ Sửa
                  </button>

                  {/* Delete Student Button */}
                  <button
                    onClick={() => handleDeleteStudent(currentStudent.id)}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs rounded-xl transition-colors"
                  >
                    🗑️ Xóa
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={() => copyStudentLink(currentStudent.id)}
                    title="Sao chép link riêng cho học viên tra cứu"
                    className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1"
                  >
                    <span>🔗 Link học viên</span>
                  </button>
                </div>
              </div>

              {/* Session Progress Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-500 block">Số buổi đã học</span>
                  <div className="text-2xl font-bold text-[#4A101D] mt-1">
                    {currentStudent.attendedSessions} <span className="text-sm font-medium text-slate-400">/ {currentStudent.packageSessions}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div className="bg-[#4A101D] h-full rounded-full" style={{ width: `${Math.min(100, Math.round((currentStudent.attendedSessions / currentStudent.packageSessions) * 100))}%` }}></div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-500 block">Số buổi còn lại</span>
                  <div className={`text-2xl font-bold mt-1 ${currentStudent.packageSessions - currentStudent.attendedSessions <= 2 ? "text-rose-600" : "text-emerald-600"}`}>
                    {Math.max(0, currentStudent.packageSessions - currentStudent.attendedSessions)} buổi
                  </div>
                  <span className="text-[11px] text-slate-400">Gói khóa học: {currentStudent.packageSessions} buổi</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-500 block">Học phí & Hóa đơn</span>
                  <div className="text-lg font-bold text-slate-900 mt-1">{currentStudent.totalAmount}</div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-emerald-600 font-semibold">{currentStudent.paymentStatus}</span>
                    <button
                      onClick={() => {
                        setActiveInvoice(currentStudent);
                        setShowInvoiceModal(true);
                      }}
                      className="text-[#4A101D] hover:underline font-medium text-[11px]"
                    >
                      Xem HĐ ↗
                    </button>
                  </div>
                </div>
              </div>

              {/* Attendance Table */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    Lịch sử điểm danh ({currentStudent.attendanceList.length} buổi đã học)
                  </h3>
                  {currentStudent.attendanceList.length > 5 && (
                    <button
                      onClick={() => setShowAllAttendance(!showAllAttendance)}
                      className="text-xs font-semibold text-[#4A101D] hover:underline"
                    >
                      {showAllAttendance ? "Thu gọn" : "Xem toàn bộ"}
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                        <th className="py-2.5 px-3">STT</th>
                        <th className="py-2.5 px-3">Ngày học</th>
                        <th className="py-2.5 px-3">Khung giờ</th>
                        <th className="py-2.5 px-3">Trạng thái</th>
                        <th className="py-2.5 px-3">Nội dung / Ghi chú</th>
                        <th className="py-2.5 px-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentStudent.attendanceList.slice(0, showAllAttendance ? undefined : 6).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 font-semibold text-slate-500">#{currentStudent.attendanceList.length - idx}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{item.date}</td>
                          <td className="py-2.5 px-3 text-slate-500">{item.time || "19:00"}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[11px]">
                              ✓ {item.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{item.note}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                if (confirm("Bạn có chắc muốn xóa bản ghi điểm danh này? (Số buổi đã học sẽ giảm 1)")) {
                                  setStudents((prev) =>
                                    prev.map((st) => {
                                      if (st.id !== currentStudent.id) return st;
                                      const updatedList = st.attendanceList.filter((_, i) => i !== idx);
                                      return {
                                        ...st,
                                        attendedSessions: Math.max(0, st.attendedSessions - 1),
                                        attendanceList: updatedList,
                                      };
                                    })
                                  );
                                  showToast("Đã xóa bản ghi điểm danh.");
                                }
                              }}
                              className="text-rose-500 hover:text-rose-700 font-medium"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                      {currentStudent.attendanceList.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-slate-400 italic">
                            Chưa có buổi học nào được điểm danh.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Policy Note Box */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 leading-relaxed">
                <b className="text-amber-800">LƯU Ý VỀ HỌC PHÍ & BẢO LƯU:</b> "{settings.policyNote}"
              </div>
            </div>
          </>
        )}

        {/* ---------------- 2. TAB LỚP HỌC ---------------- */}
        {activeTab === "lop-hoc" && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Quản Lý Lớp Học</h2>
                <p className="text-xs text-slate-500">Danh sách các lớp sáo trúc, giáo viên và học viên theo lớp</p>
              </div>
              <button
                onClick={() => setShowAddClassModal(true)}
                className="px-4 py-2 bg-[#4A101D] hover:bg-[#631728] text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                + Thêm lớp học mới
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {classes.map((cls) => {
                const classStudents = students.filter((s) => cls.studentIds.includes(s.id));
                return (
                  <div key={cls.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{cls.id}</span>
                        <h3 className="text-base font-bold text-slate-900">{cls.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">GV: <b>{cls.teacher}</b></p>
                        <p className="text-[11px] text-slate-400 mt-0.5">⏰ {cls.scheduleTime}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded border border-emerald-200">
                        {cls.status}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-xs font-semibold text-slate-700 mb-2">
                        Học viên trong lớp ({classStudents.length}):
                      </div>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {classStudents.map((st) => (
                          <div key={st.id} className="flex justify-between items-center text-xs p-1.5 rounded bg-slate-50">
                            <span className="font-medium text-slate-800">{st.name}</span>
                            <span className="text-slate-500">{st.attendedSessions}/{st.packageSessions} buổi</span>
                          </div>
                        ))}
                        {classStudents.length === 0 && (
                          <p className="text-xs text-slate-400 italic">Chưa có học viên nào.</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleCheckInClass(cls.id)}
                        className="flex-1 py-1.5 bg-[#4A101D] hover:bg-[#631728] text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        ✓ Điểm danh cả lớp
                      </button>
                      <button
                        onClick={() => setEditingClass(cls)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls.id)}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-lg"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- 3. TAB LỊCH DẠY ---------------- */}
        {activeTab === "lich-day" && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Lịch Dạy & Điểm Danh Theo Buổi</h2>
                <p className="text-xs text-slate-500">Xác nhận ca dạy, tự động tích lũy số buổi đã học cho học viên</p>
              </div>
              <button
                onClick={() => setShowAddScheduleModal(true)}
                className="px-4 py-2 bg-[#4A101D] hover:bg-[#631728] text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                + Thêm ca dạy mới
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Ngày</th>
                    <th className="py-2.5 px-3">Khung giờ</th>
                    <th className="py-2.5 px-3">Học viên / Lớp</th>
                    <th className="py-2.5 px-3">Khóa học</th>
                    <th className="py-2.5 px-3">Giáo viên</th>
                    <th className="py-2.5 px-3">Trạng thái</th>
                    <th className="py-2.5 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedules.map((sc) => (
                    <tr key={sc.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{sc.date}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">⏰ {sc.time}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{sc.studentName}</td>
                      <td className="py-2.5 px-3 text-slate-600">{sc.course}</td>
                      <td className="py-2.5 px-3 text-slate-700">{sc.teacher}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          sc.status === "Đã học" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          sc.status === "Bảo lưu" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                          sc.status === "Hủy" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                          "bg-slate-100 text-slate-700"
                        }`}>
                          {sc.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-1.5">
                        {sc.status !== "Đã học" && (
                          <button
                            onClick={() => {
                              handleCheckIn(sc.studentId, `Ca dạy ngày ${sc.date} lúc ${sc.time}`);
                              setSchedules((prev) => prev.map((item) => item.id === sc.id ? { ...item, status: "Đã học" } : item));
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px]"
                          >
                            ✓ Xác nhận đã học
                          </button>
                        )}
                        <button
                          onClick={() => setEditingSchedule(sc)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px]"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(sc.id)}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded text-[11px]"
                        >
                          Xóa
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
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Quản Lý Hóa Đơn Thu Học Phí</h2>
                <p className="text-xs text-slate-500">Danh sách hóa đơn, in hóa đơn và theo dõi công nợ học viên</p>
              </div>
              <button
                onClick={() => setShowAddInvoiceModal(true)}
                className="px-4 py-2 bg-[#4A101D] hover:bg-[#631728] text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                + Tạo hóa đơn mới
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Mã HĐ</th>
                    <th className="py-2.5 px-3">Học viên</th>
                    <th className="py-2.5 px-3">Ngày lập</th>
                    <th className="py-2.5 px-3">Khóa học</th>
                    <th className="py-2.5 px-3">Tổng tiền</th>
                    <th className="py-2.5 px-3">Tình trạng</th>
                    <th className="py-2.5 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-bold text-[#4A101D]">{st.invoiceCode}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{st.name}</td>
                      <td className="py-2.5 px-3 text-slate-500">{st.invoiceDate}</td>
                      <td className="py-2.5 px-3 text-slate-600">{st.course} ({st.packageSessions}b)</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{st.totalAmount}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          st.paymentStatus === "Đã thanh toán" ? "bg-emerald-100 text-emerald-800" :
                          st.paymentStatus === "Còn nợ" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                        }`}>
                          {st.paymentStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setActiveInvoice(st);
                            setShowInvoiceModal(true);
                          }}
                          className="px-2.5 py-1 bg-[#4A101D] hover:bg-[#631728] text-white font-semibold rounded text-[11px]"
                        >
                          Xem / In
                        </button>
                        <button
                          onClick={() => setEditingInvoice(st)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px]"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Bạn có chắc muốn xóa hóa đơn ${st.invoiceCode}?`)) {
                              setStudents((prev) => prev.map((item) => item.id === st.id ? { ...item, invoiceCode: "CHƯA_TẠO" } : item));
                              showToast("Đã xóa hóa đơn.");
                            }
                          }}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded text-[11px]"
                        >
                          Xóa
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
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Danh Sách Giáo Viên</h2>
                <p className="text-xs text-slate-500">Quản lý đội ngũ giảng viên, bộ môn phụ trách và số lớp</p>
              </div>
              <button
                onClick={() => setShowAddTeacherModal(true)}
                className="px-4 py-2 bg-[#4A101D] hover:bg-[#631728] text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                + Thêm giáo viên mới
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teachers.map((tc) => (
                <div key={tc.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#4A101D]/10 text-[#4A101D] flex items-center justify-center font-bold text-lg">
                      {tc.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{tc.name}</h3>
                      <p className="text-xs text-slate-500">📞 {tc.phone}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="font-semibold text-slate-700 block mb-0.5">Bộ môn giảng dạy:</span>
                    {tc.disciplines}
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => setEditingTeacher(tc)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(tc.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs rounded-lg"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- 6. TAB BÁO CÁO ---------------- */}
        {activeTab === "bao-cao" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Báo Cáo & Thống Kê</h2>
              <p className="text-xs text-slate-500">Tổng hợp học viên, số buổi và cảnh báo học viên sắp hết khóa</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">Học viên đang học</span>
                <div className="text-2xl font-bold text-emerald-600 mt-1">
                  {students.filter((s) => s.status === "Đang học").length}
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">Học viên bảo lưu</span>
                <div className="text-2xl font-bold text-amber-600 mt-1">
                  {students.filter((s) => s.status === "Bảo lưu").length}
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">Đã hết buổi</span>
                <div className="text-2xl font-bold text-rose-600 mt-1">
                  {students.filter((s) => s.status === "Hết buổi").length}
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">Tổng số buổi đã dạy</span>
                <div className="text-2xl font-bold text-[#4A101D] mt-1">
                  {students.reduce((acc, cur) => acc + cur.attendedSessions, 0)}
                </div>
              </div>
            </div>

            {/* Smart Alert: Students running out of sessions */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <span>⚠️</span>
                <span>Học viên sắp hết buổi (Còn ≤ 2 buổi) - Cần nhắc gia hạn</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-rose-50/70 border-b border-rose-100 text-rose-900 font-semibold">
                      <th className="py-2 px-3">Học viên</th>
                      <th className="py-2 px-3">SĐT</th>
                      <th className="py-2 px-3">Khóa học</th>
                      <th className="py-2 px-3">Đã học</th>
                      <th className="py-2 px-3">Còn lại</th>
                      <th className="py-2 px-3 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students
                      .filter((s) => s.packageSessions - s.attendedSessions <= 2 && s.status !== "Hết buổi")
                      .map((s) => (
                        <tr key={s.id}>
                          <td className="py-2 px-3 font-bold text-slate-800">{s.name}</td>
                          <td className="py-2 px-3 text-slate-600">{s.phone}</td>
                          <td className="py-2 px-3 text-slate-600">{s.course}</td>
                          <td className="py-2 px-3 font-semibold">{s.attendedSessions}/{s.packageSessions}</td>
                          <td className="py-2 px-3 font-bold text-rose-600">{s.packageSessions - s.attendedSessions} buổi</td>
                          <td className="py-2 px-3 text-right">
                            <a
                              href={`https://zalo.me/${s.phone.replace(/\s+/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold"
                            >
                              Nhắc Zalo ↗
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 7. TAB CÀI ĐẶT ---------------- */}
        {activeTab === "cai-dat" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Cài Đặt Hệ Thống & Chính Sách</h2>
              <p className="text-xs text-slate-500">Chỉnh sửa thông tin trung tâm, tài khoản VietQR và nội dung lưu ý bảo lưu</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Tên trung tâm</label>
                  <input
                    type="text"
                    value={settings.centerName}
                    onChange={(e) => setSettings({ ...settings, centerName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#4A101D]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Hotline / Zalo</label>
                  <input
                    type="text"
                    value={settings.hotline}
                    onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#4A101D]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Địa chỉ</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#4A101D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Ngân hàng</label>
                  <input
                    type="text"
                    value={settings.bankName}
                    onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#4A101D]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Số tài khoản</label>
                  <input
                    type="text"
                    value={settings.bankAccount}
                    onChange={(e) => setSettings({ ...settings, bankAccount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#4A101D]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Chủ tài khoản</label>
                  <input
                    type="text"
                    value={settings.accountName}
                    onChange={(e) => setSettings({ ...settings, accountName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#4A101D]"
                  />
                </div>
              </div>

              {/* Editable Policy Note */}
              <div className="pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-amber-900 block mb-1">
                  Nội dung quy định / Lưu ý bảo lưu học phí (Hiển thị ở cuối trang xem của học viên)
                </label>
                <textarea
                  rows={3}
                  value={settings.policyNote}
                  onChange={(e) => setSettings({ ...settings, policyNote: e.target.value })}
                  className="w-full p-3 border border-amber-300 bg-amber-50/50 rounded-xl text-xs text-amber-950 font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3">
                <button
                  onClick={() => showToast("✓ Đã lưu thành công tất cả cài đặt hệ thống!")}
                  className="px-5 py-2.5 bg-[#4A101D] hover:bg-[#631728] text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  Lưu Cài Đặt
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: THÊM HỌC VIÊN ================= */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Thêm Học Viên Mới</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const name = form.studentName.value.trim();
                const phone = form.studentPhone.value.trim();
                const course = form.studentCourse.value;
                const sessions = Number(form.studentSessions.value) || 12;
                const tuition = form.studentTuition.value;

                if (!name) return;
                const newId = `HV-2026-${Math.floor(100 + Math.random() * 900)}`;
                const newInvoice = `${settings.invoicePrefix}${Math.floor(10000 + Math.random() * 90000)}`;

                const created: StudentData = {
                  id: newId,
                  name,
                  phone: phone || "09xxxxxxx",
                  status: "Đang học",
                  course,
                  packageSessions: sessions,
                  tuition,
                  attendedSessions: 0,
                  classId: "LOP-01",
                  teacherName: "Quách Hà Vân",
                  invoiceCode: newInvoice,
                  invoiceDate: new Date().toLocaleDateString("vi-VN"),
                  unitPrice: "300.000đ",
                  totalAmount: tuition,
                  paidAmount: tuition,
                  debtAmount: "0đ",
                  paymentStatus: "Đã thanh toán",
                  attendanceList: [],
                };

                setStudents([created, ...students]);
                setSelectedStudentId(newId);
                setShowAddStudentModal(false);
                showToast(`Đã thêm thành công học viên: ${name} (${newId})!`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Họ và tên học viên *</label>
                <input required name="studentName" type="text" placeholder="Nguyễn Văn A" className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Số điện thoại *</label>
                <input required name="studentPhone" type="text" placeholder="0901 234 567" className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Khóa học</label>
                  <select name="studentCourse" className="w-full p-2.5 border border-slate-200 rounded-xl">
                    <option value="Sáo trúc cơ bản">Sáo trúc cơ bản</option>
                    <option value="Sáo Dizi nâng cao">Sáo Dizi nâng cao</option>
                    <option value="Động tiêu & Xiao">Động tiêu & Xiao</option>
                    <option value="Sáo mèo & Sáo bầu">Sáo mèo & Sáo bầu</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số buổi gói</label>
                  <input name="studentSessions" type="number" defaultValue={12} className="w-full p-2.5 border border-slate-200 rounded-xl" />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Học phí (VNĐ)</label>
                <input name="studentTuition" type="text" defaultValue="3.600.000đ" className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddStudentModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-[#4A101D] text-white rounded-xl font-bold shadow">
                  Thêm học viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SỬA HỌC VIÊN ================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Chỉnh Sửa Học Viên</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const name = form.name.value.trim();
                const phone = form.phone.value.trim();
                const course = form.course.value;
                const packageSessions = Number(form.packageSessions.value) || 12;
                const attendedSessions = Number(form.attendedSessions.value) || 0;
                const status = form.status.value;
                const paymentStatus = form.paymentStatus.value;
                const totalAmount = form.totalAmount.value;

                setStudents((prev) =>
                  prev.map((s) => (s.id === editingStudent.id ? {
                    ...s,
                    name,
                    phone,
                    course,
                    packageSessions,
                    attendedSessions,
                    status,
                    paymentStatus,
                    totalAmount,
                  } : s))
                );
                setEditingStudent(null);
                showToast("Đã cập nhật thông tin học viên!");
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Họ tên học viên</label>
                <input required name="name" defaultValue={editingStudent.name} className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Số điện thoại</label>
                <input required name="phone" defaultValue={editingStudent.phone} className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Khóa học</label>
                  <input name="course" defaultValue={editingStudent.course} className="w-full p-2.5 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Trạng thái</label>
                  <select name="status" defaultValue={editingStudent.status} className="w-full p-2.5 border border-slate-200 rounded-xl">
                    <option value="Đang học">Đang học</option>
                    <option value="Hết buổi">Hết buổi</option>
                    <option value="Bảo lưu">Bảo lưu</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số buổi đã học</label>
                  <input type="number" name="attendedSessions" defaultValue={editingStudent.attendedSessions} className="w-full p-2.5 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số buổi gói</label>
                  <input type="number" name="packageSessions" defaultValue={editingStudent.packageSessions} className="w-full p-2.5 border border-slate-200 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Học phí</label>
                  <input name="totalAmount" defaultValue={editingStudent.totalAmount} className="w-full p-2.5 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Thanh toán</label>
                  <select name="paymentStatus" defaultValue={editingStudent.paymentStatus} className="w-full p-2.5 border border-slate-200 rounded-xl">
                    <option value="Đã thanh toán">Đã thanh toán</option>
                    <option value="Còn nợ">Còn nợ</option>
                    <option value="Chưa thanh toán">Chưa thanh toán</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingStudent(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-[#4A101D] text-white rounded-xl font-bold shadow">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: THÊM LỚP HỌC ================= */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Thêm Lớp Học Mới</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const name = form.className.value.trim();
                const teacher = form.teacher.value;
                const scheduleTime = form.scheduleTime.value;
                if (!name) return;
                const newId = `LOP-${String(classes.length + 1).padStart(2, "0")}`;
                setClasses([...classes, { id: newId, name, teacher, scheduleTime, status: "Đang mở", studentIds: [] }]);
                setShowAddClassModal(false);
                showToast(`Đã thêm lớp học mới: ${name}!`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên lớp học *</label>
                <input required name="className" placeholder="Ví dụ: Sáo Trúc Cơ Bản K06" className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Giáo viên phụ trách</label>
                <input required name="teacher" defaultValue="Quách Hà Vân" className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Khung giờ lịch học</label>
                <input required name="scheduleTime" defaultValue="Thứ 3 & Thứ 6 (19:00 - 20:30)" className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddClassModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-[#4A101D] text-white rounded-xl font-bold shadow">
                  Tạo lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SỬA LỚP HỌC ================= */}
      {editingClass && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Sửa Lớp Học: {editingClass.id}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                setClasses((prev) =>
                  prev.map((c) => (c.id === editingClass.id ? {
                    ...c,
                    name: form.name.value,
                    teacher: form.teacher.value,
                    scheduleTime: form.scheduleTime.value,
                    status: form.status.value,
                  } : c))
                );
                setEditingClass(null);
                showToast("Đã cập nhật lớp học!");
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên lớp học</label>
                <input required name="name" defaultValue={editingClass.name} className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Giáo viên phụ trách</label>
                <input required name="teacher" defaultValue={editingClass.teacher} className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Khung giờ lịch học</label>
                <input required name="scheduleTime" defaultValue={editingClass.scheduleTime} className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Trạng thái</label>
                <select name="status" defaultValue={editingClass.status} className="w-full p-2.5 border border-slate-200 rounded-xl">
                  <option value="Đang mở">Đang mở</option>
                  <option value="Sắp mở">Sắp mở</option>
                  <option value="Kết thúc">Kết thúc</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingClass(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-[#4A101D] text-white rounded-xl font-bold shadow">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: THÊM LỊCH DẠY ================= */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Thêm Ca Dạy Mới</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newSc: ScheduleItem = {
                  id: `SCH-${Math.floor(100 + Math.random() * 900)}`,
                  date: form.date.value,
                  time: form.time.value,
                  studentId: form.studentId.value,
                  studentName: students.find((s) => s.id === form.studentId.value)?.name || "Học viên",
                  course: form.course.value,
                  teacher: form.teacher.value,
                  status: "Chưa học",
                };
                setSchedules([newSc, ...schedules]);
                setShowAddScheduleModal(false);
                showToast("Đã thêm ca dạy vào lịch!");
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ngày dạy</label>
                  <input required name="date" defaultValue={new Date().toLocaleDateString("vi-VN")} className="w-full p-2.5 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Khung giờ</label>
                  <input required name="time" defaultValue="19:00 - 20:30" className="w-full p-2.5 border border-slate-200 rounded-xl" />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Học viên</label>
                <select name="studentId" className="w-full p-2.5 border border-slate-200 rounded-xl">
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Khóa học</label>
                <input required name="course" defaultValue="Sáo trúc cơ bản" className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Giáo viên</label>
                <input required name="teacher" defaultValue="Quách Hà Vân" className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddScheduleModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-[#4A101D] text-white rounded-xl font-bold shadow">
                  Thêm ca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SỬA LỊCH DẠY ================= */}
      {editingSchedule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Sửa Ca Dạy: {editingSchedule.id}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                setSchedules((prev) =>
                  prev.map((sc) => (sc.id === editingSchedule.id ? {
                    ...sc,
                    date: form.date.value,
                    time: form.time.value,
                    teacher: form.teacher.value,
                    status: form.status.value,
                  } : sc))
                );
                setEditingSchedule(null);
                showToast("Đã cập nhật ca dạy!");
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ngày dạy</label>
                  <input required name="date" defaultValue={editingSchedule.date} className="w-full p-2.5 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Khung giờ</label>
                  <input required name="time" defaultValue={editingSchedule.time} className="w-full p-2.5 border border-slate-200 rounded-xl" />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Giáo viên</label>
                <input required name="teacher" defaultValue={editingSchedule.teacher} className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Trạng thái</label>
                <select name="status" defaultValue={editingSchedule.status} className="w-full p-2.5 border border-slate-200 rounded-xl">
                  <option value="Chưa học">Chưa học</option>
                  <option value="Đã học">Đã học</option>
                  <option value="Bảo lưu">Bảo lưu</option>
                  <option value="Hủy">Hủy</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingSchedule(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-[#4A101D] text-white rounded-xl font-bold shadow">
                  Lưu ca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: THÊM GIÁO VIÊN ================= */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Thêm Giáo Viên Mới</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newT: TeacherData = {
                  id: `GV-${String(teachers.length + 1).padStart(2, "0")}`,
                  name: form.name.value,
                  phone: form.phone.value,
                  disciplines: form.disciplines.value,
                  classes: [],
                };
                setTeachers([...teachers, newT]);
                setShowAddTeacherModal(false);
                showToast(`Đã thêm giáo viên: ${newT.name}!`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Họ và tên *</label>
                <input required name="name" className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Số điện thoại *</label>
                <input required name="phone" className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bộ môn giảng dạy</label>
                <input required name="disciplines" defaultValue="Sáo trúc Việt Nam, Sáo Dizi" className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddTeacherModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-[#4A101D] text-white rounded-xl font-bold shadow">
                  Thêm giáo viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SỬA GIÁO VIÊN ================= */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Sửa Thông Tin Giáo Viên</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                setTeachers((prev) =>
                  prev.map((t) => (t.id === editingTeacher.id ? {
                    ...t,
                    name: form.name.value,
                    phone: form.phone.value,
                    disciplines: form.disciplines.value,
                  } : t))
                );
                setEditingTeacher(null);
                showToast("Đã cập nhật giáo viên!");
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Họ và tên</label>
                <input required name="name" defaultValue={editingTeacher.name} className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Số điện thoại</label>
                <input required name="phone" defaultValue={editingTeacher.phone} className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bộ môn giảng dạy</label>
                <input required name="disciplines" defaultValue={editingTeacher.disciplines} className="w-full p-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingTeacher(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 bg-[#4A101D] text-white rounded-xl font-bold shadow">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: XEM & IN HÓA ĐƠN ================= */}
      {showInvoiceModal && activeInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
            >
              ✕
            </button>
            <div className="text-center border-b border-slate-200 pb-4 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4A101D]">Hóa Đơn Thu Học Phí</span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{settings.centerName}</h3>
              <p className="text-xs text-slate-500">{settings.address} · Hotline: {settings.hotline}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Mã hóa đơn:</span><b className="text-slate-800">{activeInvoice.invoiceCode}</b></div>
              <div className="flex justify-between"><span className="text-slate-500">Ngày lập:</span><span>{activeInvoice.invoiceDate}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Học viên:</span><b className="text-slate-800">{activeInvoice.name}</b></div>
              <div className="flex justify-between"><span className="text-slate-500">Khóa học:</span><span>{activeInvoice.course} ({activeInvoice.packageSessions} buổi)</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Tổng học phí:</span><b className="text-[#4A101D] text-sm">{activeInvoice.totalAmount}</b></div>
              <div className="flex justify-between"><span className="text-slate-500">Tình trạng:</span><b className="text-emerald-600">{activeInvoice.paymentStatus}</b></div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => window.print()} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-200">
                🖨️ In hóa đơn
              </button>
              <button onClick={() => setShowInvoiceModal(false)} className="px-4 py-2 bg-[#4A101D] text-white font-semibold rounded-lg text-xs hover:bg-[#631728]">
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
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-sm">Đang tải dữ liệu học viên...</div>}>
      <StudentPortalContent />
    </Suspense>
  );
}
