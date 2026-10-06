import { C, SANS, MONO, doc, t, lines, dotGrid } from "../lib/svg.mjs";

// The eight steps, each with the receipt that proves I do it. Two columns read top to bottom;
// the track runs through the number badges and loops from step 04 up to step 05.
const steps = [
  { n: "01", verb: "Validate", body: "Talk to users and build a scoring prototype before a full build.", receipt: "ParchiVisa: validated first, then live in six weeks.", c: C.violet },
  { n: "02", verb: "Model", body: "Schema and rules first. Business rules live as data, not code branches.", receipt: "Four country engines run on rules kept as data.", c: C.violet },
  { n: "03", verb: "Build", body: "One thin slice, end to end, before anything gets polished.", receipt: "ParchiVisa intake, scoring, PDF and payment run with no manual steps.", c: C.cyan },
  { n: "04", verb: "Break", body: "Write the failure cases early: timeouts, duplicates, retries, over-refunds.", receipt: "Cascade: 45 tests, integration tests on a real PostgreSQL.", c: C.cyan },
  { n: "05", verb: "Ship", body: "Docker, CI, one deploy. A live preview from week one, weekly written updates.", receipt: "Cascade: Docker plus CI on GitHub Actions.", c: C.green },
  { n: "06", verb: "Run", body: "Monitor it, fix it fast. As sole engineer, nobody else to hand a failure to.", receipt: "ParchiVisa: AWS Lightsail behind Cloudflare, watched by Sentry.", c: C.green },
  { n: "07", verb: "Hand over", body: "Code, accounts and keys sit in your own GitHub and cloud from day one.", receipt: "Two weeks of fixes after launch are in the quoted price.", c: C.amber },
  { n: "08", verb: "Write it down", body: "Say what the project does not do yet, in public, next to what it does.", receipt: "Every case study on my site has an Honest limits section.", c: C.pink },
];

export function shipLoop() {
  const w = 830;
  const m = 20; // outer margin
  const gutter = 20;
  const cw = (w - 2 * m - gutter) / 2;
  const ch = 132;
  const rgap = 16;
  const y0 = 24;
  const h = y0 + 4 * ch + 3 * rgap + 24;
  const grid = dotGrid(w, h, { id: "sl" });
  const tx = 82; // text offset inside a card
  const textW = cw - tx - 20;

  const pos = steps.map((_, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i % 4;
    return { x: m + col * (cw + gutter), y: y0 + row * (ch + rgap) };
  });
  const badge = (i) => [pos[i].x + 40, pos[i].y + ch / 2];

  const b = steps.map((_, i) => badge(i));
  const gapX = m + cw + gutter / 2;
  const bottomY = pos[3].y + ch + rgap / 2;
  const track = `M${b[0][0]} ${b[0][1]} L${b[3][0]} ${b[3][1]} L${b[3][0]} ${bottomY} L${gapX} ${bottomY} L${gapX} ${b[4][1]} L${b[4][0]} ${b[4][1]} L${b[7][0]} ${b[7][1]}`;

  const cards = steps
    .map((s, i) => {
      const { x, y } = pos[i];
      const body = lines(s.body, x + tx, y + 54, { fs: 12.4, maxPx: textW, fill: C.muted, lh: 1.4 });
      const recY = y + 54 + body.height + 8;
      const rec = lines(s.receipt, x + tx + 14, recY + 10, { fs: 10.8, maxPx: textW - 14, fill: s.c, mono: true, lh: 1.35 });
      const used = recY + 10 + (rec.count - 1) * 10.8 * 1.35 - y;
      if (used > ch - 8) throw new Error(`ship-loop card ${s.n} overflows by ${(used - ch + 8).toFixed(0)}px`);
      return `
  <g>
    <rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="16" fill="url(#card)" stroke="${s.c}" stroke-opacity=".38"/>
    <rect x="${x}" y="${y + 18}" width="3" height="${ch - 36}" rx="1.5" fill="${s.c}"/>
    <circle cx="${x + 40}" cy="${y + ch / 2}" r="23" fill="${C.bg}" stroke="${s.c}" stroke-width="1.5"/>
    ${t(s.n, x + 40, y + ch / 2 + 6, { fs: 16, weight: 800, fill: s.c, mono: true, anchor: "middle" })}
    ${t(s.verb, x + tx, y + 30, { fs: 17, weight: 700, fill: C.text })}
    ${body.svg}
    <rect x="${x + tx}" y="${recY - 1}" width="3" height="${rec.count * 10.8 * 1.35 + 2}" rx="1.5" fill="${s.c}" opacity=".6"/>
    ${rec.svg}
  </g>`;
    })
    .join("");

  const css = `
    .track{stroke-dasharray:4 9;animation:run 1.6s linear infinite}
    @keyframes run{to{stroke-dashoffset:-26}}
  `;

  const body = `
  ${grid.body}
  <path class="track" d="${track}" fill="none" stroke="url(#brand)" stroke-width="2" opacity=".85"/>
  <circle r="5" fill="${C.cyan}" filter="url(#glow)"><animateMotion dur="12s" repeatCount="indefinite" path="${track}"/></circle>
  ${cards}
`;
  return doc({
    w,
    h,
    title: "How I ship a system, in eight steps",
    desc: steps.map((s) => `${s.n} ${s.verb}: ${s.body} Receipt: ${s.receipt}`).join(" "),
    body,
    css,
    defs: grid.defs,
  });
}
