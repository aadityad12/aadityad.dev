import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

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

const title = "Aaditya Desai · AD2028 Datasheet";
const description =
  "Computer engineering student at SJSU building from the metal up: an ARM64 JIT, bare-metal firmware, on-device vision, and tools for AI agents. Available for Summer 2027 internships.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://aadityad.dev"),
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
  openGraph: { title, description, type: "website", url: "/", images: [{ url: "/og.png", width: 1200, height: 630, alt: title }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export const viewport: Viewport = { themeColor: "#e9e7e0" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${plexMono.variable}`}>{children}</body>
    </html>
  );
}
