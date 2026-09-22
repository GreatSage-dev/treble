import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TREBLE — Autonomous Statutory Tenant Deposit Defense",
  description:
    "An autonomous legal engine that reads your deposit statement, finds every unlawful deduction under California Civil Code § 1950.5, and dispatches a formal statutory demand — in under 60 seconds.",
  openGraph: {
    title: "TREBLE — Your Deposit Is Not a Negotiation",
    description:
      "$36 billion in security deposits are wrongfully withheld every year. 84% of tenants never challenge the deduction. TREBLE changes the math.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="preload"
          href="/fonts/instrument-serif-latin-400-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/jetbrains-mono-latin-500-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-canvas text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
