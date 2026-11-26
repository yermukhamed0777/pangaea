import type { Offer, Review } from "./types";

/**
 * SYNTHETIC demo data. Written by hand for testing the engine.
 * It is NOT real customer feedback and must never be presented as such.
 * It deliberately contains a burst, repeated phrasing, heavy five-star skew,
 * low-substance text, an unverified cluster, and a rating/text mismatch.
 */
const DEMO: Array<[number, string, string, string, boolean]> = [
  [5, "2026-03-02", "mira.k", "Texture is light and absorbs in about 20 seconds. No white cast on medium skin, 50 ml bottle lasted two months.", true],
  [5, "2026-03-03", "denis_a", "Bought for my wife as a gift, she says the packaging is nice and the texture feels light on the skin.", false],
  [5, "2026-03-03", "sunrise99", "Absolutely amazing, perfect, love it, best product ever, so happy with this purchase!", false],
  [5, "2026-03-03", "quickbuyer", "Absolutely amazing, perfect, love it, best product ever, so happy with this purchase!", false],
  [5, "2026-03-03", "shopper_7", "Absolutely amazing, perfect, love it, best product ever, so happy with this purchase!", false],
  [5, "2026-03-04", "mira.k", "Repurchased. The 50 ml size is good value and the formula does not pill under makeup.", true],
  [4, "2026-03-06", "anna_p", "Good sunscreen but the cap feels cheap. Takes about 15 seconds to absorb, no strong smell.", true],
  [5, "2026-03-08", "tulpan", "Great texture, no cast, works under foundation. Would buy the 50 ml again.", true],
  [5, "2026-03-09", "altyn", "Perfect, best, amazing, love it, wonderful product, very happy!", false],
  [5, "2026-03-09", "altyn", "Perfect, best, amazing, love it, wonderful product, very happy!", false],
  [3, "2026-03-12", "zhanar", "It is fine. Packaging is small for the price. It took three weeks to arrive, delivery was slow.", true],
  [5, "2026-04-02", "bakyt", "I use it every morning. No white cast, 50 ml lasts about six weeks, skin feels calm.", true],
  [4, "2026-04-11", "dias", "Decent SPF. Slightly oily for my skin but no irritation. Shipping took 9 days.", true],
  [1, "2026-04-19", "ermek", "Terrible. The bottle arrived leaking and the seller did not respond. Waste of money.", true],
  [5, "2026-05-01", "gulnara", "Love it, perfect, amazing. Bought as a present for my mom and she loves it too.", false],
  [4, "2026-05-14", "nurlan", "Works as described. 50 ml, no cast, reasonable price compared to the pharmacy version.", true],
  [5, "2026-06-03", "aygerim", "Best sunscreen I have used, texture is light and it absorbs quickly, no smell.", true],
  [2, "2026-06-22", "rustam", "Awful for oily skin, feels greasy after 30 minutes. The cap broke on day two.", true],
  [5, "2026-07-08", "mira.k", "Third bottle. Consistent formula, 50 ml, no cast, good under makeup.", true],
  [5, "2026-07-30", "samara", "Absolutely amazing, perfect, love it, best product ever, so happy with this purchase!", false],
];

export function demoReviews(): Review[] {
  return DEMO.map(([rating, date, author, text, verified], i) => ({
    id: `d${i + 1}`, rating, date, author, text, verified,
  }));
}

export function demoText(): string {
  return DEMO.map(([rating, date, author, text]) => `${rating} | ${date} | ${author} | ${text}`).join("\n");
}

/** Illustrative offers used by the workbench and the walkthrough fixtures. */
export function demoOffers(): Offer[] {
  return [
    { shop: "Shop A", price: 42, units: 1, shipping: 8.5, dutyPct: 8, vatPct: 12 },
    { shop: "Shop B", price: 34, units: 2, shipping: 6, dutyPct: 8, vatPct: 12 },
    { shop: "Shop C", price: 29.9, units: 1, shipping: 12, dutyPct: 0, vatPct: 12 },
  ];
}
