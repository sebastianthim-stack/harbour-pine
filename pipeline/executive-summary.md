# executive-summary.md — Manager output (August Hale)

> Template output. Regenerate by re-running the pipeline.

## One page, one metric

**Mission:** launch the weekly Rescue Box and drive rescue-box subscriptions booked.
**Live prototype:** https://sebastianthim-stack.github.io/harbour-pine/

## The organisation

| Agent | Role | Output |
|-------|------|--------|
| Ada Lennox (Researcher) | size the waste | research-brief.md |
| Théo Marchand (Designer) | design the offer | design-spec.md |
| Priya Nair (Maker) | build + deploy live page | GitHub Pages site |
| Maya Okafor (Communicator) | launch campaign | marketing.md |
| August Hale (Manager) | orchestrate + gate | this summary + cold-verify.md |

## Launch readiness

- **Offer:** 6 rescue-eligible lines, €18.30 full value, **€10.98** at 40% off.
- **Live data:** inventory Google Sheet (per-load fetch) + UK Carbon Intensity API.
- **Campaign:** SMS → email → social, each driving to the single live page.
- **Comms:** Article 50 disclosure in the footer; opt-out everywhere.

## Key risks

1. Sheet or API goes down → page shows a clear "live data unreachable" state
   (graceful, honest, never a fake number).
2. Box contents stale if the sheet is not updated → mitigated by per-load fetch.
3. Prompt-injection via the sheet → sheet content is treated as untrusted data;
   nothing in the sheet can change page behaviour or other rows.

## Regulatory posture

GDPR: no real personal data in the sheet; the form minimises collection; clear
purpose and opt-out. EU AI Act: Article 50 transparency line on the page; system
falls outside Annex III high-risk categories; human oversight retained via the
Manager STOP gate and a human sales handoff.
