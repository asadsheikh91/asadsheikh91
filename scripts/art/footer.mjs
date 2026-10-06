import { C, SANS, MONO, doc, t, pill } from "../lib/svg.mjs";

// Closing strip with a slow wave and the three ways to reach me.
export function footer(p) {
  const w = 830;
  const h = 170;
  const wave = (amp, y, ph) => {
    let d = `M-120 ${y}`;
    for (let x = -120; x <= w + 120; x += 10) d += ` L${x} ${(y + Math.sin((x / w) * Math.PI * 4 + ph) * amp).toFixed(1)}`;
    return d + ` L${w + 120} ${h} L-120 ${h} Z`;
  };
  const a = pill("Book a 15 minute call", 28, 96, { fs: 12.5, h: 32, px: 18, fill: `${C.violet}33`, stroke: `${C.violet}99`, color: C.text, weight: 700 });
  const b = pill("asadamadsh.me", 28 + a.width + 10, 96, { fs: 12.5, h: 32, px: 18, color: C.text });
  const c = pill("asadamad91@gmail.com", 28 + a.width + b.width + 20, 96, { fs: 12.5, h: 32, px: 18, color: C.text });
  const css = `
    .w1{animation:wv1 9s ease-in-out infinite}
    .w2{animation:wv2 12s ease-in-out infinite}
    @keyframes wv1{0%,100%{transform:translateX(0)}50%{transform:translateX(-60px)}}
    @keyframes wv2{0%,100%{transform:translateX(-40px)}50%{transform:translateX(20px)}}
  `;
  const body = `
  <rect width="${w}" height="${h}" fill="${C.bg}"/>
  <g class="w1"><path d="${wave(9, 146, 0)}" fill="${C.violet}" opacity=".16"/></g>
  <g class="w2"><path d="${wave(8, 152, 2)}" fill="${C.cyan}" opacity=".14"/></g>
  ${t("If you have a system to ship, let us talk.", 28, 52, { fs: 24, weight: 800, fill: C.text })}
  ${t("First project: about one week. Priced after the intro call, by scope.", 28, 78, { fs: 13.5, fill: C.muted })}
  ${a.svg}${b.svg}${c.svg}
`;
  return doc({
    w,
    h,
    title: "Contact",
    desc: "If you have a system to ship, let us talk. Book a 15 minute call, visit asadamadsh.me, or email asadamad91@gmail.com.",
    body,
    css,
  });
}
