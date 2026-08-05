# SHEET_SETUP.md — create the live `harbour_pine_inventory` Google Sheet

The landing page reads **all** its inventory from this Google Sheet, live, on every
page load. Nothing is hardcoded in the code — only the sheet *ID* lives in
`config.js`. This is the dynamic-access evidence for the assignment.

## Status: already created

The sheet **already exists** (created via the Sheets API from `harbour_pine_inventory.csv`):

- **Sheet:** https://docs.google.com/spreadsheets/d/1ybMfkkFaAkZZ_JHEOEiglRtIgPME5LB3J6CBU85fKb0/edit
- **ID:** `1ybMfkkFaAkZZ_JHEOEiglRtIgPME5LB3J6CBU85fKb0` (set in `config.js`)
- **Sharing:** anyone with the link (viewer)
- The gviz endpoint is read with `&headers=1` so column labels resolve even without
  publishing to the web.

## Only needed if you re-create the sheet from scratch

1. **Create a new Google Sheet** at sheets.google.com.
   Name it `harbour_pine_inventory` (optional — the name does not matter, the ID does).
2. **Share it.** File → Share → General access → **Anyone with the link → Viewer**
   (this is what lets the JSONP endpoint read it without authentication).
3. **Import the seed data.** File → Import → Upload → `data/harbour_pine_inventory.csv`
   → *Replace current sheet*.
4. **Copy the sheet ID** — the long token in the browser URL:
   `https://docs.google.com/spreadsheets/d/<SHEET_ID_HERE>/edit`
   Paste it into `config.js`:
   ```js
   SHEET_ID: "PASTE_YOUR_SHEET_ID_HERE",
   ```
5. **Test the live fetch.** Open `index.html` locally (double-click, or `npx serve .`).
   The status strip should show `Live inventory · 21 rows · <time>`.

## Column contract (do not rename)

The page uses these columns. Keep the header row exactly as in the CSV:

| Column | Meaning |
|--------|---------|
| `item_id` | unique line id (HP-1001 …) |
| `product` | product name shown in the box |
| `category` | Bakery / Fruit / Vegetables / Deli / Dairy / Storecupboard |
| `unit` | loaves, punnets, kg, packs … |
| `price_eur` | full price in euro |
| `best_before_days` | days until best-before |
| `expiry_date` | YYYY-MM-DD (used to sort the box) |
| `quantity_available` | units on the shelf |
| `in_rescue` | `Y` = eligible for this week's Rescue Box |
| `origin` | where it was grown/produced |

Only rows with `in_rescue = Y` appear in "This week's box".

## Proving it is live

The lecturer can edit a price (or set a row's `in_rescue` to `Y`/`N`) in the sheet
**after** the deadline, reload the URL, and the page must reflect the new value —
because every load re-fetches the sheet. A hardcoded copy could not do that. To
demonstrate in your screenshots, note the **timestamp** in the status strip and change
a value in the sheet, then reload: the timestamp and the box contents both update.
