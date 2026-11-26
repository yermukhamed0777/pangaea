export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string | null;
  verified: boolean | null;
  text: string;
};

export type Signal = {
  key: string;
  label: string;
  family: "timing" | "text" | "rating" | "identity" | "verification";
  severity: "watch" | "notable" | "strong";
  confidence: number;
  observed: string;
  benign: string;
  concern: string;
  evidenceIds: string[];
};

export type Analysis = {
  count: number;
  average: number;
  cleanAverage: number | null;
  distribution: number[];
  /** Number of reviews removed from the adjusted average. */
  excluded: number;
  /** Every removed review ID, so the adjusted average is reproducible. */
  excludedIds: string[];
  signals: Signal[];
  limits: string[];
};

export type Offer = {
  shop: string;
  price: number;
  units: number;
  shipping: number;
  dutyPct: number;
  vatPct: number;
};

export type CostResult = {
  shop: string;
  itemCost: number;
  duty: number;
  vat: number;
  shipping: number;
  total: number;
  perUnit: number;
};
