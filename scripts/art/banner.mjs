import { C, SANS, MONO, doc, dotGrid, t, pill } from "../lib/svg.mjs";

// Hero banner: aurora, a rotating proof line, and a request travelling through the real stack.
export function banner(p) {
  const w = 830;
  const h = 330;
  const grid = dotGrid(w, h);

  const proofs = [
    "shipped ParchiVisa alone in six weeks. it is live.",
    "a timeout is not a decline. the database enforces it.",
    "your code, accounts and keys, in your cloud from day one.",
  ];

  const proofText = proofs
    .map(
      (s, i) =>
        `<text class="proof" style="animation-delay:${i * 4}s" x="72" y="196" font-size="16" fill="${C.cyan}" font-family="${MONO}">${s.replace(/&/g, "&amp;")}</text>`,
    )
    .join("");

  // Right panel: a request walks down the stack the way it does on ParchiVisa.
  const nodes = [
    { label: "next.js", sub: "intake + report", y: 70 },
    { label: "fastapi", sub: "rules decide", y: 128 },
    { label: "postgres", sub: "state", y: 186 },
    { label: "report.pdf", sub: "one template", y: 244 },
  ];
  const nodeSvg = nodes
    .map(
      (n, i) => `
  <g class="node" style="animation-delay:${i * 0.9}s">
    <rect x="610" y="${n.y}" width="172" height="40" rx="10" fill="#ffffff0a" stroke="#ffffff26"/>
    <circle cx="628" cy="${n.y + 20}" r="4" fill="${C.cyan}"/>
    ${t(n.label, 642, n.y + 18, { fs: 13, mono: true, fill: C.text, weight: 600 })}
    ${t(n.sub, 642, n.y + 32, { fs: 10.5, mono: true, fill: C.dim })}
  </g>`,
    )
    .join("");
  const links = nodes
    .slice(0, -1)
    .map((n, i) => `<line x1="696" y1="${n.y + 40}" x2="696" y2="${nodes[i + 1].y}" stroke="#ffffff26" stroke-dasharray="3 4"/>`)
    .join("");

  const live = pill("ParchiVisa is live", 48, 262, { fs: 12.5, h: 30, fill: "#34d3991c", stroke: "#34d39955", color: C.green, px: 16 });
  const chips = [
    pill("Sole engineer, end to end", 48 + live.width + 10, 262, { fs: 12.5, h: 30, px: 16, color: C.text }),
  ];
  const chip2x = 48 + live.width + 10 + chips[0].width + 10;
  const chip3 = pill("Web apps · AI · Payments", chip2x, 262, { fs: 12.5, h: 30, px: 16, color: C.text });

  const css = `
    .a1{animation:d1 14s ease-in-out infinite}
    .a2{animation:d2 17s ease-in-out infinite}
    .a3{animation:d3 20s ease-in-out infinite}
    @keyframes d1{0%,100%{transform:translate(0,0)}50%{transform:translate(90px,40px)}}
    @keyframes d2{0%,100%{transform:translate(0,0)}50%{transform:translate(-110px,30px)}}
    @keyframes d3{0%,100%{transform:translate(0,0)}50%{transform:translate(-60px,-50px)}}
    .proof{opacity:0;animation:cyc 12s infinite}
    @keyframes cyc{0%{opacity:0;transform:translateY(6px)}4%,29%{opacity:1;transform:translateY(0)}33%,100%{opacity:0;transform:translateY(-6px)}}
    .node{animation:nodepulse 3.6s infinite}
    @keyframes nodepulse{0%,100%{opacity:.62}12%,30%{opacity:1}}
    .dot{animation:blink 1.6s ease-in-out infinite}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
    .pulse{stroke-dasharray:6 14;animation:flow 1.4s linear infinite}
    @keyframes flow{to{stroke-dashoffset:-20}}
  `;

  const body = `
  <rect width="${w}" height="${h}" fill="${C.bg}"/>
  <circle class="a1" cx="170" cy="60" r="150" fill="${C.violet}" opacity=".42" filter="url(#blur40)"/>
  <circle class="a2" cx="660" cy="270" r="140" fill="${C.cyan}" opacity=".30" filter="url(#blur40)"/>
  <circle class="a3" cx="430" cy="320" r="110" fill="${C.pink}" opacity=".20" filter="url(#blur40)"/>
  ${grid.body}
  ${t("~/asadsheikh91", 48, 52, { fs: 13, mono: true, fill: C.dim })}
  ${t("Islamabad, PK  ·  UTC+5", 48 + 130, 52, { fs: 13, mono: true, fill: C.dim })}
  <text x="46" y="118" font-size="54" font-weight="800" font-family="${SANS}" fill="url(#nameGrad)" letter-spacing="-1.5">Asad Amad Sheikh</text>
  ${t("I ship systems. Then I own them.", 48, 160, { fs: 25, weight: 600, fill: C.text })}
  <text x="48" y="196" font-size="16" fill="${C.cyan}" font-family="${MONO}">&gt;</text>
  ${proofText}
  ${live.svg}
  <circle class="dot" cx="66" cy="277" r="4" fill="${C.green}"/>
  ${chips[0].svg}
  ${chip3.svg}
  <g>
    ${links}
    ${nodeSvg}
    <circle r="4" fill="${C.cyan}" filter="url(#glow)"><animateMotion dur="3.6s" repeatCount="indefinite" path="M696 70 L696 284"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.9;1" dur="3.6s" repeatCount="indefinite"/></circle>
  </g>
  <path class="pulse" d="M0 312 L180 312 L200 300 L216 322 L232 292 L250 312 L830 312" fill="none" stroke="url(#brand)" stroke-width="2" opacity=".7"/>
`;

  const defs = `
  <linearGradient id="nameGrad" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#d9d3ff"/><stop offset="1" stop-color="${C.cyan}"/>
  </linearGradient>
  ${grid.defs}`;

  return doc({
    w,
    h,
    title: `${p.name}, ${p.title}`,
    desc: "Profile banner. Asad Amad Sheikh, full stack engineer. I ship systems, then I own them. ParchiVisa is live.",
    body,
    css,
    defs,
  });
}
