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
  title: "Aaditya Desai — I build strange, useful machines.",
  description:
    "Computer engineering student at SJSU building AI infrastructure, on-device ML, and the occasional robot. Seeking Summer 2027 internships.",
  metadataBase: new URL("https://aadityad.dev"),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Aaditya Desai — I build strange, useful machines.",
    description:
      "AI infrastructure, on-device ML, and the occasional robot. Computer engineering @ SJSU, seeking Summer 2027 internships.",
    type: "website",
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Aaditya Desai — I build strange, useful machines." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aaditya Desai — I build strange, useful machines.",
    description:
      "AI infrastructure, on-device ML, and the occasional robot. Computer engineering @ SJSU, seeking Summer 2027 internships.",
    images: ["/og.png"],
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
