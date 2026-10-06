import { C, doc, t, lines } from "../lib/svg.mjs";

// The eight steps, each with the receipt that proves I do it. Two columns read top to bottom;
// a dashed line runs through the numbers and loops from step 04 across to step 05.
const steps = [
  { n: "01", verb: "Validate", body: "Talk to users and build a scoring prototype before a full build.", receipt: "ParchiVisa: validated first, then live in six weeks.", c: C.blue },
  { n: "02", verb: "Model", body: "Schema and rules first. Business rules live as data, not code branches.", receipt: "Four country engines run on rules kept as data.", c: C.blue },
  { n: "03", verb: "Build", body: "One thin slice, end to end, before anything gets polished.", receipt: "ParchiVisa intake, scoring, PDF and payment run with no manual steps.", c: C.rust },
  { n: "04", verb: "Break", body: "Write the failure cases early: timeouts, duplicates, retries, over-refunds.", receipt: "Cascade: 45 tests, integration tests on a real PostgreSQL.", c: C.rust },
  { n: "05", verb: "Ship", body: "Docker, CI, one deploy. A live preview from week one, weekly written updates.", receipt: "Cascade: Docker plus CI on GitHub Actions.", c: C.green },
  { n: "06", verb: "Run", body: "Monitor it and fix it fast. As sole engineer, there is no one to hand off to.", receipt: "ParchiVisa: AWS Lightsail behind Cloudflare, watched by Sentry.", c: C.green },
  { n: "07", verb: "Hand over", body: "Code, accounts and keys sit in your own GitHub and cloud from day one.", receipt: "Two weeks of fixes after launch are in the quoted price.", c: C.ochre },
  { n: "08", verb: "Write it down", body: "Say what the project does not do yet, in public, next to what it does.", receipt: "Every case study on my site has an Honest limits section.", c: C.plum },
];

export function shipLoop() {
  const w = 830;
  const m = 20;
  const gutter = 20;
  const cw = (w - 2 * m - gutter) / 2;
  const ch = 140;
  const rgap = 16;
  const y0 = 24;
  const h = y0 + 4 * ch + 3 * rgap + 24;
  const tx = 82;
  const textW = cw - tx - 20;

  const pos = steps.map((_, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i % 4;
    return { x: m + col * (cw + gutter), y: y0 + row * (ch + rgap) };
  });
  const b = steps.map((_, i) => [pos[i].x + 40, pos[i].y + ch / 2]);
  const gapX = m + cw + gutter / 2;
  const bottomY = pos[3].y + ch + rgap / 2;
  const track = `M${b[0][0]} ${b[0][1]} L${b[3][0]} ${b[3][1]} L${b[3][0]} ${bottomY} L${gapX} ${bottomY} L${gapX} ${b[4][1]} L${b[4][0]} ${b[4][1]} L${b[7][0]} ${b[7][1]}`;

  const cards = steps
    .map((s, i) => {
      const { x, y } = pos[i];
      const body = lines(s.body, x + tx, y + 54, { fs: 12.6, maxPx: textW, fill: C.muted, lh: 1.4 });
      const recY = y + 54 + body.height + 10;
      const rec = lines(s.receipt, x + tx, recY + 10, { fs: 12, maxPx: textW, fill: s.c, italic: true, font: "serif", lh: 1.35 });
      const used = recY + 10 + (rec.count - 1) * 12 * 1.35 - y;
      if (used > ch - 8) throw new Error(`ship-loop card ${s.n} overflows by ${(used - ch + 8).toFixed(0)}px`);
      return `
  <g>
    <rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="4" fill="url(#card)" stroke="${C.line}"/>
    <rect x="${x}" y="${y}" width="${cw}" height="3" fill="${s.c}"/>
    <circle cx="${x + 40}" cy="${y + ch / 2}" r="23" fill="${C.bg}" stroke="${s.c}" stroke-width="1.5"/>
    ${t(s.n, x + 40, y + ch / 2 + 7, { fs: 20, fill: s.c, anchor: "middle", font: "lining", weight: 700 })}
    ${t(s.verb, x + tx, y + 32, { fs: 18, weight: 700, fill: C.text, font: "serif" })}
    ${body.svg}
    ${rec.svg}
  </g>`;
    })
    .join("");

  const css = `
    .track{stroke-dasharray:3 7;animation:run 2s linear infinite}
    @keyframes run{to{stroke-dashoffset:-20}}
  `;

  const body = `
  <path class="track" d="${track}" fill="none" stroke="${C.rust}" stroke-width="1.8" opacity=".85"/>
  <circle r="4.5" fill="${C.rust}"><animateMotion dur="12s" repeatCount="indefinite" path="${track}"/></circle>
  ${cards}
`;
  return doc({
    w,
    h,
    title: "How I ship a system, in eight steps",
    desc: steps.map((s) => `${s.n} ${s.verb}: ${s.body} Receipt: ${s.receipt}`).join(" "),
    body,
    css,
  });
}
