"use client";

import { useId, useState } from "react";
import { Hatch, PlateFrame, activateWithKey } from "./PlateFrame";

export default function ScoutPlate({ playing }: { playing: boolean }) {
  const id = `oss-scout-${useId()}`;
  const hatch = `url(#${id}-cut)`;
  const [press, setPress] = useState(0);
  const [posting, setPosting] = useState(false);
  const [lastPlaying, setLastPlaying] = useState(playing);
  if (lastPlaying !== playing) {
    setLastPlaying(playing);
    setPosting(false);
  }
  const post = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPosting(true);
    setPress(value => value + 1);
  };
  return (
    <PlateFrame name="oss-scout" playing={playing || posting} mode={posting ? "post" : undefined} interactive>
      <defs>
        <Hatch id={`${id}-cut`} />
        <clipPath id={`${id}-track`}><rect x="176" y="210" width="468" height="58" /></clipPath>
      </defs>
      <g key={press}>
        <rect x="191" y="317" width="246" height="4" fill="var(--hair)" strokeWidth="0.9" />
        <rect x="191" y="345" width="246" height="4" fill="var(--hair)" strokeWidth="0.9" />
        <rect x="191" y="373" width="246" height="4" fill="var(--hair)" strokeWidth="0.9" />
        <g data-part="stoppers">
          <rect x="423" y="313" width="8" height="12" rx="1" fill="var(--ink)" strokeWidth="1" />
          <rect x="423" y="341" width="8" height="12" rx="1" fill="var(--ink)" strokeWidth="1" />
          <rect x="423" y="369" width="8" height="12" rx="1" fill="var(--ink)" strokeWidth="1" />
        </g>
        <rect x="187" y="260" width="467" height="9" fill="var(--hair)" strokeWidth="1.4" />
        <path d="M187 265 H654" strokeWidth="0.6" />
        <g clipPath={`url(#${id}-track)`}>
          <g data-part="card" onAnimationEnd={() => setPosting(false)}>
            <path d="M161 259 L184 219 L255 219 L264 226 L245 259 Z" fill="var(--paper)" />
            <path d="M185 248 L189 248 L191 244 L187 244 Z" fill="var(--ink)" strokeWidth="0.6" />
            <path d="M195 248 L199 248 L201 244 L197 244 Z" fill="var(--ink)" strokeWidth="0.6" />
            <path d="M205 248 L209 248 L211 244 L207 244 Z" fill="var(--ink)" strokeWidth="0.6" />
          </g>
        </g>
        <path d="M59 248 L71 237 L187 237 L176 248 Z" fill="var(--hair)" />
        <path d="M176 248 L187 237 L187 380 L176 391 Z" fill={hatch} />
        <rect x="59" y="248" width="117" height="143" rx="3" fill="var(--ink)" />
        <circle cx="69" cy="258" r="2.2" fill="var(--paper)" stroke="none" />
        <circle cx="69" cy="381" r="2.2" fill="var(--paper)" stroke="none" />
        <circle cx="166" cy="258" r="2.2" fill="var(--paper)" stroke="none" />
        <circle cx="166" cy="381" r="2.2" fill="var(--paper)" stroke="none" />
        <path d="M76 360l8 -8" stroke="var(--paper)" strokeWidth="1.6" />
        <path d="M83 360l8 -8" stroke="var(--paper)" strokeWidth="1.6" />
        <path d="M90 360l8 -8" stroke="var(--paper)" strokeWidth="1.6" />
        <path d="M97 360l8 -8" stroke="var(--paper)" strokeWidth="1.6" />
        <path d="M104 360l8 -8" stroke="var(--paper)" strokeWidth="1.6" />
        <rect x="119" y="255" width="65" height="12" rx="1.5" fill="var(--paper)" strokeWidth="1.5" />
        <rect x="124" y="259" width="61" height="5" rx="1" fill="var(--ink)" strokeWidth="0.9" />
        <path d="M111 147 A22 22 0 1 0 138 175 A24 24 0 0 1 111 147Z" fill="var(--ink)" strokeWidth="1.3" />
        <rect x="439" y="164" width="35" height="77" fill={hatch} />
        <rect x="434" y="164" width="8" height="77" fill="var(--ink)" strokeWidth="1.2" />
        <rect x="469" y="164" width="9" height="77" fill="var(--paper)" strokeWidth="1.4" />
        <rect x="428" y="173.5" width="47" height="5" rx="1" fill="var(--hair)" strokeWidth="1" />
        <circle cx="477" cy="176" r="4" fill="var(--paper)" strokeWidth="1.2" />
        <rect x="428" y="226.5" width="47" height="5" rx="1" fill="var(--hair)" strokeWidth="1" />
        <circle cx="477" cy="229" r="4" fill="var(--paper)" strokeWidth="1.2" />
        <rect x="439" y="280" width="35" height="124" fill={hatch} />
        <rect x="434" y="280" width="8" height="124" fill="var(--ink)" strokeWidth="1.2" />
        <rect x="469" y="280" width="9" height="124" fill="var(--paper)" strokeWidth="1.4" />
        <rect x="428" y="289.5" width="47" height="5" rx="1" fill="var(--hair)" strokeWidth="1" />
        <circle cx="477" cy="292" r="4" fill="var(--paper)" strokeWidth="1.2" />
        <rect x="428" y="389.5" width="47" height="5" rx="1" fill="var(--hair)" strokeWidth="1" />
        <circle cx="477" cy="392" r="4" fill="var(--paper)" strokeWidth="1.2" />
        <rect x="429" y="402" width="55" height="8" rx="1" fill="var(--ink)" strokeWidth="1" />
        <rect data-part="latch" x="449" y="252" width="15" height="24" rx="1" fill={hatch} strokeWidth="1.4" />
        <rect x="446" y="197" width="21" height="56" rx="2" fill="var(--paper)" strokeWidth="1.7" />
        <rect x="449" y="192" width="15" height="60" rx="1" fill={hatch} strokeWidth="1.1" />
        <g data-part="button">
          <path d="M436 205h41v8h-41z" fill="var(--ink)" />
          <circle cx="456" cy="184" r="20" fill="var(--paper)" />
          <circle cx="456" cy="181" r="17" fill="var(--red)" />
        </g>
        <g data-part="finger-hover">
          <g data-part="finger">
            <g transform="translate(461 147) rotate(35)">
              <path d="M-12 -70 C-13 -52 -12 -36 -12 -23 C-12 -12 -10 -4 -5 -1 Q2 4 8 -2 C14 -8 13 -22 13 -35 L14 -70" fill="var(--paper)" />
              <path d="M-7 -18 C-7 -11 -6 -6 -2 -5 Q4 -3 6 -8 L7 -16 Q1 -21 -7 -18Z" fill="var(--hair)" strokeWidth="0.95" />
              <path d="M-9 -35q5 2 9 1" strokeWidth="0.85" />
            </g>
          </g>
        </g>
        <path d="M642 260 L661 243 L742 243 L723 260 Z" fill="var(--paper)" />
        <path d="M723 260 L742 243 L742 306 L723 324 Z" fill="var(--hair)" />
        <rect x="642" y="260" width="81" height="64" fill="var(--paper)" />
        <rect x="642" y="261" width="50" height="6" fill="var(--ink)" strokeWidth="0.8" />
        <path d="M648 275h68" strokeWidth="0.85" />
      </g>
      <g data-control="post" role="button" tabIndex={0} aria-label="Press to post the reviewed fix"
        onClick={post} onKeyDown={event => activateWithKey(event, post)}>
        <circle cx="456" cy="181" r="55" fill="transparent" stroke="none" />
      </g>
    </PlateFrame>
  );
}
