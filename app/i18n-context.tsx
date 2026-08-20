"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Language, translateViToEn } from "./auto-translator";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (vi: string, en?: string) => string;
  translate: (text: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "vi",
  setLang: () => {},
  toggleLang: () => {},
  t: (vi, en) => en || vi,
  translate: (text) => text,
});

const STORAGE_KEY = "site_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("vi");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === "vi" || saved === "en") {
        setLangState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // ignore localStorage disabled
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.cookie = `site_lang=${newLang};path=/;max-age=31536000`;
      document.documentElement.lang = newLang;
    } catch {
      // ignore
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "vi" ? "en" : "vi");
  }, [lang, setLang]);

  const t = useCallback((vi: string, en?: string): string => {
    if (lang === "vi") return vi;
    if (en) return en;
    return translateViToEn(vi);
  }, [lang]);

  const translate = useCallback((text: string): string => {
    if (lang === "vi") return text;
    return translateViToEn(text);
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, toggleLang, t, translate }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLanguage() {
  return useContext(I18nContext);
}

export function LanguageSwitcher({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`lang-switcher ${compact ? "lang-switcher-compact" : ""} ${className}`} role="group" aria-label="Chọn ngôn ngữ / Select language">
      <button
        type="button"
        className={`lang-btn ${lang === "vi" ? "active" : ""}`}
        onClick={() => setLang("vi")}
        aria-pressed={lang === "vi"}
        title="Tiếng Việt"
      >
        <span className="flag-icon" aria-hidden="true">🇻🇳</span>
        <span className="lang-label">{compact ? "VN" : "Tiếng Việt"}</span>
      </button>
      <span className="lang-divider" aria-hidden="true">|</span>
      <button
        type="button"
        className={`lang-btn ${lang === "en" ? "active" : ""}`}
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        title="English"
      >
        <span className="flag-icon" aria-hidden="true">🇬🇧</span>
        <span className="lang-label">{compact ? "EN" : "English"}</span>
      </button>
    </div>
  );
}
