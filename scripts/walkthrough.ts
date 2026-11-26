/**
 * Deterministic walkthrough fixtures. No clock, no randomness, no network:
 * rerunning this script always writes byte-identical files. The files let a
 * walkthrough video be assembled later without re-running the whole app.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { analyze } from "../src/lib/engine.ts";
import { compareOffers, savingPercent } from "../src/lib/cost.ts";
import { demoOffers, demoReviews, demoText } from "../src/lib/sample.ts";

const root = process.cwd();
const dir = join(root, "docs", "walkthrough");
mkdirSync(dir, { recursive: true });

const analysis = analyze(demoReviews());
const costs = compareOffers(demoOffers());
const saving = savingPercent(costs);

const report = {
  product: "PANGAEA forensics report",
  notice: "Observations only. No review is declared fake or real.",
  source: "src/lib/sample.ts (synthetic demo dataset)",
  input: demoText(),
  analysis,
  costs,
  savingPercent: saving,
};

writeFileSync(join(dir, "report.json"), JSON.stringify(report, null, 2) + "\n");

const lines = [
  "# PANGAEA walkthrough fixture (deterministic)",
  "",
  "Regenerate with `npm run walkthrough`. No timestamp and no random data:",
  "the file is byte-identical on every run. Figures below come from",
  "`analyze(demoReviews())` and `compareOffers(demoOffers())` only.",
  "",
  "## Scene 1 — paste reviews",
  "",
  "Input: 20 synthetic reviews from `src/lib/sample.ts`, piped as",
  "`rating | date | author | text`. The workbench also accepts CSV and JSON.",
  "",
  "## Scene 2 — evidence ledger",
  "",
  `- Reviews: ${analysis.count}`,
  `- Average: ${analysis.average}`,
  `- Adjusted: ${analysis.cleanAverage} (excludes ${analysis.excluded} IDs: ${analysis.excludedIds.join(", ")})`,
  `- Signals: ${analysis.signals.length}`,
  "",
  ...analysis.signals.flatMap((s) => [
    `### ${s.label} (${s.key})`,
    `- Observed: ${s.observed}`,
    `- Benign: ${s.benign}`,
    `- Concern: ${s.concern}`,
    `- Evidence IDs: ${s.evidenceIds.join(", ")}`,
    "",
  ]),
  "## Scene 3 — landed cost",
  "",
  "| Shop | Item | Duty | VAT | Shipping | Total | Per unit |",
  "|---|---:|---:|---:|---:|---:|---:|",
  ...costs.map((c) => `| ${c.shop} | ${c.itemCost} | ${c.duty} | ${c.vat} | ${c.shipping} | ${c.total} | ${c.perUnit} |`),
  "",
  `Best per unit: ${costs[0].shop} at ${costs[0].perUnit}; saving ${saving}% vs worst.`,
  "",
  "## Scene 4 — export",
  "",
  "`report.json` in this directory is the exact export payload shape, with",
  "the synthetic input embedded for reproducibility. No user text is sent anywhere.",
  "",
  "## Limits",
  "",
  ...analysis.limits.map((l) => `- ${l}`),
  "",
];
writeFileSync(join(dir, "SCENES.md"), lines.join("\n"));

console.log(`walkthrough: wrote report.json and SCENES.md (${analysis.count} reviews, ${analysis.signals.length} signals, ${costs.length} offers)`);
