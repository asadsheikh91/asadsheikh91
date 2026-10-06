import { C, doc, t, lines, pill, pillFlow } from "../lib/svg.mjs";

// Project cards. The badge is the honesty label (live, client, simulated, not deployed) and is
// never shortened: it is the first thing a founder reads and it has to be true.

const sentence = (s) => s.charAt(0) + s.slice(1).toLowerCase();

const cardCss = `
  .dot{animation:blink 1.8s ease-in-out infinite}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
`;

/** Standard 2-up card. */
export function projectCard(pr) {
  const w = 408;
  const h = 322;
  const accent = { parchivisa: C.rust, influencepay: C.plum, cascade: C.green, vehiclewatch: C.blue, veriloom: C.ochre }[pr.slug] ?? C.rust;
  const badge = pill(sentence(pr.badge), 22, 24, { fs: 11.5, h: 24, px: 12, stroke: `${accent}99`, color: accent, weight: 700 });
  const pitch = lines(pr.pitch, 22, 112, { fs: 13.5, maxPx: w - 44, fill: C.muted, lh: 1.42 });
  let y = 112 + pitch.height + 8;
  const hl = pr.highlights
    .map((s) => {
      const l = lines(s, 40, y + 4, { fs: 12.5, maxPx: w - 66, fill: C.text, lh: 1.35 });
      const out = `<rect x="23" y="${y - 3}" width="6" height="6" fill="${accent}"/>${l.svg}`;
      y += l.height + 5;
      return out;
    })
    .join("");
  const chips = pillFlow(pr.stack.slice(0, 6), 22, h - 66, w - 22, { fs: 11, h: 22, px: 9, gap: 6, color: C.muted, stroke: "#1d1c1a30", r: 3 });
  if (y > h - 76) throw new Error(`${pr.name} card content overflows (${y} > ${h - 76})`);

  const body = `
  <rect width="${w}" height="${h}" fill="url(#card)"/>
  <rect width="${w}" height="5" fill="${accent}"/>
  ${badge.svg}
  ${t(pr.role, w - 22, 41, { fs: 12, italic: true, fill: C.dim, anchor: "end", font: "serif" })}
  ${t(pr.name, 22, 90, { fs: 32, weight: 700, fill: C.text, font: "serif" })}
  ${pitch.svg}
  ${hl}
  ${chips.svg}
`;
  return doc({
    w,
    h,
    title: `${pr.name}: ${pr.badge}`,
    desc: `${pr.name}. ${pr.role}. ${pr.pitch} ${pr.highlights.join(". ")}. Stack: ${pr.stack.join(", ")}.`,
    body,
    css: cardCss,
  });
}

/** Full-width ParchiVisa card with a drawn readiness report. */
export function featuredCard(pr) {
  const w = 830;
  const h = 366;
  const accent = C.rust;
  const badge = pill(sentence(pr.badge), 28, 26, { fs: 12.5, h: 28, px: 24, color: C.green, stroke: `${C.green}99`, weight: 700 });
  const pitch = lines(pr.pitch, 28, 128, { fs: 15, maxPx: 440, fill: C.muted, lh: 1.45 });
  let y = 128 + pitch.height + 14;
  const hl = pr.highlights
    .map((s) => {
      const l = lines(s, 48, y + 4, { fs: 13.5, maxPx: 410, fill: C.text, lh: 1.35 });
      const out = `<rect x="30" y="${y - 3}" width="7" height="7" fill="${accent}"/>${l.svg}`;
      y += l.height + 7;
      return out;
    })
    .join("");
  const chips = pillFlow(pr.stack, 28, h - 82, 480, { fs: 11, h: 22, px: 9, gap: 6, color: C.muted, stroke: "#1d1c1a30", r: 3 });
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
    { label: "TB certificate", state: "Missing", c: C.ochre },
  ];
  const rows = checks
    .map((k, i) => {
      const yy = ry + 180 + i * 21;
      return `<rect x="${rx + 20}" y="${yy - 9}" width="7" height="7" fill="${k.c}"/>${t(k.label, rx + 36, yy, { fs: 12, fill: C.text })}${t(k.state, rx + rw - 20, yy, { fs: 11.5, fill: k.c, anchor: "end", weight: 700 })}`;
    })
    .join("");
  const report = `
  <g class="rep">
    <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="4" fill="#ffffff" stroke="${C.text}" stroke-opacity=".55"/>
    ${t("Readiness report", rx + 20, ry + 30, { fs: 13, italic: true, fill: C.dim, font: "serif" })}
    <circle cx="${rx + 70}" cy="${ry + 96}" r="${R}" fill="none" stroke="${C.line}" stroke-width="9"/>
    <circle class="ring" cx="${rx + 70}" cy="${ry + 96}" r="${R}" fill="none" stroke="${C.ochre}" stroke-width="9" stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${(circ * (1 - 0.61)).toFixed(1)}" transform="rotate(-90 ${rx + 70} ${ry + 96})"/>
    ${t("61", rx + 70, ry + 106, { fs: 30, weight: 700, fill: C.text, anchor: "middle", font: "lining" })}
    ${t("out of 100", rx + 70, ry + 156, { fs: 11, fill: C.dim, anchor: "middle" })}
    ${t("At risk", rx + 138, ry + 84, { fs: 19, weight: 700, fill: C.ochre, font: "serif" })}
    ${t("3 critical gaps", rx + 138, ry + 104, { fs: 12.5, fill: C.muted })}
    ${t("rules decide", rx + 138, ry + 126, { fs: 11, italic: true, fill: C.dim, font: "serif" })}
    ${t("LLM narrates", rx + 138, ry + 140, { fs: 11, italic: true, fill: C.dim, font: "serif" })}
    <line x1="${rx + 20}" x2="${rx + rw - 20}" y1="${ry + 164}" y2="${ry + 164}" stroke="${C.line}"/>
    ${rows}
  </g>
  ${t("Values as on the product screenshot. Redrawn, not a capture.", rx + rw / 2, ry + rh + 22, { fs: 10.5, italic: true, fill: C.dim, anchor: "middle", font: "serif" })}`;

  const css =
    cardCss +
    `
    .ring{animation:ringin 5s ease-out infinite}
    @keyframes ringin{0%{stroke-dashoffset:${circ.toFixed(1)}}30%,100%{stroke-dashoffset:${(circ * (1 - 0.61)).toFixed(1)}}}
  `;

  const body = `
  <rect width="${w}" height="${h}" fill="url(#card)"/>
  <rect width="${w}" height="6" fill="${accent}"/>
  ${badge.svg}
  <circle class="dot" cx="46" cy="40" r="4" fill="${C.green}"/>
  ${t(pr.role, 28 + badge.width + 14, 46, { fs: 13, italic: true, fill: C.dim, font: "serif" })}
  ${t(pr.name, 28, 98, { fs: 46, weight: 700, fill: C.text, font: "serif" })}
  ${pitch.svg}
  ${hl}
  ${chips.svg}
  ${report}
`;
  return doc({
    w,
    h,
    title: "ParchiVisa: live product, founder and sole engineer",
    desc: `${pr.pitch} ${pr.highlights.join(". ")}. Stack: ${pr.stack.join(", ")}. A readiness report preview shows a score of 61 out of 100, at risk, with 3 critical gaps.`,
    body,
    css,
  });
}
