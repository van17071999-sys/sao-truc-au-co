"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import BrandLogo from "../brand-logo";
import { parseFluteTab, renderArticleFormatting } from "../cms-content-pages";
import { buildVietQrUrl } from "../vietqr-helper";
import { parsePrice } from "../price-helper";

type CmsEntry = {
  id: string;
  collection: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  imageUrl: string;
  tag: string;
  price: string;
  content: string;
  visible: boolean;
  sortOrder: number;
  updatedAt?: string;
};

const collections = [
  { key: "services", label: "8 mục chính", note: "Các thẻ lớn trên trang chủ", priceLabel: "Giá / Phí (VNĐ hoặc 'Liên hệ')" },
  { key: "hero-slides", label: "5 ảnh đầu trang", note: "Năm ảnh demo bộ môn ở đầu trang chủ", tagLabel: "Nhãn nhỏ phía trên", priceLabel: "Chữ trên nút", excerptLabel: "Mô tả dưới tiêu đề", contentLabel: "Đường dẫn khi bấm nút" },
  { key: "class-details", label: "Lớp học các bộ môn", note: "Từng bộ môn (/bo-mon/slug) - bấm thẻ trên web dẫn thẳng vào bài giới thiệu đầy đủ", tagLabel: "Biểu tượng bộ môn (ví dụ: ♫, ◉, ♩...)", priceLabel: "Đối tượng phù hợp", excerptLabel: "Mô tả ngắn trên thẻ danh sách", contentLabel: "Bạn sẽ học được gì? (mỗi dòng một ý)" },
  { key: "product-groups", label: "Nhóm sáo & phụ kiện", note: "Các nhóm như Sáo ngang, Dizi, Sáo mèo…", tagLabel: "Nhãn phụ", contentLabel: "Nội dung bổ sung" },
  { key: "product-items", label: "Từng sản phẩm", note: "Từng cây sáo hoặc phụ kiện nằm trong một nhóm", tagLabel: "Slug nhóm cha *", tagPlaceholder: "Ví dụ: sao-ngang-viet-nam", priceLabel: "Giá bán (VNĐ hoặc 'Liên hệ')", contentLabel: "Thông tin bổ sung" },
  { key: "course-groups", label: "Nhóm khóa học", note: "Nhóm theo bộ môn ở trang khóa học quay sẵn", tagLabel: "Nhãn phụ", contentLabel: "Nội dung bổ sung" },
  { key: "course-items", label: "Trang chi tiết khóa học", note: "Sửa nội dung từng trang riêng sau địa chỉ /khoa-hoc/", tagLabel: "Nhóm khóa học (slug nhóm cha) *", tagPlaceholder: "Ví dụ: sao-truc", priceLabel: "Giá khóa học (VNĐ hoặc 'Liên hệ')", excerptLabel: "Mô tả ngắn ở đầu trang", contentLabel: "Thông tin chi tiết / quyền lợi khóa học" },
  { key: "curriculums", label: "Giáo trình", note: "Quản lý từng giáo trình theo bộ môn (/giao-trinh/slug)", tagLabel: "Bộ môn (Nhóm nhạc cụ) *", tagPlaceholder: "Ví dụ: sao-truc", priceLabel: "Giá giáo trình (VNĐ hoặc 'Liên hệ')", excerptLabel: "Mô tả ngắn / Lời giới thiệu", contentLabel: "Nội dung chi tiết giáo trình & lộ trình bài học" },
  { key: "sheets", label: "Sheet nhạc", note: "Quản lý sheet chuyển soạn theo bộ môn (/sheet/slug)", tagLabel: "Bộ môn (Nhóm nhạc cụ) *", tagPlaceholder: "Ví dụ: sao-truc", priceLabel: "Giá sheet (VNĐ hoặc 'Liên hệ')", excerptLabel: "Mô tả ngắn / Tone, nhịp", contentLabel: "Mô tả chi tiết / Ghi chú biểu diễn" },
  { key: "social-links", label: "Liên kết mạng xã hội", note: "YouTube, Facebook, TikTok và Instagram trên trang chủ", tagLabel: "Biểu tượng", tagPlaceholder: "Ví dụ: ▶", priceLabel: "Tên nền tảng", contentLabel: "Đường dẫn đầy đủ đến trang mạng xã hội" },
  { key: "studio-packages", label: "Gói thu âm & video", note: "Từng gói, giá và quyền lợi", tagLabel: "Biểu tượng", priceLabel: "Giá gói thu (VNĐ hoặc 'Liên hệ')", contentLabel: "Quyền lợi (mỗi dòng một ý)" },
  { key: "booking-packages", label: "Gói booking nghệ sĩ", note: "Từng đội hình biểu diễn, giá và quyền lợi", tagLabel: "Biểu tượng", priceLabel: "Giá booking (VNĐ hoặc 'Liên hệ')", contentLabel: "Quyền lợi (mỗi dòng một ý)" },
  { key: "recording-instruments", label: "Thu âm nhạc cụ thật", note: "Từng nhạc cụ nhận thu và giá", tagLabel: "Biểu tượng", priceLabel: "Giá thu (VNĐ hoặc 'Liên hệ')", contentLabel: "Thông tin bổ sung" },
  { key: "flute-tabs", label: "Cảm âm sáo trúc", note: "Đăng từng bài cảm âm (1 dòng Lời ở trên, 1 dòng Nốt ở dưới)", tagLabel: "Tone / nhịp / độ khó (Ví dụ: Tone C5 · Nhịp 4/4)", excerptLabel: "Tên đầy đủ của bài", priceLabel: "Thông tin phụ", contentLabel: "Lời và nốt cảm âm (1 dòng Lời, 1 dòng Nốt bên dưới)" },
  { key: "free-guides", label: "Hướng dẫn miễn phí", note: "Gắn video YouTube, TikTok hoặc bài chia sẻ", tagLabel: "Nền tảng", tagPlaceholder: "YouTube hoặc TikTok", priceLabel: "Chủ đề", contentLabel: "Đường dẫn YouTube / TikTok / bài viết" },
  { key: "articles", label: "Bài viết", note: "Bài viết chia sẻ, kiến thức và blog" },
];

const singletons = [
  { key: "settings", label: "Cài đặt chung & VietQR", note: "Thương hiệu, liên hệ và thanh toán VietQR", contentLabel: "Địa chỉ các chi nhánh (Mỗi chi nhánh 1 dòng - CN1, CN2,...)", excerptLabel: "Khẩu hiệu (Tagline)", priceLabel: "Hotline / Zalo", tagLabel: "Email liên hệ" },
  { key: "tuition", label: "Bảng học phí & Ưu đãi", note: "Mức học phí các khóa 1, 2, 3 tháng và quà tặng ưu đãi" },
  { key: "page-contact", label: "Trang Đăng ký & Tư vấn", note: "Nội dung lời dẫn, hotline, email và form đăng ký (/dang-ky-hoc)" },
  { key: "change-password", label: "Đổi mật khẩu Quản trị", note: "Thay đổi mật khẩu đăng nhập trang quản trị" },
];

const emptyEntry = (collection: string): CmsEntry => ({
  id: "",
  collection,
  title: "",
  slug: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  excerpt: "",
  imageUrl: "",
  tag: "",
  price: "",
  content: "",
  visible: true,
  sortOrder: 0,
});

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function entryHref(entry: CmsEntry) {
  if (entry.collection === "page-contact") return "/dang-ky-hoc";
  if (entry.collection === "page-classes") return "/lop-hoc";
  if (entry.collection === "page-products") return "/sao-va-phu-kien";
  if (entry.collection === "page-courses") return "/khoa-hoc-quay-san";
  if (entry.collection === "page-articles") return "/bai-viet";
  if (entry.collection === "course-items") return `/khoa-hoc/${entry.slug}`;
  if (entry.collection === "curriculums") return `/giao-trinh/${entry.slug}`;
  if (entry.collection === "sheets") return `/sheet/${entry.slug}`;
  if (entry.collection === "materials") return entry.tag.startsWith("sheet:") ? `/sheet/${entry.slug}` : `/giao-trinh/${entry.slug}`;
  if (entry.collection === "single-videos") return `/video/${entry.slug}`;
  if (entry.collection === "articles") return `/bai-viet/${entry.slug}`;
  if (entry.collection === "flute-tabs") return `/cam-am/${entry.slug}`;
  return "";
}

async function prepareImage(file: File) {
  if (file.size <= 800 * 1024 && ["image/jpeg", "image/png", "image/webp"].includes(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const maxDim = Math.max(bitmap.width, bitmap.height);
    const scale = maxDim > 1600 ? 1600 / maxDim : 1;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
      if (blob) {
        return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" });
      }
    }
  } catch (e) {
    console.warn("Client-side image preparation fallback:", e);
  }
  return file;
}

type ContactFields = {
  blockTitle: string;
  blockDesc: string;
  address: string;
  email: string;
  interestTitle: string;
  interestNote: string;
  interestItems: string;
  submitButtonText: string;
  successMessage: string;
};

const defaultInterestList = [
  "Sáo trúc Việt Nam",
  "Sáo Dizi Trung Quốc",
  "Sáo Recorder",
  "Động tiêu & Xiao",
  "Flute phương Tây",
  "Sáo H'Mông",
  "Sáo mèo & Sáo bầu",
  "Mua sáo & phụ kiện",
  "Khóa học video quay sẵn",
  "Sheet nhạc & giáo trình",
  "Thu âm & quay MV",
  "Booking biểu diễn",
].join("\n");

function parseContactToFields(content: string): ContactFields {
function parseSectionMap(content: string): Record<string, string> {
  const sectionLines: Record<string, string[]> = {};
  if (!content || !content.includes("[")) return {};
  let current = "";
  for (const line of content.split("\n")) {
    const match = line.trim().match(/^\[([A-ZÀ-Ỹ0-9\s_]+)\]$/i);
    if (match) {
      current = match[1]
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]/g, "_");
      sectionLines[current] = [];
    } else if (current) {
      sectionLines[current].push(line);
    }
  }
  const result: Record<string, string> = {};
  for (const [key, lines] of Object.entries(sectionLines)) {
    result[key] = lines.join("\n").trim();
  }
  return result;
}

function parseContactToFields(content: string = ""): ContactFields {
  const sections = parseSectionMap(content);
  if (content && content.includes("[") && content.includes("]")) {
    return {
      blockTitle: sections["tieu_de_khoi"] !== undefined ? sections["tieu_de_khoi"] : (sections["title"] !== undefined ? sections["title"] : "Đăng Kí Học Sáo, Tư Vấn Các Dịch Vụ"),
      blockDesc: sections["mo_ta_khoi"] !== undefined ? sections["mo_ta_khoi"] : (sections["desc"] !== undefined ? sections["desc"] : "Học tại trung tâm (TP.HCM), gia sư tại nhà hoặc online 1 kèm 1 linh động cho học viên ở xa và nước ngoài."),
      address: sections["dia_chi"] !== undefined ? sections["dia_chi"] : (sections["address"] !== undefined ? sections["address"] : "106/72 Hòa Bình, P. Tân Phú, TP.HCM"),
      email: sections["email"] !== undefined ? sections["email"] : "van17071999@gmail.com",
      interestTitle: sections["tieu_de_bo_mon"] !== undefined ? sections["tieu_de_bo_mon"] : "Đăng ký bộ môn or Tư vấn dịch vụ, sản phẩm",
      interestNote: sections["ghi_chu_bo_mon"] !== undefined ? sections["ghi_chu_bo_mon"] : "(Bấm để chọn nhiều mục)",
      interestItems: sections["danh_sach_bo_mon"] !== undefined ? sections["danh_sach_bo_mon"] : defaultInterestList,
      submitButtonText: sections["nut_gui"] !== undefined ? sections["nut_gui"] : "GỬI YÊU CẦU ĐĂNG KÝ →",
      successMessage: sections["thong_bao_thanh_cong"] !== undefined ? sections["thong_bao_thanh_cong"] : "Yêu cầu đã được gửi thành công. Sáo Trúc Âu Cơ sẽ liên hệ lại với bạn sớm nhất.",
    };
  }
  const lines = content ? content.split(/\n/) : [];
  return {
    blockTitle: lines[0] ?? "Đăng Kí Học Sáo, Tư Vấn Các Dịch Vụ",
    blockDesc: lines[1] ?? "Học tại trung tâm (TP.HCM), gia sư tại nhà hoặc online 1 kèm 1 linh động cho học viên ở xa và nước ngoài.",
    address: lines[2] ?? "106/72 Hòa Bình, P. Tân Phú, TP.HCM",
    email: lines[3] ?? "van17071999@gmail.com",
    interestTitle: "Đăng ký bộ môn or Tư vấn dịch vụ, sản phẩm",
    interestNote: "(Bấm để chọn nhiều mục)",
    interestItems: defaultInterestList,
    submitButtonText: "GỬI YÊU CẦU ĐĂNG KÝ →",
    successMessage: "Yêu cầu đã được gửi thành công. Sáo Trúc Âu Cơ sẽ liên hệ lại với bạn sớm nhất.",
  };
}

function assembleContactFields(fields: ContactFields): string {
  return [
    `[TIÊU ĐỀ KHỐI]\n${fields.blockTitle}`,
    `[MÔ TẢ KHỐI]\n${fields.blockDesc}`,
    `[ĐỊA CHỈ]\n${fields.address}`,
    `[EMAIL]\n${fields.email}`,
    `[TIEU_DE_BO_MON]\n${fields.interestTitle}`,
    `[GHI_CHU_BO_MON]\n${fields.interestNote}`,
    `[DANH_SACH_BO_MON]\n${fields.interestItems}`,
    `[NUT_GUI]\n${fields.submitButtonText}`,
    `[THONG_BAO_THANH_CONG]\n${fields.successMessage}`,
  ].join("\n\n");
}

type TuitionFields = {
  sessions1: string;
  sessions2: string;
  sessions3: string;
  duration: string;
  promo: string;
  note: string;
};

function parseTuitionContentToFields(content: string, imageUrl: string): TuitionFields {
  const sections = parseSectionMap(content);
  if (content && content.includes("[") && content.includes("]")) {
    return {
      sessions1: sections["buoi_1"] !== undefined ? sections["buoi_1"] : "8 buổi",
      sessions2: sections["buoi_2"] !== undefined ? sections["buoi_2"] : "16 buổi",
      sessions3: sections["buoi_3"] !== undefined ? sections["buoi_3"] : "24 buổi",
      duration: sections["thoi_luong"] !== undefined ? sections["thoi_luong"] : (imageUrl || "Thời gian mỗi buổi 60 phút."),
      promo: sections["uu_dai"] !== undefined ? sections["uu_dai"] : "giảm 10% – 15%, tặng MV Video thổi sáo khi hết khoá.",
      note: sections["luu_y"] !== undefined ? sections["luu_y"] : "Học phí đã đăng ký không hoàn lại trong mọi trường hợp. Nếu học viên có việc phát sinh và chưa thể tiếp tục học, số buổi còn lại sẽ được bảo lưu để học viên sắp xếp học lại sau.",
    };
  }
  return {
    sessions1: "8 buổi",
    sessions2: "16 buổi",
    sessions3: "24 buổi",
    duration: imageUrl || "Thời gian mỗi buổi 60 phút.",
    promo: content || "giảm 10% – 15%, tặng MV Video thổi sáo khi hết khoá.",
    note: "Học phí đã đăng ký không hoàn lại trong mọi trường hợp. Nếu học viên có việc phát sinh và chưa thể tiếp tục học, số buổi còn lại sẽ được bảo lưu để học viên sắp xếp học lại sau.",
  };
}

function assembleTuitionFields(fields: TuitionFields): string {
  return [
    `[BUOI_1]\n${fields.sessions1}`,
    `[BUOI_2]\n${fields.sessions2}`,
    `[BUOI_3]\n${fields.sessions3}`,
    `[THOI_LUONG]\n${fields.duration}`,
    `[UU_DAI]\n${fields.promo}`,
    `[LUU_Y]\n${fields.note}`,
  ].join("\n\n");
}

type ClassDetailFields = {
  headline: string;
  intro: string;
  learn: string;
  stage1: string;
  stage2: string;
  stage3: string;
  stage4: string;
  quote: string;
  formats: string;
  schedule: string;
};

function parseClassContentToFields(content: string, excerpt: string): ClassDetailFields {
  const sections = parseSectionMap(content);
  const rawPath = sections["lo_trinh_hoc"] ?? sections["lo_trinh"] ?? sections["path"] ?? "";
  const pathLines = rawPath.split(/\n/);

  return {
    headline: sections["tieu_de_bai"] ?? sections["headline"] ?? "Một lộ trình rõ ràng để chơi nhạc bằng chính cảm xúc của bạn.",
    intro: sections["gioi_thieu"] ?? sections["intro"] ?? excerpt ?? "",
    learn: sections["ban_se_hoc_duoc_gi"] ?? sections["hoc_gi"] ?? sections["learn"] ?? (!content.includes("[") ? content : ""),
    stage1: pathLines[0] ?? "Giai đoạn 1 · Làm quen & tạo tiếng",
    stage2: pathLines[1] ?? "Giai đoạn 2 · Nốt nhạc & nhịp điệu",
    stage3: pathLines[2] ?? "Giai đoạn 3 · Kỹ thuật biểu cảm",
    stage4: pathLines[3] ?? "Giai đoạn 4 · Hoàn thiện tác phẩm",
    quote: sections["trich_dan"] ?? sections["quote"] ?? "Học đúng kỹ thuật để tự do thể hiện cảm xúc — đó là nền tảng của mỗi chương trình giảng dạy.",
    formats: sections["hinh_thuc_hoc"] ?? sections["hinh_thuc"] ?? "Trực tiếp tại trung tâm\nGia sư tại nhà\nOnline 1 kèm 1",
    schedule: sections["thoi_gian"] ?? sections["schedule"] ?? "Linh động theo lịch học viên",
  };
}

function assembleFieldsToContent(fields: ClassDetailFields): string {
  const pathCombined = [fields.stage1, fields.stage2, fields.stage3, fields.stage4].join("\n");
  return [
    `[TIÊU ĐỀ BÀI]\n${fields.headline}`,
    `[GIỚI THIỆU]\n${fields.intro}`,
    `[BẠN SẼ HỌC ĐƯỢC GÌ]\n${fields.learn}`,
    `[LỘ TRÌNH HỌC]\n${pathCombined}`,
    `[TRÍCH DẪN]\n${fields.quote}`,
    `[HÌNH THỨC HỌC]\n${fields.formats}`,
    `[THỜI GIAN]\n${fields.schedule}`,
  ].join("\n\n");
}

function PriceVoucherEditor({
  value,
  onChange,
  label = "Giá bán & Voucher Khuyến mãi",
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}) {
  const info = parsePrice(value);
  const isContact = info.isContact;
  const originalPriceStr = info.originalPrice;
  const discountPercent = info.discountPercent;
  const salePriceStr = info.salePrice;

  function handleOriginalPriceChange(newOrig: string) {
    if (newOrig.toLowerCase().includes("liên hệ")) {
      onChange("Liên hệ");
      return;
    }
    const origDigits = newOrig.replace(/\D/g, "");
    if (!origDigits) {
      onChange(newOrig);
      return;
    }
    const num = Number.parseInt(origDigits, 10);
    const formattedOrig = num.toLocaleString("vi-VN") + "đ";

    if (discountPercent > 0) {
      const saleNum = Math.round(num * (1 - discountPercent / 100));
      onChange(`${formattedOrig} | ${saleNum.toLocaleString("vi-VN")}đ`);
    } else {
      onChange(formattedOrig);
    }
  }

  function handleVoucherChange(pct: number) {
    if (isContact) return;
    const origDigits = originalPriceStr.replace(/\D/g, "");
    if (!origDigits) return;
    const origNum = Number.parseInt(origDigits, 10);
    const formattedOrig = origNum.toLocaleString("vi-VN") + "đ";

    if (pct <= 0) {
      onChange(formattedOrig);
    } else {
      const saleNum = Math.round(origNum * (1 - pct / 100));
      onChange(`${formattedOrig} | ${saleNum.toLocaleString("vi-VN")}đ`);
    }
  }

  function handleSalePriceChange(newSale: string) {
    const origDigits = originalPriceStr.replace(/\D/g, "");
    const saleDigits = newSale.replace(/\D/g, "");
    if (!origDigits || !saleDigits) {
      onChange(newSale ? `${originalPriceStr} | ${newSale}` : originalPriceStr);
      return;
    }
    const origNum = Number.parseInt(origDigits, 10);
    const saleNum = Number.parseInt(saleDigits, 10);
    const formattedOrig = origNum.toLocaleString("vi-VN") + "đ";
    const formattedSale = saleNum.toLocaleString("vi-VN") + "đ";

    if (saleNum >= origNum || saleNum <= 0) {
      onChange(formattedOrig);
    } else {
      onChange(`${formattedOrig} | ${formattedSale}`);
    }
  }

  return (
    <div style={{ background: "#f8fafc", padding: "16px 18px", borderRadius: 12, border: "1px solid #e2e8f0", display: "grid", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{label}</span>
        {info.hasDiscount && (
          <span style={{ padding: "2px 8px", background: "#fee2e2", color: "#b91c1c", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>
            Đang áp dụng Voucher -{discountPercent}%
          </span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 600, color: "#475569" }}>
          <span>1. Giá gốc (Niêm yết) *</span>
          <input
            value={originalPriceStr}
            onChange={(e) => handleOriginalPriceChange(e.target.value)}
            placeholder="Ví dụ: 399.000đ hoặc Liên hệ"
            style={{ height: 42, padding: "0 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14, background: "#fff" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 600, color: "#475569" }}>
          <span>2. Giá sau giảm (Khuyến mãi)</span>
          <input
            disabled={isContact}
            value={info.hasDiscount ? salePriceStr : ""}
            onChange={(e) => handleSalePriceChange(e.target.value)}
            placeholder={isContact ? "Để trống khi là Liên hệ" : "Tự tính theo Voucher %"}
            style={{ height: 42, padding: "0 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14, background: isContact ? "#f1f5f9" : "#fff" }}
          />
        </label>
      </div>

      <div>
        <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
          3. Cài đặt Voucher giảm giá (%):
        </span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {[
            { label: "0% (Không giảm)", pct: 0 },
            { label: "10%", pct: 10 },
            { label: "15%", pct: 15 },
            { label: "20%", pct: 20 },
            { label: "25%", pct: 25 },
            { label: "30%", pct: 30 },
            { label: "40%", pct: 40 },
            { label: "50%", pct: 50 },
            { label: "70%", pct: 70 },
          ].map((item) => {
            const isSelected = discountPercent === item.pct;
            return (
              <button
                key={item.label}
                type="button"
                style={{
                  padding: "5px 11px",
                  borderRadius: 6,
                  border: isSelected ? "1.5px solid #b91c1c" : "1px solid #cbd5e1",
                  background: isSelected ? "#fee2e2" : "#fff",
                  color: isSelected ? "#991b1b" : "#334155",
                  fontWeight: isSelected ? 800 : 500,
                  fontSize: 12,
                  cursor: "pointer",
                }}
                onClick={() => handleVoucherChange(item.pct)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        <small style={{ color: "#64748b", marginRight: 2 }}>Giá gốc nhanh:</small>
        {["Liên hệ", "99.000đ", "199.000đ", "299.000đ", "399.000đ", "499.000đ", "900.000đ", "1.500.000đ", "Từ 2.000.000đ"].map((preset) => (
          <button
            key={preset}
            type="button"
            style={{
              padding: "2px 8px",
              background: originalPriceStr === preset ? "#fef2f2" : "#fff",
              color: originalPriceStr === preset ? "#991b1b" : "#475569",
              border: "1px solid #e2e8f0",
              borderRadius: 4,
              fontSize: 11,
              cursor: "pointer",
            }}
            onClick={() => handleOriginalPriceChange(preset)}
          >
            {preset}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 2, padding: "10px 14px", background: "#fff", border: "1px dashed #cbd5e1", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 12, color: "#64748b" }}>Xem trước hiển thị trên web:</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isContact ? (
            <strong style={{ color: "#7c1c38", fontSize: 15 }}>Liên hệ</strong>
          ) : info.hasDiscount ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ textDecoration: "line-through", color: "#94a3b8", fontSize: 13 }}>{info.originalPrice}</span>
              <span style={{ padding: "1px 5px", background: "#fee2e2", color: "#b91c1c", fontSize: 10, fontWeight: 800, borderRadius: 4 }}>-{info.discountPercent}%</span>
              <strong style={{ color: "#b91c1c", fontSize: 16, fontWeight: 800 }}>{info.salePrice}</strong>
            </div>
          ) : (
            <strong style={{ color: "#7c1c38", fontSize: 15 }}>{info.originalPrice}</strong>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContentAdmin() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [entries, setEntries] = useState<CmsEntry[]>([]);
  const [section, setSection] = useState("services");
  const [draft, setDraft] = useState<CmsEntry | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [productGroupFilter, setProductGroupFilter] = useState<string>("all");
  const [courseGroupFilter, setCourseGroupFilter] = useState<string>("all");
  const [videoDisciplineFilter, setVideoDisciplineFilter] = useState<string>("all");
  const [curriculumDisciplineFilter, setCurriculumDisciplineFilter] = useState<string>("all");
  const [sheetDisciplineFilter, setSheetDisciplineFilter] = useState<string>("all");

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passBusy, setPassBusy] = useState(false);
  const [passNotice, setPassNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  async function handleChangePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPassNotice(null);
    if (!newPass || newPass.length < 4) {
      setPassNotice({ type: "error", msg: "Mật khẩu mới phải có tối thiểu 4 ký tự." });
      return;
    }
    if (newPass !== confirmPass) {
      setPassNotice({ type: "error", msg: "Mật khẩu mới và Nhập lại mật khẩu không khớp nhau." });
      return;
    }
    setPassBusy(true);
    try {
      const response = await fetch("/api/cms/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
      });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; message?: string };
      if (!response.ok) {
        setPassNotice({ type: "error", msg: data.error || "Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại." });
        return;
      }
      setPassNotice({ type: "success", msg: "Đổi mật khẩu quản trị thành công! Hãy ghi nhớ mật khẩu mới này." });
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    } catch {
      setPassNotice({ type: "error", msg: "Lỗi kết nối máy chủ. Vui lòng thử lại." });
    } finally {
      setPassBusy(false);
    }
  }

  const activeMeta = [...collections, ...singletons].find((item) => item.key === section) || singletons[0];
  const isSingleton = singletons.some((item) => item.key === section);
  const isPaymentSettings = draft?.collection === "settings" && draft.slug === "payment";
  const isTuitionSettings = (draft?.collection === "settings" && draft.slug === "tuition") || section === "tuition";
  const fieldMeta = activeMeta as typeof activeMeta & {
    tagLabel?: string;
    tagPlaceholder?: string;
    priceLabel?: string;
    excerptLabel?: string;
    contentLabel?: string;
  };

  const defaultProductGroupList = useMemo(() => [
    { slug: "sao-ngang-viet-nam", title: "Sáo ngang Việt Nam" },
    { slug: "sao-dizi-trung-quoc", title: "Sáo Dizi Trung Quốc" },
    { slug: "sao-meo", title: "Sáo mèo" },
    { slug: "tieu-xiao", title: "Tiêu & Xiao" },
    { slug: "recorder", title: "Recorder" },
    { slug: "flute", title: "Flute" },
    { slug: "sao-doc", title: "Sáo dọc" },
  ], []);

  const productGroups = useMemo(() => {
    const fromEntries = entries.filter((e) => e.collection === "product-groups").sort((a, b) => a.sortOrder - b.sortOrder);
    if (fromEntries.length > 0) return fromEntries;
    return defaultProductGroupList.map((g, i) => ({
      id: `pg-${g.slug}`,
      collection: "product-groups",
      title: g.title,
      slug: g.slug,
      publishedAt: "",
      excerpt: "",
      imageUrl: "",
      tag: "",
      price: "",
      content: "",
      visible: true,
      sortOrder: i + 1,
    }));
  }, [entries, defaultProductGroupList]);

  const courseGroups = useMemo(
    () => entries.filter((e) => e.collection === "course-groups").sort((a, b) => a.sortOrder - b.sortOrder),
    [entries],
  );

  const videoDisciplinesList = useMemo(() => [
    { slug: "sao-truc", name: "Sáo trúc Việt Nam" },
    { slug: "sao-dizi", name: "Sáo Dizi" },
    { slug: "sao-meo", name: "Sáo mèo" },
    { slug: "tieu-xiao", name: "Tiêu & Xiao" },
    { slug: "recorder", name: "Sáo Recorder" },
    { slug: "flute", name: "Flute" },
    { slug: "sao-hmong", name: "Sáo H’Mông" },
    ...courseGroups.filter((cg) => !["sao-truc", "sao-dizi", "sao-meo", "recorder", "flute"].includes(cg.slug)).map((cg) => ({ slug: cg.slug, name: cg.title })),
  ], [courseGroups]);

  const defaultDisciplinesList = useMemo(() => [
    { slug: "sao-truc", name: "Sáo trúc Việt Nam" },
    { slug: "sao-dizi", name: "Sáo Dizi" },
    { slug: "sao-recorder", name: "Sáo Recorder" },
    { slug: "tieu-xiao", name: "Tiêu & Xiao" },
    { slug: "flute", name: "Flute" },
    { slug: "sao-meo", name: "Sáo mèo" },
    { slug: "sao-hmong", name: "Sáo H’Mông" },
    ...courseGroups.filter((cg) => !["sao-truc", "sao-dizi", "sao-meo", "recorder", "flute"].includes(cg.slug)).map((cg) => ({ slug: cg.slug, name: cg.title })),
  ], [courseGroups]);

  const sectionEntries = useMemo(() => {
    let list = entries.filter((entry) => entry.collection === section);
    if (section === "product-items" && productGroupFilter !== "all") {
      list = list.filter((entry) => entry.tag === productGroupFilter);
    }
    if (section === "course-items" && courseGroupFilter !== "all") {
      list = list.filter((entry) => entry.tag === courseGroupFilter);
    }
    if (section === "single-videos" && videoDisciplineFilter !== "all") {
      list = list.filter((entry) => entry.tag === videoDisciplineFilter || slugify(entry.tag) === videoDisciplineFilter);
    }
    if (section === "curriculums") {
      list = entries.filter((entry) => entry.collection === "curriculums" || (entry.collection === "materials" && (entry.tag.startsWith("giao-trinh:") || !entry.tag.startsWith("sheet:"))));
      if (curriculumDisciplineFilter !== "all") {
        list = list.filter((entry) => {
          const normTag = entry.tag.replace(/^giao-trinh:/, "");
          return normTag === curriculumDisciplineFilter || slugify(normTag) === curriculumDisciplineFilter;
        });
      }
    }
    if (section === "tuition") {
      list = entries.filter((entry) => entry.collection === "tuition" || (entry.collection === "settings" && entry.slug === "tuition"));
      if (!list.length) {
        list = [{
          id: "settings-tuition",
          collection: "settings",
          title: "2.400.000đ – 3.200.000đ",
          slug: "tuition",
          publishedAt: new Date().toISOString().slice(0, 10),
          excerpt: "4.800.000đ – 6.400.000đ",
          imageUrl: "Thời gian mỗi buổi 60 phút.",
          tag: "Bảng mục học phí",
          price: "7.200.000đ",
          content: "[BUOI_1]\n8 buổi\n\n[BUOI_2]\n16 buổi\n\n[BUOI_3]\n24 buổi\n\n[THOI_LUONG]\nThời gian mỗi buổi 60 phút.\n\n[UU_DAI]\ngiảm 10% – 15%, tặng MV Video thổi sáo khi hết khoá.\n\n[LUU_Y]\nHọc phí đã đăng ký không hoàn lại trong mọi trường hợp. Nếu học viên có việc phát sinh và chưa thể tiếp tục học, số buổi còn lại sẽ được bảo lưu để học viên sắp xếp học lại sau.",
          visible: true,
          sortOrder: 3,
        }];
      }
    }
    return list.sort((a, b) => a.sortOrder - b.sortOrder);
  }, [entries, section, productGroupFilter, courseGroupFilter, videoDisciplineFilter, curriculumDisciplineFilter, sheetDisciplineFilter]);

  const [tuitionForm, setTuitionForm] = useState<TuitionFields>(() => ({
    sessions1: "8 buổi",
    sessions2: "16 buổi",
    sessions3: "24 buổi",
    duration: "Thời gian mỗi buổi 60 phút.",
    promo: "giảm 10% – 15%, tặng MV Video thổi sáo khi hết khoá.",
    note: "Học phí đã đăng ký không hoàn lại trong mọi trường hợp. Nếu học viên có việc phát sinh và chưa thể tiếp tục học, số buổi còn lại sẽ được bảo lưu để học viên sắp xếp học lại sau.",
  }));

  const [contactForm, setContactForm] = useState<ContactFields>(() => parseContactToFields(""));
  const [classForm, setClassForm] = useState<ClassDetailFields>(() => parseClassContentToFields("", ""));

  useEffect(() => {
    if (draft && ((draft.collection === "settings" && draft.slug === "tuition") || section === "tuition")) {
      setTuitionForm(parseTuitionContentToFields(draft.content, draft.imageUrl));
    }
  }, [draft?.id, draft?.slug, draft?.collection, section]);

  useEffect(() => {
    if (draft && draft.collection === "page-contact") {
      setContactForm(parseContactToFields(draft.content));
    }
  }, [draft?.id, draft?.slug, draft?.collection]);

  useEffect(() => {
    if (draft && draft.collection === "class-details") {
      setClassForm(parseClassContentToFields(draft.content, draft.excerpt));
    }
  }, [draft?.id, draft?.slug, draft?.collection]);

  function createProductForGroup(groupSlug: string) {
    setSection("product-items");
    setProductGroupFilter(groupSlug);
    const existing = entries.filter((e) => e.collection === "product-items");
    const maxOrder = existing.length ? Math.max(...existing.map((e) => e.sortOrder)) : 0;
    setDraft({
      id: `entry-${Date.now()}`,
      collection: "product-items",
      title: "",
      slug: "",
      publishedAt: new Date().toISOString().slice(0, 10),
      excerpt: "",
      imageUrl: "",
      tag: groupSlug,
      price: "Liên hệ",
      content: "",
      visible: true,
      sortOrder: maxOrder + 1,
      updatedAt: new Date().toISOString(),
    });
  }

  function createCourseForGroup(groupSlug: string) {
    setSection("course-items");
    setCourseGroupFilter(groupSlug);
    const existing = entries.filter((e) => e.collection === "course-items");
    const maxOrder = existing.length ? Math.max(...existing.map((e) => e.sortOrder)) : 0;
    setDraft({
      id: `entry-${Date.now()}`,
      collection: "course-items",
      title: "",
      slug: "",
      publishedAt: new Date().toISOString().slice(0, 10),
      excerpt: "",
      imageUrl: "",
      tag: groupSlug,
      price: "399.000đ",
      content: "Video bài giảng HD chi tiết từng kỹ thuật\nSheet nhạc và tài liệu PDF đính kèm\nHọc mọi lúc, xem lại trọn đời trên mọi thiết bị\nHỗ trợ giải đáp thắc mắc từ giảng viên",
      visible: true,
      sortOrder: maxOrder + 1,
      updatedAt: new Date().toISOString(),
    });
  }

  function createVideoForDiscipline(discSlug: string) {
    setSection("single-videos");
    setVideoDisciplineFilter(discSlug);
    const existing = entries.filter((e) => e.collection === "single-videos");
    const maxOrder = existing.length ? Math.max(...existing.map((e) => e.sortOrder)) : 0;
    setDraft({
      id: `entry-${Date.now()}`,
      collection: "single-videos",
      title: "",
      slug: "",
      publishedAt: new Date().toISOString().slice(0, 10),
      excerpt: "Video hướng dẫn từng câu, sheet nhạc, ngón bấm và kỹ thuật.",
      imageUrl: "",
      tag: discSlug,
      price: "99.000đ",
      content: "Hướng dẫn chia câu và lấy hơi\nSheet nhạc và sơ đồ thế bấm\nPhân tích kỹ thuật rung hơi, luyến láy\nVideo HD xem lại trọn đời",
      visible: true,
      sortOrder: maxOrder + 1,
      updatedAt: new Date().toISOString(),
    });
  }

  function createCurriculumForDiscipline(discSlug: string) {
    setSection("curriculums");
    setCurriculumDisciplineFilter(discSlug);
    const existing = entries.filter((e) => e.collection === "curriculums" || (e.collection === "materials" && (e.tag.startsWith("giao-trinh:") || !e.tag.startsWith("sheet:"))));
    const maxOrder = existing.length ? Math.max(...existing.map((e) => e.sortOrder)) : 0;
    setDraft({
      id: `entry-${Date.now()}`,
      collection: "curriculums",
      title: "",
      slug: "",
      publishedAt: new Date().toISOString().slice(0, 10),
      excerpt: "Lộ trình đào tạo chuẩn, bài bản từ căn bản đến nâng cao.",
      imageUrl: "",
      tag: discSlug,
      price: "249.000đ",
      content: "Chương 1 · Tư thế, khẩu hình và cột hơi nền tảng\nChương 2 · Hệ thống ngón bấm và đọc bản nhạc chuẩn\nChương 3 · Kỹ thuật rung hơi, luyến láy và phát triển sắc thái\nChương 4 · Phân tích và hoàn thiện các tác phẩm biểu diễn\nĐính kèm file PDF chất lượng cao và video thị phạm",
      visible: true,
      sortOrder: maxOrder + 1,
      updatedAt: new Date().toISOString(),
    });
  }

  function createSheetForDiscipline(discSlug: string) {
    setSection("sheets");
    setSheetDisciplineFilter(discSlug);
    const existing = entries.filter((e) => e.collection === "sheets" || (e.collection === "materials" && e.tag.startsWith("sheet:")));
    const maxOrder = existing.length ? Math.max(...existing.map((e) => e.sortOrder)) : 0;
    setDraft({
      id: `entry-${Date.now()}`,
      collection: "sheets",
      title: "",
      slug: "",
      publishedAt: new Date().toISOString().slice(0, 10),
      excerpt: "Tone C5 · Ký âm nốt nhạc chuẩn và sơ đồ ngón bấm.",
      imageUrl: "",
      tag: discSlug,
      price: "79.000đ",
      content: "Bản ký âm 5 dòng kẻ chuẩn\nKèm sơ đồ ngón bấm và ký hiệu lấy hơi\nĐánh dấu vị trí xử lý luyến láy, rung hơi\nFile PDF độ phân giải cao sẵn sàng in ấn",
      visible: true,
      sortOrder: maxOrder + 1,
      updatedAt: new Date().toISOString(),
    });
  }

  async function moveEntry(entry: CmsEntry, direction: "up" | "down") {
    const currentList = [...sectionEntries];
    const index = currentList.findIndex((e) => e.id === entry.id);
    if (index < 0) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    const temp = currentList[index];
    currentList[index] = currentList[targetIndex];
    currentList[targetIndex] = temp;

    const updatedList = currentList.map((item, idx) => ({
      ...item,
      sortOrder: idx + 1,
      updatedAt: new Date().toISOString(),
    }));

    setEntries((prev) =>
      prev.map((e) => {
        const match = updatedList.find((u) => u.id === e.id);
        return match || e;
      })
    );

    setBusy(true);
    try {
      await Promise.all(
        updatedList.map((item) =>
          fetch("/api/cms/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          })
        )
      );
      setNotice(`Đã chuyển "${entry.title}" ${direction === "up" ? "lên trên" : "xuống dưới"}.`);
    } catch {
      setNotice("Lỗi khi lưu vị trí mới.");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function load() {
    let response = await fetch("/api/cms/admin", { credentials: "same-origin" });
    if (response.status === 401) {
      setAuthenticated(false);
      return;
    }
    if (!response.ok) throw new Error("load_failed");
    let data = (await response.json()) as { entries: CmsEntry[] };
    let offset: number | null = 0;
    while (offset !== null) {
      const seedResponse = await fetch(`/api/cms/seed-details?offset=${offset}`, { method: "POST", credentials: "same-origin" });
      if (!seedResponse.ok) break;
      const seedData = (await seedResponse.json()) as { nextOffset: number | null };
      offset = seedData.nextOffset;
    }
    response = await fetch("/api/cms/admin", { credentials: "same-origin" });
    if (response.ok) data = (await response.json()) as { entries: CmsEntry[] };
    setEntries(data.entries);
    setAuthenticated(true);

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const reqCollection = urlParams.get("collection");
      const reqSlug = urlParams.get("slug");
      if (reqCollection) {
        setSection(reqCollection);
        if (reqSlug) {
          const match = data.entries.find((item) => item.collection === reqCollection && item.slug === reqSlug);
          if (match) setDraft(match);
        }
      }
    }
  }

  useEffect(() => {
    void load().catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    setNotice("");
  }, [section]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setLoginError("");
    const response = await fetch("/api/cms/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (!response.ok) {
      setLoginError("Mật khẩu không đúng. Vui lòng thử lại.");
      return;
    }
    setPassword("");
    await load();
  }

  async function logout() {
    await fetch("/api/cms/logout", { method: "POST" });
    setAuthenticated(false);
    setEntries([]);
  }

  function startCreate() {
    if (isSingleton && sectionEntries[0]) {
      const preferredEntry = section === "settings"
        ? sectionEntries.find((entry) => entry.slug === "payment") || sectionEntries[0]
        : sectionEntries[0];
      setDraft({ ...preferredEntry });
      return;
    }
    if (section === "tuition") {
      const tuitionEntry = entries.find((entry) => entry.collection === "settings" && entry.slug === "tuition");
      if (tuitionEntry) {
        setDraft({ ...tuitionEntry });
      } else {
        setDraft({
          id: "settings-tuition",
          collection: "settings",
          title: "2.400.000đ – 3.200.000đ",
          slug: "tuition",
          publishedAt: new Date().toISOString().slice(0, 10),
          excerpt: "4.800.000đ – 6.400.000đ",
          imageUrl: "",
          tag: "Bảng mục học phí",
          price: "7.200.000đ",
          content: "giảm 10% – 15%, tặng MV Video thổi sáo khi hết khoá.",
          visible: true,
          sortOrder: 3,
        });
      }
      return;
    }
    if (section === "page-contact") {
      setDraft({
        id: "page-contact",
        collection: "page-contact",
        title: "Đăng ký lớp học & Tư vấn",
        slug: "dang-ky-hoc",
        publishedAt: new Date().toISOString().slice(0, 10),
        excerpt: "Để lại thông tin, Sáo Trúc Âu Cơ sẽ liên hệ tư vấn lớp học, chọn sáo hoặc dịch vụ phù hợp.",
        imageUrl: "/hero-flute.webp",
        tag: "THÔNG TIN LIÊN HỆ",
        price: "0374 261 368",
        content: "[TIÊU ĐỀ KHỐI]\nĐăng Kí Học Sáo, Tư Vấn Các Dịch Vụ\n\n[MÔ TẢ KHỐI]\nHọc tại trung tâm (TP.HCM), gia sư tại nhà hoặc online 1 kèm 1 linh động cho học viên ở xa và nước ngoài.\n\n[ĐỊA CHỈ]\n106/72 Hòa Bình, P. Tân Phú, TP.HCM\n\n[EMAIL]\nvan17071999@gmail.com",
        visible: true,
        sortOrder: 1,
      });
      return;
    }
    if (section === "product-items") {
      const defaultGroup = (productGroupFilter !== "all" ? productGroupFilter : productGroups[0]?.slug) || "sao-ngang-viet-nam";
      const existing = entries.filter((e) => e.collection === "product-items");
      const maxOrder = existing.length ? Math.max(...existing.map((e) => e.sortOrder)) : 0;
      setDraft({
        id: "",
        collection: "product-items",
        title: "",
        slug: "",
        publishedAt: new Date().toISOString().slice(0, 10),
        excerpt: "",
        imageUrl: "",
        tag: defaultGroup,
        price: "Liên hệ",
        content: "",
        visible: true,
        sortOrder: maxOrder + 1,
      });
      return;
    }
    setDraft(emptyEntry(section));
  }

  async function uploadImage(file: File) {
    if (!file.type.startsWith("image/")) {
      setNotice("Chỉ chấp nhận tệp ảnh.");
      return;
    }
    setBusy(true);
    const body = new FormData();
    let prepared: File;
    try {
      prepared = await prepareImage(file);
    } catch {
      setBusy(false);
      setNotice("Không xử lý được ảnh này. Hãy thử ảnh JPG hoặc PNG khác.");
      return;
    }
    body.append("file", prepared);
    const response = await fetch("/api/cms/upload", { method: "POST", body });
    setBusy(false);
    if (!response.ok) {
      setNotice("Không tải được ảnh. Hãy thử một ảnh nhỏ hơn.");
      return;
    }
    const data = (await response.json()) as { url: string };
    setDraft((current) => current ? { ...current, imageUrl: data.url } : current);
    setNotice("Đã tải ảnh lên.");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    setBusy(true);
    setNotice("");
    let payload = draft;
    if (section === "tuition" || (payload.collection === "settings" && payload.slug === "tuition")) {
      payload = {
        ...payload,
        collection: "settings",
        slug: "tuition",
        id: payload.id || "settings-tuition",
        content: assembleTuitionFields(tuitionForm),
        imageUrl: tuitionForm.duration,
      };
    }
    if (payload.collection === "page-contact") {
      payload = {
        ...payload,
        content: assembleContactFields(contactForm),
      };
    }
    if (payload.collection === "class-details") {
      payload = {
        ...payload,
        content: assembleFieldsToContent(classForm),
      };
    }
    if (payload.collection === "settings" && payload.slug === "payment") {
      const savedEntry = entries.find((entry) => entry.id === draft.id);
      const accountChanged = Boolean(savedEntry && savedEntry.price !== draft.price);
      const qrUnchanged = Boolean(savedEntry && savedEntry.imageUrl === draft.imageUrl);
      if (accountChanged && qrUnchanged) {
        const bankCode = (draft.tag.split(/[ ·]/)[0] || "STB").replace(/[^A-Za-z0-9]/g, "");
        const accountNumber = draft.price.replace(/\D/g, "");
        if (bankCode && accountNumber) payload = {
          ...draft,
          imageUrl: `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png`,
        };
      }
    }
    const response = await fetch("/api/cms/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!response.ok) {
      setNotice("Chưa lưu được nội dung. Vui lòng kiểm tra các trường bắt buộc.");
      return;
    }
    const data = (await response.json()) as { entry: CmsEntry; telegramNotified?: boolean };
    setEntries((current) => [...current.filter((item) => item.id !== data.entry.id), data.entry]);
    setDraft({ ...data.entry });
    setNotice(data.telegramNotified
      ? "Đã lưu, cập nhật lên website và gửi thông báo Telegram."
      : "Đã lưu và cập nhật lên website, nhưng chưa gửi được thông báo Telegram.");
  }

  async function remove(entry: CmsEntry) {
    if (!window.confirm(`Xóa “${entry.title}”? Thao tác này không thể hoàn tác.`)) return;
    setBusy(true);
    const response = await fetch(`/api/cms/admin?id=${encodeURIComponent(entry.id)}`, { method: "DELETE" });
    setBusy(false);
    if (!response.ok) {
      setNotice("Không thể xóa nội dung này.");
      return;
    }
    setEntries((current) => current.filter((item) => item.id !== entry.id));
    setDraft(null);
    setNotice("Đã xóa nội dung.");
  }

  if (authenticated === null) return <div className="admin-loading">Đang mở trang quản trị…</div>;

  if (!authenticated) {
    return <main className="admin-login-shell">
      <section className="admin-login-card">
        <BrandLogo className="admin-login-mark" size={52} radius={15} />
        <p>SÁO TRÚC ÂU CƠ</p>
        <h1>Quản trị nội dung</h1>
        <span>Đăng nhập để chỉnh sửa nội dung đang hiển thị trên website.</span>
        <form onSubmit={login}>
          <label>Mật khẩu quản trị<input autoFocus required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {loginError && <div className="admin-error" role="alert">{loginError}</div>}
          <button disabled={busy}>{busy ? "Đang kiểm tra…" : "Đăng nhập"}</button>
        </form>
        <a href="/">← Quay lại website</a>
      </section>
    </main>;
  }

  return <main className="admin-shell">
    <aside className={navOpen ? "admin-sidebar open" : "admin-sidebar"}>
      <div className="admin-brand"><BrandLogo size={35} radius={9} /><span><strong>Sáo Trúc Âu Cơ</strong><small>Quản trị nội dung</small></span></div>
      <button className="admin-nav-close" onClick={() => setNavOpen(false)}>×</button>
      <a className="admin-dashboard-link" href="/" target="_blank" rel="noreferrer">↗ Xem website</a>
      <p className="admin-nav-title">BỘ SƯU TẬP</p>
      <nav>{collections.map((item) => {
        const count = item.key === "curriculums"
          ? entries.filter((e) => e.collection === "curriculums" || (e.collection === "materials" && (e.tag.startsWith("giao-trinh:") || !e.tag.startsWith("sheet:")))).length
          : item.key === "sheets"
          ? entries.filter((e) => e.collection === "sheets" || (e.collection === "materials" && e.tag.startsWith("sheet:"))).length
          : entries.filter((e) => e.collection === item.key).length;
        return (
          <button className={section === item.key ? "active" : ""} key={item.key} onClick={() => { setSection(item.key); setNavOpen(false); }}>
            <span>{item.label}</span>
            <small>{count}</small>
          </button>
        );
      })}</nav>
      <p className="admin-nav-title">TRANG ĐƠN</p>
      <nav>{singletons.map((item) => <button className={section === item.key ? "active" : ""} key={item.key} onClick={() => { setSection(item.key); setNavOpen(false); }}><span>{item.label}</span></button>)}</nav>
      <button className="admin-logout" onClick={logout}>Đăng xuất</button>
    </aside>

    <section className="admin-workspace">
      <header className="admin-topbar">
        <button className="admin-menu" onClick={() => setNavOpen(true)}>☰</button>
        <div><small>{isSingleton ? "TRANG ĐƠN" : "BỘ SƯU TẬP"}</small><h1>{activeMeta.label}</h1><p>{activeMeta.note}</p></div>
        {!draft && section !== "change-password" && <button className="admin-primary" onClick={startCreate}>{isSingleton && sectionEntries.length ? "Chỉnh sửa" : "+ Tạo mới"}</button>}
      </header>

      {notice && <div className="admin-notice" role="status">{notice}</div>}

      {section === "change-password" ? (
        <div style={{ padding: "30px 34px", maxWidth: 620 }}>
          <div style={{ background: "#fff", padding: "28px 30px", border: "1px solid var(--admin-line)", borderRadius: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <h2 style={{ margin: "0 0 6px", color: "#1e293b", fontSize: 20 }}>Đổi mật khẩu trang quản trị</h2>
            <p style={{ margin: "0 0 22px", color: "#64748b", fontSize: 13, lineHeight: 1.5 }}>
              Mật khẩu mới sẽ áp dụng ngay lập tức cho các lần đăng nhập tiếp theo vào trang <b>/quan-tri</b>.
            </p>

            {passNotice && (
              <div style={{ marginBottom: 20, padding: "12px 16px", borderRadius: 8, background: passNotice.type === "success" ? "#ecfdf5" : "#fef2f2", color: passNotice.type === "success" ? "#065f46" : "#991b1b", border: `1px solid ${passNotice.type === "success" ? "#a7f3d0" : "#fecaca"}`, fontSize: 13, fontWeight: 600 }}>
                {passNotice.msg}
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display: "grid", gap: 16 }}>
              <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 700, color: "#334155" }}>
                <span>Mật khẩu hiện tại *</span>
                <input
                  required
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="Nhập mật khẩu quản trị hiện tại"
                  style={{ height: 44, padding: "0 14px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 15 }}
                />
              </label>

              <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 700, color: "#334155" }}>
                <span>Mật khẩu mới *</span>
                <input
                  required
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Nhập mật khẩu mới (tối thiểu 4 ký tự)"
                  style={{ height: 44, padding: "0 14px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 15 }}
                />
              </label>

              <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 700, color: "#334155" }}>
                <span>Xác nhận mật khẩu mới *</span>
                <input
                  required
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  style={{ height: 44, padding: "0 14px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 15 }}
                />
              </label>

              <button
                type="submit"
                disabled={passBusy}
                className="admin-primary"
                style={{ height: 46, fontSize: 14, marginTop: 8, borderRadius: 8 }}
              >
                {passBusy ? "Đang xử lý…" : "Cập nhật mật khẩu quản trị"}
              </button>
            </form>
          </div>
        </div>
      ) : !draft ? <div className="admin-list-panel">
        {section === "product-items" && productGroups.length > 0 && (
          <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Lọc theo nhóm:</span>
            <button
              type="button"
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                border: "1px solid",
                borderColor: productGroupFilter === "all" ? "#7c1c38" : "#cbd5e1",
                background: productGroupFilter === "all" ? "#7c1c38" : "#fff",
                color: productGroupFilter === "all" ? "#fff" : "#334155",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
              onClick={() => setProductGroupFilter("all")}
            >
              Tất cả ({entries.filter((e) => e.collection === "product-items").length})
            </button>
            {productGroups.map((g) => {
              const count = entries.filter((e) => e.collection === "product-items" && e.tag === g.slug).length;
              return (
                <button
                  key={g.slug}
                  type="button"
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    border: "1px solid",
                    borderColor: productGroupFilter === g.slug ? "#7c1c38" : "#cbd5e1",
                    background: productGroupFilter === g.slug ? "#7c1c38" : "#fff",
                    color: productGroupFilter === g.slug ? "#fff" : "#334155",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => setProductGroupFilter(g.slug)}
                >
                  {g.title} ({count})
                </button>
              );
            })}
          </div>
        )}

        {section === "course-items" && courseGroups.length > 0 && (
          <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Lọc theo nhóm khóa học:</span>
            <button
              type="button"
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                border: "1px solid",
                borderColor: courseGroupFilter === "all" ? "#7c1c38" : "#cbd5e1",
                background: courseGroupFilter === "all" ? "#7c1c38" : "#fff",
                color: courseGroupFilter === "all" ? "#fff" : "#334155",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
              onClick={() => setCourseGroupFilter("all")}
            >
              Tất cả ({entries.filter((e) => e.collection === "course-items").length})
            </button>
            {courseGroups.map((g) => {
              const count = entries.filter((e) => e.collection === "course-items" && e.tag === g.slug).length;
              return (
                <button
                  key={g.slug}
                  type="button"
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    border: "1px solid",
                    borderColor: courseGroupFilter === g.slug ? "#7c1c38" : "#cbd5e1",
                    background: courseGroupFilter === g.slug ? "#7c1c38" : "#fff",
                    color: courseGroupFilter === g.slug ? "#fff" : "#334155",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => setCourseGroupFilter(g.slug)}
                >
                  {g.title} ({count})
                </button>
              );
            })}
          </div>
        )}

        {section === "single-videos" && (
          <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Lọc theo bộ môn video:</span>
            <button
              type="button"
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                border: "1px solid",
                borderColor: videoDisciplineFilter === "all" ? "#7c1c38" : "#cbd5e1",
                background: videoDisciplineFilter === "all" ? "#7c1c38" : "#fff",
                color: videoDisciplineFilter === "all" ? "#fff" : "#334155",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
              onClick={() => setVideoDisciplineFilter("all")}
            >
              Tất cả ({entries.filter((e) => e.collection === "single-videos").length})
            </button>
            {videoDisciplinesList.map((d) => {
              const count = entries.filter((e) => e.collection === "single-videos" && (e.tag === d.slug || slugify(e.tag) === d.slug)).length;
              return (
                <button
                  key={d.slug}
                  type="button"
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    border: "1px solid",
                    borderColor: videoDisciplineFilter === d.slug ? "#7c1c38" : "#cbd5e1",
                    background: videoDisciplineFilter === d.slug ? "#7c1c38" : "#fff",
                    color: videoDisciplineFilter === d.slug ? "#fff" : "#334155",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => setVideoDisciplineFilter(d.slug)}
                >
                  {d.name} ({count})
                </button>
              );
            })}
          </div>
        )}

        {section === "curriculums" && (
          <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Lọc theo bộ môn giáo trình:</span>
            <button
              type="button"
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                border: "1px solid",
                borderColor: curriculumDisciplineFilter === "all" ? "#7c1c38" : "#cbd5e1",
                background: curriculumDisciplineFilter === "all" ? "#7c1c38" : "#fff",
                color: curriculumDisciplineFilter === "all" ? "#fff" : "#334155",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
              onClick={() => setCurriculumDisciplineFilter("all")}
            >
              Tất cả ({entries.filter((e) => e.collection === "curriculums" || (e.collection === "materials" && (e.tag.startsWith("giao-trinh:") || !e.tag.startsWith("sheet:")))).length})
            </button>
            {defaultDisciplinesList.map((d) => {
              const count = entries.filter((e) => (e.collection === "curriculums" || (e.collection === "materials" && (e.tag.startsWith("giao-trinh:") || !e.tag.startsWith("sheet:")))) && (e.tag.replace(/^giao-trinh:/, "") === d.slug || slugify(e.tag.replace(/^giao-trinh:/, "")) === d.slug)).length;
              return (
                <button
                  key={d.slug}
                  type="button"
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    border: "1px solid",
                    borderColor: curriculumDisciplineFilter === d.slug ? "#7c1c38" : "#cbd5e1",
                    background: curriculumDisciplineFilter === d.slug ? "#7c1c38" : "#fff",
                    color: curriculumDisciplineFilter === d.slug ? "#fff" : "#334155",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => setCurriculumDisciplineFilter(d.slug)}
                >
                  {d.name} ({count})
                </button>
              );
            })}
          </div>
        )}

        {section === "sheets" && (
          <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Lọc theo bộ môn sheet:</span>
            <button
              type="button"
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                border: "1px solid",
                borderColor: sheetDisciplineFilter === "all" ? "#7c1c38" : "#cbd5e1",
                background: sheetDisciplineFilter === "all" ? "#7c1c38" : "#fff",
                color: sheetDisciplineFilter === "all" ? "#fff" : "#334155",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
              onClick={() => setSheetDisciplineFilter("all")}
            >
              Tất cả ({entries.filter((e) => e.collection === "sheets" || (e.collection === "materials" && e.tag.startsWith("sheet:"))).length})
            </button>
            {defaultDisciplinesList.map((d) => {
              const count = entries.filter((e) => (e.collection === "sheets" || (e.collection === "materials" && e.tag.startsWith("sheet:"))) && (e.tag.replace(/^sheet:/, "") === d.slug || slugify(e.tag.replace(/^sheet:/, "")) === d.slug)).length;
              return (
                <button
                  key={d.slug}
                  type="button"
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    border: "1px solid",
                    borderColor: sheetDisciplineFilter === d.slug ? "#7c1c38" : "#cbd5e1",
                    background: sheetDisciplineFilter === d.slug ? "#7c1c38" : "#fff",
                    color: sheetDisciplineFilter === d.slug ? "#fff" : "#334155",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => setSheetDisciplineFilter(d.slug)}
                >
                  {d.name} ({count})
                </button>
              );
            })}
          </div>
        )}

        {sectionEntries.length ? <div className="admin-entry-list">{sectionEntries.map((entry, index) => {
          const parentProductGroup = section === "product-items" ? productGroups.find((g) => g.slug === entry.tag) : null;
          const parentCourseGroup = section === "course-items" ? courseGroups.find((g) => g.slug === entry.tag) : null;
          const videoDiscipline = section === "single-videos" ? videoDisciplinesList.find((d) => d.slug === entry.tag || slugify(d.slug) === slugify(entry.tag)) : null;
          const curriculumDiscipline = section === "curriculums" ? defaultDisciplinesList.find((d) => d.slug === entry.tag.replace(/^giao-trinh:/, "") || slugify(d.slug) === slugify(entry.tag.replace(/^giao-trinh:/, ""))) : null;
          const sheetDiscipline = section === "sheets" ? defaultDisciplinesList.find((d) => d.slug === entry.tag.replace(/^sheet:/, "") || slugify(d.slug) === slugify(entry.tag.replace(/^sheet:/, ""))) : null;

          const childProducts = section === "product-groups" ? entries.filter((p) => p.collection === "product-items" && p.tag === entry.slug) : [];
          const childCourses = section === "course-groups" ? entries.filter((c) => c.collection === "course-items" && c.tag === entry.slug) : [];

          return (
            <article key={entry.id} style={{ display: "grid", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "42px 75px minmax(200px, 1fr) auto auto", alignItems: "center", gap: 14 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
                  <button
                    type="button"
                    title="Đẩy lên trên"
                    disabled={busy || index === 0}
                    style={{
                      width: 28,
                      height: 26,
                      padding: 0,
                      display: "grid",
                      placeItems: "center",
                      background: index === 0 ? "#f8fafc" : "#fff",
                      color: index === 0 ? "#cbd5e1" : "#7c1c38",
                      border: "1px solid #cbd5e1",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: index === 0 ? "not-allowed" : "pointer",
                    }}
                    onClick={() => void moveEntry(entry, "up")}
                  >
                    ▲
                  </button>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#475569" }} title={`Vị trí: ${index + 1}`}>
                    #{index + 1}
                  </span>
                  <button
                    type="button"
                    title="Đẩy xuống dưới"
                    disabled={busy || index === sectionEntries.length - 1}
                    style={{
                      width: 28,
                      height: 26,
                      padding: 0,
                      display: "grid",
                      placeItems: "center",
                      background: index === sectionEntries.length - 1 ? "#f8fafc" : "#fff",
                      color: index === sectionEntries.length - 1 ? "#cbd5e1" : "#7c1c38",
                      border: "1px solid #cbd5e1",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: index === sectionEntries.length - 1 ? "not-allowed" : "pointer",
                    }}
                    onClick={() => void moveEntry(entry, "down")}
                  >
                    ▼
                  </button>
                </div>
                <div className="admin-entry-image" style={{ width: 75, height: 95, borderRadius: 8, overflow: "hidden" }}>
                  {entry.imageUrl ? <img src={entry.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span>♪</span>}
                </div>
                <div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                    <small style={{ color: "#64748b" }}>{entry.publishedAt || "Chưa đặt ngày"}</small>
                    {parentProductGroup && (
                      <span style={{ padding: "1px 8px", background: "#f1f5f9", color: "#475569", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                        Nhóm: {parentProductGroup.title}
                      </span>
                    )}
                    {parentCourseGroup && (
                      <span style={{ padding: "1px 8px", background: "#f1f5f9", color: "#475569", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                        Bộ môn: {parentCourseGroup.title}
                      </span>
                    )}
                    {videoDiscipline && (
                      <span style={{ padding: "1px 8px", background: "#fef3c7", color: "#92400e", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                        Bộ môn: {videoDiscipline.name}
                      </span>
                    )}
                    {curriculumDiscipline && (
                      <span style={{ padding: "1px 8px", background: "#fef3c7", color: "#92400e", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                        Bộ môn: {curriculumDiscipline.name}
                      </span>
                    )}
                    {sheetDiscipline && (
                      <span style={{ padding: "1px 8px", background: "#ecfdf5", color: "#065f46", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                        Bộ môn: {sheetDiscipline.name}
                      </span>
                    )}
                    {section !== "product-items" && section !== "course-items" && section !== "single-videos" && section !== "curriculums" && section !== "sheets" && entry.tag && (
                      <span style={{ padding: "1px 8px", background: "#f1f5f9", color: "#475569", borderRadius: 12, fontSize: 11 }}>
                        {entry.tag}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: 18 }}>{entry.title}</h2>
                    {entry.price && !["class-details", "hero-slides", "social-links", "flute-tabs", "free-guides"].includes(section) && (
                      <span style={{ padding: "2px 8px", background: entry.price.toLowerCase().includes("liên hệ") ? "#fef3c7" : "#ecfdf5", color: entry.price.toLowerCase().includes("liên hệ") ? "#92400e" : "#065f46", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                        {entry.price}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>{entry.excerpt || "Chưa có mô tả ngắn"}</p>
                </div>
                <span className={entry.visible ? "status visible" : "status"}>{entry.visible ? "Đang hiển thị" : "Đang ẩn"}</span>
                <div className="admin-row-actions">
                  {entryHref(entry) && <a href={entryHref(entry)} target="_blank" rel="noreferrer">Xem trang</a>}
                  <button onClick={() => setDraft({ ...entry })}>Sửa</button>
                  <button className="danger" onClick={() => void remove(entry)}>Xóa</button>
                </div>
              </div>

              {section === "product-groups" && (
                <div style={{ marginTop: 4, padding: "12px 16px", background: "#faf8f5", borderRadius: 8, border: "1px solid #e8e2d8" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontWeight: 700, color: "#5c1d2e", fontSize: 13 }}>
                      Danh sách sản phẩm thuộc nhóm này ({childProducts.length}):
                    </span>
                    <button
                      type="button"
                      style={{ padding: "6px 14px", background: "#7c1c38", color: "#fff", border: 0, borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      onClick={() => createProductForGroup(entry.slug)}
                    >
                      + Thêm sản phẩm vào nhóm "{entry.title}"
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {childProducts.map((p) => (
                      <span key={p.id} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 10px", background: "#fff", border: "1px solid #dcd3c5", borderRadius: 6, fontSize: 13 }}>
                        {p.imageUrl && <img src={p.imageUrl} alt="" style={{ width: 22, height: 28, objectFit: "cover", borderRadius: 4 }} />}
                        <b>{p.title}</b>
                        <span style={{ color: p.price.toLowerCase().includes("liên hệ") ? "#b45309" : "#047857", fontWeight: 700, fontSize: 12 }}>
                          {p.price}
                        </span>
                        <button
                          type="button"
                          style={{ border: 0, background: "none", color: "#315fe8", cursor: "pointer", fontSize: 12, padding: "0 2px", fontWeight: 700 }}
                          onClick={() => { setSection("product-items"); setDraft(p); }}
                        >
                          ✎ Sửa
                        </button>
                      </span>
                    ))}
                    {childProducts.length === 0 && (
                      <small style={{ color: "#8a7e72" }}>Chưa có sản phẩm nào. Bấm nút bên phải để thêm sản phẩm đầu tiên cho nhóm này.</small>
                    )}
                  </div>
                </div>
              )}

              {section === "course-groups" && (
                <div style={{ marginTop: 4, padding: "12px 16px", background: "#faf8f5", borderRadius: 8, border: "1px solid #e8e2d8" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontWeight: 700, color: "#5c1d2e", fontSize: 13 }}>
                      Các khóa học con thuộc bộ môn này ({childCourses.length}):
                    </span>
                    <button
                      type="button"
                      style={{ padding: "6px 14px", background: "#7c1c38", color: "#fff", border: 0, borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      onClick={() => createCourseForGroup(entry.slug)}
                    >
                      + Thêm khóa học cho "{entry.title}"
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {childCourses.map((c) => (
                      <span key={c.id} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 10px", background: "#fff", border: "1px solid #dcd3c5", borderRadius: 6, fontSize: 13 }}>
                        {c.imageUrl && <img src={c.imageUrl} alt="" style={{ width: 22, height: 28, objectFit: "cover", borderRadius: 4 }} />}
                        <b>{c.title}</b>
                        <span style={{ color: c.price.toLowerCase().includes("liên hệ") ? "#b45309" : "#047857", fontWeight: 700, fontSize: 12 }}>
                          {c.price}
                        </span>
                        <button
                          type="button"
                          style={{ border: 0, background: "none", color: "#315fe8", cursor: "pointer", fontSize: 12, padding: "0 2px", fontWeight: 700 }}
                          onClick={() => { setSection("course-items"); setDraft(c); }}
                        >
                          ✎ Sửa
                        </button>
                      </span>
                    ))}
                    {childCourses.length === 0 && (
                      <small style={{ color: "#8a7e72" }}>Chưa có khóa học nào. Bấm nút bên phải để thêm khóa học đầu tiên cho bộ môn này.</small>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}</div> : <div className="admin-empty"><b>✦</b><h2>Chưa có nội dung</h2><p>Tạo nội dung đầu tiên cho mục {activeMeta.label}.</p><button className="admin-primary" onClick={startCreate}>+ Tạo nội dung</button></div>}
      </div> : <form className="admin-editor" onSubmit={save}>
        <div className="admin-editor-head"><button type="button" onClick={() => setDraft(null)}>← Danh sách</button><div><small>{draft.id ? "CHỈNH SỬA" : "TẠO MỚI"}</small><h2>{draft.title || activeMeta.label}</h2>{entryHref(draft) && <a className="admin-page-url" href={entryHref(draft)} target="_blank" rel="noreferrer">saotrucauco.com{entryHref(draft)} ↗</a>}</div><button className="admin-primary" disabled={busy}>{busy ? "Đang lưu…" : "Lưu nội dung"}</button></div>
        <div className="admin-form-grid">
          <label className="wide">{isTuitionSettings ? "Học phí Khóa 1 tháng *" : "Tiêu đề *"}<input required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value, slug: draft.slug || slugify(event.target.value) })} placeholder={isTuitionSettings ? "Ví dụ: 2.400.000đ – 3.200.000đ" : undefined} /></label>
          <label className="wide slug-field">Slug (đường dẫn, không dấu) *<span><input required pattern="[a-z0-9-]+" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: slugify(event.target.value) })} /><button type="button" onClick={() => setDraft({ ...draft, slug: slugify(draft.title) })}>Tạo lại</button></span></label>
          <label>Ngày đăng<input type="date" value={draft.publishedAt} onChange={(event) => setDraft({ ...draft, publishedAt: event.target.value })} /></label>
          <label>Thứ tự hiển thị<input type="number" min="0" value={draft.sortOrder} onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })} /></label>
          
          {section === "product-items" ? (
            <label>
              <span>Thuộc nhóm sản phẩm nào? *</span>
              <select
                required
                value={draft.tag}
                onChange={(event) => setDraft({ ...draft, tag: event.target.value })}
                style={{ height: 42, padding: "0 12px", border: "1px solid #ccd2dc", borderRadius: 8, background: "#fff", color: "#20242b", fontSize: 14 }}
              >
                <option value="">-- Chọn nhóm sản phẩm --</option>
                {productGroups.map((group) => (
                  <option key={group.slug} value={group.slug}>
                    {group.title} ({group.slug})
                  </option>
                ))}
              </select>
            </label>
          ) : section === "course-items" ? (
            <label>
              <span>Thuộc nhóm khóa học / Bộ môn nào? *</span>
              <select
                required
                value={draft.tag}
                onChange={(event) => setDraft({ ...draft, tag: event.target.value })}
                style={{ height: 42, padding: "0 12px", border: "1px solid #ccd2dc", borderRadius: 8, background: "#fff", color: "#20242b", fontSize: 14 }}
              >
                <option value="">-- Chọn nhóm khóa học --</option>
                {courseGroups.map((group) => (
                  <option key={group.slug} value={group.slug}>
                    {group.title} ({group.slug})
                  </option>
                ))}
              </select>
            </label>
          ) : section === "single-videos" ? (
            <label>
              <span>Thuộc bộ môn / nhạc cụ nào? *</span>
              <select
                required
                value={draft.tag}
                onChange={(event) => setDraft({ ...draft, tag: event.target.value })}
                style={{ height: 42, padding: "0 12px", border: "1px solid #ccd2dc", borderRadius: 8, background: "#fff", color: "#20242b", fontSize: 14 }}
              >
                <option value="">-- Chọn bộ môn --</option>
                {videoDisciplinesList.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name} ({d.slug})
                  </option>
                ))}
              </select>
            </label>
          ) : section === "curriculums" || section === "sheets" ? (
            <label>
              <span>Thuộc bộ môn / nhạc cụ nào? *</span>
              <select
                required
                value={draft.tag.replace(/^(giao-trinh|sheet):/, "")}
                onChange={(event) => setDraft({ ...draft, tag: event.target.value })}
                style={{ height: 42, padding: "0 12px", border: "1px solid #ccd2dc", borderRadius: 8, background: "#fff", color: "#20242b", fontSize: 14 }}
              >
                <option value="">-- Chọn bộ môn --</option>
                {defaultDisciplinesList.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name} ({d.slug})
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label>{isTuitionSettings ? "Tiêu đề bảng học phí" : (isPaymentSettings ? "Ngân hàng" : fieldMeta.tagLabel || "Phân loại / nhãn")}<input required={isPaymentSettings} value={draft.tag} onChange={(event) => setDraft({ ...draft, tag: event.target.value })} placeholder={isTuitionSettings ? "Ví dụ: Bảng mục học phí" : (isPaymentSettings ? "Ví dụ: STB · Sacombank" : fieldMeta.tagPlaceholder || "Ví dụ: Kỹ thuật")} /></label>
          )}
          
          {isPaymentSettings ? (
            <div className="wide" style={{ display: "grid", gap: 18, borderTop: "2px solid #e2e8f0", paddingTop: 18 }}>
              <div style={{ padding: "14px 18px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 13, color: "#166534", lineHeight: 1.6 }}>
                <b style={{ fontSize: 14 }}>✦ CƠ CHẾ TỰ ĐỘNG TẠO MÃ QR THANH TOÁN (VIETQR):</b>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                  <li>Chỉ cần nhập <b>Ngân hàng</b>, <b>Số tài khoản</b> và <b>Tên chủ tài khoản</b> bên dưới.</li>
                  <li>Khi khách hàng bấm mua bất kỳ <b>Khóa học</b>, <b>Video từng bài</b> hoặc <b>Giáo trình/Sheet</b>, hệ thống sẽ <b>tự động nạp đúng số tiền</b> và <b>nội dung chuyển khoản</b> tương ứng vào mã QR.</li>
                </ul>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <label>
                  <span>Ngân hàng thụ hưởng *</span>
                  <input
                    required
                    value={draft.tag}
                    onChange={(event) => setDraft({ ...draft, tag: event.target.value })}
                    placeholder="Ví dụ: STB · Sacombank"
                  />
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 }}>
                    <small style={{ color: "#64748b", width: "100%", marginBottom: 2 }}>Chọn nhanh ngân hàng:</small>
                    {[
                      { code: "STB · Sacombank", name: "Sacombank" },
                      { code: "MB · MBBank", name: "MB Bank" },
                      { code: "VCB · Vietcombank", name: "Vietcombank" },
                      { code: "TCB · Techcombank", name: "Techcombank" },
                      { code: "VPB · VPBank", name: "VPBank" },
                      { code: "ACB · Á Châu", name: "ACB" },
                      { code: "TPB · TPBank", name: "TPBank" },
                      { code: "BIDV · BIDV", name: "BIDV" },
                      { code: "CTG · VietinBank", name: "VietinBank" },
                      { code: "VBA · Agribank", name: "Agribank" },
                    ].map((b) => (
                      <button
                        key={b.code}
                        type="button"
                        style={{
                          padding: "2px 8px",
                          background: draft.tag.includes(b.name) ? "#eff6ff" : "#f8fafc",
                          color: draft.tag.includes(b.name) ? "#1d4ed8" : "#475569",
                          border: `1px solid ${draft.tag.includes(b.name) ? "#93c5fd" : "#cbd5e1"}`,
                          borderRadius: 4,
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                        onClick={() => setDraft({ ...draft, tag: b.code })}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </label>

                <label>
                  <span>Số tài khoản ngân hàng *</span>
                  <input
                    required
                    inputMode="numeric"
                    value={draft.price}
                    onChange={(event) => setDraft({ ...draft, price: event.target.value })}
                    placeholder="Nhập số tài khoản ngân hàng"
                    style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.05em" }}
                  />
                  <small style={{ color: "#64748b", marginTop: 4 }}>
                    Số tài khoản nhận tiền chuyển khoản của bạn
                  </small>
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <label>
                  <span>Tên chủ tài khoản (viết hoa không dấu) *</span>
                  <input
                    required
                    value={draft.excerpt}
                    onChange={(event) => setDraft({ ...draft, excerpt: event.target.value.toUpperCase() })}
                    placeholder="Ví dụ: QUACH HA VAN"
                    style={{ fontWeight: 700 }}
                  />
                </label>

                <label>
                  <span>Ảnh mã QR tùy chỉnh (tùy chọn)</span>
                  <div className="admin-upload">
                    <input
                      value={draft.imageUrl}
                      onChange={(event) => setDraft({ ...draft, imageUrl: event.target.value })}
                      placeholder="Để trống sẽ tự tạo QR tự động theo VietQR"
                    />
                    <span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) void uploadImage(file);
                        }}
                      />
                      Tải ảnh lên
                    </span>
                  </div>
                </label>
              </div>

              <div style={{ padding: "16px 20px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                <img
                  src={buildVietQrUrl({
                    bank: draft.tag,
                    account: draft.price,
                    accountName: draft.excerpt,
                    amount: "399000",
                    memo: "KHOA_HOC_SAO_TRUC",
                    customImageUrl: draft.imageUrl,
                  })}
                  alt="Xem trước mã QR"
                  style={{ width: 170, height: 170, objectFit: "contain", borderRadius: 8, background: "#fff", padding: 6, border: "1px solid #cbd5e1" }}
                />
                <div style={{ flex: 1, minWidth: 240, display: "grid", gap: 6 }}>
                  <b style={{ color: "#1e293b", fontSize: 15 }}>✦ XEM TRƯỚC MÃ QR VIETQR VỚI SỐ TIỀN MẪU (399.000đ):</b>
                  <p style={{ margin: 0, color: "#475569", fontSize: 13, lineHeight: 1.6 }}>
                    • Ngân hàng: <b>{draft.tag || "(Chưa chọn)"}</b><br />
                    • Số tài khoản: <b>{draft.price || "(Chưa nhập)"}</b><br />
                    • Tên chủ tài khoản: <b>{draft.excerpt || "(Chưa nhập)"}</b><br />
                    • Số tiền test thử: <b>399.000đ</b> <i>(Khi khách mua món nào, số tiền của món đó sẽ tự động điền vào)</i>
                  </p>
                  <small style={{ color: "#059669", fontWeight: 700 }}>
                    ✓ Bạn có thể dùng App ngân hàng quét thử mã QR này ngay trên màn hình để kiểm tra!
                  </small>
                </div>
              </div>
            </div>
          ) : isTuitionSettings ? (
            <div className="wide" style={{ display: "grid", gap: 16, borderTop: "2px solid #e2e8f0", paddingTop: 18 }}>
              <div style={{ padding: "14px 18px", background: "#fdf8f0", border: "1px solid #fde8c3", borderRadius: 8, fontSize: 13, color: "#854d0e", lineHeight: 1.6 }}>
                <b style={{ fontSize: 14 }}>✦ CÀI ĐẶT BẢNG HỌC PHÍ, SỐ BUỔI & LƯU Ý BẢO LƯU:</b>
                <p style={{ margin: "4px 0 0" }}>Các thông tin dưới đây sẽ hiển thị trực tiếp trong khung Bảng học phí ở trang đăng ký học.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <label>
                  <span>Tiêu đề bảng học phí *</span>
                  <input
                    required
                    value={draft.tag}
                    onChange={(event) => setDraft({ ...draft, tag: event.target.value })}
                    placeholder="Ví dụ: Bảng mục học phí"
                  />
                </label>
                <label>
                  <span>Thời gian mỗi buổi học *</span>
                  <input
                    required
                    value={tuitionForm.duration}
                    onChange={(event) => setTuitionForm({ ...tuitionForm, duration: event.target.value })}
                    placeholder="Ví dụ: Thời gian mỗi buổi 60 phút."
                  />
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, background: "#fff", padding: "14px 16px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <label>
                  <span>Khóa 1 tháng - Mức học phí *</span>
                  <input
                    required
                    value={draft.title}
                    onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                    placeholder="Ví dụ: 2.400.000đ – 3.200.000đ"
                  />
                </label>
                <label>
                  <span>Khóa 1 tháng - Số buổi *</span>
                  <input
                    required
                    value={tuitionForm.sessions1}
                    onChange={(event) => setTuitionForm({ ...tuitionForm, sessions1: event.target.value })}
                    placeholder="Ví dụ: 8 buổi"
                  />
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, background: "#fff", padding: "14px 16px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <label>
                  <span>Khóa 2 tháng - Mức học phí *</span>
                  <input
                    required
                    value={draft.excerpt}
                    onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })}
                    placeholder="Ví dụ: 4.800.000đ – 6.400.000đ"
                  />
                </label>
                <label>
                  <span>Khóa 2 tháng - Số buổi *</span>
                  <input
                    required
                    value={tuitionForm.sessions2}
                    onChange={(event) => setTuitionForm({ ...tuitionForm, sessions2: event.target.value })}
                    placeholder="Ví dụ: 16 buổi"
                  />
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, background: "#fff", padding: "14px 16px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <label>
                  <span>Khóa 3 tháng - Mức học phí *</span>
                  <input
                    required
                    value={draft.price}
                    onChange={(event) => setDraft({ ...draft, price: event.target.value })}
                    placeholder="Ví dụ: 7.200.000đ"
                  />
                </label>
                <label>
                  <span>Khóa 3 tháng - Số buổi *</span>
                  <input
                    required
                    value={tuitionForm.sessions3}
                    onChange={(event) => setTuitionForm({ ...tuitionForm, sessions3: event.target.value })}
                    placeholder="Ví dụ: 24 buổi"
                  />
                </label>
              </div>

              <label className="wide">
                <span>Ưu đãi khi đăng ký khóa 2, 3 tháng & Quà tặng MV *</span>
                <textarea
                  rows={2}
                  value={tuitionForm.promo}
                  onChange={(event) => setTuitionForm({ ...tuitionForm, promo: event.target.value })}
                  placeholder="Ví dụ: giảm 10% – 15%, tặng MV Video thổi sáo khi hết khoá."
                />
              </label>

              <label className="wide">
                <span>Lưu ý / Quy định bảo lưu học phí *</span>
                <textarea
                  rows={3}
                  value={tuitionForm.note}
                  onChange={(event) => setTuitionForm({ ...tuitionForm, note: event.target.value })}
                  placeholder="Ví dụ: Học phí đã đăng ký không hoàn lại trong mọi trường hợp. Nếu học viên có việc phát sinh và chưa thể tiếp tục học, số buổi còn lại sẽ được bảo lưu để học viên sắp xếp học lại sau."
                />
              </label>

              <div style={{ padding: "16px 20px", background: "#3d1020", color: "#fff", borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(226,186,115,.3)", paddingBottom: 8, marginBottom: 10 }}>
                  <h4 style={{ margin: 0, color: "#fde8c3", fontSize: 14 }}>✦ {draft.tag || "Bảng mục học phí"}</h4>
                  <span style={{ fontSize: 11, color: "#ffdc94" }}>⏱ {tuitionForm.duration}</span>
                </div>
                <div style={{ display: "grid", gap: 6, fontSize: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "rgba(255,255,255,.05)", borderRadius: 5, borderLeft: "3px solid #e2ba73" }}>
                    <span>Khóa 1 tháng <small style={{ color: "#ffdc94" }}>({tuitionForm.sessions1})</small></span>
                    <b style={{ color: "#ffdc94" }}>{draft.title}</b>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "rgba(255,255,255,.05)", borderRadius: 5, borderLeft: "3px solid #e2ba73" }}>
                    <span>Khóa 2 tháng <small style={{ color: "#ffdc94" }}>({tuitionForm.sessions2})</small></span>
                    <b style={{ color: "#ffdc94" }}>{draft.excerpt}</b>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "rgba(255,255,255,.05)", borderRadius: 5, borderLeft: "3px solid #e2ba73" }}>
                    <span>Khóa 3 tháng <small style={{ color: "#ffdc94" }}>({tuitionForm.sessions3})</small></span>
                    <b style={{ color: "#ffdc94" }}>{draft.price}</b>
                  </div>
                </div>
                <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(143,39,68,.45)", border: "1px solid rgba(226,186,115,.38)", borderRadius: 7, fontSize: 11.5 }}>
                  <div style={{ color: "#ffdc94", fontWeight: 700, marginBottom: 2 }}>🎁 ƯU ĐÃI KHI ĐĂNG KÝ KHÓA 2, 3 THÁNG:</div>
                  <div>{tuitionForm.promo}</div>
                </div>
                <div style={{ marginTop: 8, padding: "7px 10px", background: "rgba(0,0,0,.25)", borderLeft: "3px solid rgba(226,186,115,.6)", borderRadius: 4, fontSize: 11, color: "#eddcd0" }}>
                  <b style={{ color: "#ffdc94" }}>📌 Lưu ý:</b> {tuitionForm.note}
                </div>
              </div>
            </div>
          ) : draft.collection === "page-contact" ? (
            <div className="wide" style={{ display: "grid", gap: 18, borderTop: "2px solid #e2e8f0", paddingTop: 20, marginTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h3 style={{ margin: 0, color: "#7c1c38", fontSize: 16, fontWeight: 800 }}>✦ NỘI DUNG TRANG ĐĂNG KÝ HỌC & TƯ VẤN (/dang-ky-hoc)</h3>
                  <small style={{ color: "#64748b" }}>Chỉnh sửa trực tiếp tiêu đề, thông tin liên hệ, bảng bộ môn và biểu mẫu đăng ký</small>
                </div>
                <a href="/dang-ky-hoc" target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "#7c1c38", textDecoration: "underline" }}>
                  Xem trang thực tế ↗
                </a>
              </div>

              <div style={{ padding: "12px 16px", background: "#fdf8f0", border: "1px solid #fde8c3", borderRadius: 8, fontSize: 13, color: "#854d0e", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <span>💡 <b>Mẹo:</b> Để chỉnh sửa các mức Học phí (1, 2, 3 tháng & Ưu đãi), bạn hãy bấm vào mục <b>Bảng học phí & Ưu đãi</b> ở menu bên trái.</span>
                <button type="button" onClick={() => setSection("tuition")} style={{ padding: "5px 12px", background: "#854d0e", color: "#fff", border: 0, borderRadius: 5, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  Mở Bảng học phí →
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <label>
                  <span>Nhãn nhỏ trên cùng (Eyebrow) *</span>
                  <input
                    value={draft.tag}
                    onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
                    placeholder="Ví dụ: THÔNG TIN LIÊN HỆ"
                  />
                </label>
                <label>
                  <span>Số điện thoại / Hotline / Zalo *</span>
                  <input
                    required
                    value={draft.price}
                    onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                    placeholder="Ví dụ: 0374 261 368"
                    style={{ fontWeight: 700 }}
                  />
                </label>
              </div>

              <div style={{ padding: "16px 18px", background: "#fdf8f4", border: "1px solid #ead7c8", borderRadius: 10, display: "grid", gap: 14 }}>
                <b style={{ color: "#7c1c38", fontSize: 14 }}>✦ 1. THÔNG TIN LIÊN HỆ (CỘT BÊN TRÁI):</b>
                
                <label className="wide">
                  <span>Tiêu đề khối liên hệ (Chữ Vàng Gold) *</span>
                  <input
                    value={contactForm.blockTitle}
                    onChange={(e) => setContactForm({ ...contactForm, blockTitle: e.target.value })}
                    placeholder="Ví dụ: Đăng Kí Học Sáo, Tư Vấn Các Dịch Vụ"
                    style={{ fontWeight: 700 }}
                  />
                </label>

                <label className="wide">
                  <span>Lời giới thiệu & hình thức học *</span>
                  <textarea
                    rows={3}
                    value={contactForm.blockDesc}
                    onChange={(e) => setContactForm({ ...contactForm, blockDesc: e.target.value })}
                    placeholder="Ví dụ: Học tại trung tâm (TP.HCM), gia sư tại nhà hoặc online 1 kèm 1 linh động cho học viên ở xa và nước ngoài."
                  />
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <label>
                    <span>Địa chỉ trung tâm / Lớp học (Hỗ trợ nhiều chi nhánh - mỗi chi nhánh 1 dòng) *</span>
                    <textarea
                      rows={3}
                      value={contactForm.address}
                      onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                      placeholder={"Ví dụ:\n106/72 Hòa Bình, P. Tân Phú, TP.HCM"}
                    />
                  </label>
                  <label>
                    <span>Email nhận thông báo / liên hệ *</span>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="Ví dụ: van17071999@gmail.com"
                    />
                  </label>
                </div>
              </div>

              <div style={{ padding: "16px 18px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, display: "grid", gap: 14 }}>
                <b style={{ color: "#1e293b", fontSize: 14 }}>✦ 2. CÀI ĐẶT FORM & DANH SÁCH BỘ MÔN (CỘT BÊN PHẢI):</b>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <label>
                    <span>Tiêu đề nhóm lựa chọn bộ môn *</span>
                    <input
                      value={contactForm.interestTitle}
                      onChange={(e) => setContactForm({ ...contactForm, interestTitle: e.target.value })}
                      placeholder="Ví dụ: Đăng ký bộ môn or Tư vấn dịch vụ, sản phẩm"
                    />
                  </label>
                  <label>
                    <span>Ghi chú hướng dẫn chọn *</span>
                    <input
                      value={contactForm.interestNote}
                      onChange={(e) => setContactForm({ ...contactForm, interestNote: e.target.value })}
                      placeholder="Ví dụ: (Bấm để chọn nhiều mục)"
                    />
                  </label>
                </div>

                <label className="wide">
                  <span>Danh sách Bộ môn / Dịch vụ để học viên bấm chọn (Mỗi bộ môn 1 dòng) *</span>
                  <textarea
                    rows={6}
                    value={contactForm.interestItems}
                    onChange={(e) => setContactForm({ ...contactForm, interestItems: e.target.value })}
                    placeholder={"Sáo trúc Việt Nam\nSáo Dizi Trung Quốc\nSáo Recorder\nĐộng tiêu & Xiao\nFlute phương Tây\nSáo H'Mông\nSáo mèo & Sáo bầu\nMua sáo & phụ kiện\nKhóa học video quay sẵn\nSheet nhạc & giáo trình\nThu âm & quay MV\nBooking biểu diễn"}
                  />
                  <small style={{ color: "#64748b", marginTop: 4 }}>
                    Học viên có thể bấm chọn một hoặc nhiều bộ môn trong danh sách này trên form đăng ký.
                  </small>
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <label>
                    <span>Chữ trên nút Gửi đăng ký *</span>
                    <input
                      value={contactForm.submitButtonText}
                      onChange={(e) => setContactForm({ ...contactForm, submitButtonText: e.target.value })}
                      placeholder="Ví dụ: GỬI YÊU CẦU ĐĂNG KÝ →"
                    />
                  </label>
                  <label>
                    <span>Thông báo sau khi gửi thành công *</span>
                    <input
                      value={contactForm.successMessage}
                      onChange={(e) => setContactForm({ ...contactForm, successMessage: e.target.value })}
                      placeholder="Ví dụ: Yêu cầu đã được gửi thành công. Sáo Trúc Âu Cơ sẽ liên hệ lại với bạn sớm nhất."
                    />
                  </label>
                </div>
              </div>

              <div style={{ padding: "16px 20px", background: "#fff", border: "1px solid #cbd5e1", borderRadius: 10 }}>
                <small style={{ display: "block", color: "#475569", fontWeight: 800, letterSpacing: "0.08em", marginBottom: 12 }}>
                  ✦ XEM TRƯỚC TRỰC TIẾP KHỐI LIÊN HỆ & FORM ĐĂNG KÝ (LIVE PREVIEW):
                </small>
                <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: 20, padding: 18, background: "#3d1020", color: "#fff", borderRadius: 10 }}>
                  <div>
                    <span style={{ fontSize: 10, color: "#dcb269", letterSpacing: "0.15em", textTransform: "uppercase" }}>{draft.tag || "THÔNG TIN LIÊN HỆ"}</span>
                    <h3 style={{ margin: "8px 0", font: "400 22px Georgia,serif", color: "#e2ba73" }}>{contactForm.blockTitle}</h3>
                    <p style={{ fontSize: 12.5, color: "#edd6d0", lineHeight: 1.55 }}>{contactForm.blockDesc}</p>
                    <ul style={{ paddingLeft: 16, fontSize: 12.5, color: "#eedbd5", margin: "10px 0 0" }}>
                      {(contactForm.address || "").split(/\n+/).map((l, i) => l.trim() && <li key={i}>{l.trim()}</li>)}
                      <li>Hotline / Zalo: <strong style={{ color: "#eed6a1" }}>{draft.price}</strong></li>
                      <li>Email: {contactForm.email}</li>
                    </ul>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.06)", padding: 14, borderRadius: 8, fontSize: 11.5, color: "#edd6d0", display: "flex", flexDirection: "column", gap: 7 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      <div style={{ padding: "6px 8px", background: "rgba(255,255,255,0.1)", borderRadius: 5 }}>Họ và tên</div>
                      <div style={{ padding: "6px 8px", background: "rgba(255,255,255,0.1)", borderRadius: 5 }}>Số điện thoại</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#ffdc94", fontWeight: 700 }}>{contactForm.interestTitle} <small style={{ color: "#ddd" }}>{contactForm.interestNote}</small></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, maxHeight: 110, overflowY: "auto" }}>
                      {(contactForm.interestItems || "").split(/\n+/).map((item, idx) => item.trim() && (
                        <div key={idx} style={{ padding: "4px 6px", background: idx === 0 ? "#7c1c38" : "rgba(255,255,255,0.1)", borderRadius: 4, fontSize: 10 }}>
                          {idx === 0 ? "✓ " : "+ "}{item.trim()}
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: "7px 10px", background: "#8c1c38", borderRadius: 6, color: "#fff", textAlign: "center", fontWeight: 700, fontSize: 11, marginTop: 4 }}>
                      {contactForm.submitButtonText}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : draft.collection === "class-details" ? (
            <div className="wide" style={{ display: "grid", gap: 16, borderTop: "2px solid #e2e8f0", paddingTop: 20, marginTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <h3 style={{ margin: 0, color: "#7c1c38", fontSize: 16, fontWeight: 800 }}>✦ NỘI DUNG BÀI GIỚI THIỆU ĐẦY ĐỦ (/bo-mon/{draft.slug})</h3>
                <a href={`/bo-mon/${draft.slug}`} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#7c1c38", fontWeight: 700, textDecoration: "underline" }}>🔗 Xem bài giới thiệu đầy đủ trên web ↗</a>
              </div>

              <label className="wide">
                <span>Tiêu đề bài viết (Headline lớn) *</span>
                <input 
                  value={classForm.headline} 
                  onChange={(e) => setClassForm({ ...classForm, headline: e.target.value })} 
                  placeholder="Ví dụ: Một lộ trình rõ ràng để chơi nhạc bằng chính cảm xúc của bạn." 
                />
              </label>

              <label className="wide">
                <span>Đoạn văn giới thiệu chi tiết bộ môn</span>
                <textarea 
                  rows={4} 
                  value={classForm.intro} 
                  onChange={(e) => setClassForm({ ...classForm, intro: e.target.value })} 
                  placeholder="Đoạn văn mô tả chi tiết về bộ môn..." 
                />
              </label>

              <label className="wide">
                <span>Bạn sẽ học được gì? (Mỗi dòng một ý hiển thị dấu ✓)</span>
                <textarea 
                  rows={6} 
                  value={classForm.learn} 
                  onChange={(e) => setClassForm({ ...classForm, learn: e.target.value })} 
                  placeholder="Tư thế cầm sáo, khẩu hình và điểm đặt môi&#10;Kiểm soát cột hơi, cao độ và chất lượng âm thanh&#10;Ngón bấm, đánh lưỡi, rung hơi, láy và vuốt..." 
                />
              </label>

              <div className="wide" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label>
                  <span>Lộ trình - Giai đoạn 1 (01)</span>
                  <input value={classForm.stage1} onChange={(e) => setClassForm({ ...classForm, stage1: e.target.value })} placeholder="Giai đoạn 1 · Làm quen & tạo tiếng" />
                </label>
                <label>
                  <span>Lộ trình - Giai đoạn 2 (02)</span>
                  <input value={classForm.stage2} onChange={(e) => setClassForm({ ...classForm, stage2: e.target.value })} placeholder="Giai đoạn 2 · Nốt nhạc & nhịp điệu" />
                </label>
                <label>
                  <span>Lộ trình - Giai đoạn 3 (03)</span>
                  <input value={classForm.stage3} onChange={(e) => setClassForm({ ...classForm, stage3: e.target.value })} placeholder="Giai đoạn 3 · Kỹ thuật biểu cảm" />
                </label>
                <label>
                  <span>Lộ trình - Giai đoạn 4 (04)</span>
                  <input value={classForm.stage4} onChange={(e) => setClassForm({ ...classForm, stage4: e.target.value })} placeholder="Giai đoạn 4 · Hoàn thiện tác phẩm" />
                </label>
              </div>

              <label className="wide">
                <span>Câu trích dẫn / Châm ngôn truyền cảm hứng (Quote)</span>
                <input 
                  value={classForm.quote} 
                  onChange={(e) => setClassForm({ ...classForm, quote: e.target.value })} 
                  placeholder="Ví dụ: Học đúng kỹ thuật để tự do thể hiện cảm xúc — đó là nền tảng của mỗi chương trình giảng dạy." 
                />
              </label>

              <div className="wide" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label>
                  <span>Hình thức học (mỗi dòng một hình thức)</span>
                  <textarea 
                    rows={3} 
                    value={classForm.formats} 
                    onChange={(e) => setClassForm({ ...classForm, formats: e.target.value })} 
                    placeholder="Trực tiếp tại trung tâm&#10;Gia sư tại nhà&#10;Online 1 kèm 1" 
                  />
                </label>
                <label>
                  <span>Thời gian học</span>
                  <input 
                    value={classForm.schedule} 
                    onChange={(e) => setClassForm({ ...classForm, schedule: e.target.value })} 
                    placeholder="Ví dụ: Linh động theo lịch học viên" 
                  />
                </label>
              </div>
            </div>
          ) : draft.collection === "flute-tabs" ? (
            <div className="wide" style={{ display: "grid", gap: 14 }}>
              <div style={{ padding: "14px 18px", background: "#fef8ee", border: "1px solid #e8d7be", borderRadius: 8, fontSize: 13, color: "#613b19", lineHeight: 1.6 }}>
                <b style={{ color: "#7c1c38", fontSize: 14 }}>💡 Hướng dẫn nhập cảm âm chuẩn (2 dòng):</b>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                  <li><b>Dòng 1:</b> Lời bài hát ở trên (Ví dụ: <code>Bèo dạt mây trôi chốn xa xôi</code>).</li>
                  <li><b>Dòng 2:</b> Nốt cảm âm ở dưới (Ví dụ: <code>do2 re2 mi2 sol2 la2 sol2 mi2 re2 do2</code>).</li>
                  <li><b>Tự động đổi quãng:</b> Gõ <code>re2</code>, <code>mi3</code>... website sẽ tự động chuyển thành <b>Rê²</b>, <b>Mi³</b> (dạng số mũ chuẩn).</li>
                  <li><i>(Bạn cũng có thể viết trên cùng 1 dòng ngăn cách bằng dấu <code>|</code>: Lời bài hát | do2 re2 mi2)</i></li>
                </ul>
              </div>

              <label className="wide">
                <span>Lời bài hát & nốt cảm âm *</span>
                <textarea
                  className="content-editor"
                  rows={12}
                  value={draft.content}
                  onChange={(event) => setDraft({ ...draft, content: event.target.value })}
                  placeholder={"Bèo dạt mây trôi chốn xa xôi\ndo2 re2 mi2 sol2 la2 sol2 mi2 re2 do2\n\nAnh ơi em vẫn đợi cánh bèo dạt trôi\nla sol do2 re2 mi2 sol2 re2 do2 la sol"}
                />
              </label>

              {draft.content && (
                <div style={{ marginTop: 4, padding: "16px 20px", background: "#fdfaf4", border: "1px solid #e6dccf", borderRadius: 10 }}>
                  <small style={{ display: "block", color: "#8c5625", fontWeight: 800, letterSpacing: "0.1em", marginBottom: 12 }}>
                    ✦ XEM TRƯỚC HIỂN THỊ CẢM ÂM (LIVE PREVIEW):
                  </small>
                  <div style={{ display: "grid", gap: 10 }}>
                    {parseFluteTab(draft.content).map((row, idx) => (
                      <div key={idx} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 12, alignItems: "start", padding: "10px 14px", background: "#fff", border: "1px solid #eedec9", borderRadius: 8 }}>
                        <span style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #c89d55", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, color: "#7c1c38" }}>
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {row.lyric && <div style={{ color: "#3a2529", fontWeight: 600, fontSize: 15 }}>{row.lyric}</div>}
                          {row.notes && (
                            <div style={{ padding: "6px 12px", background: "#f6ebd9", color: "#7c1c38", fontWeight: 800, fontFamily: "monospace", fontSize: 15, borderRadius: 6, width: "fit-content" }}>
                              {row.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (draft.collection === "articles" || draft.collection === "curriculums" || draft.collection === "sheets" || draft.collection === "course-items") ? (
            <ArticleContentEditor
              value={draft.content}
              onChange={(val) => setDraft({ ...draft, content: val })}
              label={fieldMeta.contentLabel || (draft.collection === "articles" ? "Nội dung bài viết chi tiết *" : "Nội dung chi tiết *")}
              placeholder={draft.collection === "articles" 
                ? "Nhập nội dung bài viết...\n\n- In đậm: **chữ in đậm** hoặc bôi đen bấm nút [B]\n- In nghiêng: *chữ in nghiêng* hoặc bôi đen bấm nút [I]\n- Vừa đậm vừa nghiêng: ***chữ vừa đậm vừa nghiêng*** hoặc bấm [BI]\n- Khoảng cách xuống dòng (Enter) được giữ nguyên 100% khi hiển thị trên website."
                : "Nhập nội dung chi tiết..."}
            />
          ) : (
            <label className="wide">{fieldMeta.contentLabel || "Nội dung"}<textarea className="content-editor" rows={12} value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} placeholder={section.includes("packages") ? "Mỗi dòng là một ý hiển thị trên website." : "Nhập nội dung chi tiết."} /></label>
          )}

          <label className="admin-check wide"><input type="checkbox" checked={draft.visible} onChange={(event) => setDraft({ ...draft, visible: event.target.checked })} />Hiển thị trên website</label>
        </div>
        <footer><button type="button" onClick={() => setDraft(null)}>Hủy</button>{draft.id && <button type="button" className="danger" onClick={() => void remove(draft)}>Xóa nội dung</button>}<button className="admin-primary" disabled={busy}>{busy ? "Đang lưu…" : "Lưu nội dung"}</button></footer>
      </form>}
    </section>
  </main>;
}

function ArticleContentEditor({
  value,
  onChange,
  label = "Nội dung bài viết",
  placeholder = "Nhập nội dung bài viết..."
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(true);

  const wrapOrInsert = (prefix: string, suffix: string, defaultText: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const currentVal = value || "";
    const selected = currentVal.substring(start, end);
    const textToInsert = selected ? `${prefix}${selected}${suffix}` : `${prefix}${defaultText}${suffix}`;
    const nextVal = currentVal.substring(0, start) + textToInsert + currentVal.substring(end);
    onChange(nextVal);

    setTimeout(() => {
      el.focus();
      if (selected) {
        el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
      } else {
        el.setSelectionRange(start + prefix.length, start + prefix.length + defaultText.length);
      }
    }, 10);
  };

  const insertBlockPrefix = (prefix: string, defaultText: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const currentVal = value || "";
    const selected = currentVal.substring(start, end);

    let nextVal = "";
    if (selected) {
      const lines = selected.split("\n");
      const prefixed = lines.map((l) => l.startsWith(prefix) ? l : `${prefix}${l}`).join("\n");
      nextVal = currentVal.substring(0, start) + prefixed + currentVal.substring(end);
      onChange(nextVal);
    } else {
      const needLeadingNewline = start > 0 && currentVal[start - 1] !== "\n";
      const textToInsert = (needLeadingNewline ? "\n" : "") + `${prefix}${defaultText}`;
      nextVal = currentVal.substring(0, start) + textToInsert + currentVal.substring(end);
      onChange(nextVal);
    }

    setTimeout(() => {
      el.focus();
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      if (e.shiftKey) {
        wrapOrInsert("***", "***", "chữ vừa đậm vừa nghiêng");
      } else {
        wrapOrInsert("**", "**", "chữ in đậm");
      }
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") {
      e.preventDefault();
      wrapOrInsert("*", "*", "chữ in nghiêng");
    }
  };

  return (
    <div className="wide article-editor-wrapper">
      <div className="article-editor-top">
        <label className="article-editor-label">{label}</label>
        <div className="article-editor-tabs">
          <button
            type="button"
            className={`article-tab-btn ${!showPreview ? "active" : ""}`}
            onClick={() => setShowPreview(false)}
          >
            ✏️ Soạn thảo
          </button>
          <button
            type="button"
            className={`article-tab-btn ${showPreview ? "active" : ""}`}
            onClick={() => setShowPreview(true)}
          >
            👁️ Soạn thảo & Xem trước (Live)
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="admin-article-toolbar" role="toolbar" aria-label="Công cụ định dạng bài viết">
        <div className="admin-toolbar-group">
          <button
            type="button"
            className="admin-tb-btn"
            title="In đậm (Ctrl+B / Cmd+B)"
            onClick={() => wrapOrInsert("**", "**", "chữ in đậm")}
          >
            <strong style={{ fontSize: 14 }}>B</strong> <span>Đậm</span>
          </button>
          <button
            type="button"
            className="admin-tb-btn"
            title="In nghiêng (Ctrl+I / Cmd+I)"
            onClick={() => wrapOrInsert("*", "*", "chữ in nghiêng")}
          >
            <em style={{ fontSize: 14, fontFamily: "serif" }}>I</em> <span>Nghiêng</span>
          </button>
          <button
            type="button"
            className="admin-tb-btn highlight-bi"
            title="Vừa in nghiêng vừa in đậm (Ctrl+Shift+B)"
            onClick={() => wrapOrInsert("***", "***", "chữ vừa đậm vừa nghiêng")}
          >
            <strong style={{ fontSize: 13 }}><em>BI</em></strong> <span>Đậm & Nghiêng</span>
          </button>
        </div>

        <div className="admin-toolbar-divider" />

        <div className="admin-toolbar-group">
          <button
            type="button"
            className="admin-tb-btn"
            title="Tiêu đề mục lớn (H2)"
            onClick={() => insertBlockPrefix("## ", "Tiêu đề mục lớn")}
          >
            <span className="tb-tag">H2</span> <span>Tiêu đề lớn</span>
          </button>
          <button
            type="button"
            className="admin-tb-btn"
            title="Tiêu đề mục phụ (H3)"
            onClick={() => insertBlockPrefix("### ", "Tiêu đề mục vừa")}
          >
            <span className="tb-tag">H3</span> <span>Tiêu đề vừa</span>
          </button>
        </div>

        <div className="admin-toolbar-divider" />

        <div className="admin-toolbar-group">
          <button
            type="button"
            className="admin-tb-btn"
            title="Danh sách gạch đầu dòng"
            onClick={() => insertBlockPrefix("- ", "Ý thứ nhất")}
          >
            <span>• Danh sách</span>
          </button>
          <button
            type="button"
            className="admin-tb-btn"
            title="Danh sách đánh số"
            onClick={() => insertBlockPrefix("1. ", "Bước thứ nhất")}
          >
            <span>1. Đánh số</span>
          </button>
          <button
            type="button"
            className="admin-tb-btn"
            title="Trích dẫn hoặc lưu ý"
            onClick={() => insertBlockPrefix("> ", "Đoạn trích dẫn hoặc lưu ý quan trọng")}
          >
            <span>❝ Trích dẫn</span>
          </button>
        </div>

        <div className="admin-toolbar-divider" />

        <div className="admin-toolbar-group">
          <button
            type="button"
            className="admin-tb-btn"
            title="Chèn liên kết web"
            onClick={() => wrapOrInsert("[", "](https://saotrucauco.com)", "Tên liên kết")}
          >
            <span>🔗 Link</span>
          </button>
          <button
            type="button"
            className="admin-tb-btn"
            title="Chèn hình ảnh"
            onClick={() => wrapOrInsert("![", "](https://saotrucauco.com/logo.jpg)", "Mô tả hình ảnh")}
          >
            <span>🖼 Ảnh</span>
          </button>
          <button
            type="button"
            className="admin-tb-btn"
            title="Xuống dòng / Tạo khoảng cách trống"
            onClick={() => {
              const el = textareaRef.current;
              if (!el) return;
              const start = el.selectionStart || 0;
              const currentVal = value || "";
              const nextVal = currentVal.substring(0, start) + "\n\n" + currentVal.substring(start);
              onChange(nextVal);
              setTimeout(() => {
                el.focus();
                el.setSelectionRange(start + 2, start + 2);
              }, 10);
            }}
          >
            <span>↵ Dòng trống</span>
          </button>
        </div>
      </div>

      {/* Guide Card */}
      <div className="admin-article-guide">
        <div className="guide-icon">💡</div>
        <div className="guide-text">
          <b>Hướng dẫn định dạng văn bản & khoảng cách:</b>
          <ul>
            <li><b>In đậm:</b> Gõ <code>**chữ in đậm**</code> hoặc bôi đen rồi bấm nút <b>B</b>.</li>
            <li><b>In nghiêng:</b> Gõ <code>*chữ in nghiêng*</code> hoặc bôi đen rồi bấm nút <i>I</i>.</li>
            <li><b>Vừa đậm vừa nghiêng:</b> Gõ <code>***chữ vừa đậm vừa nghiêng***</code> hoặc bấm nút <b><i>BI</i></b>.</li>
            <li><b>Khoảng cách dòng:</b> Mỗi lần nhấn Enter xuống dòng hoặc cách 1 dòng trống, hệ thống sẽ <b>giữ nguyên 100% khoảng cách</b> hiển thị trên website như lúc bạn nhập!</li>
          </ul>
        </div>
      </div>

      {/* Panes */}
      <div className={`admin-editor-panes ${showPreview ? "has-preview" : "no-preview"}`}>
        <div className="editor-input-pane">
          <textarea
            ref={textareaRef}
            className="content-editor article-textarea"
            rows={15}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
          />
        </div>

        {showPreview && (
          <div className="editor-live-pane">
            <div className="live-pane-title">
              <span className="live-indicator" />
              <span>✦ XEM TRƯỚC HIỂN THỊ THỰC TẾ TRÊN WEBSITE (LIVE PREVIEW):</span>
            </div>
            <div className="live-preview-content article-formatted-content">
              {value ? (
                renderArticleFormatting(value)
              ) : (
                <div className="live-preview-empty">Nội dung xem trước sẽ xuất hiện tại đây khi bạn nhập văn bản…</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
