import { C, SANS, MONO, doc, t, lines, textWidth, dotGrid } from "../lib/svg.mjs";

// Four decisions where the first instinct was wrong. The struck-through line draws itself, then
// the choice lights up. Text is condensed from the published "How I think" notes.
export function principles(p) {
  const w = 830;
  const rowH = 148;
  const top = 14;
  const h = top + p.principles.length * rowH + 6;
  const tints = [C.violet, C.cyan, C.green, C.amber];
  const colX = 24;
  const colW = 380;
  const rightX = 452;
  const rightW = w - rightX - 24;

  const rows = p.principles
    .map((r, i) => {
      const y = top + i * rowH;
      const c = tints[i % tints.length];
      const first = lines(r.first, colX + 4, y + 62, { fs: 15.5, maxPx: colW, fill: C.text, weight: 600, lh: 1.35 });
      const strikes = first.svg ? "" : "";
      const ls = r.first;
      const sw = Math.min(textWidth(ls, 15.5), colW);
      const ev = lines(r.then, colX + 4, y + 62 + first.height + 16, { fs: 12.2, maxPx: colW, fill: C.muted, lh: 1.42 });
      const chose = lines(r.chose, rightX + 22, y + 66, { fs: 14.5, maxPx: rightW - 44, fill: C.text, weight: 600, lh: 1.42 });
      const len = Math.ceil(sw);
      return `
  <g>
    <rect x="${colX - 8}" y="${y + 6}" width="${w - 2 * (colX - 8)}" height="${rowH - 14}" rx="16" fill="url(#card)" stroke="${c}" stroke-opacity=".28"/>
    ${t(r.project.toUpperCase(), colX + 4, y + 34, { fs: 10.5, mono: true, fill: c, ls: 1.8 })}
    ${t("FIRST INSTINCT", colX + 4 + textWidth(r.project, 10.5, { mono: true }) + 30, y + 34, { fs: 9.5, mono: true, fill: C.dim, ls: 1.6 })}
    ${first.svg}
    <line class="strike" style="--len:${len};animation-delay:${i * 1.1}s" x1="${colX + 4}" y1="${y + 57}" x2="${colX + 4 + sw}" y2="${y + 57}" stroke="${C.red}" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="${len}"/>
    ${ev.svg}
    <path d="M${rightX - 26} ${y + rowH / 2 - 2} L${rightX - 8} ${y + rowH / 2 - 2} M${rightX - 14} ${y + rowH / 2 - 8} L${rightX - 6} ${y + rowH / 2 - 2} L${rightX - 14} ${y + rowH / 2 + 4}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
    <rect x="${rightX}" y="${y + 20}" width="${rightW}" height="${rowH - 42}" rx="12" fill="${c}" fill-opacity=".08" stroke="${c}" stroke-opacity=".4"/>
    ${t("WHAT I CHOSE", rightX + 22, y + 44, { fs: 9.5, mono: true, fill: c, ls: 1.8 })}
    ${chose.svg}
  </g>`;
    })
    .join("");

  const css = `
    .strike{animation:st 9s ease-in-out infinite}
    @keyframes st{0%{stroke-dashoffset:var(--len)}12%,88%{stroke-dashoffset:0}100%{stroke-dashoffset:var(--len)}}
  `;
  return doc({
    w,
    h,
    title: "Four decisions where my first instinct was wrong",
    desc: p.principles.map((r) => `${r.project}. First instinct: ${r.first} Evidence: ${r.then} What I chose: ${r.chose}`).join(" "),
    body: rows,
    css,
    bg: false,
    radius: 0,
  });
}
