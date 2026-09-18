"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BrandLogo from "../../brand-logo";

type StatsResponse = {
  ok: boolean;
  error?: string;
  period: {
    range: string;
    from: string;
    to: string;
    todayDate: string;
  };
  online: number;
  today: {
    visitors: number;
    pageviews: number;
  };
  overview: {
    visitors: number;
    sessions: number;
    pageviews: number;
    zaloClicks: number;
    signupClicks: number;
    phoneClicks: number;
    playAudio: number;
    playVideo: number;
    scrollMilestones: {
      s25: number;
      s50: number;
      s75: number;
      s100: number;
    };
  };
  trafficChannels: {
    google: number;
    facebook: number;
    direct: number;
    sources: Array<{ channel: string; visitors: number; total_events: number }>;
  };
  devices: Array<{ device: string; visitors: number; total_events: number }>;
  topPages: Array<{ path: string; views: number; visitors: number }>;
  timeline: Array<{
    day: string;
    visitors: number;
    pageviews: number;
    zalo_clicks: number;
    signup_clicks: number;
  }>;
  landingPages: Array<{
    landingPage: string;
    visitors: number;
    pageviews: number;
    avgTimeSeconds: number;
    zaloClicks: number;
    signupClicks: number;
  }>;
};

export default function AnalyticsAdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Date filter states
  const [filterRange, setFilterRange] = useState<"today" | "7d" | "30d" | "custom">("today");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  // Data & loading states
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Realtime polling
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(25);

  // Landing page search filter
  const [lpSearch, setLpSearch] = useState("");

  // Chart tooltip state
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const fetchStats = async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      let queryUrl = `/api/analytics/stats?range=${filterRange}`;
      if (filterRange === "custom" && customFrom && customTo) {
        queryUrl += `&from=${encodeURIComponent(customFrom)}&to=${encodeURIComponent(customTo)}`;
      }

      const res = await fetch(queryUrl, { credentials: "same-origin" });

      if (res.status === 401) {
        setAuthenticated(false);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (!res.ok) throw new Error("Failed to load stats");

      const data = (await res.json()) as StatsResponse;
      if (data.ok) {
        setStats(data);
        setAuthenticated(true);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Error fetching analytics stats:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchStats();
  }, [filterRange]);

  // Handle countdown and polling
  useEffect(() => {
    if (!authenticated || !autoRefresh) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          void fetchStats(true);
          return 25;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [authenticated, autoRefresh, filterRange, customFrom, customTo]);

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
        setLoginError("Mật khẩu không đúng. Vui lòng kiểm tra lại.");
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

  const handleLogout = async () => {
    await fetch("/api/cms/logout", { method: "POST" });
    setAuthenticated(false);
    setStats(null);
  };

  const handleApplyCustomDate = (e: FormEvent) => {
    e.preventDefault();
    if (!customFrom || !customTo) return;
    setFilterRange("custom");
    void fetchStats();
  };

  // Filtered Landing Pages
  const filteredLandingPages = useMemo(() => {
    if (!stats?.landingPages) return [];
    if (!lpSearch.trim()) return stats.landingPages;
    const term = lpSearch.toLowerCase().trim();
    return stats.landingPages.filter((lp) => lp.landingPage.toLowerCase().includes(term));
  }, [stats?.landingPages, lpSearch]);

  // Format seconds to mm:ss
  const formatDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return "0s";
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  // If waiting for initial auth check
  if (authenticated === null && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#11050a] text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-400" />
          <p className="text-sm tracking-wide text-amber-200/70">Đang xác thực và tải dữ liệu Analytics...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, display login form
  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#11050a] px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-amber-500/20 bg-[#1c0a13]/90 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-6 flex flex-col items-center text-center">
            <BrandLogo size="md" />
            <h1 className="mt-4 text-xl font-bold tracking-tight text-amber-100">QUẢN TRỊ ANALYTICS</h1>
            <p className="mt-1 text-xs text-amber-200/60">
              Vui lòng nhập mật khẩu quản trị Sáo Trúc Âu Cơ để truy cập báo cáo
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-amber-200/80">
                Mật khẩu Quản trị
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mã bảo mật..."
                className="w-full rounded-xl border border-amber-500/30 bg-[#2b0f1d] px-4 py-3 text-sm text-amber-100 placeholder-amber-200/30 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
              />
            </div>

            {loginError && (
              <div className="rounded-lg bg-red-950/60 border border-red-500/40 p-3 text-xs text-red-200">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-bold text-stone-950 shadow-lg transition-all duration-200 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoggingIn ? "Đang kiểm tra..." : "Đăng nhập Dashboard"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-amber-300/60 hover:text-amber-200 transition-colors">
              ← Trở về Trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Total devices calculation
  const totalDeviceEvents = (stats?.devices || []).reduce((acc, d) => acc + d.visitors, 0) || 1;
  const mobileDevice = (stats?.devices || []).find((d) => d.device === "mobile")?.visitors || 0;
  const desktopDevice = (stats?.devices || []).find((d) => d.device === "desktop")?.visitors || 0;
  const mobilePercent = Math.round((mobileDevice / totalDeviceEvents) * 100);
  const desktopPercent = Math.max(0, 100 - mobilePercent);

  // SVG Chart points calculation
  const chartData = stats?.timeline || [];
  const maxPv = Math.max(...chartData.map((d) => d.pageviews), 10);
  const maxVisitors = Math.max(...chartData.map((d) => d.visitors), 10);
  const chartMax = Math.max(maxPv, maxVisitors);

  const chartWidth = 700;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 25;

  const getCoordinates = (val: number, index: number, total: number) => {
    if (total <= 1) return { x: paddingX, y: chartHeight - paddingY };
    const x = paddingX + (index / (total - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (val / chartMax) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  const pvPoints = chartData.map((d, i) => getCoordinates(d.pageviews, i, chartData.length));
  const visPoints = chartData.map((d, i) => getCoordinates(d.visitors, i, chartData.length));

  const pvPolyline = pvPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const visPolyline = visPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const pvArea = pvPoints.length > 0
    ? `${pvPoints[0].x},${chartHeight - paddingY} ${pvPolyline} ${pvPoints[pvPoints.length - 1].x},${chartHeight - paddingY}`
    : "";

  return (
    <div className="min-h-screen bg-[#0f0408] text-stone-100 font-sans antialiased pb-16">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-amber-900/30 bg-[#16060c]/90 backdrop-blur-md px-4 lg:px-8 py-3.5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-amber-100 tracking-tight">SÁO TRÚC ÂU CƠ</h1>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                  INTERNAL ANALYTICS
                </span>
              </div>
              <p className="text-[11px] text-amber-200/50">Hệ thống phân tích truy cập & hành vi không làm chậm website</p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Realtime Online Badge */}
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-300 shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="font-semibold">{stats?.online ?? 0}</span> người đang online
            </div>

            {/* Auto refresh button / countdown */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              title={autoRefresh ? "Bấm để tạm dừng tự động tải" : "Bấm để bật tự động tải"}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-colors ${
                autoRefresh
                  ? "border-amber-500/40 bg-amber-950/30 text-amber-200"
                  : "border-stone-800 bg-stone-900/50 text-stone-400"
              }`}
            >
              <i className={`fa-solid fa-arrows-rotate text-[11px] ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{autoRefresh ? `${countdown}s` : "Tạm dừng"}</span>
            </button>

            <button
              onClick={() => void fetchStats(true)}
              disabled={isRefreshing}
              className="rounded-lg border border-amber-500/30 bg-amber-950/50 px-3 py-1 text-xs font-medium text-amber-200 hover:bg-amber-900/40 transition-colors"
            >
              Làm mới ngay
            </button>

            <Link
              href="/quan-tri"
              className="rounded-lg border border-amber-500/20 bg-stone-900/80 px-3 py-1 text-xs font-medium text-amber-200/80 hover:text-amber-100 hover:border-amber-500/40 transition-colors"
            >
              ← Về CMS
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-1 text-xs font-medium text-red-300 hover:bg-red-900/40 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 lg:px-8 pt-6">
        {/* Date Filter Toolbar */}
        <section className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-900/30 bg-[#190810]/70 p-4 backdrop-blur shadow-lg">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300/70 mr-1">Bộ lọc thời gian:</span>
            {(["today", "7d", "30d", "custom"] as const).map((r) => {
              const labels = {
                today: "Hôm nay",
                "7d": "7 ngày qua",
                "30d": "30 ngày qua",
                custom: "Tùy chọn khoảng ngày",
              };
              const active = filterRange === r;
              return (
                <button
                  key={r}
                  onClick={() => setFilterRange(r)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-md shadow-amber-900/20"
                      : "border border-amber-900/40 bg-[#240c17]/60 text-amber-100/70 hover:bg-[#311120] hover:text-amber-100"
                  }`}
                >
                  {labels[r]}
                </button>
              );
            })}
          </div>

          {filterRange === "custom" && (
            <form onSubmit={handleApplyCustomDate} className="flex flex-wrap items-center gap-2 text-xs">
              <input
                type="date"
                required
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="rounded-lg border border-amber-500/30 bg-[#280c19] px-2.5 py-1.5 text-amber-100 focus:outline-none focus:border-amber-400"
              />
              <span className="text-amber-200/50">đến</span>
              <input
                type="date"
                required
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="rounded-lg border border-amber-500/30 bg-[#280c19] px-2.5 py-1.5 text-amber-100 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="rounded-lg bg-amber-500 px-3 py-1.5 font-semibold text-stone-950 hover:bg-amber-400 transition-colors"
              >
                Áp dụng
              </button>
            </form>
          )}

          {lastUpdated && (
            <div className="text-[11px] text-amber-200/40">
              Cập nhật lúc: {lastUpdated.toLocaleTimeString("vi-VN")}
            </div>
          )}
        </section>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-amber-900/30 bg-[#16060c]/50">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
              <p className="text-xs text-amber-200/60">Đang tổng hợp số liệu...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Top KPI Summary Cards */}
            <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1: Visitors */}
              <div className="relative overflow-hidden rounded-2xl border border-amber-900/30 bg-gradient-to-br from-[#1d0a13] to-[#14060d] p-4 lg:p-5 shadow-lg">
                <div className="flex items-center justify-between text-amber-300/80">
                  <span className="text-xs font-bold uppercase tracking-wider">Khách truy cập</span>
                  <i className="fa-solid fa-users text-amber-400/80 text-sm" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl lg:text-3xl font-extrabold text-amber-100">
                    {stats?.overview.visitors.toLocaleString("vi-VN") ?? 0}
                  </span>
                  <span className="text-xs text-amber-200/60 font-medium">trong kỳ</span>
                </div>
                <div className="mt-2 text-[11px] text-emerald-400/90 font-medium">
                  Hôm nay: <strong className="text-emerald-300">{stats?.today.visitors.toLocaleString("vi-VN") ?? 0}</strong> visitors
                </div>
              </div>

              {/* Card 2: Pageviews */}
              <div className="relative overflow-hidden rounded-2xl border border-amber-900/30 bg-gradient-to-br from-[#1d0a13] to-[#14060d] p-4 lg:p-5 shadow-lg">
                <div className="flex items-center justify-between text-amber-300/80">
                  <span className="text-xs font-bold uppercase tracking-wider">Lượt xem trang</span>
                  <i className="fa-regular fa-eye text-amber-400/80 text-sm" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl lg:text-3xl font-extrabold text-amber-100">
                    {stats?.overview.pageviews.toLocaleString("vi-VN") ?? 0}
                  </span>
                  <span className="text-xs text-amber-200/60 font-medium">pageviews</span>
                </div>
                <div className="mt-2 text-[11px] text-emerald-400/90 font-medium">
                  Hôm nay: <strong className="text-emerald-300">{stats?.today.pageviews.toLocaleString("vi-VN") ?? 0}</strong> lượt xem
                </div>
              </div>

              {/* Card 3: Sessions */}
              <div className="relative overflow-hidden rounded-2xl border border-amber-900/30 bg-gradient-to-br from-[#1d0a13] to-[#14060d] p-4 lg:p-5 shadow-lg">
                <div className="flex items-center justify-between text-amber-300/80">
                  <span className="text-xs font-bold uppercase tracking-wider">Phiên truy cập</span>
                  <i className="fa-solid fa-clock-rotate-left text-amber-400/80 text-sm" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl lg:text-3xl font-extrabold text-amber-100">
                    {stats?.overview.sessions.toLocaleString("vi-VN") ?? 0}
                  </span>
                  <span className="text-xs text-amber-200/60 font-medium">sessions</span>
                </div>
                <div className="mt-2 text-[11px] text-amber-200/60">
                  TB {(stats?.overview.sessions ? (stats.overview.pageviews / stats.overview.sessions).toFixed(1) : 0)} trang / phiên
                </div>
              </div>

              {/* Card 4: Conversions (Zalo & Signup) */}
              <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#280e1a] to-[#1a0710] p-4 lg:p-5 shadow-lg">
                <div className="flex items-center justify-between text-amber-300">
                  <span className="text-xs font-bold uppercase tracking-wider">Chuyển đổi Zalo & Đăng ký</span>
                  <i className="fa-solid fa-bullseye text-amber-400 text-sm" />
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xl lg:text-2xl font-black text-amber-200">
                      {stats?.overview.zaloClicks.toLocaleString("vi-VN") ?? 0}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-sky-400">Click Zalo</div>
                  </div>
                  <div className="h-8 w-px bg-amber-900/50" />
                  <div>
                    <div className="text-xl lg:text-2xl font-black text-amber-200">
                      {stats?.overview.signupClicks.toLocaleString("vi-VN") ?? 0}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-amber-400">Đăng ký học</div>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-amber-300/80 font-medium">
                  Tỷ lệ chuyển đổi:{" "}
                  <strong>
                    {stats?.overview.visitors
                      ? (
                          (((stats.overview.zaloClicks + stats.overview.signupClicks) / stats.overview.visitors) * 100)
                        ).toFixed(1)
                      : 0}
                    %
                  </strong>
                </div>
              </div>
            </section>

            {/* Traffic Channels & Devices */}
            <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Traffic Channels Breakdown */}
              <div className="rounded-2xl border border-amber-900/30 bg-[#16060c]/80 p-5 shadow-lg lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-amber-100">
                      Nguồn Traffic (Kênh truy cập)
                    </h2>
                    <p className="text-xs text-amber-200/50">Phân loại Google, Facebook, Trực tiếp & các nguồn khác</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="rounded-xl border border-blue-900/40 bg-blue-950/20 p-3 text-center">
                    <div className="text-xs text-blue-300 font-semibold flex items-center justify-center gap-1.5">
                      <i className="fa-brands fa-google text-blue-400" /> Google Search
                    </div>
                    <div className="mt-1 text-lg font-black text-blue-100">
                      {stats?.trafficChannels.google.toLocaleString("vi-VN") ?? 0}
                    </div>
                    <div className="text-[10px] text-blue-300/60">visitors</div>
                  </div>

                  <div className="rounded-xl border border-indigo-900/40 bg-indigo-950/20 p-3 text-center">
                    <div className="text-xs text-indigo-300 font-semibold flex items-center justify-center gap-1.5">
                      <i className="fa-brands fa-facebook text-indigo-400" /> Facebook
                    </div>
                    <div className="mt-1 text-lg font-black text-indigo-100">
                      {stats?.trafficChannels.facebook.toLocaleString("vi-VN") ?? 0}
                    </div>
                    <div className="text-[10px] text-indigo-300/60">visitors</div>
                  </div>

                  <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-3 text-center">
                    <div className="text-xs text-amber-300 font-semibold flex items-center justify-center gap-1.5">
                      <i className="fa-solid fa-link text-amber-400" /> Direct (Trực tiếp)
                    </div>
                    <div className="mt-1 text-lg font-black text-amber-100">
                      {stats?.trafficChannels.direct.toLocaleString("vi-VN") ?? 0}
                    </div>
                    <div className="text-[10px] text-amber-300/60">visitors</div>
                  </div>
                </div>

                {/* Detailed Channel List */}
                <div className="space-y-2.5">
                  {(stats?.trafficChannels.sources || []).map((src, idx) => {
                    const totalV = stats?.overview.visitors || 1;
                    const pct = Math.min(100, Math.round((src.visitors / totalV) * 100));
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-amber-100">{src.channel}</span>
                          <span className="text-amber-200/70">
                            {src.visitors.toLocaleString("vi-VN")} visitors ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-900">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                            style={{ width: `${Math.max(4, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {(stats?.trafficChannels.sources || []).length === 0 && (
                    <p className="text-xs text-amber-200/40 text-center py-4">Chưa có dữ liệu nguồn truy cập trong kỳ này</p>
                  )}
                </div>
              </div>

              {/* Devices & Behavioral Events */}
              <div className="space-y-4">
                {/* Device Breakdown */}
                <div className="rounded-2xl border border-amber-900/30 bg-[#16060c]/80 p-5 shadow-lg">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-amber-100 mb-1">
                    Thiết bị truy cập
                  </h2>
                  <p className="text-xs text-amber-200/50 mb-4">Mobile vs Desktop</p>

                  <div className="flex items-center justify-between gap-4 mb-3 text-center">
                    <div className="flex-1 rounded-xl border border-amber-900/30 bg-[#220c18] p-3">
                      <i className="fa-solid fa-mobile-screen text-amber-400 text-lg mb-1" />
                      <div className="text-base font-black text-amber-100">{mobilePercent}%</div>
                      <div className="text-[10px] text-amber-200/60">{mobileDevice} visitors</div>
                    </div>
                    <div className="flex-1 rounded-xl border border-amber-900/30 bg-[#220c18] p-3">
                      <i className="fa-solid fa-display text-amber-400 text-lg mb-1" />
                      <div className="text-base font-black text-amber-100">{desktopPercent}%</div>
                      <div className="text-[10px] text-amber-200/60">{desktopDevice} visitors</div>
                    </div>
                  </div>

                  <div className="h-2.5 w-full flex overflow-hidden rounded-full bg-stone-900">
                    <div className="bg-amber-400 h-full" style={{ width: `${mobilePercent}%` }} />
                    <div className="bg-amber-700 h-full" style={{ width: `${desktopPercent}%` }} />
                  </div>
                </div>

                {/* Behavioral Milestones */}
                <div className="rounded-2xl border border-amber-900/30 bg-[#16060c]/80 p-5 shadow-lg">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-amber-100 mb-1">
                    Hành vi tương tác
                  </h2>
                  <p className="text-xs text-amber-200/50 mb-3">Độ sâu cuộn trang & tương tác media</p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between rounded-lg bg-[#220c18] px-3 py-2 border border-amber-900/20">
                      <span className="text-amber-200/70">Cuộn 25% trang</span>
                      <span className="font-bold text-amber-100">{stats?.overview.scrollMilestones.s25 ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-[#220c18] px-3 py-2 border border-amber-900/20">
                      <span className="text-amber-200/70">Cuộn 50% trang</span>
                      <span className="font-bold text-amber-100">{stats?.overview.scrollMilestones.s50 ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-[#220c18] px-3 py-2 border border-amber-900/20">
                      <span className="text-amber-200/70">Cuộn 75% trang</span>
                      <span className="font-bold text-amber-100">{stats?.overview.scrollMilestones.s75 ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-[#220c18] px-3 py-2 border border-amber-900/20">
                      <span className="text-amber-200/70">Cuộn 100% trang</span>
                      <span className="font-bold text-amber-100">{stats?.overview.scrollMilestones.s100 ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-[#220c18] px-3 py-2 border border-amber-900/20">
                      <span className="text-amber-200/70">Bấm số điện thoại (Call)</span>
                      <span className="font-bold text-amber-100">{stats?.overview.phoneClicks ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-[#220c18] px-3 py-2 border border-amber-900/20">
                      <span className="text-amber-200/70">Nghe Audio / Xem Video</span>
                      <span className="font-bold text-amber-100">
                        {(stats?.overview.playAudio ?? 0) + (stats?.overview.playVideo ?? 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive Traffic Chart (7 days / 30 days) */}
            <section className="mb-6 rounded-2xl border border-amber-900/30 bg-[#16060c]/80 p-5 shadow-lg">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-amber-100">
                    Biểu đồ Traffic (Lượt xem & Khách truy cập)
                  </h2>
                  <p className="text-xs text-amber-200/50">Di chuột vào các điểm để xem chi tiết từng ngày</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="text-amber-200">Visitors (Khách)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-rose-500" />
                    <span className="text-rose-200">Pageviews (Lượt xem)</span>
                  </div>
                </div>
              </div>

              {chartData.length === 0 ? (
                <div className="flex h-52 items-center justify-center text-xs text-amber-200/40">
                  Chưa có dữ liệu biểu đồ cho khoảng thời gian này
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-[650px] relative">
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-56 overflow-visible">
                      <defs>
                        <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Grid lines */}
                      {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                        const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
                        const val = Math.round(ratio * chartMax);
                        return (
                          <g key={idx}>
                            <line
                              x1={paddingX}
                              y1={y}
                              x2={chartWidth - paddingX}
                              y2={y}
                              stroke="#3a1622"
                              strokeDasharray="4 4"
                            />
                            <text
                              x={paddingX - 8}
                              y={y + 3}
                              fill="#9e717e"
                              fontSize="10"
                              textAnchor="end"
                              fontFamily="sans-serif"
                            >
                              {val}
                            </text>
                          </g>
                        );
                      })}

                      {/* Area Fill for Pageviews */}
                      {pvArea && <polygon points={pvArea} fill="url(#pvGrad)" />}

                      {/* Pageviews Line */}
                      {pvPolyline && (
                        <polyline
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={pvPolyline}
                        />
                      )}

                      {/* Visitors Line */}
                      {visPolyline && (
                        <polyline
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={visPolyline}
                        />
                      )}

                      {/* Data Points */}
                      {chartData.map((d, idx) => {
                        const pVis = visPoints[idx];
                        const pPv = pvPoints[idx];
                        const isHovered = hoveredIndex === idx;

                        return (
                          <g key={idx}>
                            {/* Date Label on X Axis */}
                            <text
                              x={pVis.x}
                              y={chartHeight - 6}
                              fill={isHovered ? "#fbbf24" : "#9e717e"}
                              fontSize="9.5"
                              textAnchor="middle"
                              fontWeight={isHovered ? "bold" : "normal"}
                            >
                              {d.day.slice(5)}
                            </text>

                            {/* Point for Pageviews */}
                            <circle
                              cx={pPv.x}
                              cy={pPv.y}
                              r={isHovered ? 5 : 3.5}
                              fill="#f43f5e"
                              stroke="#16060c"
                              strokeWidth="2"
                              className="transition-all"
                            />

                            {/* Point for Visitors */}
                            <circle
                              cx={pVis.x}
                              cy={pVis.y}
                              r={isHovered ? 5 : 3.5}
                              fill="#fbbf24"
                              stroke="#16060c"
                              strokeWidth="2"
                              className="transition-all"
                            />

                            {/* Transparent hover target */}
                            <rect
                              x={pVis.x - 15}
                              y={paddingY}
                              width={30}
                              height={chartHeight - paddingY * 2}
                              fill="transparent"
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredIndex(idx)}
                              onMouseLeave={() => setHoveredIndex(null)}
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* Interactive Tooltip Card */}
                    {hoveredIndex !== null && chartData[hoveredIndex] && (
                      <div
                        className="pointer-events-none absolute z-20 rounded-xl border border-amber-500/40 bg-[#250d1b] p-3 shadow-2xl text-xs space-y-1"
                        style={{
                          left: `${Math.min(visPoints[hoveredIndex].x, chartWidth - 160)}px`,
                          top: "10px",
                        }}
                      >
                        <div className="font-bold text-amber-200 border-b border-amber-900/40 pb-1">
                          Ngày {chartData[hoveredIndex].day}
                        </div>
                        <div className="flex justify-between gap-4 text-amber-100">
                          <span className="text-amber-300">Khách truy cập:</span>
                          <strong>{chartData[hoveredIndex].visitors}</strong>
                        </div>
                        <div className="flex justify-between gap-4 text-rose-200">
                          <span className="text-rose-300">Lượt xem trang:</span>
                          <strong>{chartData[hoveredIndex].pageviews}</strong>
                        </div>
                        <div className="flex justify-between gap-4 text-sky-200 pt-1 border-t border-amber-900/30">
                          <span className="text-sky-300">Click Zalo:</span>
                          <strong>{chartData[hoveredIndex].zalo_clicks}</strong>
                        </div>
                        <div className="flex justify-between gap-4 text-amber-200">
                          <span className="text-amber-400">Click Đăng ký:</span>
                          <strong>{chartData[hoveredIndex].signup_clicks}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Landing Page Performance Table (Requirement 7) */}
            <section className="mb-6 rounded-2xl border border-amber-900/30 bg-[#16060c]/80 p-5 shadow-lg">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wider text-amber-100 flex items-center gap-2">
                    <i className="fa-solid fa-chart-simple text-amber-400" /> Bảng Thống Kê Landing Page
                  </h2>
                  <p className="text-xs text-amber-200/60 mt-0.5">
                    Phễu hành vi: <span className="text-amber-300 font-semibold">Nguồn traffic → Landing page → Thời gian & Xem trang → Click Zalo / Đăng ký học</span>
                  </p>
                </div>

                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    value={lpSearch}
                    onChange={(e) => setLpSearch(e.target.value)}
                    placeholder="Tìm kiếm trang đích..."
                    className="w-full rounded-xl border border-amber-500/30 bg-[#250d1b] px-3.5 py-1.5 text-xs text-amber-100 placeholder-amber-200/40 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-amber-900/30">
                <table className="w-full text-left text-xs text-stone-200">
                  <thead className="bg-[#270d1d] text-amber-200 text-[11px] uppercase tracking-wider font-bold border-b border-amber-900/40">
                    <tr>
                      <th className="py-3 px-4">Landing Page (Trang Đích)</th>
                      <th className="py-3 px-3 text-right">Visitors</th>
                      <th className="py-3 px-3 text-right">Pageviews</th>
                      <th className="py-3 px-3 text-right">Avg Time</th>
                      <th className="py-3 px-3 text-right text-sky-300">Zalo Clicks</th>
                      <th className="py-3 px-3 text-right text-amber-300">Signup Clicks</th>
                      <th className="py-3 px-4 text-right">CR (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-900/20 bg-[#1a0711]">
                    {filteredLandingPages.map((lp, idx) => {
                      const totalConv = lp.zaloClicks + lp.signupClicks;
                      const cr = lp.visitors > 0 ? ((totalConv / lp.visitors) * 100).toFixed(1) : "0.0";
                      return (
                        <tr key={idx} className="hover:bg-[#2e0e22]/50 transition-colors">
                          <td className="py-3 px-4 font-mono text-amber-100/90 font-medium">
                            <a
                              href={lp.landingPage}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline hover:text-amber-300 transition-colors inline-flex items-center gap-1.5"
                            >
                              <span>{lp.landingPage}</span>
                              <i className="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-60" />
                            </a>
                          </td>
                          <td className="py-3 px-3 text-right font-semibold text-amber-100">
                            {lp.visitors.toLocaleString("vi-VN")}
                          </td>
                          <td className="py-3 px-3 text-right text-amber-200/80">
                            {lp.pageviews.toLocaleString("vi-VN")}
                          </td>
                          <td className="py-3 px-3 text-right text-stone-300 font-mono">
                            {formatDuration(lp.avgTimeSeconds)}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-sky-400">
                            {lp.zaloClicks > 0 ? lp.zaloClicks : "-"}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-amber-400">
                            {lp.signupClicks > 0 ? lp.signupClicks : "-"}
                          </td>
                          <td className="py-3 px-4 text-right font-bold">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] ${
                                Number(cr) > 0
                                  ? "bg-emerald-950/70 text-emerald-300 border border-emerald-500/40"
                                  : "text-stone-500"
                              }`}
                            >
                              {cr}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredLandingPages.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-xs text-amber-200/40">
                          Chưa ghi nhận landing page nào trong khoảng thời gian này
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Top Viewed Pages */}
            <section className="rounded-2xl border border-amber-900/30 bg-[#16060c]/80 p-5 shadow-lg">
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-100 mb-1">
                Top Các Trang Được Xem Nhiều Nhất
              </h2>
              <p className="text-xs text-amber-200/50 mb-4">Các URL nhận được nhiều lượt xem nhất</p>

              <div className="overflow-x-auto rounded-xl border border-amber-900/30">
                <table className="w-full text-left text-xs text-stone-200">
                  <thead className="bg-[#270d1d] text-amber-200 text-[11px] uppercase tracking-wider font-bold border-b border-amber-900/40">
                    <tr>
                      <th className="py-2.5 px-4 w-12 text-center">#</th>
                      <th className="py-2.5 px-4">Đường dẫn trang (Path)</th>
                      <th className="py-2.5 px-4 text-right">Lượt xem (Views)</th>
                      <th className="py-2.5 px-4 text-right">Khách xem (Visitors)</th>
                      <th className="py-2.5 px-4 text-right">Tỷ lệ xem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-900/20 bg-[#1a0711]">
                    {(stats?.topPages || []).map((page, idx) => {
                      const totalViews = stats?.overview.pageviews || 1;
                      const pct = Math.min(100, Math.round((page.views / totalViews) * 100));
                      return (
                        <tr key={idx} className="hover:bg-[#2e0e22]/50 transition-colors">
                          <td className="py-2.5 px-4 text-center font-bold text-amber-400/60">{idx + 1}</td>
                          <td className="py-2.5 px-4 font-mono text-amber-100">
                            <a
                              href={page.path}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline hover:text-amber-300 transition-colors"
                            >
                              {page.path}
                            </a>
                          </td>
                          <td className="py-2.5 px-4 text-right font-bold text-amber-100">
                            {page.views.toLocaleString("vi-VN")}
                          </td>
                          <td className="py-2.5 px-4 text-right text-stone-300">
                            {page.visitors.toLocaleString("vi-VN")}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] text-amber-300 font-semibold">
                              {pct}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {(stats?.topPages || []).length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-xs text-amber-200/40">
                          Chưa có dữ liệu lượt xem trang
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
