"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function FloatingSignupButton() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // Do not show on admin or portal pages
  const isExcluded = pathname?.startsWith("/quan-tri") || pathname?.startsWith("/admin") || pathname?.startsWith("/diem-danh");

  useEffect(() => {
    if (typeof window === "undefined" || isExcluded) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
          setIsVisible(scrollY > 180);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isExcluded, pathname]);

  if (isExcluded) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If a registration section exists on current page, scroll to it
    const formEl = document.getElementById("dang-ky") || document.getElementById("contact");
    if (formEl) {
      e.preventDefault();
      formEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "clamp(16px, 3vw, 24px)",
        left: "clamp(14px, 3vw, 24px)",
        zIndex: 95,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.92)",
        pointerEvents: isVisible ? "auto" : "none",
        transition: "opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <a
        href="/dang-ky-hoc#dang-ky"
        onClick={handleClick}
        data-analytics="click_signup"
        aria-label="Đăng ký học ngay"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 18px",
          background: "linear-gradient(135deg, #881B1B, #591024)",
          color: "#ffffff",
          border: "1.5px solid #d4af37",
          borderRadius: "9999px",
          fontWeight: 700,
          fontSize: "13.5px",
          textDecoration: "none",
          boxShadow: "0 4px 18px rgba(136, 27, 27, 0.42), 0 2px 6px rgba(0, 0, 0, 0.18)",
          cursor: "pointer",
          letterSpacing: "0.01em",
          userSelect: "none",
          transition: "transform 0.18s ease, box-shadow 0.18s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(136, 27, 27, 0.55), 0 2px 8px rgba(0, 0, 0, 0.22)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 18px rgba(136, 27, 27, 0.42), 0 2px 6px rgba(0, 0, 0, 0.18)";
        }}
      >
        <span style={{ position: "relative", display: "flex", width: "8px", height: "8px" }}>
          <span
            style={{
              position: "absolute",
              display: "inline-flex",
              width: "100%",
              height: "100%",
              borderRadius: "9999px",
              backgroundColor: "#fce3b8",
              opacity: 0.75,
              animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
            }}
          />
          <span
            style={{
              position: "relative",
              display: "inline-flex",
              width: "8px",
              height: "8px",
              borderRadius: "9999px",
              backgroundColor: "#fce3b8",
            }}
          />
        </span>
        <i className="fa-solid fa-graduation-cap" style={{ color: "#fce3b8", fontSize: "14px" }} />
        <span>Đăng ký học</span>
      </a>
    </div>
  );
}
