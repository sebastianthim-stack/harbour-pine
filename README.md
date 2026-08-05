# Harbour & Pine — The Rescue Box (Final Project: Build an Agentic Organisation)

A five-agent organisation that launches a **weekly Rescue Box** for **Harbour & Pine**,
a fictional zero-waste grocery and deli in Dublin Docklands: near-expiry produce,
40% off, picked **live** from what is actually on the shelf.

## The five agents (see `agents/`)

| Agent | Archetype | Name | Produces |
|-------|-----------|------|----------|
| Researcher | identify the opportunity | Ada Lennox | `pipeline/research-brief.md` |
| Designer | create the solution | Théo Marchand | `pipeline/design-spec.md` |
| Maker | build the product | Priya Nair | this live GitHub Pages site |
| Communicator | get the customers | Maya Okafor | `pipeline/marketing.md` |
| Manager | run the business | August Hale | `pipeline/executive-summary.md`, `cold-verify.md` |

Pipeline: **Researcher → Designer → Maker → Communicator → Manager** (no stage starts
before the previous one finishes; every agent consumes the previous agent's output).

## What the live page does

- **Live Google Sheet** — `harbour_pine_inventory` is fetched via the Sheets JSONP
  endpoint on **every page load** and rendered as "This week's box" (rows where
  `in_rescue = Y`, sorted by `expiry_date`). Nothing is hardcoded or cached; only the
  sheet *ID* lives in `config.js`.
- **Live UK Carbon Intensity API** — fetched per load and shown as the
  "cleanest delivery window" with plain-language advice.
- **Reserve form** — Formspree if configured, otherwise a mailto fallback that works
  with no JavaScript.
- **Article 50 transparency disclosure** in the footer.
- Mobile-first, AA contrast, `prefers-reduced-motion`, `<noscript>` fallback.

## Live data (already configured)

The `harbour_pine_inventory` Google Sheet **already exists** and is shared
"anyone with the link". Its ID is set in `config.js`; the page re-fetches it on every
load (JSONP with `&headers=1`). See **`SHEET_SETUP.md`** to inspect or re-create it.

Test locally: open `index.html` — the status strip must show
`Live inventory · 21 rows · <time>`.

## Deploy to GitHub Pages

1. Create a **public** repo, e.g. `harbour-pine`.
2. Push these files:
   ```bash
   cd harbour-pine
   git remote add origin https://github.com/YOUR_USERNAME/harbour-pine.git
   git branch -M main
   git push -u origin main
   ```
3. **Settings → Pages → Deploy from a branch → main → / → Save**.
4. Live at `https://YOUR_USERNAME.github.io/harbour-pine/`.

No secrets are in this repo — the sheet is public-by-design, and no API key is used
by the page. The Gemini key used when running the agents stays on a Cloudflare Worker
secret (or local-only), never in the repo.

## Keeping it honest (assignment evidence)

- Every value on the page is fetched at runtime — the lecturer can edit the sheet
  after the deadline and the page reflects it on next load.
- Re-run the pipeline in your terminal agent to regenerate the `pipeline/` outputs
  against your live sheet, then screenshot each stage for the report.
- The pipeline outputs are template drafts — regenerate them so figures and narrative
  match your actual runs before screenshotting.
