# OffTap Plumbing & Gas website

The **Astro** homepage implements [`Readout v2`](design/hybrid-concepts/5-readout-v2/index.html). The repository also preserves the client brief, supplied brand assets, and earlier design concepts. The site is a scaffold for review, not an approved public launch.

## Develop the Astro site

Use the Node.js version in `.node-version` and the pnpm version in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm check` checks Astro and TypeScript. `pnpm test` builds the static site and checks its generated HTML, local assets, structured data, robots policy, and sitemap. `pnpm preview` serves the built `dist/` directory. There is no client-side framework runtime.

In an orb, run `amp orb services ensure` to start the declared development server and obtain its portal URL.

## Extend the homepage

- `src/pages/index.astro` composes the homepage sections and its business, website, webpage, and service structured data.
- `src/layouts/PageLayout.astro` owns document metadata, canonical URLs, social sharing, local font preloads, the skip link, and the shared header and footer.
- `src/components/Header.astro` and `Footer.astro` are separate components. `Button.astro`, `SectionHeading.astro`, and `Glow.astro` are shared elements. Homepage sections live in `src/components/home/`.
- `src/data/site.ts` owns the business details, production origin, and navigation. `src/data/methods.ts` supplies both the method tabs and service structured data.
- `src/styles/global.css` carries the selected design's typography, colours, responsive layouts, and interaction states. Fonts are self-hosted. Astro generates responsive WebP mascot images.

Every method explanation exists in the static HTML. Without JavaScript, all methods and navigation links remain available. JavaScript adds keyboard-operated tabs and the collapsible mobile menu. Reduced-motion preferences stop CSS and SVG animations.

The mock testimonials and design-review controls are omitted. The original AI mascot illustrations remain subject to client approval. Enquiry links open the visitor's email application; there is no hosted form or submission backend.

## Approve the site before search indexing

Builds default to `noindex, nofollow` and `robots.txt` disallows crawling. `PUBLIC_SITE_INDEXABLE=true` enables indexing **only in production builds**. The custom 404 page stays noindex. Robots directives are not access control. Keep sensitive previews behind hosting authentication.

Before enabling indexing:

- Confirm `https://offtapplumbingandgas.com.au` is the final canonical origin. It comes from the supplied mockup, not a verified deployment. Change `src/data/site.ts` if needed.
- Verify the phone, email, QBCC and gas licences, service coverage, business ownership, advertised methods, and written-findings claims with the client.
- Approve the mascot artwork and any new testimonials or job photographs. Do not add review ratings without genuine evidence.
- Confirm whether a public business address and opening hours can be published. Structured data deliberately omits these unknown details and makes no rich-result eligibility promise.
- Test production HTTPS, the chosen host's www/apex and trailing-slash redirects, custom 404 status, caching, compression, and security headers. Deploy only `dist/`, not the private briefs or design directories.
- Decide how any existing `.html` URLs migrate. Add host-level 301 redirects only when replacement service pages actually exist. The scaffold has one homepage, not the earlier mockup's unbuilt service pages.
- Confirm the email enquiry flow, then run the release checks below. Submit `/sitemap-index.xml` in Google Search Console after launch and domain verification. Check live Core Web Vitals once real traffic exists.

```sh
pnpm check
PUBLIC_SITE_INDEXABLE=true pnpm test
```

Set `PUBLIC_SITE_INDEXABLE=true` in the production hosting environment before its build. Leave it unset or false on previews. The sitemap includes actual generated pages only and excludes the 404 page. No analytics, invented location pages, business hours, street address, ratings, or fake search actions are added.

## Supplied materials

| Location | Contents |
| --- | --- |
| [`docs/client-brief/`](docs/client-brief/) | Client handover, content and design brief, original five-page draft, and earlier multi-page website mockup. Start with [`START_HERE.txt`](docs/client-brief/START_HERE.txt). |
| [`docs/brand-assets/`](docs/brand-assets/) | Supplied SVG logo and `FireBanner1.png`. |
| [`design/initial-concepts/`](design/initial-concepts/) | Four initial homepage directions, their shared assets, and the supplied concept notes. |
| [`design/dark-concepts/`](design/dark-concepts/) | Round 2: four dark, gradient-led homepage directions (Surge, Pressure, Water &amp; Fire, Pinpoint). Open [`index.html`](design/dark-concepts/index.html). |
| [`design/hybrid-concepts/`](design/hybrid-concepts/) | Round 3: four hybrids of initial Concept A (Under the Surface) and dark Concept 2 (Pressure): Readout, Control Room, Deep Scan, Talking Pipes, plus Readout v2, the next version built from Readout. They share `assets/hybrid.js` and `assets/hybrid.css`. Open [`index.html`](design/hybrid-concepts/index.html). |

The extracted source files are unchanged. The two nested ZIP files contained identical copies of the extracted handover and concepts, so duplicate archives are omitted. macOS metadata files are also omitted.

## Review the homepage concepts

Open [`design/initial-concepts/concepts/index.html`](design/initial-concepts/concepts/index.html) in a browser. These standalone HTML, CSS, and JavaScript mockups need no install or build step.

- **A. Under the Surface:** dark technical direction with a clickable house cutaway.
- **B. Listen Closely:** acoustic detection direction with a draggable sensor demo.
- **C. Field Notes:** light blueprint direction with a scroll-driven site plan.
- **D. Two Elements:** blue and orange direction with a three-question test finder.

The [supplied concept notes](design/initial-concepts/README.md) describe the interactions and placeholder controls. Each concept includes a toggle to hide placeholder content. Forms are non-functional mockups.

## Continue design proofing

Keep the initial concepts as a reference. Put new homepage alternatives in separate folders under `design/`, with their own entry HTML and assets. Keep the client-supplied documents and earlier mockup under `docs/` separate from new design work.

The client handover prioritises specialist leak detection, with plumbing and gas fitting secondary. Before publication, verify contact details, licensing, service coverage, capabilities, and any placeholder claims. Readout v2 is the selected homepage direction.

## Prepare an orb

Amp runs the executable `.agents/setup` before saving a reusable project snapshot. Setup installs Node.js from `.node-version`, pnpm from `package.json`, and Astro dependencies from `pnpm-lock.yaml`. Matching snapshots retain the installed tools and dependencies. Setup reuses them when it runs again after a repository update.

To check setup manually inside an orb, run:

```sh
.agents/setup
```

New login shells in this checkout use the pinned toolchain through a repository-scoped entry in `~/.bash_profile`. `.agents/resume` does no work because the project needs no authentication, databases, or reconnect steps. It never installs dependencies.

The Astro app lives at the repository root so setup installs its dependencies. Commit changes to both `package.json` and `pnpm-lock.yaml` when adding packages.

The dev server is declared in `.amp/services.yaml`. Start it with `amp orb services ensure`. Do not start servers in setup.

The lifecycle files must reach the project's default branch before future orbs use them. No project secrets or extra system packages are required.
