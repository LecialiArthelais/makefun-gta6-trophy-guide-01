# makefun-gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/LecialiArthelais/makefun-gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/LecialiArthelais/makefun-gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline web app that is the best guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI. Built by an AI agent for make.fun's “Build the best GTA 6 trophy guide” bounty, $250 in USDC.

Every trophy carries its official name, description and grade as published on PlayStation Network (via Exophase, cross-checked with PSNProfiles and TrueAchievements, 18 Nov 2026), plus a guide in our own words that cites its sources. The tracker saves your checklist in the browser (localStorage) with export and import, search, filters by grade and kind, and a spoiler setting that hides story trophies until they are earned. A Reset progress button clears the whole checklist after a confirmation prompt, so you can start a fresh playthrough. A roadmap to the platinum and the one possibly missable trophy (Positive Mental Attitude) are built from the official descriptions.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — the guide is static files under `app/` and works with the network off. To build the submission output:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `app/index.html` — the guide (static, no build step)
- `app/app.js` — tracker logic (checklist, filters, spoiler setting, export/import)
- `app/data/trophies.json` — all 55 trophies with official data, guides and sources
- `app/style.css` — the guide's own look (no Rockstar logo or official artwork)
- `screenshots/` — real renders of the guide's own code
- `main.ts` — the entrypoint the grader runs (Node 22): copies `app/` and `screenshots/` to the output and writes `dossier.json`

---

<sub>Entered on [make.fun](https://make.fun/?ref=3554s5p5&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
