---
name: leonxlnx
description: Anti-slop frontend design guidance — house rules and craft laws for building or restyling a landing page, portfolio, hero section, or any public-facing UI so it reads as deliberately designed rather than generic and AI-templated. Use whenever building, redesigning, or polishing a landing page, marketing page, portfolio, product page, or hero section, or when asked to make something look "designed," "premium," "professional," or less like every other site.
---

# Design taste: house rules and laws

A page built on autopilot usually looks like the average of every page a model has
seen: a centred headline over three lines, a small label above it, a row of icon
cards, a soft gradient, a few thin rules, a monospace caption. Nothing in it is
wrong and nothing in it was decided. This file is the short, standalone version of
that judgment — no scripts, no generated directions, just the rules and the reasons,
to be applied by hand and checked by eye.

## The process, in short

1. **Find what only this subject has.** Its name, its real numbers, its actual
   constraints, its real content. Never start from the category average.
2. **Write the idea in one sentence:** "On this page, *[something real about the
   subject]* becomes *[the device that carries it]*." If swapping in the nearest
   competitor still makes the sentence true, the idea belongs to the category, not
   to this subject — start over.
3. **Give the visitor one real, working thing to do**, built from the subject's
   actual data or function — not a decorative animation standing in for a feature.
4. **Write the content in full before styling it.** Every section promised by the
   brief carries its complete, real information. Thin sections lose to busy ones.
5. **Build words first, image second, motion last.** A page that needs animation
   to look finished is not finished.
6. **Look at the rendered result** at desktop, tablet and phone width before
   calling it done. Judge what you see, not what the code says it should look like.

## House rules (never break these)

| Rule | Instead |
| --- | --- |
| Headlines: two lines or fewer, at every width. | Cut words, then widen the measure, then (last resort) lower the size. |
| No eyebrows — no small label/pill above a heading. | Put the information in the heading or first sentence, or drop it. |
| No monospace outside real code blocks. | The text face, with tabular figures for aligned numbers. |
| No index numbering (01 / 02 / Step 2). | Order shown by position, size, or words. |
| No thin hairline dividers, grid lines, or 1px-outlined boxes. | Space, a tone step between surfaces, or a filled shape. Real tables, forms, and functional connectors (e.g. a timeline's progress line) are the only exception — and should be named as such in a comment. |
| No gradients — backgrounds, buttons, or text. | Flat colour, or a real photo with a plain scrim. |
| No shadows on things at rest. | A tone step between surfaces. Shadows only on what truly floats (menus, dialogs). |
| No "assistant palette" — cream+terracotta, or violet/indigo. | A palette actually chosen for this subject. |
| No tiny uppercase letter-spaced labels. | Sentence case at a readable size. |
| No icon-topped feature cards, no rows of identical cards. | A layout shaped by what the content actually is. |
| No glass/blur nav bars, no floating pill navigation. | A plain bar, or no persistent nav at all. |
| No emoji, gradient blobs, or decorative shapes with no content. | A real detail, a real interface fragment, or nothing. |
| No styled accent word inside a headline (italic/serif/colour/underline). | One face, one colour; let the words carry the emphasis. |
| Two typefaces at most — usually one. | A deliberate pairing, or a single family at varied weights. |

## Laws of the craft

**Type**
- Five sizes is the ceiling for the whole page (display / heading / lead / body /
  small). Pick them once, reuse them everywhere.
- Running text in the full ink at 16px+; muted/subtle tones are for captions and
  secondary notes only, never for a paragraph meant to be read.
- Check real contrast, not just vibe — body text needs ~4.5:1 against its
  background, ~7:1 is the safer bar for primary copy.

**Space**
- One grid, one pair of margins, used everywhere.
- The gap between sections should be clearly larger than any gap inside one
  (roughly 120–220px on desktop) — but a short section surrounded by generous
  gaps can still read as "empty." If a screen-height slice of the page ends up
  mostly blank, that's a sign to add real content or a tone/colour change there,
  not just more padding.
- Give neighbouring sections different compositions; never fall back to the same
  card-grid shape twice in a row.

**Colour**
- One ground, one ink, one accent. The accent appears on the primary action and
  perhaps one other thing — not scattered everywhere.
- A section may change the whole field colour on purpose (that's a real design
  move); nothing should fade into the next section by accident.

**Imagery**
- Prefer, in order: the subject's own real photos/screenshots → something
  generated for this subject → a real photo of the subject's world, credited →
  drawn-in-code graphics in the page's own palette → nothing at all.
- No image is better than a generic stock photo standing in for a specific
  product, person, or place. Never present a found or generic photo as if it
  were the subject's own.
- One dominant visual (or one clearly intentional control/object) beats several
  small decorative ones.

**Motion**
- Give every section a real entrance for its parts (heading, then text, then
  detail — staggered, not one blanket fade), plus real feedback on hover/press
  for every control.
- Prefer motion tied to something real (scroll position, real data loading, a
  real counter) over a looping decorative animation.
- Respect `prefers-reduced-motion`: keep the content, drop the travel.

## Self-check before calling it done

Since there's no automated gate here, check these by eye on real screenshots at
~1440px, ~768px, and ~390px wide, in both light and dark theme if the page has one:

- Does any screen-height slice of the page look mostly empty?
- Does any small text sit directly above a bigger heading (an accidental eyebrow)?
- Any gradients, resting shadows, hairline dividers, or icon-card rows left in?
- Does every piece of secondary-colored text still read clearly against its
  background?
- Is there one real, working thing the visitor can do — not just a static page?
