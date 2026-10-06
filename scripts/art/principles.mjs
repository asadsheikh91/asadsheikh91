import { C, doc, t, lines, wrap, textWidth } from "../lib/svg.mjs";

// Four decisions where the first instinct was wrong. The struck-through line draws itself, then
// the choice sits beside it. Text is condensed from the published "How I think" notes.
export function principles(p) {
  const w = 830;
  const rowH = 148;
  const top = 14;
  const h = top + p.principles.length * rowH + 6;
  const tints = [C.blue, C.rust, C.green, C.ochre];
  const colX = 24;
  const colW = 392;
  const rightX = 452;
  const rightW = w - rightX - 24;

  const rows = p.principles
    .map((r, i) => {
      const y = top + i * rowH;
      const c = tints[i % tints.length];
      const FS = 15.5;
      const first = lines(r.first, colX + 4, y + 66, { fs: FS, maxPx: colW, fill: C.text, lh: 1.35, font: "serif", weight: 700 });
      const firstLines = wrap(r.first, colW, FS, { font: "serif", weight: 700 });
            const ev = lines(r.then, colX + 4, y + 66 + first.height + 14, { fs: 12.5, maxPx: colW, fill: C.muted, lh: 1.42 });
      const chose = lines(r.chose, rightX + 22, y + 70, { fs: 14, maxPx: rightW - 44, fill: C.text, lh: 1.42, font: "serif", weight: 700 });
            const mid = y + rowH / 2 - 2;
      return `
  <g>
    <rect x="${colX - 8}" y="${y + 6}" width="${w - 2 * (colX - 8)}" height="${rowH - 14}" rx="4" fill="url(#card)" stroke="${C.line}"/>
    <rect x="${colX - 8}" y="${y + 6}" width="4" height="${rowH - 14}" fill="${c}"/>
    ${t(r.project, colX + 4, y + 36, { fs: 14, italic: true, fill: c, font: "serif", weight: 700 })}
    ${t("First instinct", colX + 4 + textWidth(r.project, 14, { font: "serif", weight: 700 }) + 16, y + 36, { fs: 11.5, fill: C.dim })}
    ${first.svg}
    ${firstLines
      .map((ln, k) => {
        const sw = Math.min(textWidth(ln, FS, { font: "serif", weight: 700 }), colW);
        const len = Math.ceil(sw);
        const yy = y + 66 - FS * 0.3 + k * FS * 1.35;
        return `<line class="strike" style="--len:${len};animation-delay:${i * 1.1}s" x1="${colX + 4}" y1="${yy.toFixed(1)}" x2="${(colX + 4 + sw).toFixed(1)}" y2="${yy.toFixed(1)}" stroke="${C.red}" stroke-width="2" stroke-dasharray="${len}"/>`;
      })
      .join("")}
    ${ev.svg}
    <path d="M${rightX - 28} ${mid} L${rightX - 8} ${mid} M${rightX - 15} ${mid - 6} L${rightX - 7} ${mid} L${rightX - 15} ${mid + 6}" fill="none" stroke="${c}" stroke-width="2"/>
    <rect x="${rightX}" y="${y + 20}" width="${rightW}" height="${rowH - 42}" rx="3" fill="${c}0f" stroke="${c}" stroke-opacity=".5"/>
    ${t("What I chose", rightX + 22, y + 45, { fs: 11.5, fill: c, weight: 700 })}
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
