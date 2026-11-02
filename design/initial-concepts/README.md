# OffTap Plumbing & Gas website

## Homepage concepts (`/concepts`)

Four separate desktop-first homepage directions, leading with specialist leak detection. Open `concepts/index.html` in a browser.

| Concept | Direction | Signature interaction |
|---|---|---|
| A. Under the Surface | Dark, calm, technical | Clickable house cutaway: symptom → likely methods |
| B. Listen Closely | Acoustic, lion as hero | Drag a sensor across the yard to "hear" the leak |
| C. Field Notes | Light blueprint / job sheet | Scroll-drawn site plan from route trace to marked leak |
| D. Two Elements | Bright blue/orange split | 3-question "find the right test" guide |

Notes:
- Plain HTML/CSS/vanilla JS so each section ports cleanly to Astro components. No build step.
- Placeholder content (testimonials, stats, case studies) is marked `data-placeholder`; add `?clean` to a URL or use the pill bottom-left to hide it.
- Copy comes from the content brief. Contact details and licence numbers are from Darren's draft and must be verified before launch.
- Forms are non-functional mockups.
