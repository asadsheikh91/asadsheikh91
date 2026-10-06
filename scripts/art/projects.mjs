import { C, SANS, MONO, doc, t, lines, pill, pillFlow, dotGrid } from "../lib/svg.mjs";

// Project cards. The badge is the honesty label (live, client, simulated, not deployed) and is
// never shortened: it is the first thing a founder reads and it has to be true.

function glow(tint, w) {
  return `
  <circle class="g1" cx="${w * 0.12}" cy="20" r="110" fill="${tint[0]}" opacity=".28" filter="url(#blur40)"/>
  <circle class="g2" cx="${w * 0.95}" cy="${w > 600 ? 230 : 300}" r="100" fill="${tint[1]}" opacity=".2" filter="url(#blur40)"/>`;
}

const cardCss = `
  .g1{animation:g1 11s ease-in-out infinite}
  .g2{animation:g2 13s ease-in-out infinite}
  @keyframes g1{0%,100%{transform:translate(0,0)}50%{transform:translate(50px,30px)}}
  @keyframes g2{0%,100%{transform:translate(0,0)}50%{transform:translate(-50px,-24px)}}
  .dot{animation:blink 1.6s ease-in-out infinite}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
`;

/** Standard 2-up card. */
export function projectCard(pr) {
  const w = 408;
  const h = 300;
  const [c1, c2] = pr.tint;
  const badge = pill(pr.badge, 22, 22, { fs: 10.5, h: 24, mono: true, px: 12, fill: `${c1}22`, stroke: `${c1}66`, color: c1, weight: 600 });
  const pitch = lines(pr.pitch, 22, 108, { fs: 13.2, maxPx: w - 44, fill: C.muted, lh: 1.42 });
  let y = 108 + pitch.height + 8;
  const hl = pr.highlights
    .map((s, i) => {
      const l = lines(s, 40, y + 4, { fs: 12, maxPx: w - 66, fill: C.text, lh: 1.35 });
      const out = `<circle cx="28" cy="${y}" r="3" fill="${i % 2 ? c2 : c1}"/>${l.svg}`;
      y += l.height + 5;
      return out;
    })
    .join("");
  const chips = pillFlow(pr.stack.slice(0, 6), 22, h - 66, w - 22, { fs: 10.5, h: 22, px: 9, gap: 6, color: C.muted, fill: "#ffffff0d", stroke: "#ffffff1f" });
  if (y > h - 76) throw new Error(`${pr.name} card content overflows (${y} > ${h - 76})`);

  const body = `
  <rect width="${w}" height="${h}" fill="${C.bg}"/>
  ${glow(pr.tint, w)}
  <rect width="${w}" height="${h}" fill="url(#card)" opacity=".55"/>
  ${badge.svg}
  ${t(pr.name, 22, 78, { fs: 29, weight: 800, fill: `url(#nm)` })}
  ${t(pr.role, 22 + badge.width + 12, 38, { fs: 11, mono: true, fill: C.dim })}
  ${pitch.svg}
  ${hl}
  ${chips.svg}
  <rect x="0" y="0" width="${w}" height="3" fill="url(#bar)"/>
`;
  const defs = `
  <linearGradient id="nm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${c2}"/></linearGradient>
  <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
  return doc({
    w,
    h,
    title: `${pr.name}: ${pr.badge}`,
    desc: `${pr.name}. ${pr.role}. ${pr.pitch} ${pr.highlights.join(". ")}. Stack: ${pr.stack.join(", ")}.`,
    body,
    css: cardCss,
    defs,
    radius: 16,
  });
}

/** Full-width ParchiVisa card with a drawn readiness report. */
export function featuredCard(pr) {
  const w = 830;
  const h = 350;
  const [c1, c2] = pr.tint;
  const badge = pill(pr.badge, 28, 26, { fs: 11, h: 26, mono: true, px: 24, fill: "#34d3991f", stroke: "#34d39966", color: C.green, weight: 600 });
  const pitch = lines(pr.pitch, 28, 120, { fs: 15, maxPx: 440, fill: C.muted, lh: 1.45 });
  let y = 120 + pitch.height + 14;
  const hl = pr.highlights
    .map((s, i) => {
      const l = lines(s, 48, y + 4, { fs: 13, maxPx: 410, fill: C.text, lh: 1.35 });
      const out = `<circle cx="34" cy="${y}" r="3.5" fill="${i % 2 ? c2 : c1}"/>${l.svg}`;
      y += l.height + 7;
      return out;
    })
    .join("");
  const chips = pillFlow(pr.stack, 28, h - 82, 480, { fs: 10.5, h: 22, px: 9, gap: 6, color: C.muted, fill: "#ffffff0d", stroke: "#ffffff1f" });
  if (y > h - 96) throw new Error(`featured card overflows (${y})`);

  // The readiness report, drawn from the values on the product screenshot.
  const rx = 520;
  const ry = 30;
  const rw = 282;
  const rh = 270;
  const R = 44;
  const circ = 2 * Math.PI * R;
  const checks = [
    { label: "Financial evidence", state: "Problem", c: C.red },
    { label: "Course progression", state: "Problem", c: C.red },
    { label: "Offer letter", state: "On file", c: C.green },
    { label: "TB certificate", state: "Missing", c: C.amber },
  ];
  const rows = checks
    .map((k, i) => {
      const yy = ry + 178 + i * 21;
      return `<circle cx="${rx + 22}" cy="${yy - 4}" r="4" fill="${k.c}"/>${t(k.label, rx + 34, yy, { fs: 11.5, fill: C.text })}${t(k.state, rx + rw - 20, yy, { fs: 11, mono: true, fill: k.c, anchor: "end", weight: 600 })}`;
    })
    .join("");
  const report = `
  <g class="rep">
    <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="16" fill="#0c0c1a" stroke="#ffffff26"/>
    ${t("READINESS REPORT", rx + 20, ry + 28, { fs: 10, mono: true, fill: C.dim, ls: 1.6 })}
    <circle cx="${rx + 70}" cy="${ry + 94}" r="${R}" fill="none" stroke="#ffffff14" stroke-width="9"/>
    <circle class="ring" cx="${rx + 70}" cy="${ry + 94}" r="${R}" fill="none" stroke="${C.amber}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${(circ * (1 - 0.61)).toFixed(1)}" transform="rotate(-90 ${rx + 70} ${ry + 94})"/>
    ${t("61", rx + 70, ry + 100, { fs: 26, weight: 800, fill: C.text, anchor: "middle" })}
    ${t("out of 100", rx + 70, ry + 154, { fs: 10, mono: true, fill: C.dim, anchor: "middle" })}
    ${t("At risk", rx + 138, ry + 80, { fs: 17, weight: 800, fill: C.amber })}
    ${t("3 critical gaps", rx + 138, ry + 100, { fs: 12, fill: C.muted })}
    ${t("rules decide", rx + 138, ry + 122, { fs: 10.5, mono: true, fill: C.dim })}
    ${t("LLM narrates", rx + 138, ry + 136, { fs: 10.5, mono: true, fill: C.dim })}
    <line x1="${rx + 20}" x2="${rx + rw - 20}" y1="${ry + 160}" y2="${ry + 160}" stroke="#ffffff1c"/>
    ${rows}
  </g>
  ${t("Values as on the product screenshot. Redrawn, not a capture.", rx + rw / 2, ry + rh + 20, { fs: 9.5, mono: true, fill: C.dim, anchor: "middle" })}`;

  const css =
    cardCss +
    `
    .ring{animation:ringin 5s ease-out infinite}
    @keyframes ringin{0%{stroke-dashoffset:${circ.toFixed(1)}}30%,100%{stroke-dashoffset:${(circ * (1 - 0.61)).toFixed(1)}}}
    .rep{animation:float 6s ease-in-out infinite}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
  `;

  const body = `
  <rect width="${w}" height="${h}" fill="${C.bg}"/>
  ${glow(pr.tint, w)}
  <rect width="${w}" height="${h}" fill="url(#card)" opacity=".55"/>
  ${badge.svg}
  <circle class="dot" cx="46" cy="39" r="4" fill="${C.green}"/>
  ${t(pr.role, 28 + badge.width + 14, 44, { fs: 11.5, mono: true, fill: C.dim })}
  ${t(pr.name, 28, 94, { fs: 44, weight: 800, fill: "url(#nm)" })}
  ${pitch.svg}
  ${hl}
  ${chips.svg}
  ${report}
  <rect x="0" y="0" width="${w}" height="3" fill="url(#bar)"/>
`;
  const defs = `
  <linearGradient id="nm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${c2}"/></linearGradient>
  <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
  return doc({
    w,
    h,
    title: "ParchiVisa: live product, founder and sole engineer",
    desc: `${pr.pitch} ${pr.highlights.join(". ")}. Stack: ${pr.stack.join(", ")}. A readiness report preview shows a score of 61 out of 100, at risk, with 3 critical gaps.`,
    body,
    css,
    defs,
    radius: 18,
  });
}
