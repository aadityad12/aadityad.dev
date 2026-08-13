import type { Metadata } from "next";
import { Martian_Mono } from "next/font/google";
import "./globals.css";

const martianMono = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aaditya Desai — AI Systems, Software, Infrastructure",
  description: "Aaditya Desai builds AI systems, developer tools, and software close to the machine. Currently building Accordion.",
  metadataBase: new URL("https://aadityad.dev"),
  openGraph: {
    title: "Aaditya Desai — Building the machinery behind intelligence.",
    description: "AI systems, software, and infrastructure. Currently building Accordion.",
    type: "website",
    url: "/",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Aaditya Desai — Building the machinery behind intelligence." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aaditya Desai — Building the machinery behind intelligence.",
    description: "AI systems, software, and infrastructure. Currently building Accordion.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={martianMono.variable}>{children}</body>
    </html>
  );
}
