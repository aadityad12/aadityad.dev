import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { EMAIL, GITHUB, HERO, LINKEDIN } from "./content";

const archivo = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const title = "Aaditya Desai · Computer Engineering @ SJSU";
const description = `${HERO.lead} Available for Summer 2027 internships.`;

export const metadata: Metadata = {
  title: { default: title, template: "%s · Aaditya Desai" },
  description,
  metadataBase: new URL("https://aadityad.dev"),
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
  openGraph: { siteName: "Aaditya Desai", type: "website", locale: "en_US" },
};

export const viewport: Viewport = { themeColor: "#e9e7e0" };

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
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
