# Profile setup checklist

Everything in the README is built. These are the steps that live in your GitHub account settings, which no file in a repo can change. In order of impact.

## 1. Publish the profile README (5 minutes)

GitHub shows a repo's README on your profile only when the repo is **public** and named exactly like your username.

1. Create a public repo named `asadsheikh91` (no README, no license, no .gitignore).
2. From this folder:

```bash
git add -A
git commit -m "Profile README: ship loop, ownership map, live proof of work"
git remote add origin https://github.com/asadsheikh91/asadsheikh91.git
git push -u origin main
```

3. Open the **Actions** tab and run **Update profile cards** once. After that it refreshes itself daily.

## 2. Fix the profile card (2 minutes)

Settings, Public profile.

| Field | Now | Set it to |
| --- | --- | --- |
| Name | `Asad Amad` | `Asad Amad Sheikh` |
| Bio | empty | `Full stack engineer. I ship systems, then own them. Founder of ParchiVisa (live). Web apps, AI, payments.` (under 160 characters) |
| Company | `parchivisa.app` | `ParchiVisa` |
| Location | `Pakistan` | `Islamabad, Pakistan` |
| Website | `asadamadsh.me` | `https://asadamadsh.me` |
| Social accounts | none | `https://linkedin.com/in/asadamadsheikh` |
| Photo | check | Use the 512px headshot from the portfolio (`public/asad-avatar.jpg`) |

## 3. Give every pinned repo a description and topics (3 minutes)

Empty descriptions make a profile look abandoned. The text is ready in [`data/repo-metadata.json`](../data/repo-metadata.json).

```bash
node scripts/apply-repo-metadata.mjs            # dry run, prints what would change
GITHUB_TOKEN=ghp_yourtoken node scripts/apply-repo-metadata.mjs --apply
```

Create the token at Settings, Developer settings, with the `repo` scope, and delete it afterwards. Or paste the descriptions in by hand.

## 4. Pin six repos

Profile, Customize your pins. In this order:

1. `asadsheikh91` (this profile repo, optional)
2. `cascade-payments`
3. `vehicle-watch`
4. `VeriLoom`
5. `influence`
6. `mdr-backend-demo` (it already has a description)

## 5. Clean up what a reviewer will notice

A technical reviewer opens the pinned repos first. These are the things they will see.

**`vehicle-watch` has a committed virtual environment.** The repo is 133 MB because `.venv/` is checked in, which is also why GitHub reports it as 91 MB of Python, Cython, Fortran and C. Fix:

```bash
cd vehicle-watch
echo ".venv/" >> .gitignore
git rm -r --cached .venv
git commit -m "Stop tracking the virtual environment"
git push
```

That stops new bloat. To remove it from history too (shrinks the clone), use `git filter-repo --path .venv --invert-paths` and force-push. Only do that on a repo nobody else has cloned.

**`influence` has build output committed.** The 212 MB is `website/.next/` (Next.js build output) plus `blockchain/artifacts/` and `blockchain/cache/` (Hardhat output). There is also a file named `gitgnore` (a typo) next to the real `.gitignore`. Fix:

```bash
cd influence
git rm -r --cached website/.next blockchain/artifacts blockchain/cache
printf "website/.next/\nblockchain/artifacts/\nblockchain/cache/\nnode_modules/\n.env\n" >> .gitignore
git rm --cached gitgnore && rm gitgnore
git commit -m "Stop tracking build output"
git push
```

**Empty or near-empty repos.** `demo-nic`, `claude`, `AI-MEDIATOR`, `Project`, `dealer-inventory` are 0 to 26 bytes. `Compilter-Construction-Assignemnt-01` is coursework with a typo in the name. Archive them (Settings, Danger Zone, Archive) or make them private, so the repo list is only things you are proud of. `developer-portfolios` is a fork of a list; delete the fork if you do not need it.

**`asad-portfolio1` is no longer publicly visible.** It returned a 404 on 6 Oct 2026 although it was listed as public earlier that day. If you made it private on purpose, nothing to do. If not, check Settings, General.

## 6. Make the contribution graph tell the truth

- ParchiVisa's source is not public, so the work behind your live product is invisible in the graph. In your profile's contribution settings, turn on **Include private contributions on my profile** if ParchiVisa lives in a private repo under this account. If you do, edit the one line in `scripts/update-live.mjs` that says "ParchiVisa's source is not public, so its commits are not in this graph", because it will no longer be true.
- Your local git name is `Aqsa`. Commits from this machine show that as the author name (they still count toward your graph, because `asadamad81@gmail.com` is linked). Fix it so new commits read correctly:

```bash
git config --global user.name "Asad Amad Sheikh"
```

## 7. Keep it honest

If you add a number, add it to [`data/profile.json`](../data/profile.json) and to the "Verify every claim" table in the README with where a reader can check it. If something on the profile stops being true, change the data file and run `npm run build`.
