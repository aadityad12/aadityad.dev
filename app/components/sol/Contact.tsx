"use client";

import { useState } from "react";
import Link from "next/link";
import { contact } from "../../lib/portfolio";
import { Arrow, Mark } from "./Icons";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }
  return <footer id="contact" className="contact-section">
    <div className="wrap"><div className="contact-eyebrow"><span className="eyebrow">04 / NEXT CHAPTER</span><span className="availability"><i /> OPEN TO 2027 OPPORTUNITIES</span></div>
      <div className="contact-main"><h2>Let’s build<br />something <em>real.</em></h2><a className="contact-arrow" href={`mailto:${contact.email}`} aria-label="Email Aaditya Desai"><Arrow diagonal /></a></div>
      <div className="contact-bottom"><div className="email-row"><a href={`mailto:${contact.email}`}>{contact.email}</a><button onClick={copyEmail} aria-label="Copy email address">{copied ? "COPIED ✓" : "COPY"}<span aria-live="polite" className="sr-only">{copied ? "Email copied to clipboard." : failed ? `Could not copy. Email ${contact.email}` : ""}</span></button></div><div className="contact-links"><a href={contact.github} target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a><a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow diagonal /></a><a href={contact.resume} target="_blank" rel="noreferrer">Résumé <Arrow diagonal /></a></div></div>
      <div className="colophon"><Link href="/" aria-label="Aaditya Desai, home"><Mark /> <span>MADE WITH INTENTION. BUILT BY AADITYA.</span></Link><span>SANTA CLARA, CALIFORNIA</span><a href="#top">BACK TO TOP ↑</a></div>
    </div>
  </footer>;
}
