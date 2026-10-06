import { C, doc, t, pillFlow } from "../lib/svg.mjs";

// The toolbox, grouped. Straight from the CV skills list: things shipped with, not read about.
export function stack(p) {
  const w = 830;
  const labelW = 126;
  const rowGap = 16;
  const tints = [C.blue, C.rust, C.green, C.plum, C.ochre, C.rust, C.blue, C.red, C.green];
  let y = 28;
  let body = "";
  p.stackGroups.forEach((g, i) => {
    const c = tints[i % tints.length];
    const flow = pillFlow(g.pills, 24 + labelW, y, w - 24, { fs: 12, h: 26, px: 11, gap: 7, color: C.text, stroke: `${c}77`, r: 3 });
    body += `
  ${t(g.label, 24, y + 19, { fs: 16, italic: true, fill: c, font: "serif", weight: 700 })}
  ${flow.svg}`;
    y += flow.height + rowGap;
    if (i < p.stackGroups.length - 1) body += `<line x1="24" x2="${w - 24}" y1="${y - rowGap / 2}" y2="${y - rowGap / 2}" stroke="${C.line}"/>`;
  });
  const h = y + 12;
  return doc({
    w,
    h,
    title: "Toolbox",
    desc: p.stackGroups.map((g) => `${g.label}: ${g.pills.join(", ")}`).join(". "),
    body,
  });
}
