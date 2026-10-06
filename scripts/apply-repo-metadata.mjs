// Sets the description, homepage and topics on your public repos so the pinned cards and search
// results say what each project is. Empty descriptions are the single most common profile gap.
//
//   node scripts/apply-repo-metadata.mjs            dry run: prints what would change
//   GITHUB_TOKEN=ghp_... node scripts/apply-repo-metadata.mjs --apply
//
// The token needs the `repo` scope (classic) or "Administration: write" on these repos
// (fine-grained). It is read from the environment only and never written anywhere.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const meta = JSON.parse(readFileSync(join(root, "data/repo-metadata.json"), "utf8"));
const apply = process.argv.includes("--apply");
const token = process.env.GITHUB_TOKEN;
if (apply && !token) {
  console.error("Set GITHUB_TOKEN to use --apply.");
  process.exit(1);
}

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "profile-repo-metadata",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

for (const r of meta.repos) {
  const slug = `${meta.owner}/${r.name}`;
  console.log(`\n${slug}\n  description: ${r.description}\n  homepage:    ${r.homepage ?? "(none)"}\n  topics:      ${r.topics.join(", ")}`);
  if (/[–—]/.test(JSON.stringify(r))) throw new Error(`${slug}: em or en dash in metadata`);
  if (r.description.length > 350) throw new Error(`${slug}: description over GitHub's 350 character limit`);
  if (!apply) continue;

  const patch = await fetch(`https://api.github.com/repos/${slug}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ description: r.description, homepage: r.homepage ?? "" }),
  });
  console.log(`  PATCH repo   -> ${patch.status}`);
  const topics = await fetch(`https://api.github.com/repos/${slug}/topics`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ names: r.topics }),
  });
  console.log(`  PUT topics   -> ${topics.status}`);
}
if (!apply) console.log("\nDry run only. Re-run with --apply to write these.");
