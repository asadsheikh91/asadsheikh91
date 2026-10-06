import { C, doc, t, pill } from "../lib/svg.mjs";

// Closing strip: a serif invitation, the terms in one line, and the three ways to reach me.
export function footer() {
  const w = 830;
  const h = 170;
  const a = pill("Book a 15 minute call", 28, 100, { fs: 13, h: 34, px: 20, fill: C.rust, stroke: C.rust, color: "#fbf8f1", weight: 700 });
  const b = pill("asadamadsh.me", 28 + a.width + 10, 100, { fs: 13, h: 34, px: 20, color: C.text });
  const c = pill("asadamad91@gmail.com", 28 + a.width + b.width + 20, 100, { fs: 13, h: 34, px: 20, color: C.text });
  const body = `
  <line x1="28" x2="${w - 28}" y1="22" y2="22" stroke="${C.text}" stroke-width="3"/>
  <line x1="28" x2="${w - 28}" y1="28" y2="28" stroke="${C.text}" stroke-width="1"/>
  ${t("If you have a system to ship, let us talk.", 28, 66, { fs: 26, weight: 700, fill: C.text, font: "serif" })}
  ${t("First project: about one week. Priced after the intro call, by scope.", 28, 88, { fs: 13.5, fill: C.muted, italic: true, font: "serif" })}
  ${a.svg}${b.svg}${c.svg}
`;
  return doc({
    w,
    h,
    title: "Contact",
    desc: "If you have a system to ship, let us talk. Book a 15 minute call, visit asadamadsh.me, or email asadamad91@gmail.com.",
    body,
  });
}
