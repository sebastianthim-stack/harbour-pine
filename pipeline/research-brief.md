# research-brief.md — Researcher output (Ada Lennox)

> Template output from a representative pipeline run against the seed sheet.
> Regenerate by re-running the pipeline so the figures match your live sheet.
> Every figure below is computed from a live query of `harbour_pine_inventory`.

## Problem statement

Harbour & Pine sells fresh produce with a fixed best-before life, and a share of it
never sells in time. That waste is visible, measurable, and currently unpriced —
nobody owns the number. The rescue boxes that should recover it exist only as a paper
form behind the counter, with no link between "what is near expiry" and "who wants it".

## Segment definition (precise rule)

A line is **rescue-eligible** when the live sheet reports:

```
in_rescue = Y
```

i.e. the stock will breach best-before within the current week and is still sellable.

## Sizing (from the live sheet, this run)

| Metric | Value |
|--------|-------|
| Live inventory rows | 21 |
| Rescue-eligible lines | 6 (HP-1001, HP-1003, HP-1006, HP-1011, HP-1015, HP-1017) |
| Full value of eligible lines | **€18.30** |
| Box price at 40% off | **€10.98** |
| Otherwise binned each week (estimate) | ~€18.30 of edible food |

Maths (visible): `2.50 + 3.00 + 3.50 + 2.00 + 5.20 + 2.10 = 18.30`; box price =
`18.30 × (1 − 0.40) = 10.98`.

Qualitative risk: first-time online customers who never place a second order remain
the larger structural leak, but it is not yet visible in the inventory sheet
`[ASSUMPTION: a customer dataset would be needed to size it precisely]`.

## The single metric the organisation should move

**Rescue-box subscriptions booked (per week).** Everything else — the page, the copy,
the delivery window — serves this one number.

## Notes to the Designer

- The offer is only credible because the box contents are **live**: a static list
  would be an ad, not a rescue.
- The clearest delivery-window claim must come from the live grid API, not from a
  fixed weekday promise.
