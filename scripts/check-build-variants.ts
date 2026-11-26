/**
 * Builds and inspects both supported static-export variants: root (`/`)
 * and subpath (`/pangaea`). Fails if either build emits the wrong asset
 * prefix, so a hosting change cannot silently break links.
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

type Variant = { name: string; basePath: string; expected: string; forbidden: string };
const variants: Variant[] = [
  { name: "root", basePath: "/", expected: 'src="/_next/', forbidden: 'src="/pangaea/_next/' },
  { name: "subpath", basePath: "/pangaea", expected: 'src="/pangaea/_next/', forbidden: 'src="/_next/' },
];

const root = process.cwd();
mkdirSync(join(root, ".build-check"), { recursive: true });

for (const variant of variants) {
  // A single shell command avoids the Node deprecation warning for args + shell.
  const result = spawnSync("npm run build", {
    cwd: root,
    env: { ...process.env, PANGAEA_BASE_PATH: variant.basePath },
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    console.error(`build-variants: ${variant.name} build failed`);
    process.exit(1);
  }
  const html = readFileSync(join(root, "out", "index.html"), "utf8");
  if (!html.includes(variant.expected) || html.includes(variant.forbidden)) {
    console.error(`build-variants: ${variant.name} asset prefix is wrong`);
    console.error(`  expected ${variant.expected}, forbidden ${variant.forbidden}`);
    process.exit(1);
  }
  copyFileSync(join(root, "out", "index.html"), join(root, ".build-check", `${variant.name}-index.html`));
  console.log(`PASS build-variants: ${variant.name} (basePath=${variant.basePath}) assets ${variant.expected}`);
}
console.log("build-variants: 2/2 variants verified");
