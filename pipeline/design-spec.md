# design-spec.md — Designer output (Théo Marchand)

> Template output. Regenerate by re-running the pipeline.

## Concept

**"Don't bin it — box it."** The Rescue Box reframes the shop's near-expiry stock as
a weekly, live-curated good deal instead of waste. The emotion is warmth and
cleverness, never shame. One primary conversion action exists on the page:
**"Reserve my box."**

## User journey

1. Landing on the hero: the promise in one line.
2. "This week's box" — the live inventory content, updating in front of the customer.
3. "Cleanest delivery window" — the live grid claim that makes the delivery honest.
4. The reserve form: name, email, frequency → submit.
5. Success: confirmation (mailto or Formspree), one-click opt-out promise.

## Section-by-section wireframe

| Section | Content | Primary element |
|---------|---------|-----------------|
| Hero | Headline "Don't bin it. Box it." + lede | CTA → #box |
| Status strip | Live inventory + grid readouts (the liveness evidence) | none |
| This week's box | Live list of rescue-eligible lines: name, category, qty, price | box item cards |
| Box footer | Count, total value, you-pay (40% off) | none |
| Delivery window | Live carbon index + forecast + plain-language advice | advice line |
| Reserve form | Name, email, frequency radios | Submit |
| Footer | Business + AI transparency disclosure (Article 50) | disclosure |

## Live-data moments (the Maker must wire both)

1. **Box contents** — fetched from `harbour_pine_inventory` at every page load;
   filter `in_rescue = Y`, sort by `expiry_date`.
2. **Delivery window** — UK Carbon Intensity API; map index to advice
   (very low/low → good, high/very high → bad).

## States

- default / hover / focus-visible (clear 3px focus ring)
- success / error on the form; no-JS `<noscript>` fallback; `prefers-reduced-motion`
  removes animations.

## Accessibility plan

AA contrast (Leaf on Cream, Pine on Cream), real labels on every field, keyboard
reachable, semantic HTML, `aria-live` on the box list. Canvas/WebGL deliberately
not used — the page must work everywhere, including a phone on 3G.

## Note to the Maker

A gorgeous page that fails on a phone is a failed page. Cut ambition before you cut
the accessibility bars.
