# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

SubBee — a single-page marketing/landing site (Nomba Hackathon 2026 project) for a fintech product that pays users' subscriptions from a virtual card that's kept empty except at the moment of charge. The repo is 100% frontend: Vite + React 19 + TypeScript + Tailwind. There is no backend, API, or test suite in this repo.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`).

- `pnpm dev` — start the Vite dev server
- `pnpm build` — type-check (`tsc -b`) then production-build with Vite; run this to verify TypeScript compiles cleanly
- `pnpm lint` — run oxlint (config in `.oxlintrc.json`, plugins: react/typescript/oxc)
- `pnpm preview` — preview the production build locally

There is no test runner configured in this project.

## Architecture

The entire site lives in **`src/App.tsx`** (~1000 lines) as a single scroll-snapping one-pager. Key structural points before making edits:

- **Slide model**: the page is an array of `<Slide>` elements (`const slides = [...]`, indices 0–7) rendered inside `<main>`. Each `Slide` is a `<section id="slide-N">` with CSS scroll-snap (`section.snap` in `src/index.css`) and its own `IntersectionObserver` that calls `onVisible(index)` to update the app-level `current` slide state. `TOTAL` in `App()` must match the slide count if slides are added/removed, and the `labels` array in `SideNav` must stay in sync (one label per slide index).
- **Navigation**: `goTo(i)` scrolls to `#slide-{i}` via `scrollIntoView`. The fixed header and `SideNav` (dotted progress rail with a bee-icon thumb, desktop-only) both read `current` to style themselves per-slide — many className expressions branch on `[1, 3, 4, 5, 7].includes(current)` to pick light-on-dark vs dark-on-light styling depending on each slide's background (dark slides: Pain Points, Funding Modes, Anywhere, Security, CTA). Inserting/reordering/recoloring a slide means updating this array everywhere it appears (currently 5 places in the header), the separate `[0, 7].includes(current)` check that gates center-nav-link visibility (only shown on Hero/CTA), the hardcoded `goTo(n)` targets on the "How it works"/"Security"/"Alerts" nav buttons, and every downstream slide's `key`/`id="slide-N"`/`index={N}`.
- **Local component helpers** (`BeeCard`, `BalancePanel`, `GlobeHorizon`) are defined at the top of `App.tsx` and reused across slides (hero, "how it works", security, and "Anywhere" slides) — they are not in `src/components/`. `GlobeHorizon` is a pure SVG+CSS globe (no image asset) bottom-bled off a slide via a large negative `bottom` offset, used on the "Anywhere" slide to visualize local vs. international reach with two pulsing pins and a dashed flight-arc.
- **`src/components/VirtualCard.tsx` and `ActionRequiredAlert.tsx`** are standalone components not currently imported/used anywhere in the app (they duplicate `BeeCard`'s concept with a Tailwind-color-token-based styling approach instead of the inline gradient classes `App.tsx` uses). Check before assuming they're wired in.
- **Assets**: all images referenced in `App.tsx` are loaded from `public/assets/` via absolute `/assets/...` paths (not imported through the bundler), so new images just need to be dropped into `public/assets/`. `src/assets/` also exists but holds only a couple of unused legacy files.
- **Styling**: Tailwind utility classes are the primary styling mechanism; `tailwind.config.js` defines the brand palette (`gold`, `teal`, `bg`, `surface`, `ink`, `status`) — prefer these tokens over ad hoc hex values for new UI, though much of the existing hero/slide code still uses inline hex (`#183739`, `#E9B84A`, etc.) predating the token setup. Global styles, keyframes (`slideUp`, `float`, `drawLine`), and the honeycomb background pattern live in `src/index.css`.
- **Feature flag**: `SHOW_BEE_PATH` (top of `App.tsx`) toggles a decorative animated SVG path overlay across the page; currently `false`.
