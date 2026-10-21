# Self-Assessment para Product Owners

Web app version of the *Self-Assessment para Product Owners©* spreadsheet by Dionatan Moura
([dionatanmoura.com](https://dionatanmoura.com)). A Product Owner rates 70 skills from 0 to 10, gets a skill
map and tracks progress across assessments.

**Live app: https://po-skills.pages.dev**

The original spreadsheet is kept in the repo root and is the source of truth for its 58 skills. The app keeps 39 of them (Management 3.0, Lean, ADKAR, Lean Change Management, Métricas de Eficiência, Métricas de Eficácia, Produto e Usuário, Cultura Data-Driven, Gestão de Feedback de Usuários, CNV Comunicação Não-Violenta, Desenvolvimento de Produto, Gestão de Backlog, Gerenciamento de Projetos, Sprint, Sprint Retrospective, Daily and Business Agility were dropped; Release Plan was merged into MVP, Lean Inception into Inception de Produto and Resolução de Conflitos into Negociação) and adds 31 more
(product management, software engineering, CX & metrics, AI).

## Run it

On Windows, double-click `run.bat`. Otherwise:

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # domain tests (includes a check against the original .xlsx)
npm run build      # type-check + production build in dist/
npm run preview    # serve dist/ at http://localhost:4173
```

`dist/` is a static site. Every push to `main` runs the tests, builds and deploys it to Cloudflare Pages
(`.github/workflows/deploy.yml`, needs the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets).

## Features

| Area | What it does |
| --- | --- |
| Home | Landing page with "Start new assessment"; returning users can continue an unfinished assessment or open their latest results; first-time visitors can open an example |
| Rate | One area per step (9 steps), 0–10 per skill with behavioural anchors (0 Desconheço → 9–10 Aplico com maestria), previous score shown as a dashed hint, clickable area stepper, sticky Back/Next |
| Results | Essentials/Advanced averages with change vs. previous, radar of 9 areas, all 70 skills with previous-score markers, "Save your results" block (PDF report, JSON backup, share card) |
| Progress | Averages over time, per-area comparison, biggest gains and drops |
| Data | Import the original `.xlsx` (each date column becomes an assessment), JSON backup and restore, delete an assessment |
| Share | 1200×630 PNG card (LinkedIn/Open Graph size) |
| Language | Portuguese and English, auto-detected, switchable |

Data is stored in the browser's `localStorage` only. There are no accounts or servers yet.

## Structure

```
src/
  domain/          pure logic, no React
    skills.ts      70 skills in display order (39 from the spreadsheet + 31 added), 9 areas, scale anchors
    scoring.ts     averages, levels, changes
    data.ts        data model, validation, localStorage, example data
    importXlsx.ts  original spreadsheet importer
    domain.test.ts
  i18n/            pt.ts is the reference dictionary; en.ts must match its shape
  lib/             radar geometry (shared by SVG and the PNG card), share card, download
  components/      one component per tab + Radar
  App.tsx          state and screen routing (home, #result, #rate, #history, #data)
```

## Decisions to review

- **The 9-area grouping** is this app's proposal. The spreadsheet only splits Essenciais
  (28) and Diferenciais (30). Change them in `src/domain/skills.ts`.
- **Every area has Essential and Advanced skills** (40 / 30); a test enforces it. Diferenciais are shown as
  Avançados, and seven spreadsheet skills changed tier to balance the areas (see the comment on `SHEET_SKILLS`).
  Tier and area averages are recomputed, so past assessments show the new grouping too.
- **The 31 added skills are not in the spreadsheet**, so the `.xlsx` import leaves them unrated. Older assessments
  simply have them unrated; averages ignore unrated skills.
- **The added skills follow market research** (certifications, competency frameworks, job postings, books).
  Some overlapping skills were merged (e.g. NPS with CSAT & CES, Go-to-Market with Product-Led Growth); there were
  no users yet, so old ids are simply dropped.
- **Scale anchors** are generic per level, not per skill.
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
