# Phase 02 — Design Language & App Shell — Completion

PHASE STATUS
- Build: PASS (no build step / bundler in this project — see docs/ARCHITECTURE.md; verified by loading `index.html` in a headless DOM harness, `tests/shell.test.js`)
- Tests: PASS (`npm test` — 12/12 non-time-dependent tests pass, including 5 new shell tests; see "Known limitations" for the 8 pre-existing failures unrelated to this phase)
- Regression: PASS for anything Phase 02 touches. `src/core/engine.js` was **not modified** and its regression suite (`tests/regression.test.js`) has 8 pre-existing failures that exist identically on `main` before this phase (verified via `git stash`) — they are transit-longitude assertions that drift because the fixtures were captured at a fixed "now" and the engine computes live transits. Not caused by, or in scope for, Phase 02.
- Responsive: PASS — layout grid implements the four breakpoints from Design Spec §20 (Desktop ≥1440, Laptop 1024–1439, Tablet 768–1023 collapses sidebar, Mobile <768 switches to bottom nav). Verified by reading the computed CSS rules; no visual/screenshot tooling was available in this environment, so no cross-device screenshots were taken — flagging this as a manual follow-up if the maintainer wants visual confirmation.
- Accessibility: PASS for what Phase 02 owns — visible focus rings (`:focus-visible`), skip-to-content link, ARIA roles on overlays (`role="dialog"`, `aria-modal`), `aria-current="page"` on active nav items, focus trap + Escape-to-close + focus restoration on all three overlay primitives, 44px minimum touch targets on coarse-pointer devices, `prefers-reduced-motion` + manual `data-motion="reduced"` override collapsing all animation durations to 0ms. Not covered (out of scope until real content exists): screen-reader testing of actual data, color-contrast audit of system hues against WCAG AA (the five system colors were chosen for visual distinction per §16, not contrast-verified — flagging for whichever phase first renders real text in a system color).
- Scope violations: NONE. Did not touch `src/legacy/index.html` (frozen, untouched) or `src/core/engine.js` calculation logic. Did not implement any of the five metaphysical systems, Pattern Intelligence, Timeline, Relationships, Explorer's actual question-answering, or Personal OS — every one of those routes renders an explicit placeholder naming the phase that owns it.
- Changed contracts: None yet exist to change (Phase 03 defines the first ones). New but additive: the route table in `src/shell/routes.js` (`OMCShell.routes`) is the first contract a future phase should treat as stable — see "Next phase dependency".
- Known limitations:
  - The root `index.html` previously served as the Phase 01 baseline (byte-identical to `src/legacy/index.html`); it has been **replaced** with the new shell entry point. `src/legacy/index.html` itself is untouched and remains the frozen reference.
  - `tests/regression.test.js` has 8 pre-existing failures caused by live transit calculation drift (see "Regression" above) — pre-existing on `main`, not introduced or fixed by this phase, and out of this phase's boundary to fix (owned by whichever phase next touches `src/core/engine.js` transit logic).
  - `docs/ARCHITECTURE.md`'s target structure lists `src/shell/inputs/` (shared date/time picker, city autocomplete) as a Phase 02 deliverable. The roadmap document's own Phase 02 task list (the authoritative source per `STATUS.md`) does not mention it, and it is tightly coupled to system-specific forms that are explicitly out of scope this phase ("Do not migrate individual metaphysical systems yet"). Deferred — see "Next phase dependency".
  - Command palette is a navigation-only shell (routes to existing pages), matching the roadmap's literal task wording ("command palette shell"). Question-answering with evidence trace is Phase 12 (Explorer).
  - No screenshots/visual regression tooling was available in this environment; responsive and visual QA was done by code inspection only.
  - Web fonts (Cormorant Garamond, Syne, DM Mono) are loaded from Google Fonts via `<link>` in `index.html` with system-font fallback stacks; they are not self-hosted (no bundler to vendor them through).
- Next phase dependency:
  - Phase 03 (Core Contracts & State) should treat `src/shell/routes.js` (`window.OMCShell.routes.ROUTES` / `.FLAT`) as the route/navigation contract and can start replacing individual `renderPlaceholder()` calls in `src/shell/router.js` with real page renders as each system contract lands.
  - Whichever phase first migrates a system's input form should decide then whether to build the shared `src/shell/inputs/` primitives mentioned in `docs/ARCHITECTURE.md`, since Phase 02 deliberately left that decision open rather than build it against no real form yet.
  - `src/shell/overlays.js` (`OMCShell.overlays.createModal/createDrawer/createDetailPanel`) and `src/shell/command-palette.js` are ready to be reused for Evidence drawers (Phase 03+) and the real Explorer (Phase 12) instead of being rebuilt.

## What was built

New files (all under `src/`, additive — nothing in `src/legacy/` or `src/core/` was touched):

- `src/styles/tokens.css` — design tokens: colors (background layers, warm off-white text, muted gold accent carried forward from the existing legacy loading-sigil color `#C9A84C` for visual continuity, five low-saturation system hues, confidence-scale colors), typography families/scale, spacing scale, radius scale, motion durations/easing (with a `prefers-reduced-motion` + `[data-motion="reduced"]` override), z-index scale, breakpoint reference values.
- `src/styles/base.css` — reset, typography scale application, focus-visible ring, skip link, `.omc-sr-only`.
- `src/styles/layout.css` — the shell grid (sidebar/topbar/main/bottomnav) and its four responsive breakpoints per Design Spec §20, plus generic `.omc-grid-2/3`, `.omc-stack`, `.omc-row` helpers so later phases don't invent their own grids.
- `src/styles/motion.css` — fade/rise-in transitions and the active-state glow, all reading duration from tokens so reduced-motion silences them for free.
- `src/styles/components.css` — primitives (Button, Input/Select, Tabs, Badge incl. confidence variants, Divider, Tooltip), Sidebar, Bottom Nav, Top Context Bar, Modal/Drawer/DetailPanel, Command Palette, and placeholder/empty/skeleton states.
- `src/shell/routes.js` — the target Information Architecture (Design Spec §6: Home, Patterns, Systems [5 sub-routes], Timeline, Relationships, Explorer, Personal OS, Settings) as a single route table consumed by sidebar, bottom nav, router, and command palette.
- `src/shell/overlays.js` — generic Modal/Drawer/DetailPanel factory: focus trap, Escape-to-close, backdrop click-to-close, focus restoration on close.
- `src/shell/sidebar.js`, `src/shell/bottom-nav.js`, `src/shell/top-context-bar.js` — navigation chrome built from the route table; sidebar collapse state persisted to `localStorage` (UI state only, no personal data).
- `src/shell/command-palette.js` — ⌘K/Ctrl+K searchable route list with arrow-key navigation.
- `src/shell/router.js` — hash router; renders the Home shell scaffold or an honest per-route placeholder naming the owning phase and, where defined, the route's guiding question from the Design Spec.
- `src/shell/app.js` — bootstrap that wires all of the above together.
- `tests/shell.test.js` — new vitest suite (jsdom environment) covering shell mount, Home render, full sidebar item count, navigating every route with no runtime errors, and command palette open. Extends the test baseline; does not replace `tests/regression.test.js`.

Modified files:
- `index.html` (root) — replaced the Phase 01 baseline copy of the legacy monolith with the new shell entry point (loads the CSS/JS above, mounts `#omc-app`). `src/legacy/index.html` is unchanged.
- `eslint.config.js` — added a config block scoped to `src/shell/**/*.js` with browser globals (`window`, `document`, `location`, `localStorage`, `console`), since this is the first browser-side DOM code in the repo; also added `setTimeout`/`clearTimeout` to the pre-existing global block for the new async-aware test. Did not change any existing rule or the `src/legacy` ignore.
- `package.json` / `package-lock.json` — added `jsdom` as a devDependency for the new shell test's DOM environment.
