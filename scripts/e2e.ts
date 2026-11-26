/**
 * Browser end-to-end check against the static export. Serves `out/` locally
 * under /pangaea, drives a real Chromium browser, and asserts no external
 * network requests. Set CAPTURE=1 to write deterministic screenshots to
 * docs/walkthrough/ for a later recorded walkthrough.
 */
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { chromium } from "playwright-core";
import type { AddressInfo } from "node:net";

const root = process.cwd();
const outDir = join(root, "out");
const REMOTE = process.env.E2E_BASE_URL?.replace(/\/$/, "") || "";
if (!REMOTE && !existsSync(join(outDir, "index.html"))) {
  console.error("e2e: run `npm run build` first, or set E2E_BASE_URL");
  process.exit(1);
}

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".json": "application/json",
  ".woff2": "font/woff2",
};

const server = REMOTE ? null : createServer((req, res) => {
  let pathname = decodeURIComponent(new URL(req.url || "/", "http://localhost").pathname);
  if (!pathname.startsWith("/pangaea")) { res.writeHead(404); res.end(); return; }
  pathname = pathname.slice("/pangaea".length) || "/";
  if (pathname === "/") pathname = "/index.html";
  else if (!extname(pathname)) pathname += ".html";
  const file = join(outDir, pathname);
  if (!file.startsWith(outDir) || !existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});

if (server) await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server?.address();
if (!REMOTE && (!address || typeof address === "string")) throw new Error("e2e: no server address");
const base = REMOTE || `http://127.0.0.1:${(address as AddressInfo).port}`;
const allowedHost = new URL(base).hostname;

let browser;
try {
  try {
    browser = await chromium.launch({
      headless: true,
      ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" }),
    });
  } catch {
    browser = await chromium.launch({ headless: true, channel: "msedge" });
  }
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const external: string[] = [];
  const posts: string[] = [];
  page.on("request", (req) => {
    const u = new URL(req.url());
    if (["http:", "https:"].includes(u.protocol) && u.hostname !== allowedHost) {
      external.push(req.url());
    }
    if (req.method() === "POST") posts.push(req.postData() || "");
  });

  const capture = process.env.CAPTURE === "1";
  if (capture) mkdirSync(join(root, "docs", "walkthrough"), { recursive: true });

  await page.goto(`${base}/pangaea/`, { waitUntil: "networkidle" });
  assert.match(await page.locator("h1").first().innerText(), /Know what/);
  console.log("PASS e2e: landing page renders");
  if (capture) await page.screenshot({ path: join(root, "docs", "walkthrough", "01-landing.png"), animations: "disabled" });

  await page.getByRole("link", { name: /Open workbench/ }).first().click();
  await page.waitForURL(/\/pangaea\/workbench/);
  await page.getByRole("button", { name: /Demo data/ }).click();
  await page.getByText("Analysis complete").waitFor();
  const body = await page.locator("body").textContent() || "";
  assert.match(body, /Evidence ledger/);
  assert.match(body, /Review timing is uneven/);
  assert.match(body, /4\.18/);
  console.log("PASS e2e: workbench demo produces the evidence ledger");
  if (capture) await page.screenshot({ path: join(root, "docs", "walkthrough", "02-workbench.png"), animations: "disabled" });

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /Export report/ }).click(),
  ]);
  const report = JSON.parse(readFileSync((await download.path())!, "utf8"));
  assert.equal(report.analysis.count, 20);
  assert.equal(report.analysis.cleanAverage, 4.18);
  assert.equal("score" in report.analysis, false);
  console.log("PASS e2e: exported report matches the on-screen analysis");

  await page.getByLabel("Or load a local file").setInputFiles({
    name: "reviews.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("rating,date,author,text,verified\n5,2026-03-02,alice,Texture is light and absorbs in 20 seconds.,true"),
  });
  await page.waitForFunction(() => (document.body.textContent || "").includes("csv · local only"));
  const afterImport = await page.locator("body").textContent() || "";
  assert.match(afterImport, /csv · local only/);
  console.log("PASS e2e: local CSV file is parsed in the browser");

  assert.deepEqual(external, []);
  assert.ok(
    !posts.some((body) => /Texture is light|alice|2026-03-02/.test(body)),
    "imported review text was transmitted in a POST body",
  );
  console.log("PASS e2e: zero external network requests");
  console.log("PASS e2e: imported review text was not transmitted");
  console.log("e2e: 6 checks passed");
} finally {
  if (browser) await browser.close();
  if (server) await new Promise<void>((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
}
