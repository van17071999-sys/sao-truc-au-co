"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY_VID = "_stac_vid";
const STORAGE_KEY_SID = "_stac_sid";
const STORAGE_KEY_UTM = "_stac_utm";

function getOrSetVisitorId(): string {
  try {
    let vid = localStorage.getItem(STORAGE_KEY_VID);
    if (!vid || vid.length < 5) {
      vid = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(STORAGE_KEY_VID, vid);
    }
    return vid;
  } catch {
    return `v_${Date.now().toString(36)}_mem`;
  }
}

function getOrSetSessionId(): string {
  try {
    let sid = sessionStorage.getItem(STORAGE_KEY_SID);
    if (!sid || sid.length < 5) {
      sid = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(STORAGE_KEY_SID, sid);
    }
    return sid;
  } catch {
    return `s_${Date.now().toString(36)}_mem`;
  }
}

type UtmParams = {
  source: string;
  medium: string;
  campaign: string;
};

function getUtmParams(): UtmParams {
  try {
    const params = new URLSearchParams(window.location.search);
    const source = params.get("utm_source") || "";
    const medium = params.get("utm_medium") || "";
    const campaign = params.get("utm_campaign") || "";

    if (source || medium || campaign) {
      const utmObj: UtmParams = { source, medium, campaign };
      try {
        sessionStorage.setItem(STORAGE_KEY_UTM, JSON.stringify(utmObj));
      } catch {}
      return utmObj;
    }

    // Retrieve from session storage if available
    const saved = sessionStorage.getItem(STORAGE_KEY_UTM);
    if (saved) {
      return JSON.parse(saved) as UtmParams;
    }
  } catch {}

  return { source: "", medium: "", campaign: "" };
}

function detectDevice(): "mobile" | "desktop" {
  try {
    const ua = navigator.userAgent || "";
    if (/android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua)) {
      return "mobile";
    }
    if (window.innerWidth <= 768) {
      return "mobile";
    }
  } catch {}
  return "desktop";
}

function detectBrowser(): string {
  try {
    const ua = navigator.userAgent || "";
    if (/fbav|fban|facebookexternalhit/i.test(ua)) return "Facebook App";
    if (/zalo/i.test(ua)) return "Zalo App";
    if (/tiktok/i.test(ua)) return "TikTok App";
    if (/edg\//i.test(ua)) return "Edge";
    if (/opr\/|opera/i.test(ua)) return "Opera";
    if (/chrome|crios/i.test(ua)) return "Chrome";
    if (/firefox|fxios/i.test(ua)) return "Firefox";
    if (/safari/i.test(ua)) return "Safari";
    return "Other";
  } catch {
    return "Unknown";
  }
}

function sendTrackEvent(eventName: string, extraData: Record<string, unknown> = {}) {
  try {
    const vid = getOrSetVisitorId();
    const sid = getOrSetSessionId();
    const utm = getUtmParams();
    const path = window.location.pathname || "/";
    const referrer = document.referrer || "";
    const device = detectDevice();
    const browser = detectBrowser();

    const payload = {
      eventName,
      visitorId: vid,
      sessionId: sid,
      path,
      referrer,
      source: utm.source,
      medium: utm.medium,
      campaign: utm.campaign,
      device,
      browser,
      ...extraData,
    };

    const jsonString = JSON.stringify(payload);

    // Prefer navigator.sendBeacon for lightweight, non-blocking telemetry
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([jsonString], { type: "application/json" });
      const sent = navigator.sendBeacon("/api/analytics/track", blob);
      if (sent) return;
    }

    // Fallback to fetch with keepalive: true
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonString,
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPathnameRef = useRef<string>("");
  const scrollMilestonesRef = useRef<Set<number>>(new Set());

  // Pageview tracking on initial load & route transitions
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reset scroll milestones on new page
    scrollMilestonesRef.current = new Set();
    lastPathnameRef.current = pathname;

    // Schedule pageview during idle time so it doesn't block rendering
    const triggerPageView = () => {
      sendTrackEvent("page_view");
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(triggerPageView, { timeout: 1500 });
    } else {
      setTimeout(triggerPageView, 150);
    }
  }, [pathname]);

  // Scroll depth tracking (25%, 50%, 75%, 100%)
  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;

    const checkScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const percent = Math.min(100, Math.round((scrollTop / scrollHeight) * 100));

      const milestones = [25, 50, 75, 100];
      for (const m of milestones) {
        if (percent >= m && !scrollMilestonesRef.current.has(m)) {
          scrollMilestonesRef.current.add(m);
          sendTrackEvent(`scroll_${m}`);
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  // Click tracking (Zalo, Phone, Signup) and Audio/Video tracking
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClick = (event: MouseEvent) => {
      try {
        const target = event.target as HTMLElement | null;
        if (!target) return;

        // Find closest anchor or button
        const anchor = target.closest("a");
        const button = target.closest("button");
        const clickable = anchor || button;

        if (anchor) {
          const href = (anchor.getAttribute("href") || "").toLowerCase();
          const dataAnalytics = anchor.getAttribute("data-analytics") || "";

          // 1. Zalo clicks
          if (
            href.includes("zalo.me") ||
            href.includes("chat.zalo.me") ||
            dataAnalytics === "click_zalo" ||
            anchor.classList.contains("zalo-btn") ||
            anchor.id.includes("zalo")
          ) {
            sendTrackEvent("click_zalo");
            return;
          }

          // 2. Phone clicks
          if (
            href.startsWith("tel:") ||
            dataAnalytics === "click_phone" ||
            anchor.classList.contains("phone-btn") ||
            anchor.id.includes("phone")
          ) {
            sendTrackEvent("click_phone");
            return;
          }

          // 3. Signup clicks
          if (
            href.includes("/dang-ky-hoc") ||
            dataAnalytics === "click_signup" ||
            anchor.textContent?.toLowerCase().includes("đăng ký")
          ) {
            sendTrackEvent("click_signup");
            return;
          }
        }

        if (button) {
          const dataAnalytics = button.getAttribute("data-analytics") || "";
          const btnText = (button.textContent || "").toLowerCase();

          if (dataAnalytics === "click_zalo" || btnText.includes("zalo")) {
            sendTrackEvent("click_zalo");
            return;
          }
          if (dataAnalytics === "click_phone" || btnText.includes("hotline") || btnText.includes("gọi ngay")) {
            sendTrackEvent("click_phone");
            return;
          }
          if (
            dataAnalytics === "click_signup" ||
            btnText.includes("đăng ký") ||
            button.getAttribute("type") === "submit"
          ) {
            sendTrackEvent("click_signup");
            return;
          }
        }

        // Generic element with data-analytics
        if (clickable) {
          const dataAnalytics = clickable.getAttribute("data-analytics");
          if (dataAnalytics) {
            sendTrackEvent(dataAnalytics);
          }
        }
      } catch {}
    };

    // Play event listener for Audio and Video (capture mode)
    const handlePlay = (event: Event) => {
      try {
        const target = event.target;
        if (target instanceof HTMLAudioElement) {
          sendTrackEvent("play_audio");
        } else if (target instanceof HTMLVideoElement) {
          sendTrackEvent("play_video");
        }
      } catch {}
    };

    document.addEventListener("click", handleClick, { capture: true, passive: true });
    document.addEventListener("play", handlePlay, { capture: true, passive: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      document.removeEventListener("play", handlePlay, { capture: true });
    };
  }, []);

  return null;
}
