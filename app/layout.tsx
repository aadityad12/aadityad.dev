import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Condensed, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexCondensed = IBM_Plex_Sans_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aaditya Desai — AD-2027 · Computer Engineering Datasheet",
  description:
    "Preliminary datasheet for a computer engineering student who builds software for awkward constraints: on-device ML, real-time systems, and AI tooling. Available May–Aug 2027.",
  metadataBase: new URL("https://aadityad.dev"),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Aaditya Desai — AD-2027 · Computer Engineering Datasheet",
    description:
      "Software for awkward constraints: 8 ms on-device gaze inference, 200 ms perception on a Pi 5, a 100K-token context budget. Available for Summer 2027 internships.",
    type: "website",
    url: "/",
    images: [{ url: "/og-kimi2.png", width: 1200, height: 630, alt: "Aaditya Desai — Computer Engineering Datasheet" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aaditya Desai — AD-2027 · Computer Engineering Datasheet",
    description:
      "Software for awkward constraints. Computer engineering @ SJSU. Available for Summer 2027 internships.",
    images: ["/og-kimi2.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#fbfbf7",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${plexSans.variable} ${plexCondensed.variable} ${plexMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
