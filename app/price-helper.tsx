"use client";

import React from "react";
import { useLanguage } from "./i18n-context";

export type PriceInfo = {
  raw: string;
  originalPrice: string;
  salePrice: string;
  discountPercent: number;
  hasDiscount: boolean;
  effectiveAmount: string;
  isContact: boolean;
};

export function parsePrice(raw: string | undefined | null): PriceInfo {
  const str = (raw || "").trim();
  if (!str || str.toLowerCase() === "liên hệ" || str.toLowerCase() === "contact") {
    return {
      raw: str,
      originalPrice: "Liên hệ",
      salePrice: "",
      discountPercent: 0,
      hasDiscount: false,
      effectiveAmount: "",
      isContact: true,
    };
  }

  if (str.includes("|") || str.includes("->") || str.includes("/")) {
    const parts = str.split(/[|/]|->/).map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const orig = parts[0];
      const second = parts[1];
      const origNum = Number.parseInt(orig.replace(/\D/g, ""), 10);

      if (second.includes("%")) {
        const pct = Math.abs(Number.parseInt(second.replace(/[^\d-]/g, ""), 10)) || 0;
        if (pct > 0 && pct < 100 && Number.isFinite(origNum) && origNum > 0) {
          const finalNum = Math.round(origNum * (1 - pct / 100));
          const formattedSale = finalNum.toLocaleString("vi-VN") + "đ";
          return {
            raw: str,
            originalPrice: orig.includes("đ") || orig.toLowerCase().includes("vnd") ? orig : origNum.toLocaleString("vi-VN") + "đ",
            salePrice: formattedSale,
            discountPercent: pct,
            hasDiscount: true,
            effectiveAmount: String(finalNum),
            isContact: false,
          };
        }
      }

      const saleNum = Number.parseInt(second.replace(/\D/g, ""), 10);
      if (Number.isFinite(origNum) && Number.isFinite(saleNum) && origNum > saleNum && saleNum > 0) {
        const pct = Math.round(((origNum - saleNum) / origNum) * 100);
        return {
          raw: str,
          originalPrice: orig.includes("đ") || orig.toLowerCase().includes("vnd") ? orig : origNum.toLocaleString("vi-VN") + "đ",
          salePrice: second.includes("đ") || second.toLowerCase().includes("vnd") ? second : saleNum.toLocaleString("vi-VN") + "đ",
          discountPercent: pct,
          hasDiscount: pct > 0,
          effectiveAmount: String(saleNum),
          isContact: false,
        };
      }
    }
  }

  const bracketMatch = str.match(/(.+?)\s*[\[(](?:giảm\s*)?-?(\d+)\s*%[\])]/i);
  if (bracketMatch) {
    const orig = bracketMatch[1].trim();
    const pct = Number.parseInt(bracketMatch[2], 10);
    const origNum = Number.parseInt(orig.replace(/\D/g, ""), 10);
    if (pct > 0 && pct < 100 && Number.isFinite(origNum) && origNum > 0) {
      const finalNum = Math.round(origNum * (1 - pct / 100));
      const formattedSale = finalNum.toLocaleString("vi-VN") + "đ";
      return {
        raw: str,
        originalPrice: orig.includes("đ") || orig.toLowerCase().includes("vnd") ? orig : origNum.toLocaleString("vi-VN") + "đ",
        salePrice: formattedSale,
        discountPercent: pct,
        hasDiscount: true,
        effectiveAmount: String(finalNum),
        isContact: false,
      };
    }
  }

  const num = str.replace(/\D/g, "");
  return {
    raw: str,
    originalPrice: str,
    salePrice: "",
    discountPercent: 0,
    hasDiscount: false,
    effectiveAmount: num,
    isContact: false,
  };
}

export function PriceTag({ price, className = "", highlight = false }: { price: string; className?: string; highlight?: boolean }) {
  const { t } = useLanguage();
  const info = parsePrice(price);

  if (info.isContact) {
    return <strong className={`price-contact ${className}`}>{t("Liên hệ", "Contact")}</strong>;
  }

  if (info.hasDiscount) {
    return (
      <div className={`price-tag-discounted ${className}`}>
        <div className="price-top-row">
          <del className="price-original">{info.originalPrice}</del>
          <span className="price-badge">-{info.discountPercent}%</span>
        </div>
        <strong className={`price-sale ${highlight ? "highlight" : ""}`}>{info.salePrice}</strong>
      </div>
    );
  }

  return <strong className={`price-regular ${highlight ? "highlight" : ""} ${className}`}>{info.originalPrice}</strong>;
}
