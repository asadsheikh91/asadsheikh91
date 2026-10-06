// Shared design system for every SVG on the profile.
//
// Direction: printed and editorial, not a glowing dashboard. Warm paper, ink-black type, one rust
// accent with a few muted inks, hairline rules, serif headlines over a plain sans body. No
// gradient text, no glow, no blurred blobs, no tracked uppercase labels.
//
// Everything is self-contained (no web fonts, images or scripts) because GitHub serves README
// images through a proxy that blocks all of those. Fonts are therefore system stacks: Georgia
// for headlines, the platform's UI sans for everything else.

export const C = {
  bg: "#f3eee3", // paper
  card: "#fbf8f1", // lighter sheet on the paper
  panel: "#ebe4d3",
  line: "#d6ccb8", // hairline
  text: "#1d1c1a", // ink
  muted: "#554f45",
  dim: "#70685b",
  rust: "#b8431f", // the one accent
  blue: "#2d4b6e",
  green: "#2f6b4f",
  ochre: "#a5701a",
  plum: "#7a3b5e",
  red: "#a63232",
};

export const SERIF = "Georgia,'Iowan Old Style','Palatino Linotype',Palatino,'Book Antiqua','Times New Roman',serif";
// Georgia's figures are old style (01 reads like o1), so numbers use a lining-figure serif.
export const LINING = "'Times New Roman',Times,'Liberation Serif',serif";
export const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
// Old call sites ask for "mono" to mean "small label". Labels are now plain sans.
export const MONO = SANS;

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Which family a text run uses. Big or heavy text is serif; everything else is sans. */
function family({ font, fs, weight, mono }) {
  if (font) return font === "serif" ? SERIF : font === "lining" ? LINING : SANS;
  if (mono) return SANS;
  return (weight >= 700 && fs >= 14) || fs >= 20 ? SERIF : SANS;
}

/** Rough text width in px. Good enough to size pills and wrap lines without a font engine. */
export function textWidth(s, fs, { mono = false, bold = false, font, weight = bold ? 700 : 400 } = {}) {
  const fam = family({ font, fs, weight, mono });
  const serif = fam === SERIF || fam === LINING;
  const f = serif ? (weight >= 700 ? 0.63 : 0.57) : weight >= 600 ? 0.58 : 0.54;
  return Math.ceil(String(s).length * fs * f);
}

/** Greedy word wrap to a pixel width. */
export function wrap(text, maxPx, fs, opts = {}) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (textWidth(next, fs, opts) > maxPx && cur) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

const attrs = ({ fs, fill, weight, anchor, opacity, cls, italic, font, mono }) =>
  `font-size="${fs}" fill="${fill}" font-weight="${weight}" font-family="${family({ font, fs, weight, mono })}" text-anchor="${anchor}" opacity="${opacity}"${italic ? ' font-style="italic"' : ""}${cls ? ` class="${cls}"` : ""}`;

/** Multi-line <text>. Returns { svg, height, count }. */
export function lines(text, x, y, { fs, maxPx, fill = C.text, weight = 400, lh = 1.4, mono = false, anchor = "start", opacity = 1, cls = "", italic = false, font } = {}) {
  const ls = wrap(text, maxPx, fs, { mono, font, weight });
  const out = ls
    .map((l, i) => `<text x="${x}" y="${(y + i * fs * lh).toFixed(1)}" ${attrs({ fs, fill, weight, anchor, opacity, cls, italic, font, mono })}>${esc(l)}</text>`)
    .join("");
  return { svg: out, height: ls.length * fs * lh, count: ls.length };
}

/** Single-line <text>. `ls` (letter spacing) is accepted for old call sites and ignored. */
export const t = (text, x, y, { fs = 14, fill = C.text, weight = 400, mono = false, anchor = "start", opacity = 1, cls = "", italic = false, font } = {}) =>
  `<text x="${x}" y="${y}" ${attrs({ fs, fill, weight, anchor, opacity, cls, italic, font, mono })}>${esc(text)}</text>`;

/** A flat outlined label. Returns { svg, width }. */
export function pill(text, x, y, { fs = 12, h = 26, fill = "none", stroke = "#1d1c1a40", color = C.text, mono = false, px = 12, weight = 500, r = 4 } = {}) {
  const w = textWidth(text, fs, { mono, weight }) + px * 2;
  return {
    width: w,
    svg: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>${t(text, x + w / 2, y + h / 2 + fs * 0.35, { fs, fill: color, anchor: "middle", mono, weight })}`,
  };
}

/** Flow pills left to right, wrapping at maxX. Returns { svg, height }. */
export function pillFlow(items, x0, y0, maxX, opts = {}) {
  const gap = opts.gap ?? 8;
  const h = opts.h ?? 26;
  let x = x0;
  let y = y0;
  let svg = "";
  for (const it of items) {
    const p = pill(it, x, y, opts);
    if (x + p.width > maxX && x > x0) {
      x = x0;
      y += h + gap;
      const q = pill(it, x, y, opts);
      svg += q.svg;
      x += q.width + gap;
    } else {
      svg += p.svg;
      x += p.width + gap;
    }
  }
  return { svg, height: y + h - y0 };
}

const BASE_CSS = `
  text{text-rendering:optimizeLegibility}
  @media (prefers-reduced-motion: reduce){*{animation:none !important}}
`;

/**
 * Wrap a body in the standard document: a sheet of paper with a hairline border. The card always
 * paints its own background so it reads the same in GitHub's light and dark themes.
 * `css` is appended to the base style.
 */
export function doc({ w, h, title, desc, body, css = "", defs = "", bg = true, radius = 6 }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(desc)}</desc>
<defs>
  <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.rust}"/><stop offset="1" stop-color="${C.rust}"/></linearGradient>
  <linearGradient id="card" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.card}"/><stop offset="1" stop-color="${C.card}"/></linearGradient>
  <filter id="glow"><feMerge><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <clipPath id="clip"><rect width="${w}" height="${h}" rx="${radius}"/></clipPath>
  ${defs}
</defs>
<style>${BASE_CSS}${css}</style>
<g clip-path="url(#clip)">
${bg ? `<rect width="${w}" height="${h}" fill="${C.bg}"/>` : ""}
${body}
</g>
${bg ? `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="${radius}" fill="none" stroke="${C.line}"/>` : ""}
</svg>
`;
}

/** The dotted grid is gone (it was a tell). Kept as a no-op so old call sites still work. */
export function dotGrid() {
  return { defs: "", body: "" };
}

export const monthIndex = (ym) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};
