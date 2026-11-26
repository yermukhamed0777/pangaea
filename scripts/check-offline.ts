/**
 * Offline/privacy check. Fails if authored source contains a runtime network
 * primitive or if the static export references an external host. The engine
 * is pure TypeScript and the browser build must make zero network calls for
 * user data. Report-only counts are kept separate from pass/fail.
 */
import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const FORBIDDEN = [
  { re: /\bfetch\s*\(/, label: "fetch(" },
  { re: /XMLHttpRequest/, label: "XMLHttpRequest" },
  { re: /navigator\.sendBeacon/, label: "sendBeacon" },
  { re: /\bnew\s+WebSocket/, label: "WebSocket" },
  { re: /\bnew\s+EventSource/, label: "EventSource" },
];

function files(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === "out") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files(path, out);
    else if ([".ts", ".tsx"].includes(extname(entry.name))) out.push(path);
  }
  return out;
}

let violations = 0;
let sourceFiles = 0;
for (const file of files(join(root, "src"))) {
  sourceFiles++;
  const content = readFileSync(file, "utf8");
  FORBIDDEN.forEach(({ re, label }) => {
    if (re.test(content)) {
      violations++;
      console.error(`offline: ${relative(root, file)} contains ${label}`);
    }
  });
}

function htmlFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(path, out);
    else if (entry.name.endsWith(".html")) out.push(path);
  }
  return out;
}

const outDir = join(root, "out");
let htmlCount = 0;
let externalRefs = 0;
if (requireFsExists(outDir)) {
  for (const file of htmlFiles(outDir)) {
    htmlCount++;
    const html = readFileSync(file, "utf8");
    const matches = html.match(/(?:src|href)=["'](?:https?:)?\/\/[^"']+/g) || [];
    if (matches.length) {
      externalRefs += matches.length;
      console.error(`offline: ${relative(root, file)} references external ${matches[0]}`);
    }
  }
}

function requireFsExists(path: string): boolean {
  try { readdirSync(path); return true; } catch { return false; }
}

console.log(`offline: scanned ${sourceFiles} source files, ${htmlCount} HTML files, ${externalRefs} external refs`);
if (violations || externalRefs) {
  console.error(`offline: FAILED (${violations} source violations, ${externalRefs} external refs)`);
  process.exitCode = 1;
} else {
  console.log("PASS offline: no runtime network primitives, no external asset hosts");
}
