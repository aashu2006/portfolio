# portfolio

Personal site for Akshat Patil. One static page, deliberately plain: a single
900px column, hand-written CSS, no client-side routing and no framework UI
beyond the contact form.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Layout

| Path | What lives there |
| --- | --- |
| `app/page.tsx` | The entire page. Every section is here. |
| `app/globals.css` | The whole theme. Plain CSS, no utility classes. |
| `app/layout.tsx` | Fonts and metadata. |
| `components/contact-form.tsx` | Client component: the Get in Touch form. |
| `components/instancing-demo.tsx` | Client component: the three.js forest. |
| `components/theme-toggle.tsx` | Client component: the light/dark switch. |
| `components/site-nav.tsx` | Client component: the section nav, both shapes. |
| `lib/sections.ts` | Section ids and labels. Must match the `h2` ids. |
| `lib/*-data.ts` | Content for the open source, projects, and writing sections. |

To change what the page says, edit the `lib` data files. To change how it
looks, edit `globals.css`. The section order lives in `app/page.tsx`.

## Contact form

The form posts to [Web3Forms](https://web3forms.com), which forwards the
message to my inbox. There is no backend and nothing is stored here.

It needs an access key:

1. Enter your email at web3forms.com and they mail you a key.
2. Copy `.env.example` to `.env.local` and fill in
   `NEXT_PUBLIC_WEB3FORMS_KEY`.
3. Add the same variable in the Vercel project settings, or the form works
   locally but not in production.

Without the key the section renders a plain email address instead of a form,
so a visitor never types out a message that has nowhere to go. The key is
public by design; it only authorises delivery to the address it was issued to.

## Instancing demo

The three.js scene in the Work section draws 500 trees, each a trunk plus three
stacked foliage cones, as two `InstancedMesh` batches over a ground disc. That
is roughly 2,000 objects in 3 draw calls. It illustrates the p5.strands
instancing work described right above it, so it belongs to that entry rather
than to the page.

The canvas is transparent and the fog fades to the stage background, which is
what dissolves the far trees and the rim of the ground disc into the page.
Break that equality and the scene ends at a visible hard edge.

They stay equal on their own: `.demo-stage` paints `var(--stage)` and the
component reads that same property back out with `getComputedStyle`, so the
colour is declared once in `globals.css`. A `MutationObserver` on
`data-theme` updates the fog when the theme changes, which is why the forest
does not keep a pale halo on a dark page. `HAZE_FALLBACK` in the component is
only used if the property cannot be read at all.

It is deliberately expensive to reach and cheap to ignore:

- `three` is behind a dynamic `import()`, so it lands in its own chunk and adds
  nothing to first load. Verify with `grep -l WebGLShadowMap .next/static/chunks/*.js`
  and check that chunk is absent from the served HTML.
- Nothing loads until an `IntersectionObserver` says the section is within
  200px of the viewport.
- The render loop pauses when the tab is hidden or the section scrolls away.
- `prefers-reduced-motion: reduce` renders a single static frame instead.
- If a WebGL context cannot be created, the stage shows a text fallback.
- The stage reserves its height from first paint, so the canvas arriving
  causes no layout shift.

The draw-call figure in the caption is read from `renderer.info.render.calls`
rather than hardcoded, so it stays honest if the scene ever gains a second
material.

## Theme notes

A few rules in `globals.css` are load-bearing and easy to break by accident:

- **`h1`** is a page-coloured fill over an ink-coloured stroke, so the letters
  are outlines. The fill has to match the page background or the effect
  collapses, which is why both are `var(--page)` and `var(--ink-strong)`
  rather than fixed hex. Writing either back to a literal `#fff` or `#000` is
  what would break dark mode.
- **Colour runs downhill** through the heading levels: outlined `h1`, ember
  `h2` (`--accent`, 5.9:1 on white), mauve `h3` (4.55:1). Recolouring one level
  alone inverts the hierarchy, so keep `h2` above `h3` in contrast. Dark mode
  holds the same order at 16.7:1 and 9.3:1. The levels have their own tokens,
  `--head-2` and `--head-3`, so that ordering lives in one place per theme.
- **Body copy is 16px on a 900px measure**, which is a long line. The leading
  is set wider than the headings to compensate.
- **`.blurb`** floats an image left and lets text wrap around it. Headings set
  `clear: both` so the next section never rides up alongside one.

## Project cards

Projects render as a two-column grid of bordered cards, each led by a
screenshot. This is the one part of the page that is not plain-web: the
projects are worth showing, and the 240px floated thumbnail this replaced was
too small to show anything in them.

Each entry in `lib/projects-data.ts` may set `image` to a path under `public/`,
and `liveLink` to a deployed URL. Both are optional. No `image` gives a card
with no screenshot; no `liveLink` drops the green Live dot and the globe icon,
leaving GitHub alone, which is the honest result for a project with nothing
running.

Screenshots live in `public/projects/`. Shoot them **16:9** and at least 860px
wide, which is 2x the ~430px card. `.card-shot` sets `object-fit: cover`, so a
different ratio is cropped rather than squashed, but anything far from 16:9
loses real content to the crop.

The `<Image>` needs its `sizes` prop. Without it the browser assumes the image
spans the viewport and fetches a 1920px file for a 430px box, which on these
screenshots is roughly 100KB of waste each.

Give the file its true extension. `next/image` sniffs the format and copes
either way, but a JPEG named `.png` is served with the wrong `Content-Type`
when requested directly from `public/`.

The sources are checked in at full screenshot resolution, far larger than the
box needs. That costs repo weight, not page weight: the optimizer downscales
to the 480px the thumbnail actually uses.

**Replacing a screenshot in place needs a cache clear.** The image optimizer
keys on the request URL plus width and quality, holds the result for four
hours, and never checks whether the source file changed underneath. Overwrite
`docrag.png` and `next dev` keeps serving the old one from
`.next/dev/cache/images`, which looks exactly like the new file not being
picked up. Run:

```bash
rm -rf .next/dev/cache/images   # npm run dev
rm -rf .next/cache/images       # npm run start
```

No server restart is needed, but the browser wants a hard refresh. Renaming
the file avoids this entirely, since the URL changes. Vercel is unaffected:
every deploy starts cold.

## Navigation

`lib/sections.ts` is the list of sections. Every `id` there must match the
`id` on an `h2` in `app/page.tsx`: add a section to the page without adding it
here and it is unreachable from the nav, and the reverse leaves a dot pointing
at nothing.

The nav has two shapes and `site-nav.tsx` renders both, letting CSS decide
which is shown. That also keeps the hidden one out of the accessibility tree.

- **Dot rail**, at 1200px and up. Lives in the margin the 900px column leaves.
  It is anchored by its **right** edge with each row reversed, so the dots line
  up in a fixed column beside the text while the labels run outward into the
  margin. Anchoring from the left instead puts a long label like "Get in Touch"
  33px into the body copy at *every* viewport width. 1200px is the floor
  because the widest label plus its dot needs 115px of margin, which the column
  only affords past about 1130px.
- **Sticky top bar**, below 1200px, where there is no margin to use.

Every label is always visible. An earlier version revealed them on hover, which
left six anonymous dots and one word on screen and read as decoration rather
than as navigation.

The **theme toggle is not in the nav.** It is fixed to the top-right corner of
the viewport so it sits in one place at every width. The top bar carries extra
right padding to keep its last link out from under it.

The active section comes from a scroll listener rather than an
`IntersectionObserver`: it picks the last heading above a line 120px down the
viewport, which is easier to reason about than observer thresholds. The final
section is special-cased, since it is too short to push its heading past that
line and would otherwise never go active.

## Theming

Every colour is a custom property on `:root`. The dark palette is written out
twice, once under `@media (prefers-color-scheme: dark)` scoped to
`:root:not([data-theme="light"])` and once under `:root[data-theme="dark"]`.
The media query serves a visitor who has never touched the toggle, including
one with JavaScript off; the attribute rule lets an explicit choice beat the
OS in either direction. **Keep the two blocks identical.**

`<html data-theme>` is the single source of truth. It is written before first
paint by a small inline script in `app/layout.tsx`, which is what stops a
visitor whose choice disagrees with their OS from seeing a frame of the wrong
palette. `components/theme-toggle.tsx` does not keep its own copy of the
theme: it subscribes to that attribute through `useSyncExternalStore`, and the
three.js demo watches the same attribute to recolour its fog. Anything else
that needs the theme should watch it too rather than adding a second source.

The two themes deliberately do not match. Light spends colour on headings,
chips and links, which is the [xnze.ro](https://xnze.ro/) plain-web identity
the site is built on. Dark spends almost none: headings and links go
near-white and the ember survives only as a focus ring and an error message,
which is the restraint borrowed from
[samworks](https://samworks.vercel.app/). Those two references genuinely
disagree, and each theme follows the one that suits it. That split is why
heading colour is `--head-2` / `--head-3` rather than reusing `--accent` and
`--mauve`: dark quiets the headings without dragging chips and buttons
monochrome too.

Switching the theme fires a **blast**: a ring races out from the toggle to the
furthest screen corner while the palette cross-fades underneath it. The ring is
a radial gradient with a clear centre, so it never hides the page behind a
growing disc, and the cross-fade is a `.theming` class applied to
`documentElement` for 280ms and then removed. Leaving that transition on
permanently would put a visible lag on every ordinary hover.

This deliberately does **not** use the View Transitions API, which was the
first implementation. That API paints its snapshot in a layer above all page
content, so anything drawn on top of it is invisible for the whole animation:
the ring stayed hidden for 480ms and surfaced only once it had already faded
out. Owning the animation outright also means Safari and Firefox get the same
effect. `prefers-reduced-motion` skips the blast and the cross-fade both.

The toggle also plays a short synthesised blip, two sine voices a fifth apart,
pitched up going light and down going dark. There is no audio file: it is a
handful of Web Audio nodes built on the first click, since a context created
before a user gesture starts suspended. The gain is ramped rather than
stepped, because a square edge on a waveform is heard as a click. If the sound
is unwelcome, delete `playBlip` and its one call site; nothing else depends on
it.

Adding a colour means adding it to **both** dark blocks. A literal hex left in
a rule is invisible in light mode and wrong in dark, which is the failure mode
to watch for. Check contrast in both themes: `h2` must stay above `h3`.

## Deploying

Deploys to Vercel from `main`. Set `NEXT_PUBLIC_WEB3FORMS_KEY` in the project's
environment variables before the first deploy.
