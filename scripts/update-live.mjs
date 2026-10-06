// Draws the "proof of work" cards from real GitHub data. No dependencies, Node 20+.
//
//   node scripts/update-live.mjs               fetch fresh data, write data/live.json, render
//   node scripts/update-live.mjs --render-only re-render from data/live.json (no network)
//
// Data sources, in order of preference for the contribution calendar:
//   1. GraphQL contributionsCollection, when GITHUB_TOKEN is set (the workflow sets it)
//   2. The public contributions page, parsed (what any visitor sees)
// If every source fails the existing SVGs are left alone: a stale card beats an empty one.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { C, SANS, MONO, doc, t, lines, textWidth, dotGrid } from "./lib/svg.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const profile = JSON.parse(readFileSync(join(root, "data/profile.json"), "utf8"));
const handle = profile.handle;
const outDir = join(root, "assets/generated");
const livePath = join(root, "data/live.json");
mkdirSync(outDir, { recursive: true });

const token = process.env.GITHUB_TOKEN;
const headers = {
  "User-Agent": `${handle}-profile-readme`,
  Accept: "application/vnd.github+json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function api(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${path}: ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------- data

async function fetchCalendar() {
  if (token) {
    try {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`,
          variables: { login: handle },
        }),
      });
      const j = await res.json();
      const cal = j?.data?.user?.contributionsCollection?.contributionCalendar;
      if (cal) {
        const levels = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
        return {
          source: "graphql",
          days: cal.weeks.flatMap((w) => w.contributionDays).map((d) => ({ date: d.date, count: d.contributionCount, level: levels[d.contributionLevel] ?? 0 })),
        };
      }
    } catch (e) {
      console.warn("GraphQL calendar failed, falling back to the public page:", e.message);
    }
  }
  const res = await fetch(`https://github.com/users/${handle}/contributions`, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`contributions page: ${res.status}`);
  const html = await res.text();
  const attr = (s, a) => new RegExp(String.raw`(?:^|\s)${a}="([^"]*)"`).exec(s)?.[1];
  const tips = new Map([...html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>\s*([^<]*?)\s*<\/tool-tip>/g)].map((m) => [m[1], m[2]]));
  const days = [...html.matchAll(/<td\b[^>]*class="ContributionCalendar-day"[^>]*>/g)]
    .map((m) => m[0])
    .map((c) => {
      const tip = tips.get(attr(c, "id")) || "";
      const n = /^(\d+) contribution/.exec(tip);
      return { date: attr(c, "data-date"), level: Number(attr(c, "data-level")), count: n ? Number(n[1]) : 0 };
    })
    .filter((d) => d.date)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (days.length < 300) throw new Error(`contributions page parsed ${days.length} days, expected about 365`);
  return { source: "html", days };
}

async function fetchRepos() {
  const all = await api(`/users/${handle}/repos?per_page=100&sort=pushed`);
  return all
    .filter((r) => !r.fork)
    .map((r) => ({ name: r.name, language: r.language, pushed: r.pushed_at, created: r.created_at, description: r.description, url: r.html_url }));
}

async function fetchLanguages(names) {
  const out = {};
  for (const name of names) {
    try {
      const langs = await api(`/repos/${handle}/${name}/languages`);
      const keep = profile.languageRepoFilter?.[name];
      out[name] = Object.fromEntries(Object.entries(langs).filter(([k]) => !keep || keep.includes(k)));
    } catch (e) {
      console.warn(`languages for ${name}:`, e.message);
    }
  }
  return out;
}

async function collect() {
  const [calendar, repos] = await Promise.all([fetchCalendar(), fetchRepos()]);
  const languages = await fetchLanguages(profile.featuredRepos);
  return { generatedAt: new Date().toISOString(), calendar, repos, languages };
}

// ---------------------------------------------------------------- numbers

const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const fmtMonth = (iso) => new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

function stats(days) {
  const total = days.reduce((a, d) => a + d.count, 0);
  const active = days.filter((d) => d.count > 0);
  const byMonth = new Map();
  for (const d of active) byMonth.set(d.date.slice(0, 7), (byMonth.get(d.date.slice(0, 7)) || 0) + d.count);
  const busiest = [...byMonth.entries()].sort((a, b) => b[1] - a[1])[0];
  const last = active.at(-1);
  return { total, activeDays: active.length, busiest, last, monthsActive: byMonth.size };
}

const LANG_COLORS = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572a5", "C#": "#9b4f96", Solidity: "#aa6746",
  CSS: "#7c5cff", HTML: "#e34c26", Java: "#b07219", Shell: "#89e051", Dockerfile: "#384d54",
};

function languageShares(languages) {
  const acc = {};
  const repos = Object.values(languages).filter((l) => Object.keys(l).length);
  for (const l of repos) {
    const total = Object.values(l).reduce((a, b) => a + b, 0);
    for (const [k, v] of Object.entries(l)) acc[k] = (acc[k] || 0) + v / total / repos.length;
  }
  return Object.entries(acc).sort((a, b) => b[1] - a[1]);
}

// ---------------------------------------------------------------- art

function activitySvg(live) {
  const { days } = live.calendar;
  const w = 830;
  const s = stats(days);
  const weeks = [];
  let cur = [];
  // Align the first column so rows are Sunday to Saturday like GitHub's own graph.
  const firstDow = new Date(days[0].date + "T00:00:00Z").getUTCDay();
  for (let i = 0; i < firstDow; i++) cur.push(null);
  for (const d of days) {
    cur.push(d);
    if (cur.length === 7) (weeks.push(cur), (cur = []));
  }
  if (cur.length) weeks.push(cur);

  const left = 24;
  const gap = 3;
  const cell = (w - left * 2 - (weeks.length - 1) * gap) / weeks.length;
  const gy = 64;
  const gridH = 7 * cell + 6 * gap;
  const levelFill = ["#ffffff0f", "#4c3fb3", "#6c5ce7", "#4aa3f0", C.cyan];

  let cells = "";
  weeks.forEach((wk, ci) => {
    wk.forEach((d, ri) => {
      if (!d) return;
      const x = left + ci * (cell + gap);
      const y = gy + ri * (cell + gap);
      cells += `<rect class="c" style="animation-delay:${(ci * 0.02).toFixed(2)}s" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cell.toFixed(1)}" height="${cell.toFixed(1)}" rx="2.5" fill="${levelFill[d.level]}"><title>${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}</title></rect>`;
    });
  });

  // Month labels along the top.
  let months = "";
  let lastM = "";
  weeks.forEach((wk, ci) => {
    const first = wk.find(Boolean);
    if (!first) return;
    const m = first.date.slice(0, 7);
    if (m !== lastM && Number(first.date.slice(8)) <= 7) {
      months += t(new Date(first.date + "T00:00:00Z").toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }), left + ci * (cell + gap), gy - 10, { fs: 10, mono: true, fill: C.dim });
    }
    lastM = m;
  });

  const tiles = [
    { v: String(s.total), l: "public contributions, last 12 months", c: C.violet },
    { v: String(s.activeDays), l: "days with activity", c: C.cyan },
    { v: s.busiest ? fmtMonth(s.busiest[0] + "-01").replace(" 20", " '") : "n/a", l: s.busiest ? `busiest month, ${s.busiest[1]} contributions` : "", c: C.green },
    { v: s.last ? fmtDate(s.last.date) : "n/a", l: "latest contribution", c: C.amber },
  ];
  const ty = gy + gridH + 34;
  const tw = (w - left * 2 - 3 * 12) / 4;
  const tilesSvg = tiles
    .map((k, i) => {
      const x = left + i * (tw + 12);
      const lab = lines(k.l, x + 16, ty + 58, { fs: 10.5, maxPx: tw - 32, fill: C.muted, lh: 1.3 });
      return `<rect x="${x}" y="${ty}" width="${tw}" height="82" rx="12" fill="url(#card)" stroke="${k.c}" stroke-opacity=".35"/>${t(k.v, x + 16, ty + 36, { fs: k.v.length > 9 ? 17 : 26, weight: 800, fill: k.c })}${lab.svg}`;
    })
    .join("");

  const h = Math.ceil(ty + 82 + 56);
  const legendX = w - left - 5 * 14 - 62;
  const legend = `${t("less", legendX - 26, ty + 82 + 30, { fs: 10, mono: true, fill: C.dim })}${levelFill.map((c, i) => `<rect x="${legendX + i * 14}" y="${ty + 82 + 21}" width="11" height="11" rx="2.5" fill="${c}"/>`).join("")}${t("more", legendX + 5 * 14 + 4, ty + 82 + 30, { fs: 10, mono: true, fill: C.dim })}`;

  const body = `
  ${t("Public contribution calendar, last 12 months", left, 32, { fs: 17, weight: 800, fill: C.text })}
  ${months}
  ${cells}
  ${tilesSvg}
  ${t("ParchiVisa's source is not public, so its commits are not in this graph.", left, ty + 82 + 30, { fs: 10.5, mono: true, fill: C.dim })}
  ${legend}
  ${t("Straight from GitHub. Hover a square for the day.", left, h - 12, { fs: 9.5, mono: true, fill: C.dim })}
`;
  const css = `.c{opacity:0;animation:pop .5s ease-out forwards}@keyframes pop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}.c{transform-box:fill-box;transform-origin:center}`;
  return doc({
    w,
    h,
    title: "GitHub contribution calendar",
    desc: `${s.total} public contributions on ${s.activeDays} days in the last 12 months.${s.busiest ? ` Busiest month ${fmtMonth(s.busiest[0] + "-01")}.` : ""}${s.last ? ` Latest contribution ${fmtDate(s.last.date)}.` : ""}`,
    body,
    css,
    radius: 16,
  });
}

function shippingSvg(live) {
  const w = 830;
  const byName = new Map(live.repos.map((r) => [r.name, r]));
  const rows = profile.featuredRepos.map((n) => byName.get(n)).filter(Boolean).sort((a, b) => b.pushed.localeCompare(a.pushed));
  const rowH = 46;
  const top = 58;
  const h = top + rows.length * rowH + 40;
  const body = rows
    .map((r, i) => {
      const y = top + i * rowH;
      const lc = LANG_COLORS[r.language] || C.dim;
      return `
  <rect x="24" y="${y}" width="${w - 48}" height="${rowH - 8}" rx="10" fill="#ffffff08" stroke="#ffffff12"/>
  <circle cx="46" cy="${y + (rowH - 8) / 2}" r="5" fill="${lc}"/>
  ${t(r.name, 62, y + 24, { fs: 14, weight: 700, fill: C.text })}
  ${t(r.language || "n/a", 318, y + 24, { fs: 12, mono: true, fill: C.muted })}
  ${t(`first commit ${new Date(r.created).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" })}`, 450, y + 24, { fs: 12, mono: true, fill: C.dim })}
  ${t(`last push ${fmtDate(r.pushed)}`, w - 40, y + 24, { fs: 12, mono: true, fill: C.cyan, anchor: "end" })}`;
    })
    .join("");
  return doc({
    w,
    h,
    title: "Featured repositories",
    desc: rows.map((r) => `${r.name}, ${r.language || "no language"}, last push ${fmtDate(r.pushed)}`).join(". "),
    body: `${t("Featured public repositories, newest push first", 24, 34, { fs: 17, weight: 800, fill: C.text })}${body}${t("Straight from the GitHub API. Dates are first commit month and latest push.", 24, h - 14, { fs: 9.5, mono: true, fill: C.dim })}`,
    radius: 16,
  });
}

function languagesSvg(live) {
  const w = 830;
  const shares = languageShares(live.languages);
  const top = shares.slice(0, 7);
  const rest = shares.slice(7).reduce((a, [, v]) => a + v, 0);
  if (rest > 0.001) top.push(["Other", rest]);
  const barX = 24;
  const barW = w - 48;
  let x = barX;
  const segs = top
    .map(([k, v], i) => {
      const sw = Math.max(2, v * barW);
      const c = LANG_COLORS[k] || (k === "Other" ? "#5a5878" : C.dim);
      const seg = `<rect class="seg" style="animation-delay:${i * 0.12}s" x="${x.toFixed(1)}" y="60" width="${(sw - 2).toFixed(1)}" height="16" rx="4" fill="${c}"/>`;
      x += sw;
      return seg;
    })
    .join("");
  // Legend in two columns.
  const colW = (w - 48) / 4;
  const legend = top
    .map(([k, v], i) => {
      const lx = 24 + (i % 4) * colW;
      const ly = 112 + Math.floor(i / 4) * 26;
      const c = LANG_COLORS[k] || (k === "Other" ? "#5a5878" : C.dim);
      return `<circle cx="${lx + 6}" cy="${ly - 4}" r="5" fill="${c}"/>${t(k, lx + 20, ly, { fs: 12.5, weight: 600, fill: C.text })}${t(`${(v * 100).toFixed(1)}%`, lx + 20 + textWidth(k, 12.5, { bold: true }) + 8, ly, { fs: 11, mono: true, fill: C.dim })}`;
    })
    .join("");
  const h = 112 + Math.ceil(top.length / 4) * 26 + 40;
  return doc({
    w,
    h,
    title: "Languages in my featured repositories",
    desc: top.map(([k, v]) => `${k} ${(v * 100).toFixed(1)} percent`).join(", "),
    body: `${t("Languages across featured repos, each repo weighted equally", 24, 34, { fs: 17, weight: 800, fill: C.text })}${segs}${legend}${t("Straight from the GitHub API. Dependencies and generated code are excluded.", 24, h - 14, { fs: 9.5, mono: true, fill: C.dim })}`,
    css: `.seg{transform-box:fill-box;transform-origin:left;animation:grow 1.2s ease-out both}@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}`,
    radius: 16,
  });
}

// ---------------------------------------------------------------- main

async function main() {
  const renderOnly = process.argv.includes("--render-only");
  let live;
  if (renderOnly) {
    if (!existsSync(livePath)) throw new Error("data/live.json does not exist yet; run without --render-only first");
    live = JSON.parse(readFileSync(livePath, "utf8"));
  } else {
    try {
      live = await collect();
      writeFileSync(livePath, JSON.stringify(live, null, 1) + "\n");
    } catch (e) {
      console.error("Could not fetch GitHub data, leaving the existing cards untouched:", e.message);
      process.exit(0);
    }
  }
  const files = { "activity.svg": activitySvg(live), "repos.svg": shippingSvg(live), "languages.svg": languagesSvg(live) };
  for (const [name, svg] of Object.entries(files)) {
    if (/[–—]/.test(svg)) throw new Error(`${name} contains an em or en dash`);
    writeFileSync(join(outDir, name), svg);
    console.log("wrote", name);
  }
}

main();
