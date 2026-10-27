import type { Metadata } from "next";
import { Caveat, Fraunces, Instrument_Sans, Martian_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const martianMono = Martian_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aaditya Desai | Computer Engineering @ SJSU",
  description:
    "Computer engineering student at SJSU. Projects in embedded vision, language runtimes, Android, and AI tooling. Looking for 2027 internships and co-ops.",
  metadataBase: new URL("https://aadityad.dev"),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Aaditya Desai | Computer Engineering @ SJSU",
    description:
      "Embedded vision, language runtimes, Android, and AI tooling. Computer engineering @ SJSU, looking for 2027 internships and co-ops.",
    type: "website",
    url: "/",
    images: [{ url: "/og-v3.png", width: 1200, height: 630, alt: "Aaditya Desai | Computer Engineering @ SJSU" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aaditya Desai | Computer Engineering @ SJSU",
    description:
      "Embedded vision, language runtimes, Android, and AI tooling. Computer engineering @ SJSU, looking for 2027 internships and co-ops.",
    images: ["/og-v3.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${instrumentSans.variable} ${martianMono.variable} ${caveat.variable}`}>
        {children}
      </body>
    </html>
  );
}
