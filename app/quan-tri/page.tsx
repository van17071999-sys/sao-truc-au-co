"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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
  { key: "services", label: "8 mục chính", note: "Các thẻ lớn trên trang chủ" },
  { key: "class-details", label: "Chi tiết lớp học", note: "Từng bộ môn, nội dung học và đối tượng phù hợp", tagLabel: "Biểu tượng", priceLabel: "Phù hợp với", contentLabel: "Nội dung học (mỗi dòng một ý)" },
  { key: "product-groups", label: "Nhóm sáo & phụ kiện", note: "Các nhóm như Sáo ngang, Dizi, Sáo mèo…", tagLabel: "Nhãn phụ", contentLabel: "Nội dung bổ sung" },
  { key: "product-items", label: "Từng sản phẩm", note: "Từng cây sáo hoặc phụ kiện nằm trong một nhóm", tagLabel: "Slug nhóm cha *", tagPlaceholder: "Ví dụ: sao-ngang-viet-nam", priceLabel: "Giá / Liên hệ", contentLabel: "Thông tin bổ sung" },
  { key: "course-groups", label: "Nhóm khóa học", note: "Nhóm theo bộ môn ở trang khóa học quay sẵn", tagLabel: "Nhãn phụ", contentLabel: "Nội dung bổ sung" },
  { key: "course-items", label: "Từng khóa học", note: "Từng nội dung và giá bên trong mỗi nhóm khóa học", tagLabel: "Slug nhóm cha *", tagPlaceholder: "Ví dụ: sao-truc", priceLabel: "Giá khóa học", contentLabel: "Quyền lợi / nội dung bổ sung" },
  { key: "materials", label: "Giáo trình & sheet", note: "Tài liệu bán trên website" },
  { key: "studio-packages", label: "Gói thu âm & video", note: "Từng gói, giá và quyền lợi", tagLabel: "Biểu tượng", priceLabel: "Giá tham khảo", contentLabel: "Quyền lợi (mỗi dòng một ý)" },
  { key: "booking-packages", label: "Gói booking nghệ sĩ", note: "Từng đội hình biểu diễn, giá và quyền lợi", tagLabel: "Biểu tượng", priceLabel: "Giá tham khảo", contentLabel: "Quyền lợi (mỗi dòng một ý)" },
  { key: "recording-instruments", label: "Thu âm nhạc cụ thật", note: "Từng nhạc cụ nhận thu và giá", tagLabel: "Biểu tượng", priceLabel: "Giá từ", contentLabel: "Thông tin bổ sung" },
  { key: "flute-tabs", label: "Cảm âm sáo trúc", note: "Đăng từng bài cảm âm hiển thị trên website", tagLabel: "Tone / nhịp / độ khó", excerptLabel: "Tên đầy đủ của bài", priceLabel: "Thông tin phụ", contentLabel: "Lời và nốt cảm âm (mỗi dòng: Lời | Nốt)" },
  { key: "free-guides", label: "Hướng dẫn miễn phí", note: "Gắn video YouTube, TikTok hoặc bài chia sẻ", tagLabel: "Nền tảng", tagPlaceholder: "YouTube hoặc TikTok", priceLabel: "Chủ đề", contentLabel: "Đường dẫn YouTube / TikTok / bài viết" },
  { key: "articles", label: "Tin tức (Blog)", note: "Bài viết và kiến thức" },
];

const singletons = [
  { key: "settings", label: "Cài đặt chung", note: "Thương hiệu và liên hệ" },
  { key: "page-classes", label: "Trang Lớp học", note: "Nội dung giới thiệu trang" },
  { key: "page-products", label: "Trang Cửa hàng", note: "Nội dung giới thiệu trang" },
  { key: "page-articles", label: "Trang Tin tức", note: "Nội dung giới thiệu trang" },
  { key: "page-courses", label: "Trang Khóa học", note: "Nội dung giới thiệu trang" },
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

async function prepareImage(file: File) {
  if (file.size <= 900 * 1024) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", .78));
  if (!blob) throw new Error("image_processing_failed");
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" });
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

  const activeMeta = [...collections, ...singletons].find((item) => item.key === section)!;
  const isSingleton = singletons.some((item) => item.key === section);
  const sectionEntries = useMemo(
    () => entries.filter((entry) => entry.collection === section).sort((a, b) => a.sortOrder - b.sortOrder),
    [entries, section],
  );

  async function load() {
    const response = await fetch("/api/cms/admin", { credentials: "same-origin" });
    if (response.status === 401) {
      setAuthenticated(false);
      return;
    }
    if (!response.ok) throw new Error("load_failed");
    const data = (await response.json()) as { entries: CmsEntry[] };
    setEntries(data.entries);
    setAuthenticated(true);
  }

  useEffect(() => {
    void load().catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    setDraft(null);
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
      setDraft({ ...sectionEntries[0] });
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
    const response = await fetch("/api/cms/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
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
        <div className="admin-login-mark">♪</div>
        <p>HỒNG VIỆT SÁO TRÚC</p>
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
      <div className="admin-brand"><b>♪</b><span><strong>Hồng Việt</strong><small>Quản trị nội dung</small></span></div>
      <button className="admin-nav-close" onClick={() => setNavOpen(false)}>×</button>
      <a className="admin-dashboard-link" href="/" target="_blank" rel="noreferrer">↗ Xem website</a>
      <p className="admin-nav-title">BỘ SƯU TẬP</p>
      <nav>{collections.map((item) => <button className={section === item.key ? "active" : ""} key={item.key} onClick={() => { setSection(item.key); setNavOpen(false); }}><span>{item.label}</span><small>{entries.filter((entry) => entry.collection === item.key).length}</small></button>)}</nav>
      <p className="admin-nav-title">TRANG ĐƠN</p>
      <nav>{singletons.map((item) => <button className={section === item.key ? "active" : ""} key={item.key} onClick={() => { setSection(item.key); setNavOpen(false); }}><span>{item.label}</span></button>)}</nav>
      <button className="admin-logout" onClick={logout}>Đăng xuất</button>
    </aside>

    <section className="admin-workspace">
      <header className="admin-topbar">
        <button className="admin-menu" onClick={() => setNavOpen(true)}>☰</button>
        <div><small>{isSingleton ? "TRANG ĐƠN" : "BỘ SƯU TẬP"}</small><h1>{activeMeta.label}</h1><p>{activeMeta.note}</p></div>
        {!draft && <button className="admin-primary" onClick={startCreate}>{isSingleton && sectionEntries.length ? "Chỉnh sửa" : "+ Tạo mới"}</button>}
      </header>

      {notice && <div className="admin-notice" role="status">{notice}</div>}

      {!draft ? <div className="admin-list-panel">
        {sectionEntries.length ? <div className="admin-entry-list">{sectionEntries.map((entry) => <article key={entry.id}>
          <div className="admin-entry-image">{entry.imageUrl ? <img src={entry.imageUrl} alt="" /> : <span>♪</span>}</div>
          <div><small>{entry.tag || activeMeta.label} · {entry.publishedAt || "Chưa đặt ngày"}</small><h2>{entry.title}</h2><p>{entry.excerpt || "Chưa có mô tả ngắn"}</p></div>
          <span className={entry.visible ? "status visible" : "status"}>{entry.visible ? "Đang hiển thị" : "Đang ẩn"}</span>
          <div className="admin-row-actions"><button onClick={() => setDraft({ ...entry })}>Sửa</button><button className="danger" onClick={() => void remove(entry)}>Xóa</button></div>
        </article>)}</div> : <div className="admin-empty"><b>✦</b><h2>Chưa có nội dung</h2><p>Tạo nội dung đầu tiên cho mục {activeMeta.label}.</p><button className="admin-primary" onClick={startCreate}>+ Tạo nội dung</button></div>}
      </div> : <form className="admin-editor" onSubmit={save}>
        <div className="admin-editor-head"><button type="button" onClick={() => setDraft(null)}>← Danh sách</button><div><small>{draft.id ? "CHỈNH SỬA" : "TẠO MỚI"}</small><h2>{draft.title || activeMeta.label}</h2></div><button className="admin-primary" disabled={busy}>{busy ? "Đang lưu…" : "Lưu nội dung"}</button></div>
        <div className="admin-form-grid">
          <label className="wide">Tiêu đề *<input required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value, slug: draft.slug || slugify(event.target.value) })} /></label>
          <label className="wide slug-field">Slug (đường dẫn, không dấu) *<span><input required pattern="[a-z0-9-]+" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: slugify(event.target.value) })} /><button type="button" onClick={() => setDraft({ ...draft, slug: slugify(draft.title) })}>Tạo lại</button></span></label>
          <label>Ngày đăng<input type="date" value={draft.publishedAt} onChange={(event) => setDraft({ ...draft, publishedAt: event.target.value })} /></label>
          <label>Thứ tự hiển thị<input type="number" min="0" value={draft.sortOrder} onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })} /></label>
          <label>{"tagLabel" in activeMeta ? activeMeta.tagLabel : "Phân loại / nhãn"}<input required={section === "product-items" || section === "course-items"} value={draft.tag} onChange={(event) => setDraft({ ...draft, tag: event.target.value })} placeholder={"tagPlaceholder" in activeMeta ? activeMeta.tagPlaceholder : "Ví dụ: Kỹ thuật"} /></label>
          <label>{"priceLabel" in activeMeta ? activeMeta.priceLabel : "Giá / thông tin phụ"}<input value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} placeholder="Ví dụ: 399.000đ hoặc Liên hệ" /></label>
          <label className="wide">{"excerptLabel" in activeMeta ? activeMeta.excerptLabel : "Mô tả ngắn"}<textarea rows={3} value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} /></label>
          <label className="wide">Ảnh bìa<div className="admin-upload"><input value={draft.imageUrl} onChange={(event) => setDraft({ ...draft, imageUrl: event.target.value })} placeholder="Dán URL ảnh hoặc tải ảnh lên" /><span><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file); }} />Chọn ảnh</span></div>{draft.imageUrl && <img className="admin-cover-preview" src={draft.imageUrl} alt="Xem trước ảnh bìa" />}</label>
          <label className="wide">{"contentLabel" in activeMeta ? activeMeta.contentLabel : "Nội dung"}<textarea className="content-editor" rows={12} value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} placeholder={section.includes("packages") || section === "class-details" ? "Mỗi dòng là một ý hiển thị trên website." : "Nhập nội dung chi tiết."} /></label>
          <label className="admin-check wide"><input type="checkbox" checked={draft.visible} onChange={(event) => setDraft({ ...draft, visible: event.target.checked })} />Hiển thị trên website</label>
        </div>
        <footer><button type="button" onClick={() => setDraft(null)}>Hủy</button>{draft.id && <button type="button" className="danger" onClick={() => void remove(draft)}>Xóa nội dung</button>}<button className="admin-primary" disabled={busy}>{busy ? "Đang lưu…" : "Lưu nội dung"}</button></footer>
      </form>}
    </section>
  </main>;
}
