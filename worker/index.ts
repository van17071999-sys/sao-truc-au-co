/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  CMS_ADMIN_PASSWORD?: string;
  CMS_SESSION_SECRET?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

type CmsRow = {
  id: string;
  collection: string;
  title: string;
  slug: string;
  published_at: string;
  excerpt: string;
  image_url: string;
  tag: string;
  price: string;
  content: string;
  visible: number;
  sort_order: number;
  updated_at: string;
};

const CMS_COOKIE = "hongviet_cms_session";
const CMS_COLLECTIONS = new Set([
  "services", "classes", "products", "materials", "articles", "courses",
  "settings", "page-classes", "page-products", "page-articles", "page-courses",
]);

const initialCmsEntries = [
  ["service-01", "services", "Lớp học các bộ môn", "classes", "Sáo trúc, Dizi, sáo nứa, sáo mèo, recorder và các bộ môn dân tộc.", "/carousel-saotruc.webp", "♫", "", "Xem lớp học", 1],
  ["service-02", "services", "Đăng ký lớp học", "contact", "Học tại trung tâm, gia sư tại nhà hoặc online 1 kèm 1 với lịch linh động.", "/carousel-recorder.webp", "⌂", "", "Đăng ký ngay", 2],
  ["service-03", "services", "Sáo & phụ kiện", "products", "Sáo trúc chuẩn âm, Dizi, sáo nứa, sáo mèo cùng phụ kiện được tuyển chọn.", "/carousel-dizi.webp", "◌", "", "Khám phá", 3],
  ["service-04", "services", "Khóa học quay sẵn", "courses", "Video bài giảng HD từ nhập môn đến nâng cao, học mọi lúc và xem lại trọn đời.", "/carousel-tieu.webp", "▶", "", "Xem khóa học", 4],
  ["service-05", "services", "Giáo trình & sheet", "materials", "Giáo trình kỹ thuật, sheet nhạc và bản chuyển soạn theo yêu cầu biểu diễn.", "/carousel-flute.webp", "▤", "Từ 50.000đ / sheet", "Xem tài liệu", 5],
  ["service-06", "services", "Thu âm & quay video", "studio", "Thu âm, mixing, quay hình và dựng video chỉn chu cho học viên, nghệ sĩ.", "/hero-flute.webp", "◉", "Từ 900.000đ", "Xem các gói", 6],
  ["service-07", "services", "Booking nghệ sĩ", "booking", "Độc tấu sáo, hòa tấu và ban nhạc dân tộc cho sự kiện, sân khấu, lễ hội.", "/carousel-saotruc.webp", "♬", "", "Xem gói booking", 7],
  ["service-08", "services", "Thu âm nhạc cụ thật", "instrument-recording", "Sáo, đàn tranh, đàn bầu, đàn nhị và nhiều nhạc cụ dân tộc khác.", "/carousel-dizi.webp", "≋", "Từ 500.000đ / track", "Xem dịch vụ thu", 8],
  ["article-01", "articles", "5 bước tạo tiếng sáo trong và ổn định", "5-buoc-tao-tieng-sao", "Từ tư thế, khẩu hình đến luồng hơi — nền tảng dành cho người mới bắt đầu.", "", "Kỹ thuật", "", "", 1],
  ["article-02", "articles", "Người mới nên bắt đầu với sáo tone nào?", "nguoi-moi-chon-sao-tone-nao", "So sánh sáo Đô C5, La A4 và Sol G4 để chọn cây sáo phù hợp với mục tiêu học.", "", "Chọn nhạc cụ", "", "", 2],
  ["article-03", "articles", "Cách luyện hơi dài mà không bị căng", "cach-luyen-hoi-dai", "Một lịch tập ngắn, an toàn và hiệu quả để cải thiện cột hơi mỗi ngày.", "", "Luyện tập", "", "", 3],
  ["settings-general", "settings", "HỒNG VIỆT", "general", "Sáo trúc & âm nhạc dân tộc", "/hero-flute.webp", "vanquach999x@gmail.com", "0374 261 368", "106/72 Hòa Bình, P. Tân Phú, TP.HCM", 1],
] as const;

function normalizeCmsRow(row: CmsRow) {
  return {
    id: row.id,
    collection: row.collection,
    title: row.title,
    slug: row.slug,
    publishedAt: row.published_at,
    excerpt: row.excerpt,
    imageUrl: row.image_url,
    tag: row.tag,
    price: row.price,
    content: row.content,
    visible: Boolean(row.visible),
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
  };
}

async function ensureCmsSchema(db: D1Database) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS cms_entries (
      id TEXT PRIMARY KEY,
      collection TEXT NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      published_at TEXT NOT NULL DEFAULT '',
      excerpt TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT '',
      tag TEXT NOT NULL DEFAULT '',
      price TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      visible INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS cms_collection_idx ON cms_entries(collection, visible, sort_order)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS cms_assets (
      id TEXT PRIMARY KEY,
      content_type TEXT NOT NULL,
      data BLOB NOT NULL,
      created_at TEXT NOT NULL
    )`),
  ]);

  const count = await db.prepare("SELECT COUNT(*) AS total FROM cms_entries").first<{ total: number }>();
  if (Number(count?.total ?? 0) > 0) return;
  const now = new Date().toISOString();
  await db.batch(initialCmsEntries.map((item) => db.prepare(`INSERT INTO cms_entries
    (id, collection, title, slug, published_at, excerpt, image_url, tag, price, content, visible, sort_order, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`)
    .bind(item[0], item[1], item[2], item[3], item[1] === "articles" ? "2026-08-08" : "", item[4], item[5], item[6], item[7], item[8], item[9], now)));
}

function requestHasSameOrigin(request: Request, url: URL) {
  return request.headers.get("Origin") === url.origin;
}

function getCookie(request: Request, name: string) {
  const cookies = request.headers.get("Cookie") ?? "";
  return cookies.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1) ?? "";
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return difference === 0;
}

async function isCmsAuthenticated(request: Request, env: Env) {
  if (!env.CMS_SESSION_SECRET) return false;
  const [expires, signature] = getCookie(request, CMS_COOKIE).split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return constantTimeEqual(signature, await hmac(expires, env.CMS_SESSION_SECRET));
}

async function handleCms(request: Request, env: Env, url: URL): Promise<Response | null> {
  if (!url.pathname.startsWith("/api/cms/") && !url.pathname.startsWith("/media/")) return null;

  if (!env.DB) return Response.json({ error: "CMS database is unavailable" }, { status: 503 });
  await ensureCmsSchema(env.DB);

  if (url.pathname.startsWith("/media/")) {
    const id = decodeURIComponent(url.pathname.slice("/media/".length));
    if (!id || id.includes("..") || id.startsWith("/")) return new Response("Not found", { status: 404 });
    const asset = await env.DB.prepare("SELECT content_type, data FROM cms_assets WHERE id = ?").bind(id).first<{ content_type: string; data: ArrayBuffer }>();
    if (!asset) return new Response("Not found", { status: 404 });
    return new Response(asset.data, { headers: { "Content-Type": asset.content_type, "Cache-Control": "public, max-age=31536000, immutable" } });
  }

  if (url.pathname === "/api/cms/content" && request.method === "GET") {
    const result = await env.DB.prepare("SELECT * FROM cms_entries WHERE visible = 1 ORDER BY collection, sort_order, updated_at DESC").all<CmsRow>();
    return Response.json({ entries: (result.results ?? []).map(normalizeCmsRow) }, { headers: { "Cache-Control": "public, max-age=30" } });
  }

  if (url.pathname === "/api/cms/login") {
    if (request.method !== "POST" || !requestHasSameOrigin(request, url)) return Response.json({ error: "Invalid request" }, { status: 403 });
    if (!env.CMS_ADMIN_PASSWORD || !env.CMS_SESSION_SECRET) return Response.json({ error: "CMS login is not configured" }, { status: 503 });
    const body = await request.json().catch(() => ({})) as { password?: unknown };
    const supplied = String(body.password ?? "");
    const suppliedDigest = await hmac(supplied, env.CMS_SESSION_SECRET);
    const expectedDigest = await hmac(env.CMS_ADMIN_PASSWORD, env.CMS_SESSION_SECRET);
    if (!constantTimeEqual(suppliedDigest, expectedDigest)) return Response.json({ error: "Invalid credentials" }, { status: 401 });
    const expires = String(Date.now() + 12 * 60 * 60 * 1000);
    const signature = await hmac(expires, env.CMS_SESSION_SECRET);
    return Response.json({ ok: true }, { headers: { "Set-Cookie": `${CMS_COOKIE}=${expires}.${signature}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200` } });
  }

  if (url.pathname === "/api/cms/logout") {
    return Response.json({ ok: true }, { headers: { "Set-Cookie": `${CMS_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` } });
  }

  if (!await isCmsAuthenticated(request, env)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (url.pathname === "/api/cms/admin" && request.method === "GET") {
    const result = await env.DB.prepare("SELECT * FROM cms_entries ORDER BY collection, sort_order, updated_at DESC").all<CmsRow>();
    return Response.json({ entries: (result.results ?? []).map(normalizeCmsRow) }, { headers: { "Cache-Control": "no-store" } });
  }

  if (!requestHasSameOrigin(request, url)) return Response.json({ error: "Invalid origin" }, { status: 403 });

  if (url.pathname === "/api/cms/admin" && request.method === "POST") {
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const clean = (value: unknown, maximum: number) => String(value ?? "").trim().slice(0, maximum);
    const collection = clean(body.collection, 40);
    const title = clean(body.title, 180);
    const slug = clean(body.slug, 160).toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!CMS_COLLECTIONS.has(collection) || !title || !slug) return Response.json({ error: "Invalid content" }, { status: 400 });
    const id = clean(body.id, 80) || crypto.randomUUID();
    const now = new Date().toISOString();
    const entry = {
      id, collection, title, slug,
      publishedAt: clean(body.publishedAt, 20), excerpt: clean(body.excerpt, 800), imageUrl: clean(body.imageUrl, 500),
      tag: clean(body.tag, 100), price: clean(body.price, 100), content: clean(body.content, 30000),
      visible: body.visible !== false, sortOrder: Math.max(0, Math.min(9999, Number(body.sortOrder) || 0)), updatedAt: now,
    };
    await env.DB.prepare(`INSERT INTO cms_entries
      (id, collection, title, slug, published_at, excerpt, image_url, tag, price, content, visible, sort_order, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET collection=excluded.collection, title=excluded.title, slug=excluded.slug,
      published_at=excluded.published_at, excerpt=excluded.excerpt, image_url=excluded.image_url, tag=excluded.tag,
      price=excluded.price, content=excluded.content, visible=excluded.visible, sort_order=excluded.sort_order, updated_at=excluded.updated_at`)
      .bind(id, collection, title, slug, entry.publishedAt, entry.excerpt, entry.imageUrl, entry.tag, entry.price, entry.content, entry.visible ? 1 : 0, entry.sortOrder, now).run();
    return Response.json({ entry });
  }

  if (url.pathname === "/api/cms/admin" && request.method === "DELETE") {
    const id = (url.searchParams.get("id") ?? "").slice(0, 80);
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
    await env.DB.prepare("DELETE FROM cms_entries WHERE id = ?").bind(id).run();
    return Response.json({ ok: true });
  }

  if (url.pathname === "/api/cms/upload" && request.method === "POST") {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size > 1024 * 1024 || !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      return Response.json({ error: "Invalid image" }, { status: 400 });
    }
    const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    const key = `${crypto.randomUUID()}.${extension}`;
    await env.DB.prepare("INSERT INTO cms_assets (id, content_type, data, created_at) VALUES (?, ?, ?, ?)")
      .bind(key, file.type, await file.arrayBuffer(), new Date().toISOString()).run();
    return Response.json({ url: `/media/${encodeURIComponent(key)}` });
  }

  return Response.json({ error: "Not found" }, { status: 404 });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const cmsResponse = await handleCms(request, env, url);
    if (cmsResponse) return cmsResponse;

    if (url.pathname === "/api/payment-notification") {
      if (request.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
      }

      const origin = request.headers.get("Origin");
      if (!origin || origin !== url.origin) {
        return Response.json({ error: "Invalid origin" }, { status: 403 });
      }

      if (!env?.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
        return Response.json({ error: "Telegram notification is not configured" }, { status: 503 });
      }

      let data: Record<string, unknown>;
      try {
        data = await request.json() as Record<string, unknown>;
      } catch {
        return Response.json({ error: "Invalid request" }, { status: 400 });
      }

      const clean = (value: unknown, maxLength = 180) => String(value ?? "").trim().slice(0, maxLength);
      const product = clean(data.product);
      const buyerPhone = clean(data.buyerPhone, 40);
      if (!product || !buyerPhone) {
        return Response.json({ error: "Missing required fields" }, { status: 400 });
      }

      const notification = [
        "🔔 KHÁCH HÀNG BÁO ĐÃ CHUYỂN KHOẢN",
        "",
        `Sản phẩm: ${product}`,
        `Số tiền: ${clean(data.amount, 40) || "Khách chưa nhập"}`,
        `Nội dung CK: ${clean(data.transferContent, 80) || "Khách chưa nhập"}`,
        `Họ tên: ${clean(data.buyerName, 80) || "Khách chưa nhập"}`,
        `SĐT / Zalo: ${buyerPhone}`,
        `Email: ${clean(data.buyerEmail, 120) || "Khách chưa nhập"}`,
        `Thời gian: ${new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", dateStyle: "short", timeStyle: "medium" }).format(new Date())}`,
        "",
        "Lưu ý: Đây là xác nhận do khách bấm trên website. Vui lòng kiểm tra giao dịch ngân hàng trước khi cấp sản phẩm.",
      ].join("\n");

      const telegramResponse = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: notification,
          disable_web_page_preview: true,
        }),
      });

      if (!telegramResponse.ok) {
        console.error("Telegram payment notification failed", telegramResponse.status);
        return Response.json({ error: "Unable to send notification" }, { status: 502 });
      }

      return Response.json({ ok: true });
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
