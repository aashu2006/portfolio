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

The fog colour (`HAZE` in the component) and the `.demo-stage` background in
`globals.css` must stay equal. The canvas is transparent and the fog fades to
that value, which is what dissolves the far trees and the rim of the ground
disc into the page. Change one and the scene ends at a visible hard edge.

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

- **`h1`** is white fill over a black stroke, so the letters are outlines. The
  fill has to match the page background or the effect collapses. This is the
  reason there is no dark mode.
- **Colour runs downhill** through the heading levels: outlined `h1`, ember
  `h2` (`--accent`, 5.9:1 on white), mauve `h3` (4.55:1). Recolouring one level
  alone inverts the hierarchy, so keep `h2` above `h3` in contrast.
- **Body copy is 16px on a 900px measure**, which is a long line. The leading
  is set wider than the headings to compensate.
- **`.blurb`** floats an image left and lets text wrap around it. Headings set
  `clear: both` so the next section never rides up alongside one.

## Deploying

Deploys to Vercel from `main`. Set `NEXT_PUBLIC_WEB3FORMS_KEY` in the project's
environment variables before the first deploy.
