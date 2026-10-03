# Self-Assessment para Product Owners

Web app version of the *Self-Assessment para Product Owners©* spreadsheet by Dionatan Moura
([dionatanmoura.com](https://dionatanmoura.com)). A Product Owner rates 58 skills from 0 to 10, gets a profile, a
skill map and a focus plan, and tracks progress across assessments.

**Live app: https://dsmoura.github.io/ProductOwnerAssessment/**

The original spreadsheet is kept in the repo root and is the source of truth for the skill list.

## Run it

On Windows, double-click `run.bat`. Otherwise:

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # domain tests (includes a check against the original .xlsx)
npm run build      # type-check + production build in dist/
npm run preview    # serve dist/ at http://localhost:4173
```

`dist/` is a static site. Every push to `main` runs the tests, builds and deploys it to GitHub Pages
(`.github/workflows/deploy.yml`).

## Features

| Area | What it does |
| --- | --- |
| Rate | 0–10 per skill with behavioural anchors (0 Desconheço → 9–10 Ensino e influencio), previous score shown as a dashed hint, optional evidence note for scores of 7+, "show unrated only" filter |
| Results | Profile name from the strongest area, Essentials/Differentials averages with change vs. previous, radar of 8 areas, 3-item focus plan (essentials first), all 58 skills with previous-score markers |
| Progress | Averages over time, per-area comparison, biggest gains and drops |
| Data | Import the original `.xlsx` (each date column becomes an assessment), JSON backup and restore, delete an assessment |
| Share | 1200×630 PNG card (LinkedIn/Open Graph size) |
| Language | Portuguese and English, auto-detected, switchable |

Data is stored in the browser's `localStorage` only. There are no accounts or servers yet.

## Structure

```
src/
  domain/          pure logic, no React
    skills.ts      58 skills (same order as the spreadsheet), 8 areas, scale anchors
    scoring.ts     averages, profile, focus plan, changes
    data.ts        data model, validation, localStorage, example data
    importXlsx.ts  original spreadsheet importer
    domain.test.ts
  i18n/            pt.ts is the reference dictionary; en.ts must match its shape
  lib/             radar geometry (shared by SVG and the PNG card), share card, download
  components/      one component per tab + Radar
  App.tsx          state and tab routing (#rate, #history, #data)
```

## Decisions to review

- **The 8-area grouping and the profile names** are this app's proposal. The spreadsheet only splits Essenciais
  (28) and Diferenciais (30). Change them in `src/domain/skills.ts`.
- **Scale anchors and focus-plan actions** are generic per level. Per-skill content (articles, courses, exercises)
  is the next step for the focus plan.
- **Scores are whole numbers.** Decimal scores from the spreadsheet are rounded on import.
- **Skill names in `name.pt` must match the spreadsheet exactly**, because the importer matches rows by name.
  A test enforces this.

## Roadmap ideas

1. Accounts and sync (e.g. Supabase). Replace `loadData`/`saveData` in `src/domain/data.ts`.
2. 360° feedback: invite teammates and stakeholders to rate you, then compare self vs. others.
3. AI coach: a 30/60/90-day plan generated from the results.
4. Per-skill learning content linked to dionatanmoura.com.
5. Team view for heads of product: a heatmap across POs.
6. Anonymous benchmarks.
