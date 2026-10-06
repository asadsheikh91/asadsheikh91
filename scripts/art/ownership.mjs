import { C, SANS, MONO, doc, t, lines, pill, pillFlow, dotGrid } from "../lib/svg.mjs";

// ParchiVisa as one diagram, with one owner drawn around all of it. Every box is something the
// site's ParchiVisa case study states; no connection is drawn that the case study doesn't imply.
export function ownership() {
  const w = 830;
  const h = 528;
  const grid = dotGrid(w, h, { id: "ow" });

  const box = (x, y, bw, bh, title, sub, c, delay = 0, tfs = 14.5, lineMax = bw - 28) => {
    const s = lines(sub, x + 14, y + 46, { fs: 11, maxPx: lineMax, fill: C.muted, lh: 1.38 });
    return `
  <g class="bx" style="animation-delay:${delay}s">
    <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="12" fill="url(#card)" stroke="${c}" stroke-opacity=".5"/>
    <rect x="${x}" y="${y}" width="${bw}" height="3" rx="1.5" fill="${c}"/>
    ${t(title, x + 14, y + 28, { fs: tfs, weight: 700, fill: C.text })}
    ${s.svg}
  </g>`;
  };

  // Row 1: the request path.
  const r1y = 128;
  const r1h = 88;
  const r1w = 170;
  const r1x = [44, 238, 432, 626];
  const row1 = [
    box(r1x[0], r1y, r1w, r1h, "Student", "Opens the app in a browser", C.dim, 0),
    box(r1x[1], r1y, r1w, r1h, "Next.js", "TypeScript. Clerk sign-in. Intake and report pages", C.violet, 0.5),
    box(r1x[2], r1y, r1w, r1h, "Cloudflare", "Sits in front of the API", C.amber, 1),
    box(r1x[3], r1y, r1w, r1h, "FastAPI", "The service everything else hangs off", C.cyan, 1.5),
  ].join("");
  const arrows = [0, 1, 2]
    .map((i) => {
      const x1 = r1x[i] + r1w;
      const x2 = r1x[i + 1];
      return `<line class="flow" x1="${x1 + 2}" y1="${r1y + r1h / 2}" x2="${x2 - 4}" y2="${r1y + r1h / 2}" stroke="url(#brand)" stroke-width="2"/><path d="M${x2 - 8} ${r1y + r1h / 2 - 4} L${x2 - 2} ${r1y + r1h / 2} L${x2 - 8} ${r1y + r1h / 2 + 4}" fill="none" stroke="${C.cyan}" stroke-width="1.6"/>`;
    })
    .join("");

  // Row 2: what the API does.
  const r2y = 276;
  const r2h = 138;
  const r2w = 138;
  const r2x = [44, 197, 350, 503, 656];
  const row2 = [
    box(r2x[0], r2y, r2w, r2h, "Rules engine", "UK, Australia, Canada, USA. Rules kept as data. It decides the verdict.", C.violet, 0.2, 14),
    box(r2x[1], r2y, r2w, r2h, "Retrieval + LLM", "Official requirements in, a narrative out. It cannot change the verdict.", C.pink, 0.7, 13.5),
    box(r2x[2], r2y, r2w, r2h, "Data layer", "PostgreSQL and Redis. I designed the schema.", C.green, 1.2, 14),
    box(r2x[3], r2y, r2w, r2h, "Report", "One React template, rendered to web and PDF with headless Playwright.", C.cyan, 1.7, 14),
    box(r2x[4], r2y, r2w, r2h, "Payment", "Lives on the same deploy as intake, scoring and PDF.", C.amber, 2.2, 14),
  ].join("");

  // Bus from FastAPI down to the five boxes.
  const busY = 242;
  const fx = r1x[3] + r1w / 2;
  const centers = r2x.map((x) => x + r2w / 2);
  const bus = `
  <path class="flow" d="M${fx} ${r1y + r1h} L${fx} ${busY} L${centers[0]} ${busY}" fill="none" stroke="url(#brand)" stroke-width="2"/>
  ${centers.map((cx) => `<path class="flow" d="M${cx} ${busY} L${cx} ${r2y - 2}" fill="none" stroke="url(#brand)" stroke-width="2"/>`).join("")}`;

  // Row 3: where it runs and what watches it.
  const r3y = 438;
  const hostW = 358;
  const band = (x, bw, title, sub, c) => `
  <g>
    <rect x="${x}" y="${r3y}" width="${bw}" height="48" rx="12" fill="${c}" fill-opacity=".08" stroke="${c}" stroke-opacity=".5" stroke-dasharray="5 4"/>
    ${t(title, x + 16, r3y + 21, { fs: 13.5, weight: 700, fill: C.text })}
    ${t(sub, x + 16, r3y + 38, { fs: 11, fill: C.muted })}
  </g>`;
  const row3 =
    band(44, hostW, "AWS Lightsail", "The API and the data run here, behind Cloudflare.", C.amber) +
    band(44 + hostW + 16, hostW + 12, "Sentry", "Watching for errors, so I hear about a failure first.", C.red);

  // The owner ring.
  const ring = `
  <rect class="ring" x="22" y="100" width="${w - 44}" height="406" rx="20" fill="none" stroke="${C.violet}" stroke-opacity=".7" stroke-width="1.5" stroke-dasharray="7 6"/>
  <rect x="38" y="90" width="196" height="22" rx="11" fill="${C.bg}" stroke="${C.violet}" stroke-opacity=".7"/>
  ${t("OWNED BY ONE ENGINEER", 136, 105, { fs: 10.5, mono: true, fill: C.violet, anchor: "middle", ls: 1.8 })}`;

  const head = `
  ${t("ParchiVisa, drawn as the system it is", 24, 40, { fs: 22, weight: 800, fill: C.text })}
  ${t("Boxes are from the public case study. The ring is the point: I designed, built, deployed and run every one of them.", 24, 64, { fs: 12.5, fill: C.muted })}`;

  const css = `
    .flow{stroke-dasharray:4 7;animation:fl 1.2s linear infinite}
    @keyframes fl{to{stroke-dashoffset:-22}}
    .ring{animation:rg 6s ease-in-out infinite}
    @keyframes rg{0%,100%{stroke-opacity:.35}50%{stroke-opacity:.9}}
    .bx{animation:bx 5s ease-in-out infinite}
    @keyframes bx{0%,100%{opacity:1}50%{opacity:.82}}
  `;

  const body = `
  ${grid.body}
  ${head}
  ${ring}
  ${arrows}
  ${bus}
  ${row1}
  ${row2}
  ${row3}
  ${[0, 1, 2].map((i) => `<circle r="4" fill="${C.cyan}" filter="url(#glow)"><animateMotion dur="1.8s" begin="${i * 0.6}s" repeatCount="indefinite" path="M${r1x[i] + r1w + 2} ${r1y + r1h / 2} L${r1x[i + 1] - 4} ${r1y + r1h / 2}"/></circle>`).join("")}
  <circle r="4" fill="${C.cyan}" filter="url(#glow)"><animateMotion dur="3.4s" repeatCount="indefinite" path="M${fx} ${r1y + r1h} L${fx} ${busY} L${centers[2]} ${busY} L${centers[2]} ${r2y - 2}"/></circle>
`;

  return doc({
    w,
    h,
    title: "ParchiVisa architecture, owned end to end by one engineer",
    desc: "A student uses the Next.js app, which calls a FastAPI service behind Cloudflare. The service runs a rules engine for four countries, retrieval plus an LLM that writes the narrative, a PostgreSQL and Redis data layer, a report rendered to web and PDF, and payment. It runs on AWS Lightsail and Sentry watches it. One engineer owns all of it.",
    body,
    css,
    defs: grid.defs,
  });
}
