import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Familjen_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Familjen_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const title = "Aaditya Desai — The interesting part is the limit.";
const description =
  "Computer engineering at San José State. Languages, on-device models, and tools that had to fit inside a real budget. Summer 2027 internships.";

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
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Aaditya Desai. The interesting part is the limit." }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#E6ECEF",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aaditya Desai",
  url: "https://aadityad.dev",
  email: "mailto:aaditya.d.desai@gmail.com",
  jobTitle: "Computer engineering student",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "San José State University",
  },
  sameAs: [
    "https://github.com/aadityad12",
    "https://www.linkedin.com/in/aaditya-desai-12d",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
