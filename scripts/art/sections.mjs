import { C, SANS, MONO, doc, t, lines } from "../lib/svg.mjs";

// Section header strip: a mono kicker, a bold headline, and a gradient rule that draws itself.
export function sectionHeader({ kicker, title, sub, id }) {
  const w = 830;
  const h = 104;
  const css = `
    .rule{stroke-dasharray:830;stroke-dashoffset:0;animation:draw 5s ease-in-out infinite}
    @keyframes draw{0%{stroke-dashoffset:830}30%,85%{stroke-dashoffset:0}100%{stroke-dashoffset:-830}}
    .tick{animation:tk 2.2s ease-in-out infinite}
    @keyframes tk{0%,100%{opacity:1}50%{opacity:.3}}
  `;
  const body = `
  <rect x="24" y="26" width="8" height="8" rx="2" fill="${C.cyan}" class="tick"/>
  ${t(kicker.toUpperCase(), 44, 34, { fs: 12.5, mono: true, fill: C.cyan, ls: 2.5 })}
  ${t(title, 24, 70, { fs: 30, weight: 800, fill: C.text })}
  ${sub ? t(sub, 24, 92, { fs: 13.5, fill: C.muted }) : ""}
  <line class="rule" x1="0" y1="${h - 2}" x2="${w}" y2="${h - 2}" stroke="url(#brand)" stroke-width="3"/>
`;
  return doc({
    w,
    h,
    title: `${kicker}: ${title}`,
    desc: sub ? `${title}. ${sub}` : title,
    body,
    css,
    radius: 14,
  });
}

export const sectionHeaders = [
  { file: "h-ship.svg", kicker: "01 · process", title: "How I ship a system", sub: "Eight steps. One owner, from the first schema to the fix after launch." },
  { file: "h-own.svg", kicker: "02 · ownership", title: "What sole engineer actually means", sub: "ParchiVisa, layer by layer. Nothing falls between two people because there is one." },
  { file: "h-proof.svg", kicker: "03 · receipts", title: "Numbers I can point to", sub: "Each one traces to a repo, the CV, or a live product." },
  { file: "h-systems.svg", kicker: "04 · systems", title: "What I have shipped", sub: "Every card says what it is: live, client work, simulated, or not deployed yet." },
  { file: "h-think.svg", kicker: "05 · judgment", title: "How I think", sub: "Four times my first instinct was wrong, and what the evidence changed." },
  { file: "h-path.svg", kicker: "06 · path", title: "How I got here", sub: "Two internships on real production systems, then a product of my own." },
  { file: "h-live.svg", kicker: "07 · proof of work", title: "Activity, straight from GitHub", sub: "Generated daily by a workflow in this repo. Nothing on this card is typed by hand." },
  { file: "h-stack.svg", kicker: "08 · toolbox", title: "Things I have shipped with", sub: "Not things I have read about." },
  { file: "h-work.svg", kicker: "09 · working together", title: "Work with me", sub: "For founders who need a system built and someone to stand behind it." },
];
