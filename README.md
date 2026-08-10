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
| `components/contact-form.tsx` | The only client component. |
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

## Theme notes

A few rules in `globals.css` are load-bearing and easy to break by accident:

- **`h1`** is white fill over a black stroke, so the letters are outlines. The
  fill has to match the page background or the effect collapses. This is the
  reason there is no dark mode.
- **Colour runs downhill** through the heading levels: outlined `h1`, teal
  `h2`, mauve `h3`. Recolouring one level alone inverts the hierarchy.
- **Body copy is 16px on a 900px measure**, which is a long line. The leading
  is set wider than the headings to compensate.
- **`.blurb`** floats an image left and lets text wrap around it. Headings set
  `clear: both` so the next section never rides up alongside one.

## Deploying

Deploys to Vercel from `main`. Set `NEXT_PUBLIC_WEB3FORMS_KEY` in the project's
environment variables before the first deploy.
