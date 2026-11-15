import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Schibsted_Grotesk, Shantell_Sans } from "next/font/google";
import "./globals.css";
import "./styles/figures.css";
import "./styles/work.css";
import "./styles/sections.css";
import "./styles/project.css";
import { EMAIL, GITHUB, HERO, LINKEDIN } from "./content";

const sans = Schibsted_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Mono is for code and for data inside figures, nowhere else.
const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const title = "Aaditya Desai · Computer Engineering @ SJSU";
const description = `${HERO.lead} Looking for a Summer 2027 internship.`;

export const metadata: Metadata = {
  title: { default: title, template: "%s · Aaditya Desai" },
  description,
  metadataBase: new URL("https://aadityad.dev"),
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
  openGraph: { siteName: "Aaditya Desai", type: "website", locale: "en_US" },
};

// Pathfinder's handwriting. Used only inside his drawings (the signpost, his notes).
const hand = Shantell_Sans({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

export const viewport: Viewport = { themeColor: "#f7f8f5" };

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aaditya Desai",
  alternateName: "Aadi Desai",
  url: "https://aadityad.dev",
  email: `mailto:${EMAIL}`,
  jobTitle: "Computer Engineering Student",
  affiliation: { "@type": "CollegeOrUniversity", name: "San José State University" },
  address: { "@type": "PostalAddress", addressLocality: "Santa Clara", addressRegion: "CA", addressCountry: "US" },
  sameAs: [GITHUB, LINKEDIN],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${hand.variable}`} suppressHydrationWarning>
      <head>
        {/* Motion is added on top of visible content, and only once scripts are known to run. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
