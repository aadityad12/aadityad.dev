import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Mono, Manrope } from "next/font/google";
import "./globals.css";
import "./stages.css";
import "./labs.css";
import "./alta.css";

const sans = Manrope({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"], display: "swap" });
const mono = DM_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: "Aaditya Desai — I wonder. Then I build.",
  description: "Computer engineering at SJSU. AI agents, handwritten ARM64, embedded vision, and local-first Android. Explore the builds. Available for Summer 2027 internships.",
  metadataBase: new URL("https://aadityad.dev"),
  alternates: { canonical: "/" },
  icons: { icon: [{ url: "/favicon.svg?v=3", type: "image/svg+xml" }] },
  openGraph: { title: "Aaditya Desai — I wonder. Then I build.", description: "A few answers to what if. AI tools, language runtimes, embedded vision, and Android builds.", type: "website", url: "/", images: [{ url: "/og-noir.png", width: 1200, height: 630, alt: "Aaditya Desai — I wonder. Then I build." }] },
  twitter: { card: "summary_large_image", title: "Aaditya Desai — I wonder. Then I build.", description: "Computer engineer & builder. Explore the work.", images: ["/og-noir.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning className={`${sans.variable} ${display.variable} ${mono.variable}`}><head><script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js")' }} /></head><body>{children}</body></html>;
}
