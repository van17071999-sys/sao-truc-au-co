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
  assert.doesNotMatch(html, /chatgpt\.site|codex-preview/i);
});

test("permanently redirects www.saotrucauco.com to saotrucauco.com (301)", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const mockEnv = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const mockCtx = { waitUntil() {}, passThroughOnException() {} };

  const testCases = [
    {
      incoming: "https://www.saotrucauco.com/",
      expected: "https://saotrucauco.com/",
    },
    {
      incoming: "https://www.saotrucauco.com/cam-am",
      expected: "https://saotrucauco.com/cam-am",
    },
    {
      incoming: "https://www.saotrucauco.com/huong-dan",
      expected: "https://saotrucauco.com/huong-dan",
    },
    {
      incoming: "https://www.saotrucauco.com/bai-viet",
      expected: "https://saotrucauco.com/bai-viet",
    },
    {
      incoming: "https://www.saotrucauco.com/bo-mon/sao-truc-viet-nam",
      expected: "https://saotrucauco.com/bo-mon/sao-truc-viet-nam",
    },
    {
      incoming: "https://www.saotrucauco.com/cam-am?utm_source=facebook&utm_campaign=test",
      expected: "https://saotrucauco.com/cam-am?utm_source=facebook&utm_campaign=test",
    },
    {
      incoming: "https://www.saotrucauco.com/cam-am?utm_source=test&utm_campaign=seo",
      expected: "https://saotrucauco.com/cam-am?utm_source=test&utm_campaign=seo",
    },
  ];

  for (const { incoming, expected } of testCases) {
    const res = await worker.fetch(new Request(incoming), mockEnv, mockCtx);
    assert.equal(res.status, 301, `Expected 301 for ${incoming}`);
    assert.equal(res.headers.get("Location"), expected, `Expected Location ${expected}`);
  }

  // Ensure canonical host does NOT redirect to itself (no loop)
  const canonicalRes = await worker.fetch(new Request("https://saotrucauco.com/cam-am"), mockEnv, mockCtx);
  assert.notEqual(canonicalRes.status, 301, "Canonical host should not redirect");
  assert.notEqual(canonicalRes.status, 308, "Canonical host should not redirect");
  assert.equal(canonicalRes.status, 200, "Canonical host should return 200 OK");
});

test("verifies page-specific canonical URLs, blog titles, and sitemap.xml", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const mockEnv = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const mockCtx = { waitUntil() {}, passThroughOnException() {} };

  const check = async (path) => {
    const res = await worker.fetch(new Request(`https://saotrucauco.com${path}`, { headers: { accept: "text/html" } }), mockEnv, mockCtx);
    assert.equal(res.status, 200, `Expected 200 for ${path}`);
    const html = await res.text();
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    const canonicalMatch = html.match(/<link[^>]*rel=["\x27]canonical["\x27][^>]*href=["\x27]([^"\x27]*)["\x27]/i) ||
                           html.match(/<link[^>]*href=["\x27]([^"\x27]*)["\x27][^>]*rel=["\x27]canonical["\x27]/i);
    return {
      title: titleMatch ? titleMatch[1] : "",
      canonical: canonicalMatch ? canonicalMatch[1] : "",
    };
  };

  // 1. Verify Canonical for subpages (not pointing to homepage)
  const camAm = await check("/cam-am");
  assert.equal(camAm.canonical, "https://saotrucauco.com/cam-am");

  const boMon = await check("/bo-mon/sao-truc-viet-nam");
  assert.equal(boMon.canonical, "https://saotrucauco.com/bo-mon/sao-truc-viet-nam");

  // 2. Verify specific blog titles and canonicals
  const blog1 = await check("/bai-viet/5-buoc-tao-tieng-sao");
  assert.equal(blog1.title, "5 Bước Tạo Tiếng Sáo Trong Cho Người Mới | Sáo Trúc Âu Cơ");
  assert.equal(blog1.canonical, "https://saotrucauco.com/bai-viet/5-buoc-tao-tieng-sao");

  const blog2 = await check("/bai-viet/nguoi-moi-chon-sao-tone-nao");
  assert.equal(blog2.title, "Người Mới Nên Chọn Sáo Tone Nào? | Sáo Trúc Âu Cơ");
  assert.equal(blog2.canonical, "https://saotrucauco.com/bai-viet/nguoi-moi-chon-sao-tone-nao");

  const blog3 = await check("/bai-viet/cach-luyen-hoi-dai");
  assert.equal(blog3.title, "Cách Luyện Hơi Dài Khi Thổi Sáo | Sáo Trúc Âu Cơ");
  assert.equal(blog3.canonical, "https://saotrucauco.com/bai-viet/cach-luyen-hoi-dai");

  // 3. Verify sitemap.xml
  const sitemapRes = await worker.fetch(new Request("https://saotrucauco.com/sitemap.xml"), mockEnv, mockCtx);
  assert.equal(sitemapRes.status, 200);
  const sitemapXml = await sitemapRes.text();
  assert.doesNotMatch(sitemapXml, /www\.saotrucauco\.com/i, "Sitemap must not contain www");
  assert.match(sitemapXml, /<loc>https:\/\/saotrucauco\.com\/cam-am<\/loc>/);
  assert.match(sitemapXml, /<loc>https:\/\/saotrucauco\.com\/bai-viet\/5-buoc-tao-tieng-sao<\/loc>/);
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



