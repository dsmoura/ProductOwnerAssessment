# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server, http://localhost:5173 (run.bat does install + dev on Windows)
npm test             # vitest run (all tests live in src/domain/domain.test.ts)
npx vitest run -t "xlsx import"   # run one describe/it by name
npm run typecheck    # tsc only (strict, noUnusedLocals/Parameters)
npm run build        # tsc && vite build -> dist/
npm run preview      # serve dist/ at http://localhost:4173
```

There is no linter. Every push to `main` runs `npm test` and `npm run build`, then deploys `dist/` to GitHub Pages
(`.github/workflows/deploy.yml`). `vite.config.ts` uses `base: './'` so the same build works at `/` and under
`/ProductOwnerAssessment/`; keep asset URLs relative.

## What this is

A client-only React 19 + TypeScript app that turns the *Self-Assessment para Product Owners©* spreadsheet (the `.xlsx`
in the repo root) into a web app: rate skills 0–10, get a radar and progress over time. No
backend; all data is in `localStorage`. `README.md` has the feature list and the "Decisions to review" that explain
why the catalogue differs from the spreadsheet. `prototype/index.html` is a standalone static design prototype, not
part of the build.

## Architecture

- **`src/domain/` is pure logic with no React** and is the only tested layer.
  - `skills.ts` is the catalogue: `DOMAIN_IDS`/`DOMAINS` (10 areas) and `SKILLS`, both written in display order
    (the order of the rating flow, results list and radar); within an area, essentials come before advanced.
    Skills are declared with `s()` (spreadsheet row) or `n()` (added by the app), and `SHEET_SKILLS` /
    `NEW_SKILLS` are filters on `fromSheet`. Tiers are `'E'` (Essential) / `'A'` (Advanced, the
    spreadsheet's "Diferenciais"), and `LEVELS` holds the scale anchors.
  - `scoring.ts` derives everything from a `Scores` map (`skillId -> 0..10`). Unrated skills are absent from the
    map and ignored by averages; tier/area averages are always recomputed from the current catalogue, so changing
    a skill's tier or area retroactively regroups old assessments.
  - `data.ts` owns `AppData` (versioned, `po-self-assessment:v1` key), `parseAppData` (validates untrusted JSON from
    localStorage or a backup: drops unknown skill ids, out-of-range scores, bad dates; rounds to integers), and
    the deterministic `sampleData()` shown to first-time visitors (`isSample: true`).
  - `importXlsx.ts` matches spreadsheet rows to skills by normalized `sheetLabel(skill)` (`sheetName ?? name.pt`),
    and turns each date column into an assessment; all-zero columns are the untouched template and are skipped.
- **Catalogue invariants enforced by tests** (the test reads the real `.xlsx` via `read-excel-file/node`):
  every `SHEET_SKILLS` label must exist in sheet "1. Assessment"; no `NEW_SKILLS` `name.pt` may collide with a
  sheet row; ids are unique; every area has at least one Essential and one Advanced skill. If you rename a
  spreadsheet skill's Portuguese name, set `sheetName` to the original label. Update the count assertions and the
  README numbers when adding/removing skills.
- **`App.tsx` holds all state** (`AppData`, persisted on every change) and routes screens by URL hash
  (`home` = no hash, `#result`, `#rate`, `#history`, `#data`) with `pushState`, so browser Back walks the flow.
  Components in `src/components/` receive data and callbacks as props; they do not touch storage.
  "Current" assessment = `currentId` or the latest by date; "previous" = the one before it by date.
- **i18n** (`src/i18n/`): `pt.ts` is the reference dictionary and defines `Dict = typeof pt`; `en.ts` is typed as
  `Dict`, so every key must exist in both. Skill/area text uses `Localized = { pt, en }` resolved with `l()` from
  `useI18n()`, which also provides `formatScore` / `formatDate` (dates are ISO `YYYY-MM-DD`, formatted in UTC).
- **Exports in `src/lib/`** draw outside the DOM and do not use `styles.css`:
  `shareCard.ts` renders a 1200×630 PNG on a canvas; `pdfReport.ts` builds an A4 report with jsPDF using a
  hard-coded copy of the light theme colors, and must pass text through `safe()` because the built-in PDF fonts are
  Latin-1 only. Both use `radarGeometry.ts` so the radar matches the SVG `Radar` component; both take a
  `CardText` bundle (`t`, `l`, formatters) instead of using the React i18n hook.
- **Styling**: a single `src/styles.css` with CSS custom-property tokens and a dark-mode variant; fonts are
  self-hosted via `@fontsource` packages.
