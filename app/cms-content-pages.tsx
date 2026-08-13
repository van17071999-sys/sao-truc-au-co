"use client";

import Link from "next/link";
import BrandLogo from "./brand-logo";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
};

function useCmsEntries(collection: string) {
  const [entries, setEntries] = useState<CmsEntry[] | null>(null);
  useEffect(() => {
    let active = true;
    fetch("/api/cms/content")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("cms_unavailable")))
      .then((data: { entries?: CmsEntry[] }) => {
        if (!active) return;
        setEntries((data.entries || [])
          .filter((entry) => entry.collection === collection && entry.visible)
          .sort((a, b) => a.sortOrder - b.sortOrder));
      })
      .catch(() => { if (active) setEntries([]); });
    return () => { active = false; };
  }, [collection]);
  return entries;
}

function ContentHeader() {
  return <header className="article-header">
    <Link className="brand" href="/"><BrandLogo /><span><b>HỒNG VIỆT</b><small>SÁO TRÚC & ÂM NHẠC DÂN TỘC</small></span></Link>
    <nav><Link href="/">Trang chủ</Link><Link href="/tin-tuc">Tin tức</Link><Link href="/cam-am">Cảm âm</Link><Link href="/#contact">Liên hệ</Link></nav>
  </header>;
}

function ContentFooter() {
  return <footer><Link className="brand" href="/"><BrandLogo /><span><b>HỒNG VIỆT</b><small>SÁO TRÚC & ÂM NHẠC DÂN TỘC</small></span></Link><p>Đam mê làm nên giá trị · Chất lượng tạo nên uy tín</p><small>© 2026 Hồng Việt.</small></footer>;
}

function ShareButton({ title }: { title: string }) {
  async function share() {
    if (navigator.share) {
      await navigator.share({ title, url: window.location.href }).catch(() => undefined);
      return;
    }
    await navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
  }
  return <button className="content-share" type="button" onClick={() => void share()}>Chia sẻ bài viết ↗</button>;
}

export function FluteIndex() {
  const entries = useCmsEntries("flute-tabs");
  return <main className="subject-page content-page">
    <ContentHeader />
    <section className="content-list-hero"><p className="eyebrow">LỜI BÀI HÁT · NỐT CẢM ÂM</p><h1>Cảm âm sáo trúc</h1><p>Chọn một bài để mở trang cảm âm riêng, thuận tiện khi luyện tập và chia sẻ.</p></section>
    <section className="content-index">
      {entries === null ? <p className="content-state">Đang tải cảm âm…</p> : entries.length ? <div className="flute-tab-list">{entries.map((entry, index) => <article className="flute-tab" key={entry.id}>
        <Link className="flute-tab-summary" href={`/cam-am/${entry.slug}`}><span><small>BÀI CẢM ÂM {String(index + 1).padStart(2, "0")}</small><b>{entry.title}</b><em>{entry.tag}</em></span><i>→</i></Link>
      </article>)}</div> : <p className="content-state">Chưa có bài cảm âm nào được đăng.</p>}
    </section>
    <ContentFooter />
  </main>;
}

export function FluteDetail() {
  const params = useParams<{ slug: string }>();
  const entries = useCmsEntries("flute-tabs");
  const entry = entries?.find((item) => item.slug === params.slug);
  const rows = useMemo(() => (entry?.content || "").split(/\n+/).map((line) => {
    const separator = line.indexOf("|");
    return separator >= 0
      ? { lyric: line.slice(0, separator).trim(), notes: line.slice(separator + 1).trim() }
      : { lyric: "", notes: line.trim() };
  }).filter((line) => line.lyric || line.notes), [entry]);

  return <main className="subject-page content-page">
    <ContentHeader />
    {entries === null ? <p className="content-state content-detail-state">Đang tải cảm âm…</p> : entry ? <>
      <section className="content-detail-hero"><p className="eyebrow">CẢM ÂM SÁO TRÚC</p><h1>{entry.title}</h1><p>{entry.excerpt}</p><span>{entry.tag}</span></section>
      <article className="content-detail-body">
        <div className="notation-lines">{rows.map((line, index) => <div key={`${entry.id}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><p className="lyric-line">{line.lyric}</p><p className="note-line">{line.notes}</p></div>)}</div>
        <div className="content-detail-actions"><Link href="/cam-am">← Tất cả bài cảm âm</Link><ShareButton title={entry.title} /></div>
      </article>
    </> : <section className="content-state content-detail-state"><h1>Không tìm thấy bài cảm âm</h1><Link href="/cam-am">Quay lại danh sách</Link></section>}
    <ContentFooter />
  </main>;
}

export function NewsIndex() {
  const entries = useCmsEntries("articles");
  return <main className="subject-page content-page">
    <ContentHeader />
    <section className="content-list-hero"><p className="eyebrow">TIN TỨC · BLOG · CHIA SẺ</p><h1>Tin tức</h1><p>Bài viết về sáo trúc, kỹ thuật luyện tập, chọn nhạc cụ và âm nhạc dân tộc.</p></section>
    <section className="content-index">
      {entries === null ? <p className="content-state">Đang tải bài viết…</p> : entries.length ? <div className="article-grid">{entries.map((entry, index) => <article key={entry.id}>
        <div className="article-visual"><span>{String(index + 1).padStart(2, "0")}</span><b>♪</b></div>
        <div className="article-body"><small>{entry.tag} · {entry.publishedAt ? new Date(`${entry.publishedAt}T00:00:00`).toLocaleDateString("vi-VN") : ""}</small><h3>{entry.title}</h3><p>{entry.excerpt}</p><Link href={`/tin-tuc/${entry.slug}`}>Đọc bài viết <span>→</span></Link></div>
      </article>)}</div> : <p className="content-state">Chưa có bài viết nào được đăng.</p>}
    </section>
    <ContentFooter />
  </main>;
}

export function NewsDetail() {
  const params = useParams<{ slug: string }>();
  const entries = useCmsEntries("articles");
  const entry = entries?.find((item) => item.slug === params.slug);
  const paragraphs = (entry?.content || entry?.excerpt || "").split(/\n{2,}|\n/).map((item) => item.trim()).filter(Boolean);

  return <main className="subject-page content-page">
    <ContentHeader />
    {entries === null ? <p className="content-state content-detail-state">Đang tải bài viết…</p> : entry ? <>
      <section className="content-detail-hero"><p className="eyebrow">{entry.tag || "TIN TỨC"}</p><h1>{entry.title}</h1><p>{entry.excerpt}</p><span>{entry.publishedAt ? new Date(`${entry.publishedAt}T00:00:00`).toLocaleDateString("vi-VN") : ""}</span></section>
      <article className="content-detail-body prose-content">{entry.imageUrl && <img src={entry.imageUrl} alt={entry.title} />} {paragraphs.map((paragraph, index) => <p key={`${entry.id}-${index}`}>{paragraph}</p>)}<div className="content-detail-actions"><Link href="/tin-tuc">← Tất cả tin tức</Link><ShareButton title={entry.title} /></div></article>
    </> : <section className="content-state content-detail-state"><h1>Không tìm thấy bài viết</h1><Link href="/tin-tuc">Quay lại tin tức</Link></section>}
    <ContentFooter />
  </main>;
}

export function SalesDetail({ collection, typeLabel, backHref, backLabel }: { collection: string; typeLabel: string; backHref: string; backLabel: string }) {
  const params = useParams<{ slug: string }>();
  const entries = useCmsEntries(collection);
  const entry = entries?.find((item) => item.slug === params.slug);
  const paragraphs = (entry?.content || entry?.excerpt || "").split(/\n{2,}|\n/).map((item) => item.trim()).filter(Boolean);

  useEffect(() => {
    if (!entry) return;
    document.title = `${entry.title} | Hồng Việt Sáo Trúc`;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", entry.excerpt || `${typeLabel} ${entry.title} tại Hồng Việt Sáo Trúc.`);
  }, [entry, typeLabel]);

  const schema = entry ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: entry.title,
    description: entry.excerpt,
    image: entry.imageUrl || undefined,
    category: typeLabel,
    brand: { "@type": "Brand", name: "Hồng Việt Sáo Trúc" },
    offers: entry.price && entry.price.toLocaleLowerCase("vi") !== "liên hệ" ? {
      "@type": "Offer",
      priceCurrency: "VND",
      price: entry.price.replace(/\D/g, ""),
      availability: "https://schema.org/InStock",
      url: typeof window !== "undefined" ? window.location.href : undefined,
    } : undefined,
  } : null;

  return <main className="subject-page content-page sales-detail-page">
    <ContentHeader />
    {entries === null ? <p className="content-state content-detail-state">Đang tải nội dung…</p> : entry ? <>
      <section className="sales-detail-hero">
        <div><p className="eyebrow">{typeLabel.toUpperCase()}</p><h1>{entry.title}</h1><p>{entry.excerpt}</p><div className="sales-detail-price"><small>GIÁ THAM KHẢO</small><strong>{entry.price || "Liên hệ"}</strong></div><Link className="button button-wine" href="/#contact">Gửi yêu cầu tư vấn →</Link></div>
        {entry.imageUrl && <img src={entry.imageUrl} alt={entry.title} />}
      </section>
      <article className="content-detail-body prose-content sales-detail-body">
        <p className="article-kicker">THÔNG TIN CHI TIẾT</p>
        {paragraphs.map((paragraph, index) => <p key={`${entry.id}-${index}`}>{paragraph}</p>)}
        {!paragraphs.length && <p>Nội dung chi tiết đang được cập nhật. Vui lòng gửi yêu cầu để được tư vấn đầy đủ.</p>}
        <div className="content-detail-actions"><Link href={backHref}>← {backLabel}</Link><ShareButton title={entry.title} /></div>
      </article>
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
    </> : <section className="content-state content-detail-state"><h1>Không tìm thấy nội dung</h1><Link href={backHref}>Quay lại {backLabel.toLocaleLowerCase("vi")}</Link></section>}
    <ContentFooter />
  </main>;
}
