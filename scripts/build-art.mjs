// Builds every hand-designed SVG in assets/ from data/profile.json.
// Run: node scripts/build-art.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const p = JSON.parse(readFileSync(join(root, "data/profile.json"), "utf8"));
mkdirSync(join(root, "assets"), { recursive: true });

const pieces = [
  ["banner.svg", "./art/banner.mjs", "banner"],
  ["ship-loop.svg", "./art/ship-loop.mjs", "shipLoop"],
  ["ownership.svg", "./art/ownership.mjs", "ownership"],
  ["numbers.svg", "./art/numbers.mjs", "numbers"],
  ["principles.svg", "./art/principles.mjs", "principles"],
  ["timeline.svg", "./art/timeline.mjs", "timeline"],
  ["stack.svg", "./art/stack.mjs", "stack"],
  ["availability.svg", "./art/availability.mjs", "availability"],
  ["footer.svg", "./art/footer.mjs", "footer"],
];

// Section header strips, one per README section.
const { sectionHeader, sectionHeaders } = await import("./art/sections.mjs");
for (const hd of sectionHeaders) {
  const svg = sectionHeader(hd);
  if (/[–—]/.test(svg)) throw new Error(hd.file + " contains an em or en dash");
  writeFileSync(join(root, "assets", hd.file), svg);
}
console.log("built", sectionHeaders.length, "section headers");

for (const [file, mod, fn] of pieces) {
  const m = await import(mod);
  const svg = m[fn](p);
  if (/[–—]/.test(svg)) throw new Error(`${file} contains an em or en dash`);
  writeFileSync(join(root, "assets", file), svg);
  console.log("built", file, `${(svg.length / 1024).toFixed(1)} KB`);
}

// Project cards: ParchiVisa is featured, the other four are 2-up.
const proj = await import("./art/projects.mjs");
mkdirSync(join(root, "assets/projects"), { recursive: true });
for (const pr of p.projects) {
  const svg = pr.slug === "parchivisa" ? proj.featuredCard(pr) : proj.projectCard(pr);
  if (/[–—]/.test(svg)) throw new Error(pr.slug + " card contains an em or en dash");
  writeFileSync(join(root, "assets/projects", pr.slug + ".svg"), svg);
  console.log("built project", pr.slug);
}
