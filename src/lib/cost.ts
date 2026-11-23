import type { Offer, CostResult } from "./types";

/**
 * Landed cost per unit.
 *
 * itemCost   = price × units
 * duty       = itemCost × dutyPct
 * vat        = (itemCost + duty + shipping) × vatPct
 * total      = itemCost + duty + vat + shipping
 * perUnit    = total / units
 *
 * Percentages are supplied by the user because jurisdictions and product
 * categories vary. No external tax API, no network, no keys.
 */
export function landedCost(offer: Offer): CostResult {
  const itemCost = Math.max(0, offer.price) * Math.max(1, offer.units);
  const duty = itemCost * (Math.max(0, offer.dutyPct) / 100);
  const shipping = Math.max(0, offer.shipping);
  const vat = (itemCost + duty + shipping) * (Math.max(0, offer.vatPct) / 100);
  const total = itemCost + duty + vat + shipping;
  const perUnit = total / Math.max(1, offer.units);
  return {
    shop: offer.shop,
    itemCost: r(itemCost), duty: r(duty), vat: r(vat), shipping: r(shipping),
    total: r(total), perUnit: r(perUnit),
  };
}

export function compareOffers(offers: Offer[]): CostResult[] {
  return offers.filter((o) => o.price > 0).map(landedCost).sort((a, b) => a.perUnit - b.perUnit);
}

export function savingPercent(results: CostResult[]): number {
  if (results.length < 2) return 0;
  const worst = results[results.length - 1].perUnit;
  const best = results[0].perUnit;
  if (!worst) return 0;
  return Math.round(((worst - best) / worst) * 1000) / 10;
}

function r(n: number): number {
  return Math.round(n * 100) / 100;
}
