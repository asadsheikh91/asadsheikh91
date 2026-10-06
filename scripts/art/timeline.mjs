import { C, SANS, MONO, doc, t, lines, textWidth, monthIndex, dotGrid } from "../lib/svg.mjs";

// Career timeline in two parts. Top: the whole path, with bars exactly as the CV states them (a
// bar marked fadeStart only has a year, so its left edge fades instead of pretending to a month).
// Bottom: 2026 month by month, where five things happen and a single axis cannot show them.
// The pink dots are first commits on GitHub, not launch dates.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function timeline(p) {
  const tl = p.career;
  const w = 830;
  const h = 456;
  const grid = dotGrid(w, h, { id: "tl" });
  const x0 = 44;
  const x1 = 790;
  const m0 = monthIndex(tl.axis.from);
  const m1 = monthIndex(tl.axis.to) + 1;
  const X = (ym, end = false) => x0 + ((monthIndex(ym) + (end ? 1 : 0) - m0) / (m1 - m0)) * (x1 - x0);

  const axisY = 258;
  const edu = tl.bars.find((b) => b.lane === "learn");
  const eduX = X(edu.from);
  const eduX2 = X(edu.to, true);
  const eduBand = `
  <rect x="${eduX}" y="196" width="${eduX2 - eduX}" height="8" rx="4" fill="url(#eduG)"/>
  ${t("B.S. Computer Science, FAST NUCES", eduX, 224, { fs: 12.5, weight: 700, fill: C.text })}
  ${t("2022 to June 2026", eduX, 241, { fs: 11, fill: C.muted })}`;

  const work = tl.bars.filter((b) => b.lane === "work");
  const cards = [
    { bar: work[0], x: 250, w: 186, title: "Data Engineering Intern", sub: "Ufone (PTCL Group), Jun to Aug 2024", body: "80 tables. A ~670 GB compliance dataset. Found and fixed silent data loss.", c: C.violet },
    { bar: work[1], x: 446, w: 186, title: "Backend Engineering Intern", sub: "Frontier Works, Jun to Aug 2025", body: "300+ vehicles. Reporting from 30 min to under 1. The only award among 45 interns.", c: C.cyan },
    { bar: work[2], x: 642, w: 168, title: "Founder, ParchiVisa", sub: "2026 to now", body: "Live product. Selected for League of Launchers S2.", c: C.green },
  ];
  const cardY = 14;
  const cardH = 166;
  const workSvg = cards
    .map((c, i) => {
      const b = c.bar;
      const bx = X(b.from);
      const bx2 = X(b.to, true);
      const mid = (bx + bx2) / 2;
      const title = lines(c.title, c.x + 14, cardY + 28, { fs: 12.5, maxPx: c.w - 28, fill: C.text, weight: 700, lh: 1.25 });
      const sub = lines(c.sub, c.x + 14, cardY + 28 + title.height + 4, { fs: 10, maxPx: c.w - 28, fill: C.dim, lh: 1.3 });
      const body = lines(c.body, c.x + 14, cardY + 28 + title.height + 4 + sub.height + 10, { fs: 11, maxPx: c.w - 28, fill: C.muted, lh: 1.38 });
      const need = 28 + title.height + 4 + sub.height + 10 + body.height;
      if (need > cardH) throw new Error(`timeline card ${c.title} overflows ${need.toFixed(0)} > ${cardH}`);
      const fill = b.fadeStart ? `url(#fade${i})` : c.c;
      return `
  <defs><linearGradient id="fade${i}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c.c}" stop-opacity=".05"/><stop offset=".35" stop-color="${c.c}"/><stop offset="1" stop-color="${c.c}"/></linearGradient></defs>
  <path d="M${mid} ${cardY + cardH} L${mid} 212" stroke="${c.c}" stroke-opacity=".6" stroke-dasharray="3 4"/>
  <rect x="${c.x}" y="${cardY}" width="${c.w}" height="${cardH}" rx="14" fill="url(#card)" stroke="${c.c}" stroke-opacity=".45"/>
  <rect x="${c.x}" y="${cardY}" width="${c.w}" height="3" rx="1.5" fill="${c.c}"/>
  ${title.svg}${sub.svg}${body.svg}
  <rect x="${bx}" y="212" width="${bx2 - bx}" height="22" rx="8" fill="${fill}" ${b.open ? `class="open"` : ""}/>`;
    })
    .join("");

  const years = [2022, 2023, 2024, 2025, 2026];
  const ticks = years
    .map((y) => `<line x1="${X(`${y}-01`)}" y1="${axisY - 6}" x2="${X(`${y}-01`)}" y2="${axisY + 6}" stroke="#ffffff55"/>${t(String(y), X(`${y}-01`), axisY + 24, { fs: 11, mono: true, fill: C.dim, anchor: "middle" })}`)
    .join("");

  // 2026 inset.
  const ix0 = 44;
  const ix1 = 790;
  const mw = (ix1 - ix0) / 12;
  const IX = (month) => ix0 + (month - 0.5) * mw; // month 1..12, centred
  const bandY = 360;
  const inset = [
    { m: 3, name: "Veriloom", dot: C.pink, y: 326 },
    { m: 4, name: "VehicleWatch", dot: C.pink, y: 344 },
    { m: 5, name: "InfluencePay", dot: C.pink, y: 326 },
    { m: 6, name: "Graduated", dot: C.amber, y: 344 },
    { m: 9, name: "Cascade", dot: C.pink, y: 326 },
  ];
  const insetSvg = inset
    .map((d) => {
      const x = IX(d.m);
      return `
  <path d="M${x} ${d.y + 6} L${x} ${bandY + 4}" stroke="${d.dot}" stroke-opacity=".55"/>
  ${t(d.name, x, d.y, { fs: 11.5, weight: 700, fill: C.text, anchor: "middle" })}
  <circle cx="${x}" cy="${bandY + 4}" r="5.5" fill="${C.bg}" stroke="${d.dot}" stroke-width="2"/>`;
    })
    .join("");
  const monthLabels = MONTHS.map((m, i) => t(m, IX(i + 1), bandY + 34, { fs: 10, mono: true, fill: C.dim, anchor: "middle" })).join("");
  const nowX = ix0 + (9 + 6 / 31) * mw; // 6 October
  const now = `<line class="now" x1="${nowX}" y1="${bandY - 14}" x2="${nowX}" y2="${bandY + 20}" stroke="${C.cyan}" stroke-width="1.5"/>${t("today", nowX, bandY - 20, { fs: 9.5, mono: true, fill: C.cyan, anchor: "middle" })}`;

  const body = `
  ${grid.body}
  <line x1="${x0}" y1="${axisY}" x2="${x1}" y2="${axisY}" stroke="#ffffff33" stroke-width="2"/>
  ${eduBand}
  ${workSvg}
  ${ticks}
  <line x1="24" x2="${w - 24}" y1="290" y2="290" stroke="#ffffff14"/>
  ${t("2026, MONTH BY MONTH", 24, 306, { fs: 10.5, mono: true, fill: C.cyan, ls: 2 })}
  <rect class="open" x="${ix0}" y="${bandY}" width="${nowX - ix0}" height="8" rx="4" fill="url(#pbG)"/>
  ${t("ParchiVisa, 2026 to now", ix0, bandY + 56, { fs: 11, weight: 700, fill: C.green })}
  ${t("(start month not stated, so the bar fades in)", ix0 + textWidth("ParchiVisa, 2026 to now", 11, { bold: true }) + 10, bandY + 56, { fs: 10, mono: true, fill: C.dim })}
  ${monthLabels}
  ${insetSvg}
  ${now}
  ${t("Pink dots are the first commit of each public repo, not a launch date.", 24, h - 14, { fs: 10, mono: true, fill: C.dim })}
`;
  const css = `
    .open{animation:op 3s ease-in-out infinite}
    @keyframes op{0%,100%{opacity:1}50%{opacity:.7}}
    .now{animation:nw 1.8s ease-in-out infinite}
    @keyframes nw{0%,100%{opacity:1}50%{opacity:.35}}
  `;
  const defs = `<linearGradient id="eduG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.violet}" stop-opacity=".08"/><stop offset=".3" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient>
<linearGradient id="pbG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.green}" stop-opacity=".08"/><stop offset=".25" stop-color="${C.green}"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient>${grid.defs}`;
  return doc({
    w,
    h,
    title: "Career timeline",
    desc: "B.S. Computer Science at FAST NUCES from 2022, graduated June 2026. Data engineering intern at Ufone, June to August 2024. Backend engineering intern at Frontier Works, June to August 2025, the only Certificate of Appreciation among 45 interns. Founder of ParchiVisa, 2026 to now. In 2026: first commits of Veriloom in March, VehicleWatch in April and InfluencePay in May, graduation in June, first commit of Cascade in September.",
    body,
    css,
    defs,
  });
}
