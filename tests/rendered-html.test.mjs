import assert from "node:assert/strict";
import test from "node:test";

test("renders production domain metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<link rel=["']canonical["'] href=["']https:\/\/saotrucauco\.com\/?["']/i);
  assert.match(html, /property=["']og:image["'] content=["']https:\/\/saotrucauco\.com\/(logo\.jpg|hero-flute\.webp)["']/i);
  assert.match(html, /<title>Dạy thổi sáo tại TP\.HCM &amp; Online \| Sáo Trúc Âu Cơ<\/title>/i);
  assert.match(html, /<h1[^>]*>Lớp Dạy Thổi Sáo Tại TP\.HCM – Sáo Trúc Âu Cơ<\/h1>/i);
  assert.match(html, /<meta[^>]*name=["']description["'][^>]*content=["']Trung tâm dạy sáo tại TP\.HCM và Online\. Học Sáo Trúc, Dizi, Tiêu và nhiều loại sáo với lộ trình từ cơ bản đến nâng cao\.["']/i);
  assert.doesNotMatch(html, /chatgpt\.site|codex-preview/i);
});

test("permanently redirects www and http traffic to https://saotrucauco.com (301)", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const mockEnv = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const mockCtx = { waitUntil() {}, passThroughOnException() {} };

  const testCases = [
    // 1. https://www -> https://non-www
    { incoming: "https://www.saotrucauco.com/", expected: "https://saotrucauco.com/" },
    { incoming: "https://www.saotrucauco.com/cam-am", expected: "https://saotrucauco.com/cam-am" },
    { incoming: "https://www.saotrucauco.com/huong-dan", expected: "https://saotrucauco.com/huong-dan" },
    { incoming: "https://www.saotrucauco.com/lop-hoc", expected: "https://saotrucauco.com/lop-hoc" },
    { incoming: "https://www.saotrucauco.com/bai-viet", expected: "https://saotrucauco.com/bai-viet" },
    { incoming: "https://www.saotrucauco.com/bo-mon/sao-truc-viet-nam", expected: "https://saotrucauco.com/bo-mon/sao-truc-viet-nam" },
    { incoming: "https://www.saotrucauco.com/cam-am?utm_source=facebook&utm_campaign=test", expected: "https://saotrucauco.com/cam-am?utm_source=facebook&utm_campaign=test" },

    // 2. http://www -> https://non-www
    { incoming: "http://www.saotrucauco.com/", expected: "https://saotrucauco.com/" },
    { incoming: "http://www.saotrucauco.com/cam-am", expected: "https://saotrucauco.com/cam-am" },
    { incoming: "http://www.saotrucauco.com/huong-dan", expected: "https://saotrucauco.com/huong-dan" },
    { incoming: "http://www.saotrucauco.com/lop-hoc", expected: "https://saotrucauco.com/lop-hoc" },
    { incoming: "http://www.saotrucauco.com/bai-viet", expected: "https://saotrucauco.com/bai-viet" },

    // 3. http://non-www -> https://non-www
    { incoming: "http://saotrucauco.com/", expected: "https://saotrucauco.com/" },
    { incoming: "http://saotrucauco.com/cam-am", expected: "https://saotrucauco.com/cam-am" },
    { incoming: "http://saotrucauco.com/huong-dan", expected: "https://saotrucauco.com/huong-dan" },
    { incoming: "http://saotrucauco.com/lop-hoc", expected: "https://saotrucauco.com/lop-hoc" },
    { incoming: "http://saotrucauco.com/bai-viet", expected: "https://saotrucauco.com/bai-viet" },
  ];

  for (const { incoming, expected } of testCases) {
    const res = await worker.fetch(new Request(incoming), mockEnv, mockCtx);
    assert.equal(res.status, 301, `Expected 301 for ${incoming}`);
    assert.equal(res.headers.get("Location"), expected, `Expected Location ${expected} for ${incoming}`);
    assert.match(res.headers.get("Cache-Control") || "", /max-age/);
  }

  // Ensure canonical host does NOT redirect to itself (no loop)
  const canonicalRes = await worker.fetch(new Request("https://saotrucauco.com/cam-am"), mockEnv, mockCtx);
  assert.notEqual(canonicalRes.status, 301, "Canonical host should not redirect");
  assert.notEqual(canonicalRes.status, 308, "Canonical host should not redirect");
  assert.equal(canonicalRes.status, 200, "Canonical host should return 200 OK");
});

test("SSR / Pre-render for /cam-am and /huong-dan delivers complete HTML without JS", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const mockEnv = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const mockCtx = { waitUntil() {}, passThroughOnException() {} };

  // 1. Verify /cam-am initial HTML
  const camAmRes = await worker.fetch(new Request("https://saotrucauco.com/cam-am", { headers: { accept: "text/html" } }), mockEnv, mockCtx);
  assert.equal(camAmRes.status, 200);
  const camAmHtml = await camAmRes.text();

  // Must NOT contain loading state
  assert.doesNotMatch(camAmHtml, /Đang tải cảm âm/i, "Initial HTML of /cam-am must not contain 'Đang tải cảm âm'");

  // Must contain H1
  assert.match(camAmHtml, /<h1[^>]*>Kho Cảm Âm Sáo Trúc Chuẩn<\/h1>/i);

  // Must contain page description
  assert.match(camAmHtml, /Tổng hợp các bản cảm âm sáo trúc chuẩn 2 dòng/i);

  // Must contain article/tab list with titles
  assert.match(camAmHtml, /Bèo dạt mây trôi/i);
  assert.match(camAmHtml, /Chiều trên quê hương/i);
  assert.match(camAmHtml, /Khúc sáo vùng cao/i);
  assert.match(camAmHtml, /Về Quê/i);
  assert.match(camAmHtml, /Tình Ca Tây Bắc/i);

  // Must contain real <a href="..."> links to detail pages
  assert.match(camAmHtml, /<a[^>]+href=["']\/cam-am\/beo-dat-may-troi["']/i);
  assert.match(camAmHtml, /<a[^>]+href=["']\/cam-am\/chieu-tren-que-huong["']/i);
  assert.match(camAmHtml, /<a[^>]+href=["']\/cam-am\/khuc-sao-vung-cao["']/i);

  // Must have dedicated canonical and title
  assert.match(camAmHtml, /<link[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/saotrucauco\.com\/cam-am["']/i);
  assert.match(camAmHtml, /<title>Kho Cảm Âm Sáo Trúc Chuẩn Nhất – Lời Bài Hát &amp; Nốt Quãng \| Sáo Trúc Âu Cơ<\/title>/i);

  // 2. Verify /huong-dan initial HTML
  const huongDanRes = await worker.fetch(new Request("https://saotrucauco.com/huong-dan", { headers: { accept: "text/html" } }), mockEnv, mockCtx);
  assert.equal(huongDanRes.status, 200);
  const huongDanHtml = await huongDanRes.text();

  // Must NOT contain loading state
  assert.doesNotMatch(huongDanHtml, /Đang tải danh sách hướng dẫn/i, "Initial HTML of /huong-dan must not contain 'Đang tải danh sách hướng dẫn'");

  // Must contain H1
  assert.match(huongDanHtml, /<h1[^>]*>Hướng Dẫn Thổi Sáo &amp; Video Bài Giảng<\/h1>/i);

  // Must contain page description
  assert.match(huongDanHtml, /Tổng hợp các bài viết hướng dẫn chi tiết kỹ thuật bấm ngón, lấy hơi/i);

  // Must contain guide items
  assert.match(huongDanHtml, /Cách lấy hơi và tạo tiếng sáo tròn, rõ/i);
  assert.match(huongDanHtml, /Mẹo sửa lỗi xì tiếng và rung ngón/i);
  assert.match(huongDanHtml, /Chọn nhạc cụ và xây dựng lộ trình học sáo hiệu quả/i);

  // Must contain real <a href="..."> links
  assert.match(huongDanHtml, /href=["']https:\/\/www\.youtube\.com\/@saotrucauco["']/i);
  assert.match(huongDanHtml, /href=["']\/huong-dan\/chon-nhac-cu-va-xay-dung-lo-trinh-hoc["']/i);

  // Must have dedicated canonical and title
  assert.match(huongDanHtml, /<link[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/saotrucauco\.com\/huong-dan["']/i);
  assert.match(huongDanHtml, /<title>Hướng Dẫn (?:Học Thổi|Thổi) Sáo Trúc &amp; Video Bài Giảng (?:Kỹ Thuật|Chuẩn Kỹ Thuật) \| Sáo Trúc Âu Cơ<\/title>/i);
  assert.match(huongDanHtml, /"CollectionPage"/i);
  assert.match(huongDanHtml, /"BreadcrumbList"/i);
});

test("handles thin content and gioi-thieu-admin with noindex and sitemap exclusion", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const mockEnv = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const mockCtx = { waitUntil() {}, passThroughOnException() {} };

  const checkNoindex = async (path) => {
    const res = await worker.fetch(new Request(`https://saotrucauco.com${path}`, { headers: { accept: "text/html" } }), mockEnv, mockCtx);
    assert.equal(res.status, 200, `Expected 200 for ${path}`);
    const html = await res.text();
    const hasNoindex = /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
    const hasFollow = /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*follow/i.test(html);
    return { html, hasNoindex, hasFollow };
  };

  // 1. Thin content articles must have noindex, follow
  const thinArticles = [
    "/bai-viet/5-buoc-tao-tieng-sao",
    "/bai-viet/nguoi-moi-chon-sao-tone-nao",
    "/bai-viet/cach-luyen-hoi-dai",
  ];

  for (const path of thinArticles) {
    const { html, hasNoindex, hasFollow } = await checkNoindex(path);
    assert.ok(hasNoindex, `${path} must have noindex`);
    assert.ok(hasFollow, `${path} must have follow`);
    // Retain internal links to related classes/courses
    assert.match(html, /href=["']\/(?:dang-ky-hoc|lop-hoc|sao-va-phu-kien)["']/i, `${path} should keep internal links`);
  }

  // 2. /gioi-thieu-admin must have noindex, follow
  const adminIntro = await checkNoindex("/gioi-thieu-admin");
  assert.ok(adminIntro.hasNoindex, "/gioi-thieu-admin must have noindex");
  assert.ok(adminIntro.hasFollow, "/gioi-thieu-admin must have follow");

  // 3. Fully fleshed article must have index, follow
  const fullArticleRes = await worker.fetch(new Request("https://saotrucauco.com/bai-viet/hoc-thoi-sao-hcm", { headers: { accept: "text/html" } }), mockEnv, mockCtx);
  const fullArticleHtml = await fullArticleRes.text();
  assert.match(fullArticleHtml, /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*index/i);
  assert.doesNotMatch(fullArticleHtml, /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i);

  // 4. Sitemap.xml must NOT contain noindexed URLs
  const sitemapRes = await worker.fetch(new Request("https://saotrucauco.com/sitemap.xml"), mockEnv, mockCtx);
  assert.equal(sitemapRes.status, 200);
  const sitemapXml = await sitemapRes.text();

  assert.doesNotMatch(sitemapXml, /www\.saotrucauco\.com/i);
  assert.doesNotMatch(sitemapXml, /<loc>https:\/\/saotrucauco\.com\/gioi-thieu-admin<\/loc>/i, "Sitemap must not contain /gioi-thieu-admin");
  assert.doesNotMatch(sitemapXml, /<loc>https:\/\/saotrucauco\.com\/bai-viet\/5-buoc-tao-tieng-sao<\/loc>/i, "Sitemap must not contain thin article 5-buoc-tao-tieng-sao");
  assert.doesNotMatch(sitemapXml, /<loc>https:\/\/saotrucauco\.com\/bai-viet\/nguoi-moi-chon-sao-tone-nao<\/loc>/i, "Sitemap must not contain thin article nguoi-moi-chon-sao-tone-nao");
  assert.doesNotMatch(sitemapXml, /<loc>https:\/\/saotrucauco\.com\/bai-viet\/cach-luyen-hoi-dai<\/loc>/i, "Sitemap must not contain thin article cach-luyen-hoi-dai");

  // Sitemap MUST contain valid indexable URLs
  assert.match(sitemapXml, /<loc>https:\/\/saotrucauco\.com\/cam-am<\/loc>/);
  assert.match(sitemapXml, /<loc>https:\/\/saotrucauco\.com\/huong-dan<\/loc>/);
  assert.match(sitemapXml, /<loc>https:\/\/saotrucauco\.com\/bai-viet\/hoc-thoi-sao-hcm<\/loc>/);

  // 5. Robots.txt must declare sitemap URL
  const robotsRes = await worker.fetch(new Request("https://saotrucauco.com/robots.txt"), mockEnv, mockCtx);
  assert.equal(robotsRes.status, 200);
  const robotsTxt = await robotsRes.text();
  assert.match(robotsTxt, /Sitemap:\s*https:\/\/saotrucauco\.com\/sitemap\.xml/i);
});

test("verifies student portal endpoints and synchronization", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const dbStore = new Map();
  const mockDB = {
    prepare(sql) {
      return {
        bind(...args) {
          return {
            async run() {
              if (sql.includes("INSERT OR REPLACE INTO student_portal_state")) {
                dbStore.set(args[0], { data: args[1], updated_at: args[2] });
              }
              return { success: true };
            },
            async all() {
              return { results: [] };
            },
            async first() {
              if (sql.includes("WHERE key = 'students'")) {
                const item = dbStore.get("students");
                return item ? { data: item.data } : null;
              }
              return null;
            }
          };
        },
        async run() {
          return { success: true };
        },
        async all() {
          const results = [];
          for (const [key, val] of dbStore.entries()) {
            results.push({ key, data: val.data });
          }
          return { results };
        },
        async first() {
          return null;
        }
      };
    },
    async batch(stmts) {
      for (const s of stmts) {
        if (s && typeof s.run === "function") await s.run();
      }
      return [];
    }
  };

  const mockEnv = {
    DB: mockDB,
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  };
  const mockCtx = { waitUntil() {}, passThroughOnException() {} };

  // 1. Initial GET on /api/students/data seeds the 5 students
  const resData = await worker.fetch(new Request("https://saotrucauco.com/api/students/data"), mockEnv, mockCtx);
  assert.equal(resData.status, 200);
  const json = await resData.json();
  assert.equal(json.ok, true);
  assert.equal(json.data.students.length, 5);

  const studentNames = json.data.students.map((s) => s.name);
  assert.ok(studentNames.includes("Huỳnh Tân Anh"));
  assert.ok(studentNames.includes("Khang"));
  assert.ok(studentNames.includes("Anh Thắng"));
  assert.ok(studentNames.includes("Tâm Như"));
  assert.ok(studentNames.includes("Chị Quỳnh"));

  // 2. Query individual student via /api/students/item
  const resItem = await worker.fetch(new Request("https://saotrucauco.com/api/students/item?id=6-DyqX6a46"), mockEnv, mockCtx);
  assert.equal(resItem.status, 200);
  const jsonItem = await resItem.json();
  assert.equal(jsonItem.ok, true);
  assert.equal(jsonItem.student.name, "Huỳnh Tân Anh");
  assert.equal(jsonItem.student.phone, "0315478568");
  assert.equal(jsonItem.student.attendedSessions, 1);

  // 3. Test sync via POST /api/students/sync
  const updatedStudents = [...json.data.students, {
    id: "test-new-student",
    name: "Học Viên Mới Test",
    phone: "0999888777",
    status: "Đang học",
    course: "Sáo trúc cơ bản",
    packageSessions: 8,
    tuition: "2.400.000đ",
    attendedSessions: 0,
    attendanceList: [],
  }];

  const resSync = await worker.fetch(new Request("https://saotrucauco.com/api/students/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ students: updatedStudents }),
  }), mockEnv, mockCtx);
  assert.equal(resSync.status, 200);
  const jsonSync = await resSync.json();
  assert.equal(jsonSync.ok, true);
  assert.ok(jsonSync.syncedAt);
});

test("verifies flute learning on-page SEO metadata and structured data", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const mockEnv = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const mockCtx = { waitUntil() {}, passThroughOnException() {} };

  // 1. /lop-hoc
  const lopHocRes = await worker.fetch(new Request("https://saotrucauco.com/lop-hoc", { headers: { accept: "text/html" } }), mockEnv, mockCtx);
  assert.equal(lopHocRes.status, 200);
  const lopHocHtml = await lopHocRes.text();
  assert.match(lopHocHtml, /<title>Lớp Học Sáo Trúc Tại TP\.HCM &amp; Online 1 Kèm 1 \| Sáo Trúc Âu Cơ<\/title>/i);
  assert.match(lopHocHtml, /"Course"/i);
  assert.match(lopHocHtml, /"BreadcrumbList"/i);
  assert.match(lopHocHtml, /"ItemList"/i);

  // 2. /dang-ky-hoc
  const dangKyRes = await worker.fetch(new Request("https://saotrucauco.com/dang-ky-hoc", { headers: { accept: "text/html" } }), mockEnv, mockCtx);
  assert.equal(dangKyRes.status, 200);
  const dangKyHtml = await dangKyRes.text();
  assert.match(dangKyHtml, /<title>Đăng Ký Học Sáo Trúc Tại TP\.HCM &amp; Online 1 Kèm 1 \| Sáo Trúc Âu Cơ<\/title>/i);
  assert.match(dangKyHtml, /"ContactPage"/i);

  // 3. /khoa-hoc-quay-san
  const recordedRes = await worker.fetch(new Request("https://saotrucauco.com/khoa-hoc-quay-san", { headers: { accept: "text/html" } }), mockEnv, mockCtx);
  assert.equal(recordedRes.status, 200);
  const recordedHtml = await recordedRes.text();
  assert.match(recordedHtml, /<title>Khóa Học Sáo Trúc Online Qua Video HD – Tự Học Sáo Tại Nhà \| Sáo Trúc Âu Cơ<\/title>/i);
  assert.match(recordedHtml, /"Course"/i);

  // 4. /giao-trinh-va-sheet
  const materialsRes = await worker.fetch(new Request("https://saotrucauco.com/giao-trinh-va-sheet", { headers: { accept: "text/html" } }), mockEnv, mockCtx);
  assert.equal(materialsRes.status, 200);
  const materialsHtml = await materialsRes.text();
  assert.match(materialsHtml, /<title>Giáo Trình Học Sáo Trúc &amp; Sheet Nhạc Chuyển Soạn Chuẩn \| Sáo Trúc Âu Cơ<\/title>/i);
  assert.match(materialsHtml, /"LearningResource"/i);

  // 5. /bai-viet
  const baiVietRes = await worker.fetch(new Request("https://saotrucauco.com/bai-viet", { headers: { accept: "text/html" } }), mockEnv, mockCtx);
  assert.equal(baiVietRes.status, 200);
  const baiVietHtml = await baiVietRes.text();
  assert.match(baiVietHtml, /<title>Bài Viết &amp; Kiến Thức Học Sáo Trúc \| Sáo Trúc Âu Cơ<\/title>/i);
  assert.match(baiVietHtml, /"CollectionPage"/i);

  // 6. /gioi-thieu
  const founderRes = await worker.fetch(new Request("https://saotrucauco.com/gioi-thieu", { headers: { accept: "text/html" } }), mockEnv, mockCtx);
  assert.equal(founderRes.status, 200);
  const founderHtml = await founderRes.text();
  assert.match(founderHtml, /"Person"/i);
  assert.match(founderHtml, /Quách Hạ Văn/i);
});

test("verifies internal analytics system: tracking, bot filtering, authentication, and stats", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const events = [];
  const mockDB = {
    prepare(sql) {
      return {
        bind(...args) {
          return {
            async run() {
              if (sql.includes("INSERT INTO analytics_events")) {
                events.push({
                  id: args[0],
                  visitor_id: args[1],
                  session_id: args[2],
                  event_name: args[3],
                  path: args[4],
                  referrer: args[5],
                  source: args[6],
                  medium: args[7],
                  campaign: args[8],
                  device: args[9],
                  browser: args[10],
                  created_at: args[11],
                });
              }
              return { success: true };
            },
            async all() {
              if (sql.includes("FROM analytics_events") && sql.includes("GROUP BY channel")) {
                return { results: [{ channel: "Direct (Trực tiếp)", visitors: 1, total_events: 2 }] };
              }
              if (sql.includes("FROM analytics_events") && sql.includes("GROUP BY device")) {
                return { results: [{ device: "desktop", visitors: 1, total_events: 2 }] };
              }
              if (sql.includes("FROM analytics_events") && sql.includes("GROUP BY path")) {
                return { results: [{ path: "/", views: 1, visitors: 1 }] };
              }
              if (sql.includes("FROM analytics_events") && sql.includes("GROUP BY substr(created_at, 1, 10)")) {
                return { results: [{ day: "2026-09-18", visitors: 1, pageviews: 1, zalo_clicks: 1, signup_clicks: 1 }] };
              }
              if (sql.includes("first_views")) {
                return { results: [{ landing_page: "/", visitors: 1, pageviews: 1, avg_time_sec: 45, zalo_clicks: 1, signup_clicks: 1 }] };
              }
              return { results: [] };
            },
            async first() {
              if (sql.includes("WHERE collection = 'settings' AND slug = 'admin-password'")) {
                return null;
              }
              if (sql.includes("online_count")) {
                return { online_count: events.length > 0 ? 1 : 0 };
              }
              if (sql.includes("visitors_today")) {
                return { visitors_today: 1, pageviews_today: 1 };
              }
              if (sql.includes("total_visitors")) {
                return {
                  total_visitors: 1,
                  total_sessions: 1,
                  total_pageviews: 1,
                  click_zalo: 1,
                  click_signup: 1,
                  click_phone: 0,
                  play_audio: 0,
                  play_video: 0,
                  scroll_25: 1,
                  scroll_50: 1,
                  scroll_75: 0,
                  scroll_100: 0,
                };
              }
              if (sql.includes("lower(source) LIKE '%google%'")) {
                return { count: 0 };
              }
              if (sql.includes("lower(source) LIKE '%facebook%'")) {
                return { count: 0 };
              }
              if (sql.includes("source = '' OR lower(source) = 'direct'")) {
                return { count: 1 };
              }
              return null;
            }
          };
        },
        async run() {
          return { success: true };
        },
        async all() {
          return { results: [] };
        },
        async first() {
          return null;
        }
      };
    },
    async batch() {
      return [];
    }
  };

  const mockEnv = {
    DB: mockDB,
    CMS_ADMIN_PASSWORD: "testpassword123",
    CMS_SESSION_SECRET: "test-secret-saotrucauco-2026",
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  };
  const mockCtx = { waitUntil() {}, passThroughOnException() {} };

  // 1. Bot exclusion test: Googlebot should be ignored and not inserted
  const botRes = await worker.fetch(new Request("https://saotrucauco.com/api/analytics/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
    },
    body: JSON.stringify({
      eventName: "page_view",
      visitorId: "test_bot_vid",
      sessionId: "test_bot_sid",
      path: "/cam-am"
    })
  }), mockEnv, mockCtx);

  assert.equal(botRes.status, 200);
  const botJson = await botRes.json();
  assert.equal(botJson.ignored, "bot");
  assert.equal(events.length, 0, "Bot events must not be inserted into DB");

  // 2. Validation test: missing required fields should return 400
  const invalidRes = await worker.fetch(new Request("https://saotrucauco.com/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventName: "page_view" }) // missing visitorId & sessionId
  }), mockEnv, mockCtx);
  assert.equal(invalidRes.status, 400);

  // 3. Valid event tracking: page_view, scroll_25, click_zalo, click_signup
  const validEvents = [
    { eventName: "page_view", visitorId: "v_user_1", sessionId: "s_user_1", path: "/", device: "desktop" },
    { eventName: "scroll_25", visitorId: "v_user_1", sessionId: "s_user_1", path: "/", device: "desktop" },
    { eventName: "click_zalo", visitorId: "v_user_1", sessionId: "s_user_1", path: "/", device: "desktop" },
    { eventName: "click_signup", visitorId: "v_user_1", sessionId: "s_user_1", path: "/", device: "desktop" }
  ];

  for (const evt of validEvents) {
    const res = await worker.fetch(new Request("https://saotrucauco.com/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evt)
    }), mockEnv, mockCtx);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.ok, true);
  }
  assert.equal(events.length, 4, "4 events should have been inserted into DB");

  // 4. GET /api/analytics/stats unauthorized when no cookie
  const unauthRes = await worker.fetch(new Request("https://saotrucauco.com/api/analytics/stats"), mockEnv, mockCtx);
  assert.equal(unauthRes.status, 401);

  // 5. Authenticate via CMS login and fetch stats
  const loginRes = await worker.fetch(new Request("https://saotrucauco.com/api/cms/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "testpassword123" })
  }), mockEnv, mockCtx);
  assert.equal(loginRes.status, 200);
  const cookieHeader = loginRes.headers.get("set-cookie");
  assert.ok(cookieHeader);

  const cookie = cookieHeader.split(";")[0];
  const statsRes = await worker.fetch(new Request("https://saotrucauco.com/api/analytics/stats?range=today", {
    headers: { Cookie: cookie }
  }), mockEnv, mockCtx);

  assert.equal(statsRes.status, 200);
  const statsJson = await statsRes.json();
  assert.equal(statsJson.ok, true);
  assert.ok(statsJson.period);
  assert.ok(statsJson.overview);
  assert.ok(statsJson.trafficChannels);
  assert.ok(Array.isArray(statsJson.landingPages));

  // 6. Verify /admin/analytics HTML has noindex, nofollow
  const adminAnalyticsRes = await worker.fetch(new Request("https://saotrucauco.com/admin/analytics", {
    headers: { accept: "text/html" }
  }), mockEnv, mockCtx);
  assert.equal(adminAnalyticsRes.status, 200);
  const adminHtml = await adminAnalyticsRes.text();
  assert.match(adminHtml, /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i);
  assert.match(adminHtml, /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*nofollow/i);
});

