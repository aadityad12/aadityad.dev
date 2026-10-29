import type { Metadata, Viewport } from "next";
import "@/lab/project-artifacts.css";
import "@/lab/visionassist-artifact.css";
import "@/lab/visionassist-directions.css";
import "@/lab/project-reels.css";
import "@/lab/alta-artifact.css";
import "./globals.css";
import { EMAIL, GITHUB, LINKEDIN } from "./content";

const title = "Aaditya Desai | Computer Engineering @ SJSU";
const description =
  "Computer engineering student at San José State. ARM64 JIT compilers, bare-metal firmware, on-device vision with Infineon, and award-winning AI developer tools. Open to Summer 2027 internships.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://aadityad.dev"),
  alternates: { canonical: "/" },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
  openGraph: {
    title,
    description,
    type: "website",
    url: "/",
    siteName: "Aaditya Desai",
    images: [{ url: "/og-v4.png", width: 1200, height: 630, alt: "Aaditya Desai, computer engineering at SJSU" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-v4.png"] },
};

export const viewport: Viewport = { themeColor: "#EEECF7" };

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
