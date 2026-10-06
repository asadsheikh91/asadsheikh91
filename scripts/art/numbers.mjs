import { C, doc, t, lines } from "../lib/svg.mjs";

// Six static numbers. Never animated counters: a number that counts up looks like marketing.
export function numbers(p) {
  const w = 830;
  const cols = 3;
  const gap = 14;
  const m = 0;
  const tw = (w - gap * (cols - 1)) / cols;
  const th = 112;
  const h = th * 2 + gap;
  const tints = [C.violet, C.cyan, C.green, C.amber, C.pink, C.cyan];
  const tiles = p.numbers
    .map((n, i) => {
      const x = (i % cols) * (tw + gap);
      const y = Math.floor(i / cols) * (th + gap);
      const c = tints[i % tints.length];
      const lab = lines(n.label, x + 22, y + 82, { fs: 12, maxPx: tw - 44, fill: C.muted, lh: 1.35 });
      return `
  <g>
    <rect x="${x}" y="${y}" width="${tw}" height="${th}" rx="16" fill="url(#card)" stroke="${c}" stroke-opacity=".35"/>
    <rect class="sheen" style="animation-delay:${i * 0.9}s" x="${x}" y="${y}" width="60" height="${th}" fill="url(#shine)" opacity="0"/>
    ${t(n.value, x + 22, y + 52, { fs: n.value.length > 9 ? 25 : 34, weight: 800, fill: c })}
    ${lab.svg}
  </g>`;
    })
    .join("");

  const defs = `<linearGradient id="shine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
  const css = `
    .sheen{animation:sh 6s ease-in-out infinite}
    @keyframes sh{0%{transform:translateX(0);opacity:0}8%{opacity:1}30%{transform:translateX(${tw - 60}px);opacity:0}100%{transform:translateX(${tw - 60}px);opacity:0}}
  `;
  return doc({
    w,
    h,
    title: "Numbers I can point to",
    desc: p.numbers.map((n) => `${n.value}: ${n.label}`).join(". "),
    body: tiles,
    css,
    defs,
    bg: false,
    radius: 0,
  });
}
