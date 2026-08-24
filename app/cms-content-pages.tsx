"use client";

import Link from "next/link";
import BrandLogo from "./brand-logo";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { PaymentModal, ContactSection } from "./service-pages";
import { PriceTag, parsePrice } from "./price-helper";
import { getDisciplineSeo } from "./discipline-seo-data";

export type CmsEntry = {
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

function useCmsEntries(collection: string, initialEntries?: CmsEntry[]) {
  const [entries, setEntries] = useState<CmsEntry[] | null>(initialEntries || null);
  useEffect(() => {
    let active = true;
    fetch("/api/cms/content")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("cms_unavailable")))
      .then((data: { entries?: CmsEntry[] }) => {
        if (!active) return;
        setEntries((data.entries || [])
          .filter((entry) => {
            if (!entry.visible) return false;
            if (entry.collection === collection) return true;
            if (collection === "curriculums" && (entry.collection === "curriculums" || (entry.collection === "materials" && (entry.tag.startsWith("giao-trinh:") || !entry.tag.startsWith("sheet:"))))) return true;
            if (collection === "sheets" && (entry.collection === "sheets" || (entry.collection === "materials" && entry.tag.startsWith("sheet:")))) return true;
            if (collection === "materials" && (entry.collection === "materials" || entry.collection === "curriculums" || entry.collection === "sheets")) return true;
            return false;
          })
          .sort((a, b) => a.sortOrder - b.sortOrder));
      })
      .catch(() => { if (active) setEntries([]); });
    return () => { active = false; };
  }, [collection]);
  return entries;
}

import { useLanguage, LanguageSwitcher } from "./i18n-context";

function renderAddressLine(line: string) {
  const trimmed = line.trim();
  const match = trimmed.match(/^((?:CN\s*\d+|Chi\s*nhánh\s*\d+|Cơ\s*sở\s*\d+|Trụ\s*sở(?:\s*chính)?):?)\s*(.*)$/i);
  if (match) {
    return (
      <>
        <span className="branch-tag">{match[1]}</span> {match[2]}
      </>
    );
  }
  return trimmed;
}

function ContentHeader() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [addressText, setAddressText] = useState("106/72 Hòa Bình, P. Tân Phú, TP.HCM");
  const [phoneText, setPhoneText] = useState("0374 261 368");

  useEffect(() => {
    let active = true;
    fetch("/api/cms/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { entries?: CmsEntry[] } | null) => {
        if (!active || !data?.entries) return;
        const general = data.entries.find((e) => e.collection === "settings" && e.slug === "general");
        if (general?.content) setAddressText(general.content);
        if (general?.price) setPhoneText(general.price);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const addressLines = (addressText || "106/72 Hòa Bình, P. Tân Phú, TP.HCM")
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <>
      <div className="top-contact-bar" aria-label={t("Thông tin liên hệ nhanh", "Quick contact info")}>
        <Link className="top-address" href="/dang-ky-hoc">
          <span className="top-address-icon">⌖</span>
          <span className="top-address-list">
            {addressLines.length > 0 ? (
              addressLines.map((line, idx) => (
                <span key={idx} className="top-address-line">
                  {renderAddressLine(line)}
                </span>
              ))
            ) : (
              <span className="top-address-line">106/72 Hòa Bình, P. Tân Phú, TP.HCM</span>
            )}
          </span>
        </Link>
        <a className="top-phone" href={`tel:${phoneText.replace(/\D/g, "")}`}>
          <span>☎</span>
          <span>{phoneText}</span>
          <small>{t("Hotline / Zalo", "Hotline / Zalo")}</small>
        </a>
        <LanguageSwitcher className="lang-switcher-top" compact />
      </div>
      <header className="article-header">
        <Link className="brand" href="/"><BrandLogo /><span><b>{t("SÁO TRÚC ÂU CƠ", "AU CO BAMBOO FLUTE")}</b><small>{t("ÂM NHẠC DÂN TỘC & ĐÀO TẠO CHUYÊN NGHIỆP", "TRADITIONAL MUSIC & PROFESSIONAL TRAINING")}</small></span></Link>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={t("Mở menu", "Open menu")} aria-expanded={menuOpen}>☰</button>
        <nav className={menuOpen ? "open" : ""}>
          <Link href="/" onClick={() => setMenuOpen(false)}>{t("Trang chủ", "Home")}</Link>
          <Link href="/bai-viet" onClick={() => setMenuOpen(false)}>{t("Bài viết", "Articles")}</Link>
          <Link href="/huong-dan" onClick={() => setMenuOpen(false)}>{t("Hướng dẫn", "Tutorials")}</Link>
          <Link href="/lop-hoc" onClick={() => setMenuOpen(false)}>{t("Lớp học", "Classes")}</Link>
          <Link href="/cam-am" onClick={() => setMenuOpen(false)}>{t("Cảm âm", "Flute Tabs")}</Link>
          <Link href="/dang-ky-hoc" onClick={() => setMenuOpen(false)}>{t("Liên hệ", "Contact")}</Link>
        </nav>
      </header>
    </>
  );
}

function ContentFooter() {
  const { t } = useLanguage();
  return <footer><Link className="brand" href="/"><BrandLogo /><span><b>{t("SÁO TRÚC ÂU CƠ", "AU CO BAMBOO FLUTE")}</b><small>{t("ÂM NHẠC DÂN TỘC & ĐÀO TẠO CHUYÊN NGHIỆP", "TRADITIONAL MUSIC & PROFESSIONAL TRAINING")}</small></span></Link><p>{t("Đam mê làm nên giá trị · Chất lượng tạo nên uy tín", "Passion creates value · Quality builds trust")}</p><small>{t("© 2026 Sáo Trúc Âu Cơ.", "© 2026 Au Co Bamboo Flute.")}</small></footer>;
}

function ShareButton({ title }: { title: string }) {
  const { t } = useLanguage();
  async function share() {
    if (navigator.share) {
      await navigator.share({ title, url: window.location.href }).catch(() => undefined);
      return;
    }
    await navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
  }
  return <button className="content-share" type="button" onClick={() => void share()}>{t("Chia sẻ bài viết ↗", "Share article ↗")}</button>;
}

const superscriptDigits: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
};

export function formatFluteNoteToken(token: string): string {
  const regex = /^([a-zA-ZđĐáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+)([#b]?)([\d¹²³⁴⁵⁶⁷⁸⁹]+)?$/i;
  const match = token.match(regex);
  if (!match) return token;

  const [, rawName, rawAccidental, rawOctave] = match;
  const normalized = rawName.toLowerCase();

  const noteMap: Record<string, string> = {
    "do": "Đô", "đo": "Đô", "đô": "Đô", "c": "Đô",
    "re": "Rê", "rê": "Rê", "d": "Rê",
    "mi": "Mi", "e": "Mi",
    "fa": "Fa", "f": "Fa",
    "sol": "Sol", "son": "Sol", "g": "Sol",
    "la": "La", "a": "La",
    "si": "Si", "b": "Si",
  };

  const formattedName = noteMap[normalized] || (rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase());
  const accidental = rawAccidental ? (rawAccidental === "#" ? "#" : "b") : "";

  let formattedOctave = "";
  if (rawOctave) {
    formattedOctave = rawOctave.split("").map((digit) => superscriptDigits[digit] || digit).join("");
  }

  return `${formattedName}${accidental}${formattedOctave}`;
}

export function formatFluteNoteLine(line: string): string {
  if (!line) return "";
  return line.replace(/([a-zA-ZđĐáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+[#b]?[\d¹²³⁴⁵⁶⁷⁸⁹]*)/g, (match) => {
    return formatFluteNoteToken(match);
  });
}

export type ParsedTabRow = {
  lyric: string;
  notes: string;
};

export function parseFluteTab(content: string): ParsedTabRow[] {
  if (!content) return [];
  const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];

  const rows: ParsedTabRow[] = [];
  const hasPipe = lines.some((l) => l.includes("|"));

  if (hasPipe) {
    for (const line of lines) {
      const sep = line.indexOf("|");
      if (sep >= 0) {
        rows.push({
          lyric: line.slice(0, sep).trim(),
          notes: formatFluteNoteLine(line.slice(sep + 1).trim()),
        });
      } else {
        rows.push({
          lyric: "",
          notes: formatFluteNoteLine(line),
        });
      }
    }
    return rows;
  }

  for (let i = 0; i < lines.length; i += 2) {
    const lyricLine = lines[i] || "";
    const noteLine = lines[i + 1] || "";
    if (noteLine) {
      rows.push({
        lyric: lyricLine,
        notes: formatFluteNoteLine(noteLine),
      });
    } else {
      const isNoteOnly = /^(?:(?:do|re|rê|mi|fa|sol|son|la|si|đô|c|d|e|f|g|a|b)[#b]?[\d¹²³⁴⁵]?\s*[-–,\/]?\s*)+$/i.test(lyricLine);
      if (isNoteOnly) {
        rows.push({ lyric: "", notes: formatFluteNoteLine(lyricLine) });
      } else {
        rows.push({ lyric: lyricLine, notes: "" });
      }
    }
  }

  return rows;
}

export function FluteIndex() {
  const { t, translate } = useLanguage();
  const entries = useCmsEntries("flute-tabs");
  return <main className="subject-page content-page">
    <ContentHeader />
    <section className="content-list-hero"><p className="eyebrow">{t("LỜI BÀI HÁT · NỐT CẢM ÂM", "LYRICS · FLUTE TABS")}</p><h1>{t("Cảm âm sáo trúc", "Bamboo Flute Tabs")}</h1><p>{t("Chọn một bài để mở trang cảm âm riêng, thuận tiện khi luyện tập và chia sẻ.", "Select a song to open its dedicated tab page with full lyrics and notation.")}</p></section>
    <section className="content-index">
      {entries === null ? <p className="content-state">{t("Đang tải cảm âm…", "Loading flute tabs…")}</p> : entries.length ? <div className="flute-tab-list">{entries.map((entry, index) => <article className="flute-tab" key={entry.id}>
        <Link className="flute-tab-summary" href={`/cam-am/${entry.slug}`}><span><small>{t("BÀI CẢM ÂM", "FLUTE TAB")} {String(index + 1).padStart(2, "0")}</small><b>{entry.title}</b><em>{translate(entry.tag)}</em></span><i>→</i></Link>
      </article>)}</div> : <p className="content-state">{t("Chưa có bài cảm âm nào được đăng.", "No flute tabs published yet.")}</p>}
      <FeaturedReferenceLinks />
    </section>
    <ContentFooter />
  </main>;
}

export function FluteDetail() {
  const { t, translate } = useLanguage();
  const params = useParams<{ slug: string }>();
  const entries = useCmsEntries("flute-tabs");
  const entry = entries?.find((item) => item.slug === params.slug);
  const rows = useMemo(() => parseFluteTab(entry?.content || ""), [entry?.content]);

  return <main className="subject-page content-page">
    <ContentHeader />
    {entries === null ? <p className="content-state content-detail-state">{t("Đang tải cảm âm…", "Loading flute tab…")}</p> : entry ? <>
      <section className="content-detail-hero">
        <p className="eyebrow">{t("CẢM ÂM SÁO TRÚC", "BAMBOO FLUTE TAB")}</p>
        <h1>{entry.title}</h1>
        <p>{entry.excerpt}</p>
        {entry.tag && <span>{entry.tag}</span>}
      </section>
      <article className="content-detail-body">
        <div className="notation-lines">
          {rows.map((row, index) => (
            <div key={`${entry.id}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div className="notation-phrase">
                {row.lyric && <p className="lyric-line">{row.lyric}</p>}
                {row.notes && <p className="note-line">{row.notes}</p>}
              </div>
            </div>
          ))}
        </div>
        <FeaturedReferenceLinks />
        <div className="content-detail-actions"><Link href="/cam-am">{t("← Tất cả bài cảm âm", "← All Flute Tabs")}</Link><ShareButton title={entry.title} /></div>
      </article>
    </> : <section className="content-state content-detail-state"><h1>{t("Không tìm thấy bài cảm âm", "Flute tab not found")}</h1><Link href="/cam-am">{t("Quay lại danh sách", "Back to list")}</Link></section>}
    <ContentFooter />
  </main>;
}

export function NewsIndex({ initialEntries }: { initialEntries?: CmsEntry[] }) {
  const { t, translate } = useLanguage();
  const entries = useCmsEntries("articles", initialEntries);
  return <main className="subject-page content-page">
    <ContentHeader />
    <section className="content-list-hero"><p className="eyebrow">{t("BÀI VIẾT · BLOG · CHIA SẺ", "ARTICLES · BLOG · KNOWLEDGE")}</p><h1>{t("Bài viết", "Articles")}</h1><p>{t("Bài viết về sáo trúc, kỹ thuật luyện tập, chọn nhạc cụ và âm nhạc dân tộc.", "Guides on bamboo flute practice, technique mastery, instrument selection, and traditional music.")}</p></section>
    <section className="content-index">
      {entries === null ? <p className="content-state">{t("Đang tải bài viết…", "Loading articles…")}</p> : entries.length ? <div className="article-grid">{entries.map((entry, index) => <article key={entry.id}>
        <div className={`article-visual ${entry.imageUrl ? "has-image" : ""}`}>
          {entry.imageUrl ? (
            <>
              <img src={entry.imageUrl} alt={entry.title} className="article-visual-img" onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }} />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </>
          ) : (
            <>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>♪</b>
            </>
          )}
        </div>
        <div className="article-body"><small>{translate(entry.tag)} · {entry.publishedAt ? new Date(`${entry.publishedAt}T00:00:00`).toLocaleDateString("vi-VN") : ""}</small><h3>{translate(entry.title)}</h3><p>{translate(entry.excerpt)}</p><Link href={`/bai-viet/${entry.slug}`}>{t("Đọc bài viết", "Read article")} <span>→</span></Link></div>
      </article>)}</div> : <p className="content-state">{t("Chưa có bài viết nào được đăng.", "No articles published yet.")}</p>}
    </section>
    <ContentFooter />
  </main>;
}

export function parseInlineArticleFormatting(source: string): ReactNode[] {
  if (!source) return [];

  const tokenPattern = /(?:<strong\s*>\s*<em\s*>([^]*?)<\/em\s*><\/strong\s*>|<b\s*>\s*<i\s*>([^]*?)<\/i\s*><\/b\s*>|<em\s*>\s*<strong\s*>([^]*?)<\/strong\s*><\/em\s*>|<i\s*>\s*<b\s*>([^]*?)<\/b\s*><\/i\s*>|<strong\s*>\s*<i\s*>([^]*?)<\/i\s*><\/strong\s*>|<b\s*>\s*<em\s*>([^]*?)<\/em\s*><\/b\s*>|\*\*\*([^\*\n]+?)\*\*\*|___([^_\n]+?)___|\*\*\_([^_\n]+?)\_\*\*|\*__([^_\n]+?)__\*|\_\_\*([^\*\n]+?)\*\_\_|\_\*\*([^\*\n]+?)\*\*\_|<strong\b[^>]*>([^]*?)<\/strong\s*>|<b\b[^>]*>([^]*?)<\/b\s*>|\*\*([^\*\n]+?)\*\*|__([^_\n]+?)__|`([^`\n]+?)`|<code\b[^>]*>([^]*?)<\/code\s*>|<em\b[^>]*>([^]*?)<\/em\s*>|<i\b[^>]*>([^]*?)<\/i\s*>|\*([^\*\n]+?)\*|_([^\s_][^_\n]*?[^\s_]|[^_\s])_|<u\b[^>]*>([^]*?)<\/u\s*>|<del\b[^>]*>([^]*?)<\/del\s*>|~~([^~\n]+?)~~|<a\b[^>]*href=["']([^"']+)["'][^>]*>([^]*?)<\/a\s*>|\[([^\]\n]+)\]\((https?:\/\/[^\s\)]+|\/[^\s\)]*)\)|(https?:\/\/[^\s<]+))/gi;

  const result: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(source)) !== null) {
    const matchStart = match.index;
    const matchEnd = tokenPattern.lastIndex;

    if (matchStart > lastIndex) {
      result.push(source.substring(lastIndex, matchStart));
    }

    const [
      fullMatch,
      strongEm1, strongEm2, strongEm3, strongEm4, strongEm5, strongEm6,
      mdBI1, mdBI2, mdBI3, mdBI4, mdBI5, mdBI6,
      htmlStrong1, htmlStrong2, mdBold1, mdBold2,
      inlineCode1, inlineCode2,
      htmlEm1, htmlEm2, mdItalic1, mdItalic2,
      htmlUnderline, htmlDel, mdDel,
      htmlLinkHref, htmlLinkText, mdLinkText, mdLinkHref, rawUrl
    ] = match;

    const boldItalicContent = strongEm1 || strongEm2 || strongEm3 || strongEm4 || strongEm5 || strongEm6 || mdBI1 || mdBI2 || mdBI3 || mdBI4 || mdBI5 || mdBI6;
    const boldContent = htmlStrong1 || htmlStrong2 || mdBold1 || mdBold2;
    const codeContent = inlineCode1 || inlineCode2;
    const italicContent = htmlEm1 || htmlEm2 || mdItalic1 || mdItalic2;
    const underlineContent = htmlUnderline;
    const delContent = htmlDel || mdDel;

    if (boldItalicContent !== undefined) {
      result.push(
        <strong key={`bi-${matchStart}`} className="article-strong-em">
          <em>{parseInlineArticleFormatting(boldItalicContent)}</em>
        </strong>
      );
    } else if (boldContent !== undefined) {
      result.push(
        <strong key={`b-${matchStart}`} className="article-strong">
          {parseInlineArticleFormatting(boldContent)}
        </strong>
      );
    } else if (italicContent !== undefined) {
      result.push(
        <em key={`i-${matchStart}`} className="article-em">
          {parseInlineArticleFormatting(italicContent)}
        </em>
      );
    } else if (codeContent !== undefined) {
      result.push(
        <code key={`code-${matchStart}`} className="article-inline-code">
          {codeContent}
        </code>
      );
    } else if (underlineContent !== undefined) {
      result.push(
        <u key={`u-${matchStart}`}>
          {parseInlineArticleFormatting(underlineContent)}
        </u>
      );
    } else if (delContent !== undefined) {
      result.push(
        <del key={`del-${matchStart}`}>
          {parseInlineArticleFormatting(delContent)}
        </del>
      );
    } else if (htmlLinkHref !== undefined && htmlLinkText !== undefined) {
      result.push(
        <a key={`a-${matchStart}`} href={htmlLinkHref} target={htmlLinkHref.startsWith("http") ? "_blank" : undefined} rel={htmlLinkHref.startsWith("http") ? "noopener noreferrer" : undefined} className="article-inline-link">
          {parseInlineArticleFormatting(htmlLinkText)}
        </a>
      );
    } else if (mdLinkHref !== undefined && mdLinkText !== undefined) {
      result.push(
        <a key={`a-${matchStart}`} href={mdLinkHref} target={mdLinkHref.startsWith("http") ? "_blank" : undefined} rel={mdLinkHref.startsWith("http") ? "noopener noreferrer" : undefined} className="article-inline-link">
          {parseInlineArticleFormatting(mdLinkText)}
        </a>
      );
    } else if (rawUrl !== undefined) {
      result.push(
        <a key={`url-${matchStart}`} href={rawUrl} target="_blank" rel="noopener noreferrer" className="article-inline-link">
          {rawUrl}
        </a>
      );
    } else {
      result.push(fullMatch);
    }

    lastIndex = matchEnd;
  }

  if (lastIndex < source.length) {
    result.push(source.substring(lastIndex));
  }

  return result;
}

export function renderArticleFormatting(source: string): ReactNode[] {
  if (!source) return [];

  const normalized = source
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<\/?p[^>]*>/gi, "");

  const lines = normalized.split("\n");
  const blocks: ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Empty line: preserves exact line spacing from editor!
    if (trimmed === "") {
      blocks.push(
        <div key={`empty-${i}`} className="article-line-break" aria-hidden="true" />
      );
      continue;
    }

    // 2. Headings
    const h1Match = trimmed.match(/^#\s+(.+)$/);
    if (h1Match) {
      blocks.push(
        <h2 key={`h1-${i}`} className="article-heading article-h1">
          {parseInlineArticleFormatting(h1Match[1])}
        </h2>
      );
      continue;
    }

    const h2Match = trimmed.match(/^##\s+(.+)$/);
    if (h2Match) {
      blocks.push(
        <h2 key={`h2-${i}`} className="article-heading article-h2">
          {parseInlineArticleFormatting(h2Match[1])}
        </h2>
      );
      continue;
    }

    const h3Match = trimmed.match(/^###\s+(.+)$/);
    if (h3Match) {
      blocks.push(
        <h3 key={`h3-${i}`} className="article-heading article-h3">
          {parseInlineArticleFormatting(h3Match[1])}
        </h3>
      );
      continue;
    }

    const h4Match = trimmed.match(/^####\s+(.+)$/);
    if (h4Match) {
      blocks.push(
        <h4 key={`h4-${i}`} className="article-heading article-h4">
          {parseInlineArticleFormatting(h4Match[1])}
        </h4>
      );
      continue;
    }

    // 3. Embedded Image ![alt](url)
    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s\)]+|\/[^\s\)]+)\)$/i);
    if (imgMatch) {
      blocks.push(
        <figure key={`img-${i}`} className="article-embedded-figure">
          <img src={imgMatch[2]} alt={imgMatch[1] || "Hình ảnh bài viết"} />
          {imgMatch[1] && <figcaption>{imgMatch[1]}</figcaption>}
        </figure>
      );
      continue;
    }

    // 4. Blockquote
    const quoteMatch = rawLine.match(/^>\s*(.+)$/);
    if (quoteMatch) {
      blocks.push(
        <blockquote key={`quote-${i}`} className="article-blockquote">
          {parseInlineArticleFormatting(quoteMatch[1])}
        </blockquote>
      );
      continue;
    }

    // 5. Bullet list item
    const bulletMatch = rawLine.match(/^(\s*)(?:[-*•]|\+)\s+(.+)$/);
    if (bulletMatch) {
      const indent = bulletMatch[1].length > 0;
      blocks.push(
        <div key={`bullet-${i}`} className={`article-bullet-item ${indent ? "article-bullet-sub" : ""}`}>
          <span className="article-bullet-dot">✦</span>
          <div className="article-bullet-content">{parseInlineArticleFormatting(bulletMatch[2])}</div>
        </div>
      );
      continue;
    }

    // 6. Numbered list item
    const numMatch = rawLine.match(/^(\s*)(\d+)[.)]\s+(.+)$/);
    if (numMatch) {
      blocks.push(
        <div key={`num-${i}`} className="article-num-item">
          <span className="article-num-badge">{numMatch[2]}</span>
          <div className="article-num-content">{parseInlineArticleFormatting(numMatch[3])}</div>
        </div>
      );
      continue;
    }

    // 7. Divider
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push(<hr key={`hr-${i}`} className="article-divider" />);
      continue;
    }

    // 8. Regular text line / paragraph
    blocks.push(
      <p key={`p-${i}`} className="article-paragraph">
        {parseInlineArticleFormatting(rawLine)}
      </p>
    );
  }

  return blocks;
}

export function FeaturedReferenceLinks() {
  const { t, translate } = useLanguage();
  const settingsEntries = useCmsEntries("settings");
  const recommendEntry = settingsEntries?.find((e) => e.slug === "recommend-links");

  const title = recommendEntry?.title || "THAM KHẢO CÁC LỚP HỌC, SẢN PHẨM VÀ GIÁO TRÌNH";
  const defaultItems = [
    { icon: "🎓", badge: "ĐÀO TẠO & KHÓA HỌC", title: "Đăng ký học sáo →", href: "/dang-ky-hoc", isPrimary: true },
    { icon: "🎋", badge: "NHẠC CỤ CHUẨN ÂM", title: "Các sản phẩm sáo →", href: "/sao-va-phu-kien", isPrimary: false },
    { icon: "🎼", badge: "TÀI LIỆU & SHEET NHẠC", title: "Mua tài liệu & sheet →", href: "/giao-trinh-va-sheet", isPrimary: false },
  ];

  let items = defaultItems;
  if (recommendEntry?.content) {
    const lines = recommendEntry.content.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length >= 3) {
      items = lines.slice(0, 3).map((line, idx) => {
        const parts = line.split("|");
        return {
          icon: idx === 0 ? "🎓" : idx === 1 ? "🎋" : "🎼",
          badge: parts[0] || defaultItems[idx].badge,
          title: parts[1] || defaultItems[idx].title,
          href: parts[2] || defaultItems[idx].href,
          isPrimary: idx === 0,
        };
      });
    }
  }

  return (
    <div className="article-featured-links" style={{
      marginTop: 44,
      marginBottom: 32,
      padding: "24px 28px",
      background: "linear-gradient(135deg, #fff9f0, #fcf3e6)",
      border: "1px solid #ebd9c5",
      borderRadius: 14,
      boxShadow: "0 6px 20px rgba(75, 20, 34, 0.04)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 18, color: "#8a243c" }}>✦</span>
        <h3 style={{ margin: 0, fontSize: 16, fontFamily: "Georgia, serif", color: "#63172f", fontWeight: 700, letterSpacing: "0.03em" }}>
          {translate(title)}
        </h3>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {items.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="article-link-card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "15px 18px",
              background: item.isPrimary ? "#63172f" : "#fff",
              color: item.isPrimary ? "#fff" : "#63172f",
              border: item.isPrimary ? "none" : "1px solid #dfc399",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
              boxShadow: item.isPrimary ? "0 4px 12px rgba(99, 23, 47, 0.15)" : "0 2px 8px rgba(75, 20, 34, 0.04)",
              transition: "all 0.2s ease"
            }}
          >
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{ lineHeight: 1.35 }}>
              <span style={{ display: "block", color: item.isPrimary ? "#e8c37c" : "#8a5829", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
                {translate(item.badge)}
              </span>
              <strong style={{ color: item.isPrimary ? "#ffffff" : "#63172f", fontSize: 14 }}>
                {translate(item.title)}
              </strong>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function NewsDetail({ initialEntry }: { initialEntry?: CmsEntry }) {
  const { t, translate } = useLanguage();
  const params = useParams<{ slug: string }>();
  const entries = useCmsEntries("articles", initialEntry ? [initialEntry] : undefined);
  const cmsEntry = entries?.find((item) => item.slug === params.slug);
  const entry = cmsEntry || initialEntry;

  // Ưu tiên nội dung mới chuẩn hóa và loại bỏ sạch sẽ mọi dòng "Nhấp vào liên kết" / "Tham khảo chi tiết"
  let rawContent = (initialEntry && initialEntry.slug === params.slug)
    ? initialEntry.content
    : (entry?.content || entry?.excerpt || "");

  // Lọc sạch toàn bộ dòng "Nhấp vào liên kết" / "Tham khảo chi tiết"
  rawContent = rawContent
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (/^👉?\s*\*(?:Nhấp vào liên kết|Tham khảo chi tiết)/i.test(trimmed)) return false;
      if (/^(?:Nhấp vào liên kết|Tham khảo chi tiết)/i.test(trimmed)) return false;
      return true;
    })
    .join("\n");

  const articleContent = translate(rawContent);

  return <main className="subject-page content-page">
    <ContentHeader />
    {entries === null && !initialEntry ? <p className="content-state content-detail-state">{t("Đang tải bài viết…", "Loading article…")}</p> : entry ? <>
      <section className="content-detail-hero"><p className="eyebrow">{translate(entry.tag) || t("BÀI VIẾT", "ARTICLE")}</p><h1>{translate(entry.title)}</h1><p>{translate(entry.excerpt)}</p><span>{entry.publishedAt ? new Date(`${entry.publishedAt}T00:00:00`).toLocaleDateString("vi-VN") : ""}</span></section>
      <article className="content-detail-body prose-content">
        {entry.imageUrl && <img src={entry.imageUrl} alt={entry.title} onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }} />}
        <div className="article-formatted-content">{renderArticleFormatting(articleContent)}</div>
        <FeaturedReferenceLinks />
        <div className="content-detail-actions">
          <Link href="/bai-viet">{t("← Tất cả bài viết", "← All Articles")}</Link>
          <ShareButton title={translate(entry.title)} />
        </div>
      </article>
    </> : <section className="content-state content-detail-state"><h1>{t("Không tìm thấy bài viết", "Article not found")}</h1><Link href="/bai-viet">{t("Quay lại danh sách bài viết", "Back to articles list")}</Link></section>}
    <ContentFooter />
  </main>;
}

export function SalesDetail({ collection, typeLabel, backHref, backLabel }: { collection: string; typeLabel: string; backHref: string; backLabel: string }) {
  const { t, translate } = useLanguage();
  const params = useParams<{ slug: string }>();
  const entries = useCmsEntries(collection);
  const settingsEntries = useCmsEntries("settings");
  const paymentSettings = settingsEntries?.find((e) => e.slug === "payment");
  const [paymentOpen, setPaymentOpen] = useState(false);

  const entry = entries?.find((item) => item.slug === params.slug);
  const paragraphs = (entry?.content || entry?.excerpt || "").split(/\n{2,}|\n/).map((item) => item.trim()).filter(Boolean);

  useEffect(() => {
    if (!entry) return;
    document.title = `${entry.title} | Sáo Trúc Âu Cơ`;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", entry.excerpt || `${typeLabel} ${entry.title} tại Sáo Trúc Âu Cơ.`);
  }, [entry, typeLabel]);

  const showPrice = Boolean(entry?.price && entry.price.toLowerCase() !== "liên hệ" && entry.price.toLowerCase() !== "contact");
  const cleanTag = entry?.tag?.replace(/^(giao-trinh|sheet):/, "");

  const schema = entry && showPrice ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: entry.title,
    description: entry.excerpt,
    image: entry.imageUrl || undefined,
    category: typeLabel,
    brand: { "@type": "Brand", name: "Sáo Trúc Âu Cơ" },
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: entry.price.replace(/\D/g, ""),
      availability: "https://schema.org/InStock",
      url: typeof window !== "undefined" ? window.location.href : undefined,
    },
  } : null;

  return (
    <main className="subject-page content-page sales-detail-page">
      <ContentHeader />
      {entries === null ? (
        <p className="content-state content-detail-state">{t("Đang tải nội dung…", "Loading content…")}</p>
      ) : entry ? (
        <>
          <section className="sales-detail-hero">
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
                <p className="eyebrow" style={{ margin: 0 }}>{translate(typeLabel).toUpperCase()}</p>
                {cleanTag && (
                  <span style={{ padding: "3px 10px", background: "rgba(124, 28, 56, 0.08)", color: "#7c1c38", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                    {cleanTag}
                  </span>
                )}
              </div>
              <h1>{translate(entry.title)}</h1>
              <p>{translate(entry.excerpt)}</p>
              <div className="sales-detail-price">
                <small>{t("GIÁ TÀI LIỆU", "PRICE")}</small>
                <PriceTag price={entry.price} />
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                {showPrice && (
                  <button className="button button-wine" onClick={() => setPaymentOpen(true)}>
                    {t("Mua ngay qua VietQR", "Buy via VietQR")}
                  </button>
                )}
                <Link className="button button-gold" href={`/dang-ky-hoc?subject=${encodeURIComponent(`${typeLabel} - ${entry.title}`)}`}>
                  {t("Gửi yêu cầu tư vấn →", "Get Consultation →")}
                </Link>
              </div>
            </div>
            {entry.imageUrl && <img src={entry.imageUrl} alt={entry.title} onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }} />}
          </section>

          <article className="content-detail-body prose-content sales-detail-body">
            <p className="article-kicker">{t("THÔNG TIN CHI TIẾT & LỘ TRÌNH", "DETAILED SYLLABUS & INFORMATION")}</p>
            {paragraphs.map((paragraph, index) => (
              <p key={`${entry.id}-${index}`}>{translate(paragraph)}</p>
            ))}
            {!paragraphs.length && (
              <p>{t("Nội dung chi tiết đang được cập nhật. Vui lòng gửi yêu cầu để được tư vấn đầy đủ.", "Detailed description is being updated. Please submit an inquiry for complete information.")}</p>
            )}
            <div className="content-detail-actions">
              <Link href={backHref}>← {translate(backLabel)}</Link>
              <ShareButton title={translate(entry.title)} />
            </div>
          </article>

          <PaymentModal
            isOpen={paymentOpen}
            onClose={() => setPaymentOpen(false)}
            purchaseTitle={`${typeLabel}: ${entry.title}`}
            defaultAmount={entry.price ? parsePrice(entry.price).effectiveAmount : ""}
            paymentBank={paymentSettings?.tag || "STB · Sacombank"}
            paymentAccount={paymentSettings?.price || "030046023451"}
            paymentAccountName={paymentSettings?.excerpt || "QUACH HA VAN"}
            customQrUrl={paymentSettings?.imageUrl}
          />

          {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
        </>
      ) : (
        <section className="content-state content-detail-state">
          <h1>{t("Không tìm thấy nội dung", "Content not found")}</h1>
          <Link href={backHref}>{t("Quay lại danh mục", "Back to catalog")}</Link>
        </section>
      )}
      <ContentFooter />
    </main>
  );
}

const fallbackSubjects: Record<string, { icon: string; title: string; lead: string; intro: string; learn: string[]; path: string[]; suitable: string }> = {
  "sao-truc-viet-nam": { icon: "♫", title: "Sáo trúc Việt Nam", lead: "Mang hơi thở dân tộc vào từng giai điệu.", intro: "Sáo trúc Việt Nam có âm sắc mộc mạc, gần gũi nhưng giàu khả năng biểu cảm. Tại trung tâm, học viên không chỉ học cách thổi đúng nốt mà còn được xây dựng cột hơi, tiếng sáo và tư duy xử lý tác phẩm một cách bài bản.", learn: ["Tư thế cầm sáo, khẩu hình và điểm đặt môi", "Kiểm soát cột hơi, cao độ và chất lượng âm thanh", "Ngón bấm, đánh lưỡi, rung hơi, láy và vuốt", "Đọc nhạc, cảm âm và luyện tập cùng beat", "Xử lý dân ca, nhạc trữ tình và ca khúc hiện đại"], path: ["Giai đoạn 1 · Làm quen & tạo tiếng", "Giai đoạn 2 · Nốt nhạc & nhịp điệu", "Giai đoạn 3 · Kỹ thuật biểu cảm", "Giai đoạn 4 · Hoàn thiện tác phẩm"], suitable: "Người mới bắt đầu, người từng tự học nhưng chưa vững nền tảng, hoặc học viên muốn nâng cao khả năng biểu diễn." },
  "sao-dizi": { icon: "◉", title: "Sáo Dizi", lead: "Âm sắc rực rỡ của những giai điệu cổ phong.", intro: "Dizi tạo dấu ấn bằng màng rung đặc trưng và âm sắc sáng, vang. Khóa học kết hợp kỹ thuật nhạc cụ với cách xử lý tác phẩm Trung Hoa, giúp học viên tạo được màu âm rõ ràng và tự nhiên.", learn: ["Cấu tạo Dizi và cách chọn tone phù hợp", "Dán, căn chỉnh và bảo quản màng rung", "Khẩu hình, cột hơi và hệ thống ngón", "Luyến, láy, vuốt và kỹ thuật cổ phong", "Thực hành nhạc phim và tác phẩm Trung Hoa"], path: ["Giai đoạn 1 · Làm chủ màng rung", "Giai đoạn 2 · Hơi & ngón Dizi", "Giai đoạn 3 · Kỹ thuật cổ phong", "Giai đoạn 4 · Hoàn thiện tác phẩm"], suitable: "Người yêu âm nhạc Trung Hoa, nhạc phim cổ trang và muốn khám phá màu âm Dizi." },
  "sao-recorder": { icon: "♩", title: "Sáo Recorder", lead: "Khởi đầu âm nhạc nhẹ nhàng và đúng phương pháp.", intro: "Recorder dễ tiếp cận nhưng cần nền tảng đúng để tiếng không chói và ngón bấm linh hoạt. Chương trình phù hợp cho trẻ em, người mới và giáo viên âm nhạc cần ứng dụng trong lớp học.", learn: ["Tư thế, hơi thổi nhẹ và âm thanh tròn", "Hệ thống ngón soprano/alto recorder", "Đọc nốt, tiết tấu và ký hiệu âm nhạc", "Độc tấu, song tấu và hòa tấu", "Phương pháp luyện tập và ứng dụng giảng dạy"], path: ["Giai đoạn 1 · Nốt cơ bản", "Giai đoạn 2 · Đọc nhạc", "Giai đoạn 3 · Kỹ thuật & hòa tấu", "Giai đoạn 4 · Biểu diễn"], suitable: "Trẻ em, người mới học, giáo viên phổ thông và giáo viên Steiner/Waldorf." },
  "dong-tieu-xiao": { icon: "♬", title: "Động tiêu & Xiao", lead: "Thanh âm trầm ấm cho những khoảng lặng sâu.", intro: "Động tiêu Việt Nam và Xiao Trung Quốc cùng sử dụng huyệt thổi dọc nhưng có hệ thống ngón và phong cách khác nhau. Học viên được hướng dẫn tạo tiếng trầm ổn định, kiểm soát hơi dài và biểu cảm tinh tế.", learn: ["Tư thế, huyệt thổi và cách tạo tiếng", "Cột hơi dài, âm trầm và chuyển quãng", "Hệ thống ngón động tiêu và Xiao", "Rung, vuốt và xử lý câu nhạc chậm", "Thực hành nhạc thiền và tác phẩm cổ phong"], path: ["Giai đoạn 1 · Tạo tiếng trầm", "Giai đoạn 2 · Hệ thống ngón", "Giai đoạn 3 · Sắc thái", "Giai đoạn 4 · Tác phẩm"], suitable: "Người yêu âm nhạc sâu lắng, cổ phong, thiền định và màu âm trầm ấm." },
  flute: { icon: "♪", title: "Flute", lead: "Âm sắc trong trẻo cùng kỹ thuật phương Tây bài bản.", intro: "Chương trình flute được cá nhân hóa từ nền tảng đến nâng cao. Người học phát triển tư thế đúng, khẩu hình linh hoạt, cao độ ổn định và khả năng đọc bản nhạc để tiến tới các tác phẩm hoàn chỉnh.", learn: ["Lắp nhạc cụ, tư thế và khẩu hình", "Âm dài, cao độ và chuyển quãng", "Gam, arpeggio, etude và kỹ thuật lưỡi", "Đọc bản nhạc và xây dựng nhịp", "Phong cách và xử lý tác phẩm"], path: ["Giai đoạn 1 · Âm thanh nền tảng", "Giai đoạn 2 · Gam & etude", "Giai đoạn 3 · Kỹ thuật", "Giai đoạn 4 · Repertoire"], suitable: "Người mới, học sinh nghệ thuật và người chơi muốn chỉnh sửa hoặc nâng cao kỹ thuật." },
  "sao-hmong": { icon: "❋", title: "Sáo H’Mông", lead: "Chạm vào âm hưởng mộc mạc của núi rừng Tây Bắc.", intro: "Sáo H’Mông sử dụng lam đồng và có màu âm da diết rất riêng. Khóa học đưa người học từ nguyên lý phát âm đến hệ thống ngón và những làn điệu mang đậm bản sắc vùng cao.", learn: ["Cấu tạo và nguyên lý lam đồng", "Tạo tiếng, bẻ lam và kiểm soát hơi", "Hệ thống ngón đặc trưng", "Luyến láy theo phong cách Tây Bắc", "Thực hành làn điệu và tác phẩm"], path: ["Giai đoạn 1 · Làm quen lam", "Giai đoạn 2 · Hơi & ngón", "Giai đoạn 3 · Làn điệu", "Giai đoạn 4 · Biểu diễn"], suitable: "Người yêu âm nhạc dân tộc, văn hóa Tây Bắc và muốn khám phá nhạc cụ mới." },
};

function parseSubjectContent(content: string, fallback?: { lead: string; intro: string; learn: string[]; path: string[]; suitable: string }) {
  const sections: Record<string, string> = {};
  let currentSection = "learn";

  if (content && content.includes("[") && content.includes("]")) {
    const lines = content.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      const match = trimmed.match(/^\[([A-ZÀ-Ỹ0-9\s_]+)\]$/i);
      if (match) {
        currentSection = match[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]/g, "_");
        if (!sections[currentSection]) sections[currentSection] = "";
      } else {
        if (!sections[currentSection]) sections[currentSection] = "";
        sections[currentSection] += (sections[currentSection] ? "\n" : "") + line;
      }
    }
  }

  const headline = sections["tieu_de_bai"] || sections["headline"] || fallback?.lead || "Một lộ trình rõ ràng để chơi nhạc bằng chính cảm xúc của bạn.";
  const intro = sections["gioi_thieu"] || sections["intro"] || fallback?.intro || "";

  const rawWhoIsFor = sections["ai_phu_hop"] || sections["doi_tuong"];
  const whoIsForItems = rawWhoIsFor
    ? rawWhoIsFor.split(/\n+/).map((l) => l.trim().replace(/^[✦✓•\-\*]\s*/, "")).filter(Boolean)
    : undefined;

  const rawLearn = sections["ban_se_hoc_duoc_gi"] || sections["hoc_gi"] || sections["learn"] || (!content.includes("[") ? content : "");
  const learnItems = rawLearn
    ? rawLearn.split(/\n+/).map((l) => l.trim().replace(/^[✓•\-\*]\s*/, "")).filter(Boolean)
    : fallback?.learn || [];

  const rawPath = sections["lo_trinh_hoc"] || sections["lo_trinh"] || sections["path"];
  const pathItems = rawPath
    ? rawPath.split(/\n+/).map((l) => l.trim()).filter(Boolean)
    : fallback?.path || [
        "Giai đoạn 1 · Làm quen & tạo tiếng",
        "Giai đoạn 2 · Nốt nhạc & nhịp điệu",
        "Giai đoạn 3 · Kỹ thuật biểu cảm",
        "Giai đoạn 4 · Hoàn thiện tác phẩm",
      ];

  const quote = sections["trich_dan"] || sections["quote"] || "Học đúng kỹ thuật để tự do thể hiện cảm xúc — đó là nền tảng của mỗi chương trình giảng dạy.";

  const onsiteCustom = sections["hoc_tai_tphcm"] || sections["dao_tao_truc_tiep"] || sections["tphcm"];
  const onlineCustom = sections["hoc_online"] || sections["dao_tao_tu_xa"] || sections["online"];

  const rawFormats = sections["hinh_thuc_hoc"] || sections["hinh_thuc"];
  const formatItems = rawFormats
    ? rawFormats.split(/\n+/).map((l) => l.trim()).filter(Boolean)
    : ["Trực tiếp tại trung tâm", "Gia sư tại nhà", "Online 1 kèm 1"];

  const schedule = sections["thoi_gian"] || sections["schedule"] || "Linh động theo lịch học viên";

  const rawFaqs = sections["cau_hoi_thuong_gap"] || sections["faq"];
  const customFaqs = rawFaqs
    ? rawFaqs.split(/\n\n+/).map((block) => {
        const lines = block.split(/\n/);
        return {
          q: lines[0]?.replace(/^(\?|Q:|Hỏi:)\s*/i, "").trim() || "",
          a: lines.slice(1).join("\n").replace(/^(A:|Đáp:|Trả lời:)\s*/i, "").trim() || "",
        };
      }).filter((item) => item.q && item.a)
    : undefined;

  return { headline, intro, whoIsForItems, learnItems, pathItems, quote, onsiteCustom, onlineCustom, formatItems, schedule, customFaqs };
}

export function SubjectDetail() {
  const { t, translate } = useLanguage();
  const params = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<"all" | "intro" | "course" | "formats" | "tuition" | "faq">("all");
  const entries = useCmsEntries("class-details");
  const settingsEntries = useCmsEntries("settings");
  const entry = entries?.find((item) => item.slug === params.slug);
  const fallback = params.slug ? fallbackSubjects[params.slug] : undefined;
  const seo = params.slug ? getDisciplineSeo(params.slug) : undefined;

  const rawTitle = entry?.title || fallback?.title || "";
  const title = translate(rawTitle);
  const icon = entry?.tag || fallback?.icon || "♫";
  const rawLead = entry?.excerpt || fallback?.lead || "Mang hơi thở dân tộc vào từng giai điệu.";
  const lead = translate(rawLead);
  const rawSuitable = entry?.price || fallback?.suitable || "Người mới bắt đầu hoặc học viên muốn nâng cao khả năng biểu diễn.";
  const suitable = translate(rawSuitable);

  const tuitionEntry = settingsEntries?.find((e) => e.slug === "tuition");

  const parsed = useMemo(() => {
    return parseSubjectContent(entry?.content || "", fallback);
  }, [entry, fallback]);

  useEffect(() => {
    if (params.slug) {
      const disciplineSeo = getDisciplineSeo(params.slug);
      if (disciplineSeo) {
        document.title = disciplineSeo.seoTitle;
        const description = document.querySelector('meta[name="description"]');
        description?.setAttribute("content", disciplineSeo.description);
        return;
      }
    }
    if (rawTitle) document.title = `${rawTitle} | Sáo Trúc Âu Cơ`;
  }, [params.slug, rawTitle]);

  if (entries === null && !fallback) {
    return (
      <main className="subject-page content-page">
        <ContentHeader />
        <p className="content-state content-detail-state">{t("Đang tải thông tin lớp học…", "Loading course details…")}</p>
        <ContentFooter />
      </main>
    );
  }

  if (!entry && !fallback) {
    return (
      <main className="subject-page content-page">
        <ContentHeader />
        <section className="content-state content-detail-state">
          <h1>{t("Không tìm thấy bộ môn", "Discipline not found")}</h1>
          <Link href="/#classes">{t("Quay lại danh sách lớp học", "Back to classes list")}</Link>
        </section>
        <ContentFooter />
      </main>
    );
  }

  const h1Title = seo?.h1Title || `Lớp Học ${title} tại TP.HCM & Online`;
  const whatIsTitle = seo?.whatIsTitle || `${title} là gì?`;
  const whoIsForTitle = seo?.whoIsForTitle || `Ai phù hợp học ${seo?.instrumentShortName || title}?`;
  const courseContentTitle = seo?.courseContentTitle || `Nội dung khóa học ${seo?.instrumentShortName || title}`;
  const roadmapTitle = seo?.roadmapTitle || "Lộ trình học từ cơ bản đến nâng cao";
  const onsiteTitle = seo?.onsiteTitle || `Học ${seo?.instrumentShortName || title} tại TP.HCM`;
  const onlineTitle = seo?.onlineTitle || `Học ${seo?.instrumentShortName || title} online`;
  const tuitionTitle = seo?.tuitionTitle || "Học phí và lịch học";
  const faqTitle = seo?.faqTitle || "Câu hỏi thường gặp";

  const effectiveWhoIsFor = (parsed.whoIsForItems && parsed.whoIsForItems.length > 0) ? parsed.whoIsForItems : seo?.whoIsForContent;
  const effectiveFaqs = (parsed.customFaqs && parsed.customFaqs.length > 0) ? parsed.customFaqs : seo?.faqs;

  return (
    <main className="subject-page">
      <ContentHeader />

      <article className="subject-article" style={{ maxWidth: 1250, margin: "0 auto", padding: "28px clamp(14px, 3vw, 24px)", display: "grid", gridTemplateColumns: "1fr 310px", gap: 20 }}>
        <div className="article-main" id="subject-content-view" style={{ maxWidth: "100%", display: "grid", gap: 18 }}>
          
          {/* KHỐI HERO BỘ MÔN (Nằm gọn trong cột chính bên trái, thẳng hàng hoàn hảo với các thẻ bên dưới) */}
          <section className="subject-hero" style={{ padding: "28px 24px 22px", minHeight: "auto", background: "radial-gradient(circle at 85% 20%, rgba(214, 173, 102, 0.22), transparent 40%), linear-gradient(120deg, #f7ecde, #fffaf1)", border: "1px solid var(--line)", borderRadius: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <span style={{ display: "grid", placeItems: "center", width: 40, height: 40, border: "1px solid var(--gold)", borderRadius: "50%", fontSize: 20, color: "var(--wine)", background: "#fff", flexShrink: 0 }}>
                  {icon}
                </span>
                <p className="eyebrow" style={{ margin: 0, fontSize: 11 }}>{t("BÀI GIỚI THIỆU BỘ MÔN & ĐÀO TẠO", "DISCIPLINE OVERVIEW & COURSES")}</p>
              </div>
              <h1 style={{ fontSize: "clamp(24px, 3.8vw, 42px)", lineHeight: 1.2, margin: "0 0 12px", color: "var(--wine)", fontFamily: "Georgia, serif" }}>
                {h1Title}
              </h1>

              {/* Hướng dẫn và Lưới tab 2 dọc 3 ngang */}
              <div style={{ margin: "4px 0 0", paddingTop: 10, borderTop: "1px dashed rgba(124, 28, 56, 0.18)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 13 }}>💡</span>
                  <b style={{ fontSize: 12.5, color: "#7c1c38", letterSpacing: "0.02em" }}>
                    {t("Hướng dẫn: Bấm để xem nhanh", "Guide: Tap to view quickly")}
                  </b>
                </div>

                <nav style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(activeTab === "intro" ? "all" : "intro")}
                    style={{
                      padding: "8px 4px",
                      border: activeTab === "intro" ? "1px solid #7c1c38" : "1px solid rgba(124, 28, 56, 0.18)",
                      borderRadius: 8,
                      fontSize: "clamp(10.5px, 2.7vw, 12.5px)",
                      fontWeight: 700,
                      textAlign: "center",
                      cursor: "pointer",
                      background: activeTab === "intro" ? "#7c1c38" : "#fff",
                      color: activeTab === "intro" ? "#fff" : "#63172f",
                      boxShadow: "0 2px 5px rgba(124, 28, 56, 0.04)",
                      minHeight: 38,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1.25,
                    }}
                  >
                    ✦ 1. Giới thiệu
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab(activeTab === "course" ? "all" : "course")}
                    style={{
                      padding: "8px 4px",
                      border: activeTab === "course" ? "1px solid #7c1c38" : "1px solid rgba(124, 28, 56, 0.18)",
                      borderRadius: 8,
                      fontSize: "clamp(10.5px, 2.7vw, 12.5px)",
                      fontWeight: 700,
                      textAlign: "center",
                      cursor: "pointer",
                      background: activeTab === "course" ? "#7c1c38" : "#fff",
                      color: activeTab === "course" ? "#fff" : "#63172f",
                      boxShadow: "0 2px 5px rgba(124, 28, 56, 0.04)",
                      minHeight: 38,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1.25,
                    }}
                  >
                    ✦ 2. Khóa học & Lộ trình
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab(activeTab === "formats" ? "all" : "formats")}
                    style={{
                      padding: "8px 4px",
                      border: activeTab === "formats" ? "1px solid #7c1c38" : "1px solid rgba(124, 28, 56, 0.18)",
                      borderRadius: 8,
                      fontSize: "clamp(10.5px, 2.7vw, 12.5px)",
                      fontWeight: 700,
                      textAlign: "center",
                      cursor: "pointer",
                      background: activeTab === "formats" ? "#7c1c38" : "#fff",
                      color: activeTab === "formats" ? "#fff" : "#63172f",
                      boxShadow: "0 2px 5px rgba(124, 28, 56, 0.04)",
                      minHeight: 38,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1.25,
                    }}
                  >
                    ✦ 3. Địa chỉ học và học online
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab(activeTab === "tuition" ? "all" : "tuition")}
                    style={{
                      padding: "8px 4px",
                      border: activeTab === "tuition" ? "1px solid #7c1c38" : "1px solid rgba(124, 28, 56, 0.18)",
                      borderRadius: 8,
                      fontSize: "clamp(10.5px, 2.7vw, 12.5px)",
                      fontWeight: 700,
                      textAlign: "center",
                      cursor: "pointer",
                      background: activeTab === "tuition" ? "#7c1c38" : "#fff",
                      color: activeTab === "tuition" ? "#fff" : "#63172f",
                      boxShadow: "0 2px 5px rgba(124, 28, 56, 0.04)",
                      minHeight: 38,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1.25,
                    }}
                  >
                    ✦ 4. Học phí & Lịch học
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab(activeTab === "faq" ? "all" : "faq")}
                    style={{
                      padding: "8px 4px",
                      border: activeTab === "faq" ? "1px solid #7c1c38" : "1px solid rgba(124, 28, 56, 0.18)",
                      borderRadius: 8,
                      fontSize: "clamp(10.5px, 2.7vw, 12.5px)",
                      fontWeight: 700,
                      textAlign: "center",
                      cursor: "pointer",
                      background: activeTab === "faq" ? "#7c1c38" : "#fff",
                      color: activeTab === "faq" ? "#fff" : "#63172f",
                      boxShadow: "0 2px 5px rgba(124, 28, 56, 0.04)",
                      minHeight: 38,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1.25,
                    }}
                  >
                    ✦ 5. Câu hỏi thường gặp
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("all")}
                    style={{
                      padding: "8px 4px",
                      border: activeTab === "all" ? "1px solid #7c1c38" : "1px dashed rgba(124, 28, 56, 0.4)",
                      borderRadius: 8,
                      fontSize: "clamp(10.5px, 2.7vw, 12.5px)",
                      fontWeight: 700,
                      textAlign: "center",
                      cursor: "pointer",
                      background: activeTab === "all" ? "#7c1c38" : "#fffdf8",
                      color: activeTab === "all" ? "#fff" : "#7c1c38",
                      boxShadow: "0 2px 5px rgba(124, 28, 56, 0.04)",
                      minHeight: 38,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1.25,
                    }}
                  >
                    ✦ 6. Xem tất cả
                  </button>
                </nav>
              </div>
            </div>
          </section>
          
          {(activeTab === "all" || activeTab === "intro") && (
            <div id="tong-quan" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              <section className="subject-section" id="gioi-thieu" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: "20px 22px", display: "flex", flexDirection: "column" }}>
                <p className="article-kicker" style={{ margin: "0 0 4px", fontSize: 10 }}>{t("TỔNG QUAN NHẠC CỤ", "INSTRUMENT OVERVIEW")}</p>
                <h2 style={{ fontSize: 20, margin: "0 0 10px", lineHeight: 1.3, color: "var(--wine)" }}>{whatIsTitle}</h2>
                {parsed.headline && parsed.headline !== whatIsTitle && (
                  <p style={{ fontSize: 13.5, margin: "0 0 8px", color: "#8a243c", fontStyle: "italic", fontWeight: 600 }}>
                    {translate(parsed.headline)}
                  </p>
                )}
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: "#5a4542", flex: 1 }}>
                  {translate(parsed.intro)}
                </p>
                {seo?.whatIsContent && seo.whatIsContent !== parsed.intro && (
                  <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.6, color: "#6a524e" }}>
                    {seo.whatIsContent}
                  </p>
                )}
              </section>

              <section className="subject-section" id="doi-tuong" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: "20px 22px", display: "flex", flexDirection: "column" }}>
                <p className="article-kicker" style={{ margin: "0 0 4px", fontSize: 10 }}>{t("ĐỐI TƯỢNG HỌC VIÊN", "TARGET LEARNERS")}</p>
                <h2 style={{ fontSize: 20, margin: "0 0 10px", lineHeight: 1.3, color: "var(--wine)" }}>{whoIsForTitle}</h2>
                <p style={{ margin: "0 0 10px", fontSize: 13.5, lineHeight: 1.6, color: "#5a4542" }}>{suitable}</p>
                {effectiveWhoIsFor && effectiveWhoIsFor.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6, color: "#5a4542", display: "grid", gap: 5 }}>
                    {effectiveWhoIsFor.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          )}

          {(activeTab === "all" || activeTab === "course") && (
            <div id="khoa-hoc" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              {/* H2 - 3: Nội dung khóa học */}
              <section className="subject-section" id="noi-dung" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: "20px 22px" }}>
                <p className="article-kicker" style={{ margin: "0 0 4px", fontSize: 10 }}>{t("CHƯƠNG TRÌNH ĐÀO TẠO", "COURSE CURRICULUM")}</p>
                <h2 style={{ fontSize: 20, margin: "0 0 12px", lineHeight: 1.3, color: "var(--wine)" }}>{courseContentTitle}</h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 7 }}>
                  {parsed.learnItems.map((item) => (
                    <li key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "7px 10px", background: "#fffaf1", borderRadius: 6, fontSize: 13, color: "#5a4542", border: "1px solid rgba(226,186,115,0.3)" }}>
                      <span style={{ color: "#7c1c38", fontWeight: 800, marginTop: 1 }}>✓</span>
                      <span>{translate(item)}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* H2 - 4: Lộ trình học từ cơ bản đến nâng cao */}
              <section className="subject-section" id="lo-trinh" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: "20px 22px", display: "flex", flexDirection: "column" }}>
                <p className="article-kicker" style={{ margin: "0 0 4px", fontSize: 10 }}>{t("LỘ TRÌNH ĐÀO TẠO", "LEARNING ROADMAP")}</p>
                <h2 style={{ fontSize: 20, margin: "0 0 12px", lineHeight: 1.3, color: "var(--wine)" }}>{roadmapTitle}</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, flex: 1 }}>
                  {parsed.pathItems.map((item, i) => (
                    <div key={item} style={{ padding: "8px 10px", background: "#f5ebdd", borderRadius: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                      <b style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#8a5829" }}>0{i + 1}</b>
                      <span style={{ fontSize: 12, color: "#54383d", lineHeight: 1.35 }}>{translate(item)}</span>
                    </div>
                  ))}
                </div>
                {parsed.quote && (
                  <blockquote style={{ margin: "12px 0 0", padding: "8px 12px", borderLeft: "3px solid var(--gold)", background: "#fffaf1", color: "var(--wine)", fontSize: 12.5, fontStyle: "italic", lineHeight: 1.5 }}>
                    “{translate(parsed.quote)}”
                  </blockquote>
                )}
              </section>
            </div>
          )}

          {/* KHỐI 3 (Lưới 2 cột): Học tại TP.HCM & Học Online */}
          {(activeTab === "all" || activeTab === "formats") && (
            <div id="hinh-thuc" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              {/* H2 - 5: Học tại TP.HCM */}
              <section className="subject-section" id="tai-tphcm" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: "20px 22px" }}>
                <p className="article-kicker" style={{ margin: "0 0 4px", fontSize: 10 }}>{t("ĐÀO TẠO TRỰC TIẾP", "ONSITE LEARNING")}</p>
                <h2 style={{ fontSize: 20, margin: "0 0 10px", lineHeight: 1.3, color: "var(--wine)" }}>{onsiteTitle}</h2>
                <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.55, color: "#5a4542" }}>
                  {parsed.onsiteCustom || seo?.onsiteContent || `Khóa học trực tiếp tại TP.HCM được tổ chức tại trung tâm Sáo Trúc Âu Cơ và gia sư 1 kèm 1 tại nhà học viên ở các quận.`}
                </p>
                <div style={{ display: "grid", gap: 6, fontSize: 12.5, color: "#5a4542" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span>📍</span>
                    <span><b>Địa chỉ:</b> 106/72 Hòa Bình, P. Tân Phú, TP.HCM</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span>🏡</span>
                    <span><b>Gia sư tại nhà:</b> Nhận kèm 1:1 các quận TP.HCM</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span>🎵</span>
                    <span><b>Phòng học:</b> Cách âm, chuẩn âm mẫu, máy đo cao độ</span>
                  </div>
                </div>
              </section>

              {/* H2 - 6: Học online */}
              <section className="subject-section" id="online" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: "20px 22px" }}>
                <p className="article-kicker" style={{ margin: "0 0 4px", fontSize: 10 }}>{t("ĐÀO TẠO TỪ XA", "ONLINE 1 ON 1")}</p>
                <h2 style={{ fontSize: 20, margin: "0 0 10px", lineHeight: 1.3, color: "var(--wine)" }}>{onlineTitle}</h2>
                <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.55, color: "#5a4542" }}>
                  {parsed.onlineCustom || seo?.onlineContent || `Khóa học Online 1 kèm 1 qua Zoom / Google Meet / Zalo Video chất lượng cao cho học viên ở xa hoặc nước ngoài.`}
                </p>
                <div style={{ display: "grid", gap: 6, fontSize: 12.5, color: "#5a4542" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span>💻</span>
                    <span><b>Hình thức:</b> Video HD 1 kèm 1, chỉnh khẩu hình từng phút</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span>🎥</span>
                    <span><b>Học liệu:</b> Video bài giảng + Sheet nét xem lại trọn đời</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span>🌍</span>
                    <span><b>Phù hợp:</b> Học viên toàn quốc và kiều bào nước ngoài</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* KHỐI 4 (Toàn chiều rộng): Học phí và lịch học */}
          {(activeTab === "all" || activeTab === "tuition") && (
            <section className="subject-section" id="hoc-phi" style={{
              background: "linear-gradient(135deg, #fffaf1, #fcedd8)",
              border: "1px solid #e2ba73",
              borderRadius: 12,
              padding: "20px 22px",
              boxShadow: "0 4px 16px rgba(75, 20, 34, 0.05)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                <div>
                  <p className="article-kicker" style={{ margin: "0 0 3px", fontSize: 10 }}>{t("CHI PHÍ & THỜI GIAN", "TUITION & SCHEDULE")}</p>
                  <h2 style={{ fontSize: 22, margin: 0, color: "var(--wine)" }}>{tuitionTitle}</h2>
                </div>
                <div style={{ fontSize: 12.5, color: "#705d59" }}>
                  ⏱ <b>60 phút/buổi</b> · 📅 <b>Lịch học:</b> {translate(parsed.schedule)}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                <div style={{ background: "#fff", padding: "12px 14px", borderRadius: 8, borderLeft: "4px solid #7c1c38" }}>
                  <small style={{ color: "#7c1c38", fontWeight: 700, textTransform: "uppercase", fontSize: 10.5 }}>Khóa 1 Tháng (8 buổi)</small>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#63172f", margin: "3px 0 2px" }}>
                    {tuitionEntry?.title || "2.400.000đ – 3.200.000đ"}
                  </div>
                  <span style={{ fontSize: 11.5, color: "#705d59" }}>Tạo tiếng & nốt cơ bản</span>
                </div>
                <div style={{ background: "#fff", padding: "12px 14px", borderRadius: 8, borderLeft: "4px solid #c99238" }}>
                  <small style={{ color: "#c99238", fontWeight: 700, textTransform: "uppercase", fontSize: 10.5 }}>Khóa 2 Tháng (16 buổi)</small>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#63172f", margin: "3px 0 2px" }}>
                    {tuitionEntry?.excerpt || "4.800.000đ – 6.400.000đ"}
                  </div>
                  <span style={{ fontSize: 11.5, color: "#705d59" }}>Kỹ thuật & tác phẩm</span>
                </div>
                <div style={{ background: "#fff", padding: "12px 14px", borderRadius: 8, borderLeft: "4px solid #7c1c38" }}>
                  <small style={{ color: "#7c1c38", fontWeight: 700, textTransform: "uppercase", fontSize: 10.5 }}>Khóa 3 Tháng (24 buổi)</small>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#63172f", margin: "3px 0 2px" }}>
                    {tuitionEntry?.price || "7.200.000đ"}
                  </div>
                  <span style={{ fontSize: 11.5, color: "#705d59" }}>Biểu diễn & cảm âm</span>
                </div>
              </div>

              <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(124, 28, 56, 0.08)", borderRadius: 6, fontSize: 12, color: "#63172f", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                <span>🎁 <b>Ưu đãi:</b> Giảm 10% – 15% khi đăng ký khóa 2–3 tháng và tặng MV Video tốt nghiệp!</span>
                <a href="#dang-ky" style={{ padding: "4px 10px", background: "#7c1c38", color: "#fff", borderRadius: 4, textDecoration: "none", fontWeight: 700, fontSize: 11.5 }}>
                  Đăng ký ngay →
                </a>
              </div>
            </section>
          )}

          {/* KHỐI 5 (Lưới 2 cột FAQ): Câu hỏi thường gặp */}
          {(activeTab === "all" || activeTab === "faq") && (
            <section className="subject-section" id="faq" style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: "20px 22px" }}>
              <p className="article-kicker" style={{ margin: "0 0 4px", fontSize: 10 }}>{t("GIẢI ĐÁP THẮC MẮC", "FREQUENTLY ASKED QUESTIONS")}</p>
              <h2 style={{ fontSize: 20, margin: "0 0 12px", color: "var(--wine)" }}>{faqTitle}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
                {(effectiveFaqs || [
                  {
                    q: `Chưa biết gì về nhạc lý có học ${title} được không?`,
                    a: "Hoàn toàn được. Lộ trình được cá nhân hóa cho người mới bắt đầu từ con số 0, giúp bạn tạo tiếng và cảm âm dễ hiểu nhất.",
                  },
                  {
                    q: "Học viên chưa có nhạc cụ thì trung tâm có hỗ trợ không?",
                    a: "Bạn được mượn nhạc cụ tại lớp để luyện tập và được giáo viên kiểm tra, tư vấn chọn cây sáo chuẩn âm tốt nhất.",
                  },
                  {
                    q: "Nếu bận việc đột xuất có được bảo lưu hoặc học bù không?",
                    a: "Học viên được bảo lưu số buổi còn lại và linh động sắp xếp học bù theo thời gian rảnh.",
                  },
                ]).map((faq, idx) => (
                  <div key={idx} style={{ background: "#fffaf1", border: "1px solid var(--line)", borderRadius: 8, padding: "12px 14px" }}>
                    <h3 style={{ margin: "0 0 4px", fontSize: 14, color: "#63172f", fontFamily: "Georgia, serif" }}>
                      ❓ {faq.q}
                    </h3>
                    <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: "#705d59" }}>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* CỘT PHẢI: Sticky Widget */}
        <aside style={{ position: "sticky", top: 95, alignSelf: "start", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#fffaf1", border: "1px solid var(--line)", borderRadius: 10, padding: 16 }}>
            <small style={{ color: "var(--gold)", fontSize: 9, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>{t("HÌNH THỨC HỌC", "STUDY FORMAT")}</small>
            <ul style={{ margin: "6px 0 0", paddingLeft: 16, fontSize: 12.5, color: "#5a4542", lineHeight: 1.55 }}>
              {parsed.formatItems.map((f) => <li key={f}>{translate(f)}</li>)}
            </ul>
          </div>

          <div style={{ background: "linear-gradient(135deg, #7c1c38, #591024)", color: "#fff", borderRadius: 10, padding: "16px 18px" }}>
            <small style={{ color: "#fce3b8", fontSize: 9.5, fontWeight: 700, letterSpacing: ".12em" }}>{t("TƯ VẤN NHANH", "QUICK INQUIRY")}</small>
            <h4 style={{ margin: "4px 0 4px", color: "#fff", fontSize: 14.5 }}>Hotline & Zalo</h4>
            <a href="tel:0374261368" style={{ color: "#fce3b8", fontSize: 17, fontWeight: 800, textDecoration: "none", display: "block" }}>
              0374 261 368
            </a>
            <p style={{ fontSize: 11, color: "#f3d2bb", margin: "4px 0 10px", lineHeight: 1.35 }}>
              Nhận bài kiểm tra khẩu hình và tư vấn lộ trình học miễn phí!
            </p>
            <a href="#dang-ky" className="button button-gold" style={{ width: "100%", textAlign: "center", display: "block", padding: "7px 12px", fontSize: 12.5 }}>
              Đăng ký ngay ↓
            </a>
          </div>
        </aside>
      </article>

      <div className="contact-page-container" style={{ margin: "16px 0 0", width: "100%" }}>
        <ContactSection initialSubject={rawTitle} id="dang-ky" />
      </div>

      <div style={{ maxWidth: 1250, margin: "0 auto", padding: "0 20px 36px", width: "100%" }}>
        <FeaturedReferenceLinks />
      </div>

      <ContentFooter />
    </main>
  );
}

export function GuideIndex() {
  const { t, translate } = useLanguage();
  const entries = useCmsEntries("free-guides");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fallbackGuides: CmsEntry[] = [
    {
      id: "guide-01",
      collection: "free-guides",
      title: "Cách lấy hơi và tạo tiếng sáo tròn, rõ",
      slug: "cach-lay-hoi-va-tao-tieng-sao-tron-ro",
      tag: "YouTube",
      price: "Sáo trúc căn bản",
      excerpt: "Hướng dẫn kỹ thuật lấy hơi bằng cơ hoành, khẩu hình chuẩn và cách tạo luồng hơi ổn định khi mới học.",
      content: "https://www.youtube.com/@saotrucauco",
      imageUrl: "/carousel-saotruc.webp",
      visible: true,
      sortOrder: 1,
      publishedAt: "2026-08-01",
    },
    {
      id: "guide-02",
      collection: "free-guides",
      title: "Mẹo sửa lỗi xì tiếng và rung ngón",
      slug: "meo-sua-loi-xi-tieng-va-rung-ngon",
      tag: "TikTok",
      price: "Mẹo luyện tập nhanh",
      excerpt: "Video ngắn chia sẻ mẹo khắc phục lỗi xì tiếng sáo, cách đặt môi êm và linh hoạt ngón tay.",
      content: "https://www.tiktok.com/@saotrucauco",
      imageUrl: "/carousel-dizi.webp",
      visible: true,
      sortOrder: 2,
      publishedAt: "2026-08-05",
    },
    {
      id: "guide-03",
      collection: "free-guides",
      title: "Chọn sáo tone nào cho người mới bắt đầu?",
      slug: "chon-sao-tone-nao-cho-nguoi-moi-bat-dau",
      tag: "Bài viết",
      price: "Kiến thức chuyên sâu",
      excerpt: "So sánh chi tiết ưu nhược điểm của các tone sáo C5, A4, G4 để người mới lựa chọn phù hợp nhất.",
      content: "/bai-viet/nguoi-moi-chon-sao-tone-nao",
      imageUrl: "/carousel-tieu.webp",
      visible: true,
      sortOrder: 3,
      publishedAt: "2026-08-10",
    },
  ];

  const guideList = (entries && entries.length > 0) ? entries : (entries === null ? null : fallbackGuides);

  const filtered = (guideList || []).filter((item) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "youtube" && (item.tag || "").toLowerCase().includes("youtube")) ||
      (filter === "tiktok" && (item.tag || "").toLowerCase().includes("tiktok")) ||
      (filter === "article" && ((item.tag || "").toLowerCase().includes("bài viết") || (item.tag || "").toLowerCase().includes("kỹ thuật") || (!(item.tag || "").toLowerCase().includes("youtube") && !(item.tag || "").toLowerCase().includes("tiktok"))));
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      item.tag.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="subject-page content-page">
      <ContentHeader />
      <section className="content-list-hero">
        <p className="eyebrow">{t("CHIA SẺ KIẾN THỨC · VIDEO & BÀI HƯỚNG DẪN", "KNOWLEDGE SHARING · VIDEOS & TUTORIALS")}</p>
        <h1>{t("Hướng dẫn & Video", "Tutorials & Videos")}</h1>
        <p>{t("Tổng hợp các bài viết hướng dẫn chi tiết, video bài giảng YouTube và clip mẹo luyện sáo TikTok từ Sáo Trúc Âu Cơ.", "Collection of detailed guides, YouTube video lessons, and TikTok flute practice tips by Au Co Bamboo Flute.")}</p>
      </section>
      <section className="content-index" style={{ paddingTop: 30 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div className="recorded-tabs" role="tablist" style={{ margin: 0 }}>
            <button role="tab" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
              {t("✦ Tất cả", "✦ All")}
            </button>
            <button role="tab" className={filter === "youtube" ? "active" : ""} onClick={() => setFilter("youtube")}>
              {t("▶ Video YouTube", "▶ YouTube Videos")}
            </button>
            <button role="tab" className={filter === "tiktok" ? "active" : ""} onClick={() => setFilter("tiktok")}>
              {t("♪ Video TikTok", "♪ TikTok Videos")}
            </button>
            <button role="tab" className={filter === "article" ? "active" : ""} onClick={() => setFilter("article")}>
              {t("✎ Bài hướng dẫn", "✎ Written Guides")}
            </button>
          </div>
          <div style={{ position: "relative", minWidth: 240, maxWidth: 360, flex: "1 1 240px" }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Tìm kiếm hướng dẫn, video...", "Search guides, videos...")}
              style={{
                width: "100%",
                padding: "10px 16px 10px 36px",
                borderRadius: 24,
                border: "1px solid rgba(124,28,56,0.25)",
                background: "#fffaf1",
                fontSize: 14,
                color: "#47101e",
                outline: "none",
              }}
            />
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8a243d", pointerEvents: "none" }}>⌕</span>
          </div>
        </div>

        {guideList === null ? (
          <p className="content-state">{t("Đang tải danh sách hướng dẫn…", "Loading guides…")}</p>
        ) : filtered.length ? (
          <div className="free-guides-grid" style={{ marginTop: 0 }}>
            {filtered.map((guide) => {
              const isYouTube = (guide.tag || "").toLowerCase().includes("youtube");
              const isTikTok = (guide.tag || "").toLowerCase().includes("tiktok");
              const icon = isYouTube ? "▶" : isTikTok ? "♪" : "✎";
              const targetHref = guide.content && (guide.content.startsWith("http") || guide.content.startsWith("/"))
                ? guide.content
                : `/huong-dan/${guide.slug}`;
              const isExternal = targetHref.startsWith("http");

              return (
                <article key={guide.id} style={{ display: "flex", flexDirection: "column" }}>
                  <div className="guide-visual">
                    <span>{icon}</span>
                    <small>{translate(guide.tag) || (isYouTube ? "YouTube" : isTikTok ? "TikTok" : "Bài viết")}</small>
                  </div>
                  <div className="guide-copy" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <small>{translate(guide.price) || t("Hướng dẫn miễn phí", "Free Guide")}</small>
                    <h3 style={{ fontSize: 20, margin: "8px 0 10px", lineHeight: 1.35 }}>{translate(guide.title)}</h3>
                    <p style={{ flex: 1, minHeight: 60 }}>{translate(guide.excerpt)}</p>
                    <a
                      href={targetHref}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      style={{ marginTop: "auto" }}
                    >
                      {isYouTube
                        ? t("Xem video trên YouTube ↗", "Watch on YouTube ↗")
                        : isTikTok
                        ? t("Xem video trên TikTok ↗", "Watch on TikTok ↗")
                        : t("Xem chi tiết hướng dẫn →", "Read full guide →")}
                      <span>→</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="content-state">{t("Không tìm thấy hướng dẫn phù hợp.", "No matching guides found.")}</p>
        )}

        <div className="free-guides-note" style={{ marginTop: 45 }}>
          <span>✦</span>
          <p>
            <b>{t("Bạn muốn được hướng dẫn trực tiếp?", "Want personal flute coaching?")}</b>
            <small>
              {t(
                "Đăng ký tham gia lớp học 1 kèm 1 (Trực tiếp hoặc Online) để được giảng viên theo sát và chỉnh sửa kỹ thuật chuẩn xác nhất.",
                "Join our 1-on-1 flute coaching (In-person or Online) to get direct feedback from our master instructors."
              )}
            </small>
          </p>
          <Link href="/dang-ky-hoc" className="button button-gold" style={{ textDecoration: "none", alignSelf: "center" }}>
            {t("Đăng ký học ngay →", "Enroll Now →")}
          </Link>
        </div>
      </section>
      <ContentFooter />
    </main>
  );
}

export function GuideDetail() {
  const { t, translate } = useLanguage();
  const params = useParams<{ slug: string }>();
  const entries = useCmsEntries("free-guides");
  const entry = entries?.find((item) => item.slug === params.slug);

  if (entries === null) {
    return (
      <main className="subject-page content-page">
        <ContentHeader />
        <p className="content-state content-detail-state">{t("Đang tải hướng dẫn…", "Loading guide…")}</p>
        <ContentFooter />
      </main>
    );
  }

  if (!entry) {
    return (
      <main className="subject-page content-page">
        <ContentHeader />
        <section className="content-state content-detail-state">
          <h1>{t("Không tìm thấy bài hướng dẫn", "Guide not found")}</h1>
          <Link href="/huong-dan">{t("Quay lại danh sách hướng dẫn", "Back to guides list")}</Link>
        </section>
        <ContentFooter />
      </main>
    );
  }

  const isExternalVideo = entry.content && entry.content.startsWith("http");

  return (
    <main className="subject-page content-page">
      <ContentHeader />
      <section className="content-detail-hero">
        <p className="eyebrow">{translate(entry.tag) || t("HƯỚNG DẪN", "TUTORIAL")}</p>
        <h1>{translate(entry.title)}</h1>
        <p>{translate(entry.excerpt)}</p>
        {entry.publishedAt && <span>{new Date(`${entry.publishedAt}T00:00:00`).toLocaleDateString("vi-VN")}</span>}
      </section>
      <article className="content-detail-body prose-content">
        {entry.imageUrl && <img src={entry.imageUrl} alt={entry.title} onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }} />}
        {isExternalVideo ? (
          <div style={{ margin: "24px 0", textAlign: "center", padding: "30px 20px", background: "rgba(124,28,56,0.06)", borderRadius: 12 }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#621730", marginBottom: 16 }}>
              {t("Video hướng dẫn có sẵn trên nền tảng:", "Video tutorial is available on:")} {entry.tag}
            </p>
            <a href={entry.content} target="_blank" rel="noopener noreferrer" className="button button-gold" style={{ display: "inline-block", textDecoration: "none" }}>
              {t("Bấm để xem video ngay ↗", "Click to watch video now ↗")}
            </a>
          </div>
        ) : (
          <div className="article-formatted-content">{renderArticleFormatting(translate(entry.content || entry.excerpt || ""))}</div>
        )}
        <FeaturedReferenceLinks />
        <div className="content-detail-actions">
          <Link href="/huong-dan">{t("← Tất cả hướng dẫn & video", "← All Guides & Videos")}</Link>
          <ShareButton title={translate(entry.title)} />
        </div>
      </article>
      <ContentFooter />
    </main>
  );
}
