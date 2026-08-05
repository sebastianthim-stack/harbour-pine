# cold-verify.md — Manager quality gate (August Hale)

> Template output. Regenerate by re-running the pipeline.

Cold verification re-tasked a fresh verifier, blind to how the work was made, against
frozen criteria. Pass/fail with evidence below.

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | Data is fetched live, not cached | PASS | `app.js` calls the Sheets JSONP endpoint on every load; no catalogue values in the repo; `config.js` holds only the sheet ID |
| 2 | One metric, not five | PASS | research-brief names a single metric: rescue-box subscriptions booked |
| 3 | Page runs on a phone | **FAIL on first run** | no-JS fallback rendered only the hero; booking impossible without JavaScript |
| 4 | On-brand, on-voice | PASS | "Don't bin it, box it" spine consistent across page and copy |
| 5 | GDPR-clean and kind | PASS | clear purpose, one-click opt-out, no pre-tick, no shame |
| 6 | No hallucinated facts | PASS | all figures (6 lines, €18.30, €10.98) trace to the live sheet |

## The catch

**Found one:** the first deployment broke on a phone with JavaScript disabled — the
fallback state failed. The Maker was re-queued; the fix (a `<noscript>` notice plus a
mailto fallback that works without JS) shipped in the second run.

**STOP gate: lifted after re-run #2.** The page, the copy and the plan all reference
the same live segment and metric because each agent consumed the previous one's output.
