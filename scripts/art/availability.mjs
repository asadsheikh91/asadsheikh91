import { C, SANS, MONO, doc, t, lines } from "../lib/svg.mjs";

// My working window drawn on each zone's own 24 hour clock, with its overlap against a 9 to 5
// day. All arithmetic, no claims: 12:00 to 22:00 UTC is 5 pm to 3 am Islamabad. Standard time;
// daylight saving moves the western rows by an hour.
export function availability(p) {
  const w = 830;
  const startUtc = (p.hoursPkt.start - p.utcOffset + 24) % 24; // 12
  const endUtc = (p.hoursPkt.end - p.utcOffset + 24) % 24; // 22
  const span = (endUtc - startUtc + 24) % 24; // 10 hours

  const zones = [
    { name: "Vancouver", off: -8, tag: "PST" },
    { name: "New York, Toronto", off: -5, tag: "EST" },
    { name: "London", off: 0, tag: "GMT" },
    { name: "Dubai", off: 4, tag: "GST" },
    { name: "Islamabad", off: 5, tag: "PKT", home: true },
  ];

  const labelW = 150;
  const barX = 24 + labelW;
  const barW = w - barX - 150;
  const rowH = 52;
  const top = 96;
  const h = top + zones.length * rowH + 52;
  const hx = (hour) => barX + (hour / 24) * barW;
  const fmt = (hr) => `${String(((hr % 24) + 24) % 24).padStart(2, "0")}:00`;

  const overlap = (s, len) => {
    // hours of [9,17) covered by the window starting at s for len hours (wraps at 24)
    let n = 0;
    for (let hr = 9; hr < 17; hr++) if (((hr - s + 24) % 24) < len) n++;
    return n;
  };

  const rows = zones
    .map((z, i) => {
      const y = top + i * rowH;
      const s = (startUtc + z.off + 24) % 24;
      const e = (s + span) % 24;
      const ov = overlap(s, span);
      const seg = (a, b) => `<rect class="band" x="${hx(a)}" y="${y + 8}" width="${hx(b) - hx(a)}" height="26" rx="3" fill="url(#brand)" opacity=".9"/>`;
      const bands = e > s || e === 0 ? seg(s, e === 0 ? 24 : e) : seg(s, 24) + seg(0, e);
      return `
  <g>
    ${t(z.name, 24, y + 25, { fs: 13.5, weight: z.home ? 800 : 600, fill: z.home ? C.rust : C.text })}
    ${t(`${z.tag}, UTC${z.off >= 0 ? "+" : "-"}${Math.abs(z.off)}`, 24, y + 41, { fs: 10, mono: true, fill: C.dim })}
    <rect x="${barX}" y="${y + 8}" width="${barW}" height="26" rx="3" fill="#1d1c1a0b" stroke="#1d1c1a14"/>
    <rect x="${hx(9)}" y="${y + 5}" width="${hx(17) - hx(9)}" height="32" rx="3" fill="none" stroke="${C.ochre}" stroke-opacity=".55" stroke-dasharray="4 3"/>
    ${bands}
    ${t(`${fmt(s)} to ${fmt(e)}`, hx(24) + 14, y + 26, { fs: 12, mono: true, fill: C.text, weight: 600 })}
    ${t(ov ? `${ov} h of your 9 to 5` : "your evening", hx(24) + 14, y + 41, { fs: 10, mono: true, fill: ov ? C.green : C.dim })}
  </g>`;
    })
    .join("");

  const axis = [0, 6, 12, 18, 24]
    .map((hr) => `<line x1="${hx(hr)}" y1="${top - 6}" x2="${hx(hr)}" y2="${top + zones.length * rowH - 10}" stroke="#1d1c1a10"/>${t(fmt(hr), hx(hr), top - 14, { fs: 10, mono: true, fill: C.dim, anchor: "middle" })}`)
    .join("");

  const head = `
  ${t("My core hours: 5 pm to 3 am Islamabad time", 24, 40, { fs: 22, weight: 800, fill: C.text })}
  ${t("Each row is that city's own clock. The dashed outline is a 9 to 5 day. Core hours, not limits.", 24, 62, { fs: 12.5, fill: C.muted })}`;
  const foot = `${t("Standard time. Daylight saving moves the western rows by one hour. Cities listed are examples, not a limit.", 24, h - 18, { fs: 10, mono: true, fill: C.dim })}`;

  const css = `
    .band{animation:bd 4s ease-in-out infinite}
    @keyframes bd{0%,100%{opacity:.92}50%{opacity:.62}}
  `;
  return doc({
    w,
    h,
    title: "Working hours across time zones",
    desc: "Core hours are 5 pm to 3 am Islamabad time, which is 12:00 to 22:00 UTC. In New York and Toronto standard time that is 07:00 to 17:00, a full 9 to 5 day. In London 12:00 to 22:00, in Vancouver 04:00 to 14:00, in Dubai 16:00 to 02:00.",
    body: `${head}${axis}${rows}${foot}`,
    css,
    radius: 16,
  });
}
