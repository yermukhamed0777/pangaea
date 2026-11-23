import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dm = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-serif",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  icons: { icon: "/favicon.svg" },
  title: "PANGAEA — Know what you're buying",
  description:
    "PANGAEA reads real buyer feedback, exposes manipulated ratings, and finds the same product for less. Shopping intelligence with nothing to hide.",
  keywords: [
    "review analysis",
    "fake review detection",
    "price comparison",
    "shopping intelligence",
    "PANGAEA",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dm.variable} ${serif.variable} ${mono.variable}`}>
      <body className="font-sans bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
