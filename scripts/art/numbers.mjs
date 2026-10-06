import { C, doc, t, lines } from "../lib/svg.mjs";

// Six static numbers, set big in serif. Never animated counters: a number that counts up looks
// like marketing.
export function numbers(p) {
  const w = 830;
  const cols = 3;
  const gap = 14;
  const tw = (w - gap * (cols - 1)) / cols;
  const th = 118;
  const h = th * 2 + gap;
  const tints = [C.blue, C.rust, C.green, C.ochre, C.plum, C.rust];
  const tiles = p.numbers
    .map((n, i) => {
      const x = (i % cols) * (tw + gap);
      const y = Math.floor(i / cols) * (th + gap);
      const c = tints[i % tints.length];
      const lab = lines(n.label, x + 22, y + 86, { fs: 12.5, maxPx: tw - 44, fill: C.muted, lh: 1.35 });
      return `
  <g>
    <rect x="${x}" y="${y}" width="${tw}" height="${th}" rx="4" fill="url(#card)" stroke="${C.line}"/>
    <rect x="${x}" y="${y}" width="4" height="${th}" fill="${c}"/>
    ${t(n.value, x + 24, y + 56, { fs: n.value.length > 9 ? 26 : 38, weight: 700, fill: c, font: "lining" })}
    ${lab.svg}
  </g>`;
    })
    .join("");

  return doc({
    w,
    h,
    title: "Numbers I can point to",
    desc: p.numbers.map((n) => `${n.value}: ${n.label}`).join(". "),
    body: tiles,
    bg: false,
    radius: 0,
  });
}
