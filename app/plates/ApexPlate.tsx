"use client";

import { useId } from "react";
import { Hatch, PlateFrame } from "./PlateFrame";

const trackers = [
  { label: "Study", top: 178, row: 188, bar: 93, bus: "M235 205h23l17 -17h45" },
  { label: "Screen", top: 250, row: 221, bar: 121, bus: "M235 277h28l34 -56h23" },
  { label: "Budget", top: 322, row: 254, bar: 75, bus: "M235 349h34l37 -37v-45l13 -13h1" },
] as const;

// The last square is reserved for today's score.
const history = ["ink", "hair", "paper", "ink", "hair", "ink", "ink",
  "hair", "ink", "ink", "paper", "ink", "hair", "ink",
  "ink", "paper", "hair", "ink", "ink", "hair", "paper"];

function TrackerIcon({ label }: { label: (typeof trackers)[number]["label"] }) {
  if (label === "Study") {
    return (
      <>
        <path d="M-5 -17H5 M0 -17v4 M10 -10l3 -3" strokeWidth="2.5" />
        <circle cy="2" r="13" fill="var(--paper)" />
        <path data-part="study-ring" d="M0 -7a9 9 0 1 1 -8.7 11.3" pathLength="100" strokeDasharray="100" strokeWidth="4" />
        <path d="M0 2l4 -4" strokeWidth="1.8" />
      </>
    );
  }
  if (label === "Screen") {
    return (
      <>
        <rect x="-15" y="-11" width="30" height="22" rx="3" fill="var(--paper)" />
        <path d="M-5 14H5 M0 11v3" />
        <path data-part="screen-meter" d="M-10 1H4" strokeWidth="5" strokeLinecap="butt" />
        <path d="M7 -5v12" strokeWidth="1.4" />
      </>
    );
  }
  return (
    <>
      <path d="M-14 -15H6v28l-4 -3 -4 3 -4 -3 -4 3 -4 -3Z" fill="var(--paper)" />
      <path d="M-10 -8H2 M-10 -3h8 M-10 2h5" strokeWidth="1.4" />
      <g data-part="budget-shackle">
        <path d="M5 4V0a4.5 4.5 0 0 1 9 0v4" strokeWidth="2.5" />
      </g>
      <rect x="2" y="3" width="15" height="12" rx="2" fill="var(--ink)" />
      <path d="M9.5 7v3" stroke="var(--paper)" />
      <path data-part="receipt-scan" d="M-17 -10H1" strokeWidth="2.8" />
    </>
  );
}

export default function ApexPlate({ playing }: { playing: boolean }) {
  const hatch = `apex-hatch-${useId()}`;
  const hatched = `url(#${hatch})`;

  return (
    <PlateFrame name="apextracker" playing={playing}>
      <defs><Hatch id={hatch} /></defs>
      {trackers.map(({ label, top, bus }) => (
        <g key={label} data-tracker={label}>
          <path d={bus} strokeWidth="1.6" />
          <path data-part="tracker-pulse" d={bus} pathLength="100" strokeDasharray="13 110" strokeWidth="4" />
          <g transform={`translate(60 ${top})`}>
            <rect x="2" y="3" width="172" height="54" rx="7" fill={hatched} />
            <rect width="172" height="54" rx="7" fill="var(--paper)" strokeWidth="2.2" />
            <path d="M51 1v52" strokeWidth="1" />
            <g transform="translate(26 27)"><TrackerIcon label={label} /></g>
            <text x="62" y="35">{label}</text>
            <circle cx="175" cy="27" r="3.2" fill="var(--ink)" />
          </g>
        </g>
      ))}

      {/* The write line terminates at the vault's left-hand connector. */}
      <path d="M520 255h56" />
      <path data-part="vault-write" d="M520 255h56" pathLength="100" strokeDasharray="16 110" strokeWidth="4" />

      {/* Handset hardware, status strip and app bar. */}
      <rect x="517" y="154" width="6" height="37" rx="2.5" fill="var(--ink)" />
      <rect x="517" y="202" width="6" height="17" rx="2.5" fill="var(--ink)" />
      <rect x="320" y="90" width="200" height="375" rx="26" fill="var(--paper)" strokeWidth="3.5" />
      <rect x="326" y="96" width="188" height="363" rx="21" fill="var(--paper)" strokeWidth="1.6" />
      <circle cx="420" cy="107" r="3.3" fill="var(--ink)" stroke="none" />
      <path d="M343 109h10m4 0h3" strokeWidth="2.5" />
      <path d="M469 112l7 -7v7Z" fill="var(--ink)" stroke="none" />
      <path d="M480 106q4 -3 8 0l-4 5Z" fill="var(--ink)" stroke="none" />
      <rect x="491" y="105" width="8" height="6" rx="1" strokeWidth="1.3" />
      <path d="M500 107v2" strokeWidth="1.2" />
      <path d="M327 124h186 M327 163h186" strokeWidth="1" />
      <text className="sans" x="339" y="152">today</text>
      <g fill="var(--ink)" stroke="none">
        <circle cx="496" cy="139" r="1.5" /><circle cx="496" cy="144" r="1.5" /><circle cx="496" cy="149" r="1.5" />
      </g>

      {trackers.map(({ label, row, bar }) => (
        <g key={label} data-tracker={label} transform={`translate(339 ${row})`}>
          <rect x="0" y="-9" width="18" height="18" rx="3" fill="var(--paper)" />
          <g data-part="goal-check">
            <rect x="0" y="-9" width="18" height="18" rx="3" fill="var(--ink)" />
            <path d="m3.5 0 3.4 3.6 7.5 -8" stroke="var(--paper)" strokeWidth="2.4" />
          </g>
          <rect x="29" y="-3.5" width="132" height="7" rx="3.5" fill="var(--hair)" stroke="none" />
          <rect x="29" y="-3.5" width={bar} height="7" rx="3.5" fill="var(--ink)" stroke="none" />
        </g>
      ))}

      <path d="M339 275h162" strokeWidth="1" />
      <text className="sans" x="339" y="299">auto-scored</text>
      {history.map((tone, index) => (
        <rect key={index} x={338 + (index % 7) * 24} y={311 + Math.floor(index / 7) * 24}
          width="20" height="20" rx="2" fill={`var(--${tone})`} strokeWidth="1.2" />
      ))}
      <rect data-part="score-today" x="482" y="359" width="20" height="20" rx="2" fill="var(--red)" stroke="none" />

      {/* Four Material destinations followed by the system gesture bar. */}
      <path d="M327 397h186" strokeWidth="1" />
      <rect x="333" y="407" width="37" height="22" rx="11" fill="var(--hair)" stroke="none" />
      <path d="m344 417 7.5 -6 7.5 6v7h-5v-5h-5v5h-5Z" fill="var(--ink)" strokeWidth="1" />
      <path d="M389 424v-6m5 6v-12m5 12v-9" strokeWidth="2.8" />
      <path d="M432 412h13v13h-13Z M435 418l2 2 5 -5" />
      <path d="M478 413h14v12h-14Z M479 413l11 -4v4 M486 417h6v4h-6Z" fill="var(--paper)" />
      <path d="M398 448h44" strokeWidth="4" />

      {/* An inset vault door with a key, locking hasp and offline badge. */}
      <path d="M576 219l9 -9h145l13 13v83l-10 10H582l-6 -6Z" fill={hatched} strokeWidth="2.2" />
      <rect x="583" y="218" width="152" height="90" rx="5" fill="var(--paper)" strokeWidth="2" />
      <rect x="594" y="228" width="129" height="69" rx="4" fill={hatched} strokeWidth="1.3" />
      <rect x="601" y="234" width="115" height="57" rx="3" fill="var(--paper)" />
      <path d="M593 239v13m0 19v13" strokeWidth="4.5" />
      <circle cx="628" cy="261" r="10" strokeWidth="3" /><circle cx="625" cy="261" r="2" fill="var(--ink)" stroke="none" />
      <path d="M638 261h20v6h-5v-3h-6v-3" strokeWidth="2.8" />
      <path data-part="vault-shackle" d="M671 258v-8a8 8 0 0 1 16 0v8" strokeWidth="3.5" />
      <rect x="667" y="256" width="24" height="20" rx="3" fill="var(--ink)" />
      <path d="M679 264v5" stroke="var(--paper)" strokeWidth="2.5" />
      <circle cx="725" cy="215" r="17" fill="var(--paper)" strokeWidth="2" />
      <path d="M718 220a4.5 4.5 0 0 1 -1 -9 7 7 0 0 1 13 -1 5 5 0 0 1 1 10Z" strokeWidth="1.7" />
      <path d="m714 204 22 22" stroke="var(--paper)" strokeWidth="5" /><path d="m714 204 22 22" strokeWidth="2.3" />
      <text x="660" y="347" textAnchor="middle">SQLCipher</text>
      <text className="secondary" x="660" y="371" textAnchor="middle">offline · v26</text>
    </PlateFrame>
  );
}
