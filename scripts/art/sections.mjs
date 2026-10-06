import { C, doc, t } from "../lib/svg.mjs";

// Section header: a serif number, a serif headline, a plain subline, and a rule with a short
// rust segment that draws itself once per loop. No tracked uppercase kicker.
export function sectionHeader({ kicker, title, sub }) {
  const w = 830;
  const h = 100;
  const num = kicker.split(" ")[0];
  const css = `
    .seg{stroke-dasharray:70;animation:sg 6s ease-in-out infinite}
    @keyframes sg{0%{stroke-dashoffset:70}18%,100%{stroke-dashoffset:0}}
  `;
  const body = `
  ${t(num, 24, 62, { fs: 42, italic: true, fill: C.rust, font: "lining" })}
  ${t(title, 84, 56, { fs: 29, weight: 700, fill: C.text, font: "serif" })}
  ${sub ? t(sub, 85, 80, { fs: 13.5, fill: C.muted }) : ""}
  <line x1="24" x2="${w - 24}" y1="${h - 12}" y2="${h - 12}" stroke="${C.text}" stroke-width="1"/>
  <line class="seg" x1="24" x2="94" y1="${h - 12}" y2="${h - 12}" stroke="${C.rust}" stroke-width="4"/>
`;
  return doc({
    w,
    h,
    title: `${kicker}: ${title}`,
    desc: sub ? `${title}. ${sub}` : title,
    body,
    css,
  });
}

export const sectionHeaders = [
  { file: "h-ship.svg", kicker: "01 process", title: "How I ship a system", sub: "Eight steps. One owner, from the first schema to the fix after launch." },
  { file: "h-own.svg", kicker: "02 ownership", title: "What sole engineer actually means", sub: "ParchiVisa, layer by layer. Nothing falls between two people because there is one." },
  { file: "h-proof.svg", kicker: "03 receipts", title: "Numbers I can point to", sub: "Each one traces to a repo, the CV, or a live product." },
  { file: "h-systems.svg", kicker: "04 systems", title: "What I have shipped", sub: "Every card says what it is: live, client work, simulated, or not deployed yet." },
  { file: "h-think.svg", kicker: "05 judgment", title: "How I think", sub: "Four times my first instinct was wrong, and what the evidence changed." },
  { file: "h-path.svg", kicker: "06 path", title: "How I got here", sub: "Two internships on real production systems, then a product of my own." },
  { file: "h-live.svg", kicker: "07 proof of work", title: "Activity, straight from GitHub", sub: "Generated daily by a workflow in this repo. Nothing on this card is typed by hand." },
  { file: "h-stack.svg", kicker: "08 toolbox", title: "Things I have shipped with", sub: "Not things I have read about." },
  { file: "h-work.svg", kicker: "09 working together", title: "Work with me", sub: "For founders who need a system built and someone to stand behind it." },
];
