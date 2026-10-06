import { C, SERIF, SANS, doc, t, pill } from "../lib/svg.mjs";

// Masthead. Paper, a double rule, a serif name. On the right, the real request path through
// ParchiVisa laid out as a plain index, with one dot travelling down it.
export function banner(p) {
  const w = 830;
  const h = 330;

  const proofs = [
    "Shipped ParchiVisa alone in six weeks. It is live.",
    "A timeout is not a decline, and the database enforces it.",
    "Your code, accounts and keys, in your cloud from day one.",
  ];
  const proofText = proofs
    .map(
      (s, i) =>
        `<text class="proof" style="animation-delay:${i * 4}s" x="56" y="230" font-size="16" fill="${C.muted}" font-family="${SANS}">${s}</text>`,
    )
    .join("");

  const rows = [
    { label: "next.js", sub: "intake and report" },
    { label: "fastapi", sub: "rules decide the verdict" },
    { label: "postgres", sub: "state" },
    { label: "report.pdf", sub: "one template, web and PDF" },
  ];
  const ix = 616;
  const iy = 98;
  const rh = 46;
  const index = rows
    .map((r, i) => {
      const y = iy + i * rh;
      return `
  <line x1="${ix}" x2="798" y1="${y}" y2="${y}" stroke="${C.line}"/>
  ${t(r.label, ix + 22, y + 22, { fs: 15, weight: 700, fill: C.text, font: "serif" })}
  ${t(r.sub, ix + 22, y + 38, { fs: 11, fill: C.dim })}`;
    })
    .join("");

  const live = pill("ParchiVisa is live", 32, 268, { fs: 12.5, h: 30, px: 18, color: C.green, stroke: `${C.green}88`, weight: 600 });
  const a = pill("Sole engineer, end to end", 32 + live.width + 10, 268, { fs: 12.5, h: 30, px: 16, color: C.text });
  const b = pill("Web apps, AI and payments", 32 + live.width + a.width + 20, 268, { fs: 12.5, h: 30, px: 16, color: C.text });

  const css = `
    .proof{opacity:0;animation:cyc 12s infinite}
    @keyframes cyc{0%{opacity:0}4%,29%{opacity:1}33%,100%{opacity:0}}
    .dot{animation:blink 1.8s ease-in-out infinite}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
    .under{stroke-dasharray:90;animation:ul 6s ease-in-out infinite}
    @keyframes ul{0%{stroke-dashoffset:90}15%,100%{stroke-dashoffset:0}}
  `;

  const body = `
  <line x1="32" x2="798" y1="26" y2="26" stroke="${C.text}" stroke-width="3"/>
  <line x1="32" x2="798" y1="32" y2="32" stroke="${C.text}" stroke-width="1"/>
  ${t("Islamabad, Pakistan  ·  UTC+5", 32, 58, { fs: 12.5, fill: C.dim })}
  ${t("Full stack engineer", 798, 58, { fs: 12.5, fill: C.dim, anchor: "end" })}
  ${t("Asad Amad Sheikh", 30, 142, { fs: 54, weight: 700, fill: C.text, font: "serif" })}
  <line class="under" x1="32" x2="122" y1="164" y2="164" stroke="${C.rust}" stroke-width="5" stroke-linecap="butt"/>
  ${t("I ship systems. Then I own them.", 32, 204, { fs: 25, fill: C.text, italic: true, font: "serif" })}
  ${t("→", 32, 230, { fs: 16, fill: C.rust, weight: 700 })}
  ${proofText}
  ${t("One request, one owner", ix, iy - 14, { fs: 13, italic: true, fill: C.muted, font: "serif" })}
  ${index}
  <line x1="${ix}" x2="798" y1="${iy + rows.length * rh}" y2="${iy + rows.length * rh}" stroke="${C.line}"/>
  <circle r="4" fill="${C.rust}"><animateMotion dur="4s" repeatCount="indefinite" path="M${ix + 8} ${iy + 22} L${ix + 8} ${iy + rows.length * rh - 22}"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.85;1" dur="4s" repeatCount="indefinite"/></circle>
  ${live.svg}
  <circle class="dot" cx="50" cy="283" r="4" fill="${C.green}"/>
  ${a.svg}
  ${b.svg}
  <line x1="32" x2="798" y1="312" y2="312" stroke="${C.text}" stroke-width="1"/>
  <line x1="32" x2="798" y1="318" y2="318" stroke="${C.text}" stroke-width="3"/>
`;

  return doc({
    w,
    h,
    title: `${p.name}, ${p.title}`,
    desc: "Profile banner. Asad Amad Sheikh, full stack engineer. I ship systems, then I own them. ParchiVisa is live.",
    body,
    css,
  });
}
