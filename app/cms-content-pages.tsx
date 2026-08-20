"use client";

import Link from "next/link";
import BrandLogo from "./brand-logo";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { PaymentModal } from "./service-pages";
import { PriceTag, parsePrice } from "./price-helper";

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

function ContentHeader() {
  const { t } = useLanguage();
  return (
    <>
      <div className="top-contact-bar" aria-label={t("Thông tin liên hệ nhanh", "Quick contact info")}>
        <Link className="top-address" href="/#contact"><span>⌖</span><span>106/72 Hòa Bình, P. Tân Phú, TP.HCM</span></Link>
        <a className="top-phone" href="tel:0374261368"><span>☎</span><span>0374 261 368</span><small>{t("Hotline / Zalo", "Hotline / Zalo")}</small></a>
        <LanguageSwitcher className="lang-switcher-top" compact />
      </div>
      <header className="article-header">
        <Link className="brand" href="/"><BrandLogo /><span><b>{t("SÁO TRÚC ÂU CƠ", "AU CO BAMBOO FLUTE")}</b><small>{t("ÂM NHẠC DÂN TỘC & ĐÀO TẠO CHUYÊN NGHIỆP", "TRADITIONAL MUSIC & PROFESSIONAL TRAINING")}</small></span></Link>
        <nav>
          <Link href="/">{t("Trang chủ", "Home")}</Link>
          <Link href="/bai-viet">{t("Bài viết", "Articles")}</Link>
          <Link href="/cam-am">{t("Cảm âm", "Flute Tabs")}</Link>
          <Link href="/#contact">{t("Liên hệ", "Contact")}</Link>
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
        <div className="content-detail-actions"><Link href="/cam-am">{t("← Tất cả bài cảm âm", "← All Flute Tabs")}</Link><ShareButton title={entry.title} /></div>
      </article>
    </> : <section className="content-state content-detail-state"><h1>{t("Không tìm thấy bài cảm âm", "Flute tab not found")}</h1><Link href="/cam-am">{t("Quay lại danh sách", "Back to list")}</Link></section>}
    <ContentFooter />
  </main>;
}

export function NewsIndex() {
  const { t, translate } = useLanguage();
  const entries = useCmsEntries("articles");
  return <main className="subject-page content-page">
    <ContentHeader />
    <section className="content-list-hero"><p className="eyebrow">{t("BÀI VIẾT · BLOG · CHIA SẺ", "ARTICLES · BLOG · KNOWLEDGE")}</p><h1>{t("Bài viết", "Articles")}</h1><p>{t("Bài viết về sáo trúc, kỹ thuật luyện tập, chọn nhạc cụ và âm nhạc dân tộc.", "Guides on bamboo flute practice, technique mastery, instrument selection, and traditional music.")}</p></section>
    <section className="content-index">
      {entries === null ? <p className="content-state">{t("Đang tải bài viết…", "Loading articles…")}</p> : entries.length ? <div className="article-grid">{entries.map((entry, index) => <article key={entry.id}>
        <div className="article-visual"><span>{String(index + 1).padStart(2, "0")}</span><b>♪</b></div>
        <div className="article-body"><small>{translate(entry.tag)} · {entry.publishedAt ? new Date(`${entry.publishedAt}T00:00:00`).toLocaleDateString("vi-VN") : ""}</small><h3>{translate(entry.title)}</h3><p>{translate(entry.excerpt)}</p><Link href={`/bai-viet/${entry.slug}`}>{t("Đọc bài viết", "Read article")} <span>→</span></Link></div>
      </article>)}</div> : <p className="content-state">{t("Chưa có bài viết nào được đăng.", "No articles published yet.")}</p>}
    </section>
    <ContentFooter />
  </main>;
}

function renderArticleFormatting(source: string): ReactNode[] {
  const normalized = source
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<\/?p[^>]*>/gi, "");
  const pattern = /(<strong>[^]*?<\/strong>|<b>[^]*?<\/b>|<em>[^]*?<\/em>|<i>[^]*?<\/i>|\*\*\*[^]*?\*\*\*|\*\*[^]*?\*\*|__[^]*?__|\*[^*\n]+?\*|_[^_\n]+?_)/gi;

  return normalized.split(pattern).filter(Boolean).map((part, index) => {
    const strongEmphasis = part.match(/^\*\*\*([^]*)\*\*\*$/);
    if (strongEmphasis) return <strong key={index}><em>{renderArticleFormatting(strongEmphasis[1])}</em></strong>;

    const strong = part.match(/^<(?:strong|b)>([^]*)<\/(?:strong|b)>$/i)
      || part.match(/^\*\*([^]*)\*\*$/)
      || part.match(/^__([^]*)__$/);
    if (strong) return <strong key={index}>{renderArticleFormatting(strong[1])}</strong>;

    const emphasis = part.match(/^<(?:em|i)>([^]*)<\/(?:em|i)>$/i)
      || part.match(/^\*([^*\n]+)\*$/)
      || part.match(/^_([^_\n]+)_$/);
    if (emphasis) return <em key={index}>{renderArticleFormatting(emphasis[1])}</em>;

    return part;
  });
}

export function NewsDetail() {
  const { t, translate } = useLanguage();
  const params = useParams<{ slug: string }>();
  const entries = useCmsEntries("articles");
  const entry = entries?.find((item) => item.slug === params.slug);
  const articleContent = translate(entry?.content || entry?.excerpt || "");

  return <main className="subject-page content-page">
    <ContentHeader />
    {entries === null ? <p className="content-state content-detail-state">{t("Đang tải bài viết…", "Loading article…")}</p> : entry ? <>
      <section className="content-detail-hero"><p className="eyebrow">{translate(entry.tag) || t("BÀI VIẾT", "ARTICLE")}</p><h1>{translate(entry.title)}</h1><p>{translate(entry.excerpt)}</p><span>{entry.publishedAt ? new Date(`${entry.publishedAt}T00:00:00`).toLocaleDateString("vi-VN") : ""}</span></section>
      <article className="content-detail-body prose-content">{entry.imageUrl && <img src={entry.imageUrl} alt={entry.title} />}<div className="article-formatted-content">{renderArticleFormatting(articleContent)}</div><div className="content-detail-actions"><Link href="/bai-viet">{t("← Tất cả bài viết", "← All Articles")}</Link><ShareButton title={translate(entry.title)} /></div></article>
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

  const schema = entry ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: entry.title,
    description: entry.excerpt,
    image: entry.imageUrl || undefined,
    category: typeLabel,
    brand: { "@type": "Brand", name: "Sáo Trúc Âu Cơ" },
    offers: showPrice ? {
      "@type": "Offer",
      priceCurrency: "VND",
      price: entry.price.replace(/\D/g, ""),
      availability: "https://schema.org/InStock",
      url: typeof window !== "undefined" ? window.location.href : undefined,
    } : undefined,
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
            {entry.imageUrl && <img src={entry.imageUrl} alt={entry.title} />}
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

  const rawFormats = sections["hinh_thuc_hoc"] || sections["hinh_thuc"];
  const formatItems = rawFormats
    ? rawFormats.split(/\n+/).map((l) => l.trim()).filter(Boolean)
    : ["Trực tiếp tại trung tâm", "Gia sư tại nhà", "Online 1 kèm 1"];

  const schedule = sections["thoi_gian"] || sections["schedule"] || "Linh động theo lịch học viên";

  return { headline, intro, learnItems, pathItems, quote, formatItems, schedule };
}

export function SubjectDetail() {
  const { t, translate } = useLanguage();
  const params = useParams<{ slug: string }>();
  const entries = useCmsEntries("class-details");
  const entry = entries?.find((item) => item.slug === params.slug);
  const fallback = params.slug ? fallbackSubjects[params.slug] : undefined;

  const rawTitle = entry?.title || fallback?.title || "";
  const title = translate(rawTitle);
  const icon = entry?.tag || fallback?.icon || "♫";
  const rawLead = entry?.excerpt || fallback?.lead || "Mang hơi thở dân tộc vào từng giai điệu.";
  const lead = translate(rawLead);
  const rawSuitable = entry?.price || fallback?.suitable || "Người mới bắt đầu hoặc học viên muốn nâng cao khả năng biểu diễn.";
  const suitable = translate(rawSuitable);

  const parsed = useMemo(() => {
    return parseSubjectContent(entry?.content || "", fallback);
  }, [entry, fallback]);

  useEffect(() => {
    if (rawTitle) document.title = `${rawTitle} | Sáo Trúc Âu Cơ`;
  }, [rawTitle]);

  if (entries === null) {
    return <main className="subject-page content-page">
      <ContentHeader />
      <p className="content-state content-detail-state">{t("Đang tải thông tin lớp học…", "Loading course details…")}</p>
      <ContentFooter />
    </main>;
  }

  if (!entry && !fallback) {
    return <main className="subject-page content-page">
      <ContentHeader />
      <section className="content-state content-detail-state"><h1>{t("Không tìm thấy bộ môn", "Discipline not found")}</h1><Link href="/#classes">{t("Quay lại danh sách lớp học", "Back to classes list")}</Link></section>
      <ContentFooter />
    </main>;
  }

  return <main className="subject-page">
    <ContentHeader />
    <section className="subject-hero">
      <div>
        <p className="eyebrow">{t("BÀI GIỚI THIỆU BỘ MÔN", "DISCIPLINE OVERVIEW")}</p>
        <span className="subject-symbol">{icon}</span>
        <h1>{title}</h1>
        <p>{lead}</p>
        <a className="button button-wine" href="#dang-ky">{t("Đăng ký tư vấn →", "Get Consultation →")}</a>
      </div>
    </section>
    <article className="subject-article">
      <div className="article-main">
        <p className="article-kicker">{t("HIỂU VỀ BỘ MÔN", "ABOUT THIS DISCIPLINE")}</p>
        <h2>{translate(parsed.headline)}</h2>
        <p className="article-lead">{translate(parsed.intro)}</p>
        <h3>{t("Bạn sẽ học được gì?", "What will you learn?")}</h3>
        <ul className="learn-list">
          {parsed.learnItems.map((item) => <li key={item}><span>✓</span>{translate(item)}</li>)}
        </ul>
        <h3>{t("Lộ trình học", "Learning Roadmap")}</h3>
        <div className="path-grid">
          {parsed.pathItems.map((item, i) => <div key={item}><b>0{i + 1}</b><span>{translate(item)}</span></div>)}
        </div>
        <blockquote>“{translate(parsed.quote)}”</blockquote>
      </div>
      <aside>
        <div><small>{t("PHÙ HỢP VỚI", "SUITABLE FOR")}</small><p>{suitable}</p></div>
        <div><small>{t("HÌNH THỨC HỌC", "STUDY FORMAT")}</small><ul>{parsed.formatItems.map((f) => <li key={f}>{translate(f)}</li>)}</ul></div>
        <div><small>{t("THỜI GIAN", "SCHEDULE")}</small><p>{translate(parsed.schedule)}</p></div>
      </aside>
    </article>
    <section className="subject-register" id="dang-ky">
      <p className="eyebrow">{t("BẮT ĐẦU HÀNH TRÌNH", "BEGIN YOUR JOURNEY")}</p>
      <h2>{t("Đăng ký học", "Enroll in")} {title}</h2>
      <p>{t("Để lại thông tin tại form đăng ký. Bộ môn sẽ được chọn sẵn khi bạn quay về trang chính.", "Fill in your details in the contact form. This discipline will be preselected on the homepage.")}</p>
      <Link className="button button-wine" href={`/?subject=${encodeURIComponent(rawTitle)}#contact`}>{t("Đi đến form đăng ký →", "Go to enrollment form →")}</Link>
    </section>
    <ContentFooter />
  </main>;
}
