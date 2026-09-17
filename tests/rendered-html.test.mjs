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

