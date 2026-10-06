import { C, SANS, MONO, doc, t, pill, pillFlow } from "../lib/svg.mjs";

// The toolbox, grouped. Straight from the CV skills list: things shipped with, not read about.
export function stack(p) {
  const w = 830;
  const labelW = 118;
  const rowGap = 18;
  const tints = [C.violet, C.cyan, C.green, C.pink, C.amber, C.cyan, C.violet, C.red, C.green];
  let y = 26;
  let body = "";
  p.stackGroups.forEach((g, i) => {
    const c = tints[i % tints.length];
    const flow = pillFlow(g.pills, 24 + labelW, y, w - 24, { fs: 11.5, h: 26, px: 11, gap: 7, color: C.text, fill: `${c}14`, stroke: `${c}44` });
    body += `
  ${t(g.label.toUpperCase(), 24, y + 17, { fs: 10.5, mono: true, fill: c, ls: 1.8 })}
  <rect class="chipline" style="animation-delay:${i * 0.4}s" x="14" y="${y + 3}" width="3" height="20" rx="1.5" fill="${c}"/>
  ${flow.svg}`;
    y += flow.height + rowGap;
  });
  const h = y + 8;
  const css = `
    .chipline{animation:cl 5s ease-in-out infinite}
    @keyframes cl{0%,100%{opacity:1}50%{opacity:.35}}
  `;
  return doc({
    w,
    h,
    title: "Toolbox",
    desc: p.stackGroups.map((g) => `${g.label}: ${g.pills.join(", ")}`).join(". "),
    body,
    css,
    radius: 16,
  });
}
