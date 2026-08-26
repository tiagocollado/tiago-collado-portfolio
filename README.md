# Gotya

Personal portfolio of **Tiago Collado** — UX/UI Designer & Frontend Developer.

**Live:** [tiagocollado.vercel.app](https://tiagocollado.vercel.app/)

---

## About

A bilingual (EN/ES) portfolio built around long-form case studies rather than a gallery of screenshots. Each project is documented as a decision log: the problem, the constraints, the reasoning, and what shipped.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 — App Router, Turbopack |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS v4 — CSS-first `@theme`, no config file |
| Animation | Framer Motion, Lenis smooth scroll |
| i18n | next-intl — full EN/ES parity |
| Theming | next-themes — dark by default |
| Icons | lucide-react, simple-icons |
| Hosting | Vercel |

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Structure

```
src/
├── app/[locale]/           # routes, layout, global styles, OG image
│   └── projects/[slug]/    # case studies
├── components/
│   ├── case-study/         # case study layout
│   ├── sections/           # home sections
│   └── ui/                 # shared UI
├── data/                   # project and stack data
├── i18n/                   # next-intl config
├── messages/               # en.json, es.json
└── proxy.ts                # locale detection
```

## Notes

- `/` redirects to `/en`; every `/es/...` route is equally available.
- All 21 routes are statically generated at build time, including a branded Open Graph image per locale.
- Next.js 16 renamed the middleware file to `proxy.ts` — that is not a typo.

---

© 2026 Tiago Collado. The code is public for reference. The brand, design, copy, and project content are not licensed for reuse.
