import type { Metadata } from "next";
import { HERO } from "./content";
import SiteHeader from "./components/SiteHeader";
import Hero from "./components/home/Hero";
import Work from "./components/home/Work";
import Experience from "./components/home/Experience";
import Credentials from "./components/home/Credentials";
import About from "./components/home/About";
import Contact from "./components/home/Contact";
import SiteFooter from "./components/SiteFooter";

const title = "Aaditya Desai · Computer Engineering @ SJSU";
const description = `${HERO.lead} Looking for a Summer 2027 internship.`;
const image = { url: "/og/home.png", width: 1200, height: 630, alt: "Aaditya Desai, computer engineering at San José State: a JIT compiler, bare-metal firmware, on-device vision, tools for AI agents" };

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { title, description, url: "/", siteName: "Aaditya Desai", type: "website", images: [image] },
  twitter: { card: "summary_large_image", title, description, images: [image.url] },
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Work />
        <Experience />
        <Credentials />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
