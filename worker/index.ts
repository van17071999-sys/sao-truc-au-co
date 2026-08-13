/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
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

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

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
