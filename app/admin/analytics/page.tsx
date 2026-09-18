"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";

type StatsData = {
  online_now?: number;
  online?: number;
  summary?: {
    visitors?: number;
    pageviews?: number;
    sessions?: number;
    zalo_clicks?: number;
    signup_clicks?: number;
    phone_clicks?: number;
  };
  sources?: Array<{
    group_source: string;
    visitors: number;
    events?: number;
  }>;
  devices?: Array<{
    device: string;
    visitors: number;
    events?: number;
  }>;
  trend?: Array<{
    date: string;
    visitors: number;
    pageviews: number;
  }>;
  landing_pages?: Array<{
    path: string;
    visitors: number;
    pageviews: number;
    zalo_clicks: number;
    signup_clicks: number;
    avgTimeSeconds?: number;
  }>;
};

export default function AnalyticsAdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Range and dates
  const [currentRange, setCurrentRange] = useState<"today" | "7d" | "30d" | "custom">("today");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Data states
  const [data, setData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fetchStats = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      let url = `/api/analytics/stats?range=${currentRange}`;
      if (currentRange === "custom" && dateFrom && dateTo) {
        url += `&from=${encodeURIComponent(dateFrom)}&to=${encodeURIComponent(dateTo)}`;
      }

      const res = await fetch(url, { credentials: "same-origin" });
      if (res.status === 401) {
        setAuthenticated(false);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (!res.ok) throw new Error("Failed to load analytics");

      const json = await res.json();
      const statsPayload: StatsData = json.data || {
        online_now: json.online || 0,
        summary: {
          visitors: json.overview?.visitors || 0,
          pageviews: json.overview?.pageviews || 0,
          sessions: json.overview?.sessions || 0,
          zalo_clicks: json.overview?.zaloClicks || 0,
          signup_clicks: json.overview?.signupClicks || 0,
          phone_clicks: json.overview?.phoneClicks || 0,
        },
        sources: (json.trafficChannels?.sources || []).map((s: any) => ({
          group_source: s.channel || s.group_source || "Others",
          visitors: s.visitors || 0,
        })),
        devices: (json.devices || []).map((d: any) => ({
          device: d.device || "Desktop",
          visitors: d.visitors || 0,
          events: d.events || d.total_events || 0,
        })),
        trend: (json.timeline || []).map((t: any) => ({
          date: t.day || t.date || "",
          visitors: t.visitors || 0,
          pageviews: t.pageviews || 0,
        })),
        landing_pages: (json.landingPages || json.data?.landing_pages || []).map((lp: any) => ({
          path: lp.landingPage || lp.path || "/",
          visitors: lp.visitors || 0,
          pageviews: lp.pageviews || 0,
          avgTimeSeconds: Math.max(0, Number(lp.avgTimeSeconds || lp.avg_time_sec) || 0),
          zalo_clicks: lp.zaloClicks || lp.zalo_clicks || 0,
          signup_clicks: lp.signupClicks || lp.signup_clicks || 0,
        })),
      };

      setData(statsPayload);
      setAuthenticated(true);
    } catch (err) {
      console.error("Fetch stats error:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchStats();
  }, [currentRange]);

  // Polling every 25 seconds
  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(() => {
      void fetchStats();
    }, 25000);
    return () => clearInterval(interval);
  }, [authenticated, currentRange, dateFrom, dateTo]);

  // Draw trend canvas chart
  useEffect(() => {
    if (!data?.trend || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const trendData = data.trend;
    if (!trendData.length) {
      ctx.fillStyle = "#9C9388";
      ctx.font = "13px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Chưa có dữ liệu xu hướng cho khoảng thời gian này", w / 2, h / 2);
      return;
    }

    const padding = { top: 25, right: 25, bottom: 35, left: 45 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const maxVal = Math.max(
      ...trendData.map((d) => Math.max(d.pageviews || 0, d.visitors || 0)),
      10
    );

    // Grid lines
    ctx.strokeStyle = "#EADFCB";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#9C9388";
    ctx.font = "10px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "right";

    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const y = padding.top + (chartH / gridSteps) * i;
      const val = Math.round(maxVal - (maxVal / gridSteps) * i);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.fillText(val.toString(), padding.left - 8, y + 3);
    }

    const stepX = chartW / Math.max(1, trendData.length - 1);

    // Draw Pageviews Line (Red #881B1B)
    ctx.beginPath();
    trendData.forEach((d, idx) => {
      const x = padding.left + idx * stepX;
      const y = padding.top + chartH - ((d.pageviews || 0) / maxVal) * chartH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#881B1B";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Pageview points
    trendData.forEach((d, idx) => {
      const x = padding.left + idx * stepX;
      const y = padding.top + chartH - ((d.pageviews || 0) / maxVal) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#881B1B";
      ctx.fill();
    });

    // Draw Visitors Line (Green #20402C)
    ctx.beginPath();
    trendData.forEach((d, idx) => {
      const x = padding.left + idx * stepX;
      const y = padding.top + chartH - ((d.visitors || 0) / maxVal) * chartH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#20402C";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Visitor points & Date labels
    ctx.fillStyle = "#20402C";
    ctx.textAlign = "center";
    ctx.font = "10px 'Plus Jakarta Sans', sans-serif";

    trendData.forEach((d, idx) => {
      const x = padding.left + idx * stepX;
      const y = padding.top + chartH - ((d.visitors || 0) / maxVal) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Date label
      ctx.fillStyle = "#9C9388";
      const dateText = d.date ? d.date.slice(5) : "";
      ctx.fillText(dateText, x, h - 10);
      ctx.fillStyle = "#20402C";
    });
  }, [data?.trend]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/cms/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setLoginError("Mật khẩu không đúng! Vui lòng kiểm tra lại.");
        setIsLoggingIn(false);
        return;
      }

      setPassword("");
      setAuthenticated(true);
      await fetchStats();
    } catch {
      setLoginError("Lỗi kết nối. Vui lòng thử lại sau.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const applyCustomRange = () => {
    if (!dateFrom || !dateTo) {
      alert("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
      return;
    }
    setCurrentRange("custom");
    void fetchStats();
  };

  // Auth Screen
  if (authenticated === false) {
    return (
      <div className="fixed inset-0 z-50 bg-[#FAF6EE] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#D9C4A6] shadow-2xl text-center">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="w-16 h-16 mx-auto rounded-full object-cover border-2 border-[#881B1B] shadow-md mb-4"
          />
          <h1 className="font-serif text-2xl font-bold text-[#881B1B]">saotrucauco.com</h1>
          <p className="text-xs text-stone-500 mt-1 mb-6">Hệ Thống Analytics & Báo Cáo Nội Bộ</p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1.5">Mật khẩu quản trị:</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu quản trị..."
                className="w-full bg-[#FAF6EE] border border-[#D9CDBB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#881B1B]"
              />
            </div>

            {loginError && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#881B1B] hover:bg-[#701515] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <i className="fa-solid fa-chart-line"></i> {isLoggingIn ? "Đang kiểm tra..." : "Mở Báo Cáo Thống Kê"}
            </button>
          </form>
          <div className="mt-4">
            <Link href="/" className="text-xs text-stone-500 hover:text-[#881B1B]">
              ← Về trang chủ saotrucauco.com
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const s = data?.summary || {};
  const totalVisitors = Math.max(1, s.visitors || 1);

  // Traffic sources color mapping
  const sourceColors: Record<string, string> = {
    Google: "bg-blue-600",
    Facebook: "bg-indigo-600",
    Zalo: "bg-sky-500",
    YouTube: "bg-red-600",
    TikTok: "bg-stone-900",
    Direct: "bg-emerald-600",
    Others: "bg-stone-400",
  };

  const sourceIcons: Record<string, string> = {
    Google: "fa-brands fa-google text-blue-600",
    Facebook: "fa-brands fa-facebook text-indigo-600",
    Zalo: "fa-solid fa-comment-dots text-sky-500",
    YouTube: "fa-brands fa-youtube text-red-600",
    TikTok: "fa-brands fa-tiktok text-stone-800",
    Direct: "fa-solid fa-compass text-emerald-600",
    Others: "fa-solid fa-link text-stone-500",
  };

  // Device breakdown
  const deviceIcons: Record<string, string> = {
    Mobile: "fa-solid fa-mobile-screen text-[#881B1B]",
    Desktop: "fa-solid fa-laptop text-[#20402C]",
    Tablet: "fa-solid fa-tablet-screen-button text-amber-600",
  };

  return (
    <div className="min-h-screen flex flex-col text-sm text-[#292421]">
      {/* Top Bar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#EADFCB] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/quan-tri" className="flex items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="w-9 h-9 rounded-full object-cover border border-[#881B1B]/30"
            />
            <div>
              <span className="font-serif font-bold text-base text-[#881B1B] leading-none block">
                saotrucauco.com
              </span>
              <span className="text-[11px] text-[#20402C] font-semibold tracking-wider uppercase mt-0.5 block">
                Internal Analytics
              </span>
            </div>
          </Link>
        </div>

        {/* Realtime badge & Polling status */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>
              Online: <strong className="text-emerald-700 text-sm">{data?.online_now ?? 0}</strong>
            </span>
          </div>

          <button
            onClick={() => void fetchStats(true)}
            className="p-2 rounded-xl border border-[#D9CDBB] bg-[#FAF6EE] hover:bg-stone-200 text-stone-700 transition-colors"
            title="Làm mới dữ liệu"
          >
            <i className={`fa-solid fa-arrows-rotate text-xs ${isRefreshing ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/quan-tri"
            className="px-3 py-1.5 bg-[#881B1B] hover:bg-[#701515] text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <i className="fa-solid fa-sliders"></i> Quản trị
          </Link>
        </div>
      </header>

      {/* Content Area */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
        {/* Banner Section matching Screenshot 1 */}
        <div className="bg-white rounded-2xl border border-[#E8DFC8] shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#881B1B] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#193822]">Hệ Thống Analytics & Phễu Chuyển Đổi</h3>
              <p className="text-xs text-stone-500">Xem trực tiếp số liệu lưu lượng, tỷ lệ chuyển đổi Zalo & Đăng ký học</p>
            </div>
          </div>
          <a
            href="/admin/analytics"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-[#FAF6EE] hover:bg-[#EADBCA] border border-[#D9CDBB] text-[#881B1B] font-bold rounded-xl text-xs flex items-center gap-2 transition-all"
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i> Mở trang riêng
          </a>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8DFC8] shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#292421]">Báo Cáo Lưu Lượng & Chuyển Đổi</h2>
            <p className="text-xs text-stone-500 mt-0.5">Dữ liệu cập nhật tự động mỗi 25 giây • Không block render</p>
          </div>

          {/* Date Range Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex p-1 bg-[#FAF6EE] border border-[#D9CDBB] rounded-xl text-xs font-medium">
              <button
                onClick={() => setCurrentRange("today")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  currentRange === "today"
                    ? "bg-[#881B1B] text-white font-semibold shadow-xs"
                    : "text-stone-700 hover:text-[#881B1B]"
                }`}
              >
                Hôm nay
              </button>
              <button
                onClick={() => setCurrentRange("7d")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  currentRange === "7d"
                    ? "bg-[#881B1B] text-white font-semibold shadow-xs"
                    : "text-stone-700 hover:text-[#881B1B]"
                }`}
              >
                7 ngày qua
              </button>
              <button
                onClick={() => setCurrentRange("30d")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  currentRange === "30d"
                    ? "bg-[#881B1B] text-white font-semibold shadow-xs"
                    : "text-stone-700 hover:text-[#881B1B]"
                }`}
              >
                30 ngày qua
              </button>
            </div>

            {/* Custom Date Input */}
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-[#FAF6EE] border border-[#D9CDBB] rounded-lg px-2.5 py-1 text-xs text-stone-700 outline-none"
              />
              <span className="text-stone-400 text-xs">→</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-[#FAF6EE] border border-[#D9CDBB] rounded-lg px-2.5 py-1 text-xs text-stone-700 outline-none"
              />
              <button
                onClick={applyCustomRange}
                className="px-2.5 py-1 bg-[#193822] text-white rounded-lg text-xs font-medium hover:bg-[#122a19]"
              >
                Lọc
              </button>
            </div>
          </div>
        </div>

        {/* KPI Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Card 1: Visitors */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8DFC8] shadow-xs">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Khách xem (Visitors)</span>
              <i className="fa-solid fa-users text-[#881B1B]"></i>
            </div>
            <div className="text-2xl font-bold font-serif text-[#292421]">{(s.visitors || 0).toLocaleString()}</div>
            <p className="text-[11px] text-stone-500 mt-1">Unique visitor ID</p>
          </div>

          {/* Card 2: Pageviews */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8DFC8] shadow-xs">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Lượt xem (Pageviews)</span>
              <i className="fa-solid fa-eye text-[#20402C]"></i>
            </div>
            <div className="text-2xl font-bold font-serif text-[#20402C]">{(s.pageviews || 0).toLocaleString()}</div>
            <p className="text-[11px] text-stone-500 mt-1">Tổng số trang đã xem</p>
          </div>

          {/* Card 3: Sessions */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8DFC8] shadow-xs">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Phiên (Sessions)</span>
              <i className="fa-solid fa-clock-rotate-left text-amber-600"></i>
            </div>
            <div className="text-2xl font-bold font-serif text-[#292421]">{(s.sessions || 0).toLocaleString()}</div>
            <p className="text-[11px] text-stone-500 mt-1">Chu kỳ 30 phút</p>
          </div>

          {/* Card 4: Zalo Clicks */}
          <div className="bg-white rounded-2xl p-4 border border-blue-200 bg-gradient-to-br from-white to-blue-50/40 shadow-xs">
            <div className="flex items-center justify-between text-blue-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">Click Zalo</span>
              <i className="fa-solid fa-comment-dots text-blue-600"></i>
            </div>
            <div className="text-2xl font-bold font-serif text-blue-700">{(s.zalo_clicks || 0).toLocaleString()}</div>
            <p className="text-[11px] text-blue-600/80 mt-1">Liên hệ tư vấn Zalo</p>
          </div>

          {/* Card 5: Signup Clicks */}
          <div className="bg-white rounded-2xl p-4 border border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40 shadow-xs">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Đăng Ký Học</span>
              <i className="fa-solid fa-graduation-cap text-emerald-600"></i>
            </div>
            <div className="text-2xl font-bold font-serif text-emerald-700">{(s.signup_clicks || 0).toLocaleString()}</div>
            <p className="text-[11px] text-emerald-600/80 mt-1">Bắt đầu học & Lớp học</p>
          </div>

          {/* Card 6: Phone Clicks */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200 bg-gradient-to-br from-white to-amber-50/40 shadow-xs">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Click Gọi Điện</span>
              <i className="fa-solid fa-phone text-amber-600"></i>
            </div>
            <div className="text-2xl font-bold font-serif text-amber-700">{(s.phone_clicks || 0).toLocaleString()}</div>
            <p className="text-[11px] text-amber-600/80 mt-1">Hotline 0374 261 368</p>
          </div>
        </div>

        {/* Main Trend Chart */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFC8] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-[#292421]">Xu Hướng Truy Cập Theo Ngày</h3>
              <p className="text-xs text-stone-500">So sánh lượt truy cập (Visitors) và lượt xem trang (Pageviews)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#881B1B]"></span> Pageviews
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#20402C]"></span> Visitors
              </span>
            </div>
          </div>

          {/* Canvas Chart Container */}
          <div className="relative w-full h-64 sm:h-72">
            <canvas ref={canvasRef} className="w-full h-full"></canvas>
          </div>
        </div>

        {/* Middle Grid: Sources & Devices */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Traffic Sources Breakdown (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-[#E8DFC8] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-base text-[#292421]">Nguồn Lưu Lượng (Traffic Sources)</h3>
              <span className="text-xs text-stone-400">Google • Facebook • Direct • Khác</span>
            </div>
            <div className="space-y-3">
              {(data?.sources || []).map((item, idx) => {
                const pct = Math.min(100, Math.round((item.visitors / totalVisitors) * 100));
                const color = sourceColors[item.group_source] || "bg-[#881B1B]";
                const icon = sourceIcons[item.group_source] || "fa-solid fa-globe text-stone-500";

                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="flex items-center gap-2 font-medium">
                        <i className={`${icon} w-4 text-center`}></i> {item.group_source}
                      </span>
                      <span className="font-bold text-stone-700">
                        {item.visitors.toLocaleString()}{" "}
                        <span className="text-stone-400 font-normal">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-[#FAF6EE] h-2 rounded-full overflow-hidden border border-[#EADFCB]">
                      <div
                        className={`${color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(4, pct)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {(data?.sources || []).length === 0 && (
                <div className="text-center py-6 text-stone-400">Chưa có dữ liệu nguồn truy cập</div>
              )}
            </div>
          </div>

          {/* Device Breakdown (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#E8DFC8] shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-[#292421] mb-1">Thiết Bị Truy Cập</h3>
              <p className="text-xs text-stone-500 mb-4">Tỷ lệ Mobile, Desktop và Tablet</p>
              <div className="space-y-3">
                {(data?.devices || []).map((item, idx) => {
                  const pct = Math.min(100, Math.round((item.visitors / totalVisitors) * 100));
                  const icon = deviceIcons[item.device] || "fa-solid fa-display text-stone-500";

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6EE] border border-[#EADFCB]"
                    >
                      <div className="flex items-center gap-3">
                        <i className={`${icon} text-lg`}></i>
                        <div>
                          <span className="font-bold text-xs text-stone-800 block">{item.device}</span>
                          <span className="text-[11px] text-stone-500">
                            {(item.events || 0).toLocaleString()} lượt tương tác
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#881B1B]">{pct}%</span>
                        <span className="block text-[10px] text-stone-500">{item.visitors} khách</span>
                      </div>
                    </div>
                  );
                })}
                {(data?.devices || []).length === 0 && (
                  <div className="text-center py-6 text-stone-400">Chưa có dữ liệu thiết bị</div>
                )}
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#FAF6EE] rounded-xl border border-[#D9CDBB] text-xs text-stone-600">
              <i className="fa-solid fa-circle-info text-[#881B1B] mr-1"></i> Tối ưu giao diện cho{" "}
              <strong>Mobile</strong> giúp tăng tối đa tỷ lệ click Zalo và đăng ký học trực tiếp.
            </div>
          </div>
        </div>

        {/* Top Visited Pages & Landing Pages Table */}
        <div className="bg-white rounded-2xl border border-[#E8DFC8] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#EADFCB] flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-serif font-bold text-base text-[#292421]">
                Hiệu Quả Landing Page & Phễu Chuyển Đổi
              </h3>
              <p className="text-xs text-stone-500">
                Đo lường: Nguồn traffic → Landing page → Hành vi → Click Zalo / Đăng ký học
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#FAF6EE] border border-[#D9CDBB] text-stone-600">
              Top Landing Pages
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF6EE] text-[11px] font-bold text-stone-600 uppercase tracking-wider border-b border-[#EADFCB]">
                  <th className="py-3 px-4">Landing Page / URL</th>
                  <th className="py-3 px-4 text-center">Khách (Visitors)</th>
                  <th className="py-3 px-4 text-center">Lượt xem (Pageviews)</th>
                  <th className="py-3 px-4 text-center">Avg time</th>
                  <th className="py-3 px-4 text-center text-blue-700">Click Zalo</th>
                  <th className="py-3 px-4 text-center text-emerald-700">Click Đăng ký</th>
                  <th className="py-3 px-4 text-right">Tỷ lệ chuyển đổi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADFCB]/60 text-xs">
                {(data?.landing_pages || []).map((p, idx) => {
                  const totalConversions = (p.zalo_clicks || 0) + (p.signup_clicks || 0);
                  const cr = p.visitors > 0 ? ((totalConversions / p.visitors) * 100).toFixed(1) : "0.0";
                  const avgTimeFormatted = (() => {
                    const sec = p.avgTimeSeconds || 0;
                    if (!sec || sec <= 0) return "0s";
                    if (sec < 60) return `${Math.round(sec)}s`;
                    const mins = Math.floor(sec / 60);
                    const remSec = Math.round(sec % 60);
                    return `${mins}m ${remSec}s`;
                  })();

                  return (
                    <tr key={idx} className="hover:bg-[#FAF6EE]/50 transition-colors">
                      <td className="py-3 px-4">
                        <a
                          href={p.path}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-[#881B1B] hover:underline flex items-center gap-1.5"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-stone-400"></i>
                          <span className="truncate max-w-xs sm:max-w-md">{p.path}</span>
                        </a>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-stone-700">
                        {(p.visitors || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center text-stone-600">
                        {(p.pageviews || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-stone-600">
                        {avgTimeFormatted}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-blue-700">
                        {(p.zalo_clicks || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700">
                        {(p.signup_clicks || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md ${
                            totalConversions > 0
                              ? "bg-emerald-100 text-emerald-800 font-bold"
                              : "bg-stone-100 text-stone-500"
                          } text-xs`}
                        >
                          {cr}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {(data?.landing_pages || []).length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-stone-400">
                      Chưa có dữ liệu landing page
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-stone-400 border-t border-[#EADFCB] bg-white">
        saotrucauco.com In-House Analytics • Sáo Trúc Âu Cơ © 2026
      </footer>
    </div>
  );
}
