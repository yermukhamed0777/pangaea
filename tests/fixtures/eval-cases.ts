import type { Review } from "../../src/lib/types.ts";

/* ------------------------------------------------------------------ *
 * SYNTHETIC labelled fixtures for the local eval harness.
 *
 * These strings were written by hand for this repository. They are not
 * customer reviews, not scraped data, and carry no third-party licence.
 * They exercise signal thresholds only — they are NOT real-world
 * validation. See plan/backlog.md P1-2 and M1-1.
 * ------------------------------------------------------------------ */

export type EvalCase = {
  name: string;
  reviews: Review[];
  expected: string[];
};

type Spec = [text: string, rating?: number, date?: string | null, verified?: boolean | null];

function make(specs: Spec[]): Review[] {
  return specs.map(([text, rating = 3, date = null, verified = null], i) => ({
    id: `e${i + 1}`,
    author: `tester-${i + 1}`,
    rating,
    date,
    verified,
    text,
  }));
}

const substance = "The 50 ml bottle lasted six weeks, the texture feels light on skin and the packaging is sturdy with no strong smell.";

export const evalCases: EvalCase[] = [
  {
    name: "empty input",
    reviews: [],
    expected: [],
  },
  {
    name: "five-star skew only",
    reviews: make([
      ["Good.", 5], ["Fine.", 5], ["Nice.", 5], ["Works.", 5], ["Solid.", 5],
      ["Great.", 5], ["Happy.", 5], ["Pleased.", 5], ["Recommended.", 5], ["Good value.", 5],
      ["Nice finish.", 5], ["Works well.", 5], ["Happy buyer.", 5], ["Solid build.", 5], ["Good buy.", 5],
    ]),
    expected: ["rating-five-heavy"],
  },
  {
    name: "author concentration only",
    reviews: (() => {
      const rs = make([["Good.", 3], ["Fine.", 3], ["Nice.", 3], ["Works.", 3]]);
      rs.forEach((r) => { r.author = "same-author"; });
      return rs;
    })(),
    expected: ["identity-concentration"],
  },
  {
    name: "timing burst only",
    reviews: make([
      ["Good.", 5, "2026-01-01"], ["Fine.", 1, "2026-01-02"], ["Nice.", 2, "2026-01-03"],
      ["Works.", 4, "2026-01-04"], ["Solid.", 3, "2026-01-05"], ["Okay.", 2, "2026-01-06"],
      ["Fine.", 1, "2026-01-07"], ["Good.", 4, "2026-04-01"],
    ]),
    expected: ["timing-burst"],
  },
  {
    name: "unverified cluster only",
    reviews: make([
      ["Good.", 5, null, false], ["Fine.", 1, null, false], ["Nice.", 2, null, false],
      ["Works.", 4, null, false], ["Solid.", 3, null, false], ["Okay.", 2, null, false],
      ["Fine.", 1, null, false], ["Good.", 4, null, false],
    ]),
    expected: ["verification-low"],
  },
  {
    name: "low substance and duplicate text",
    reviews: make([
      ["Absolutely amazing, perfect and wonderful, the best thing ever, so happy with this purchase and would recommend to everyone I know."],
      ["Absolutely amazing, perfect and wonderful, the best thing ever, so happy with this purchase and would recommend to everyone I know."],
      ["Absolutely amazing, perfect and wonderful, the best thing ever, so happy with this purchase and would recommend to everyone I know."],
    ]),
    expected: ["text-low-substance", "text-duplicates"],
  },
  {
    name: "rating/text mismatch only",
    reviews: make([
      ["Terrible, awful, worst, hate, useless — a complete waste of money and a total scam.", 5],
      ["Awful and broken, disappointed, waste, terrible product that stopped working immediately.", 5],
      ["Amazing, perfect, love, great, wonderful — the best purchase I have made this year.", 1],
      ["Love it, great, best, amazing, fantastic — absolutely wonderful quality throughout.", 1],
    ]),
    expected: ["rating-text-mismatch"],
  },
  {
    name: "duplicate text only",
    reviews: make([
      [substance, 4], [substance, 4], [substance, 4],
      ["Fine.", 2], ["Okay.", 3], ["Works.", 4],
    ]),
    expected: ["text-duplicates"],
  },
];
