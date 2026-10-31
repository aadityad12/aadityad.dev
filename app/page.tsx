import type { Metadata } from "next";
import { HERO, RESUME } from "./content";
import Masthead from "./components/Masthead";
import Hero from "./components/brief/Hero";
import Proof from "./components/brief/Proof";
import ProjectIndex from "./components/brief/ProjectIndex";
import Experience from "./components/brief/Experience";
import Credentials from "./components/brief/Credentials";
import About from "./components/brief/About";
import Contact from "./components/brief/Contact";

const title = "Aaditya Desai · Computer Engineering @ SJSU";
const description = `${HERO.lead} Available for Summer 2027 internships.`;
const image = { url: "/og/home.png", width: 1200, height: 630, alt: "Aaditya Desai, computer engineering at SJSU: an ARM64 JIT, bare-metal firmware, on-device vision, tools for AI agents" };

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { title, description, url: "/", siteName: "Aaditya Desai", type: "website", images: [image] },
  twitter: { card: "summary_large_image", title, description, images: [image.url] },
};

export default function Home() {
  return (
    <>
      <Masthead variant="brief" resume={RESUME} />
      <main className="brief" id="main">
        <Hero />
        <Proof />
        <ProjectIndex />
        <Experience />
        <Credentials />
        <About />
      </main>
      <Contact />
    </>
  );
}
