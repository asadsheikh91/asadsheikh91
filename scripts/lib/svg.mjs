// Shared design system for every SVG on the profile. Colours match asadamadsh.me:
// violet to cyan on near-black. Everything is self-contained (no external fonts, images or
// scripts) because GitHub serves README images through a proxy that blocks all of those.

export const C = {
  bg: "#0a0a14",
  bg2: "#11111e",
  panel: "#14142a",
  line: "#2a2a44",
  text: "#eceaff",
  muted: "#a09ec0",
  dim: "#6d6b8f",
  violet: "#8b7cff",
  cyan: "#22d3ee",
  pink: "#f472b6",
  green: "#34d399",
  amber: "#fbbf24",
  red: "#fb7185",
};

export const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
export const MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace";

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Rough text width in px. Good enough to size pills and wrap lines without a font engine. */
export function textWidth(s, fs, { mono = false, bold = false } = {}) {
  const f = mono ? 0.6 : bold ? 0.6 : 0.54;
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

/** Multi-line <text>. Returns { svg, height }. */
export function lines(text, x, y, { fs, maxPx, fill = C.text, weight = 400, lh = 1.4, mono = false, anchor = "start", opacity = 1, cls = "" }) {
  const ls = wrap(text, maxPx, fs, { mono });
  const out = ls
    .map(
      (l, i) =>
        `<text x="${x}" y="${(y + i * fs * lh).toFixed(1)}" font-size="${fs}" fill="${fill}" font-weight="${weight}" font-family="${mono ? MONO : SANS}" text-anchor="${anchor}" opacity="${opacity}"${cls ? ` class="${cls}"` : ""}>${esc(l)}</text>`,
    )
    .join("");
  return { svg: out, height: ls.length * fs * lh, count: ls.length };
}

export const t = (text, x, y, { fs = 14, fill = C.text, weight = 400, mono = false, anchor = "start", opacity = 1, cls = "", ls = 0 } = {}) =>
  `<text x="${x}" y="${y}" font-size="${fs}" fill="${fill}" font-weight="${weight}" font-family="${mono ? MONO : SANS}" text-anchor="${anchor}" opacity="${opacity}"${ls ? ` letter-spacing="${ls}"` : ""}${cls ? ` class="${cls}"` : ""}>${esc(text)}</text>`;

/** A rounded pill with text. Returns { svg, width }. */
export function pill(text, x, y, { fs = 12, h = 26, fill = "#ffffff12", stroke = "#ffffff22", color = C.text, mono = false, px = 12, weight = 500 } = {}) {
  const w = textWidth(text, fs, { mono }) + px * 2;
  return {
    width: w,
    svg: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}"/>${t(text, x + w / 2, y + h / 2 + fs * 0.35, { fs, fill: color, anchor: "middle", mono, weight })}`,
  };
}

/** Flow pills left to right, wrapping at maxX. Returns { svg, height, w }. */
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
      svg += pill(it, x, y, opts).svg;
      x += pill(it, x, y, opts).width + gap;
    } else {
      svg += p.svg;
      x += p.width + gap;
    }
  }
  return { svg, height: y + h - y0 };
}

const BASE_CSS = `
  text{text-rendering:geometricPrecision}
  @media (prefers-reduced-motion: reduce){*{animation:none !important}}
`;

/**
 * Wrap a body in the standard document: rounded dark card, shared gradients and filters.
 * `css` is appended to the base style. The card always paints its own background so it reads
 * the same in GitHub's light and dark themes.
 */
export function doc({ w, h, title, desc, body, css = "", defs = "", bg = true, radius = 18 }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(desc)}</desc>
<defs>
  <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient>
  <linearGradient id="brandV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.violet}"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient>
  <linearGradient id="card" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#171730"/><stop offset="1" stop-color="#0e0e1c"/></linearGradient>
  <filter id="blur40" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
  <filter id="blur20" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <clipPath id="clip"><rect width="${w}" height="${h}" rx="${radius}"/></clipPath>
  ${defs}
</defs>
<style>${BASE_CSS}${css}</style>
<g clip-path="url(#clip)">
${bg ? `<rect width="${w}" height="${h}" fill="${C.bg}"/>` : ""}
${body}
</g>
${bg ? `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="${radius}" fill="none" stroke="#ffffff1a"/>` : ""}
</svg>
`;
}

/** Dot grid pattern def + a rect that uses it, faded toward the edges. */
export function dotGrid(w, h, { id = "dots", gap = 22, opacity = 0.35 } = {}) {
  return {
    defs: `<pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="#ffffff" opacity="${opacity}"/></pattern>
<radialGradient id="${id}fade" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
<mask id="${id}mask"><rect width="${w}" height="${h}" fill="url(#${id}fade)"/></mask>`,
    body: `<rect width="${w}" height="${h}" fill="url(#${id})" mask="url(#${id}mask)" opacity=".5"/>`,
  };
}

export const monthIndex = (ym) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};
