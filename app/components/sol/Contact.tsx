"use client";

import { useState } from "react";
import Link from "next/link";
import { contact } from "../../lib/portfolio";
import { Arrow } from "./Icons";

export default function Contact() {
  const [status, setStatus] = useState("");
  async function copy() {
    try { await navigator.clipboard.writeText(contact.email); setStatus("Copied."); }
    catch { setStatus(`Email me at ${contact.email}`); }
  }
  return <footer id="contact" className="contact-section"><div className="wrap"><div className="contact-eyebrow"><span className="eyebrow">03 / LET’S FIND OUT.</span><span className="contact-availability"><i /> OPEN TO 2027 OPPORTUNITIES</span></div><div className="contact-main"><h2>Got a good<br /><span>what if?</span></h2><a className="contact-arrow" href={`mailto:${contact.email}`} aria-label="Email Aaditya Desai"><Arrow diagonal /></a></div><div className="contact-bottom"><div className="email-row"><a href={`mailto:${contact.email}`}>{contact.email}</a><button onClick={copy} aria-label="Copy email address">{status === "Copied." ? "Copied ✓" : "Copy"}<span className="sr-only" aria-live="polite">{status}</span></button></div><div className="contact-links"><a href={contact.github} target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a><a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow diagonal /></a><a href={contact.resume} target="_blank" rel="noreferrer">Résumé <Arrow diagonal /></a></div></div><div className="colophon"><Link href="/" className="footer-brand">aaditya.</Link><span>BUILT FROM A FEW TOO MANY “WHAT IFS”.</span><a href="#top">Back to top ↑</a></div></div></footer>;
}
