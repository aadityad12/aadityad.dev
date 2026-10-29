import type { Metadata } from "next";
import { DM_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const sans = Instrument_Sans({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ variable: "--font-display", subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap" });
const mono = DM_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: "Aaditya Desai — Big ideas. Real constraints.",
  description: "Computer engineering at SJSU. AI agents, handwritten ARM64, embedded vision, and local-first Android. Explore the builds. Available for Summer 2027 internships.",
  metadataBase: new URL("https://aadityad.dev"),
  alternates: { canonical: "/" },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
  openGraph: { title: "Aaditya Desai — Big ideas. Real constraints.", description: "From the silicon to the interface. An interactive collection of AI tools, language runtimes, embedded vision, and Android builds.", type: "website", url: "/", images: [{ url: "/og-sol.png", width: 1200, height: 630, alt: "Aaditya Desai — Big ideas. Real constraints." }] },
  twitter: { card: "summary_large_image", title: "Aaditya Desai — Big ideas. Real constraints.", description: "Computer engineer & builder. Explore the work.", images: ["/og-sol.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}><body>{children}</body></html>;
}
