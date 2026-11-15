import Link from "next/link";
import { EMAIL, GITHUB, HERO, LINKEDIN, RESUME } from "../../content";
import HeroScene from "./HeroScene";

// The five facts under the hero. Each one is a claim a recruiter can check one click away.
const FACTS: { big: string; rest: string; href: string }[] = [
  { big: "Infineon", rest: "research intern and technical lead", href: "/work/visionassist/" },
  { big: "Hackathon winner", rest: "UC Berkeley AI Hackathon 2026", href: "/work/accordion/" },
  { big: "Top 6 finalist", rest: "AIE Code Summit 2026", href: "/work/sisyphus/" },
  { big: "3.8 GPA", rest: "Dean's Scholar, teaching assistant", href: "#education" },
  { big: "Summer 2027", rest: "looking for an internship", href: "#contact" },
];

export default function Hero() {
  return (
    <section className="wrap" aria-label="Introduction">
      <div className="hero">
        <div>
          <p className="hero-who">{HERO.who}</p>
          <h1>
            Aaditya
            <br />
            Desai
          </h1>
          <p className="hero-lede">
            I build things like <Link href="/work/visionassist/">a wearable that tells a blind person what&rsquo;s ahead</Link>,{" "}
            <Link href="/work/alta/">a lab assistant that walks students to the fault in their circuit</Link>, and{" "}
            <Link href="/work/accordion/">tools that keep AI coding agents on track</Link>.
          </p>
          <div className="hero-cta">
            <a className="btn" href={RESUME}>Résumé (PDF)</a>
            <a className="btn quiet" href={`mailto:${EMAIL}`}>Email me</a>
            <a className="btn quiet" href={GITHUB}>GitHub</a>
            <a className="btn quiet" href={LINKEDIN}>LinkedIn</a>
          </div>
        </div>
        <HeroScene />
      </div>
      <ul className="facts">
        {FACTS.map((f) => (
          <li key={f.big}>
            <Link href={f.href}>
              <b>{f.big}</b>
              {f.rest}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
