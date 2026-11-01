import type { Metadata } from "next";
import Masthead from "../components/Masthead";
import SkillsMap from "../components/skills/SkillsMap";
import { RESUME } from "../content";

const description = "28 skills, one per pin, and the projects that used each one.";
const image = { url: "/og/home.png", width: 1200, height: 630, alt: "28 skills, one per pin, and the projects that used each one." };

export const metadata: Metadata = {
  title: "Skills",
  description,
  alternates: { canonical: "/skills/" },
  openGraph: { title: "Skills", description, url: "/skills/", images: [image] },
  twitter: { card: "summary_large_image", title: "Skills", description, images: [image.url] },
};

export default function SkillsPage() {
  return (
    <>
      <Masthead variant="brief" resume={RESUME} />
      <main className="skills" id="main"><SkillsMap heading="h1" /></main>
    </>
  );
}
