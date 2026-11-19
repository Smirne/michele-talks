# Decisions — Site foundation: content, structure and visual identity

Choices the agents made that the spec, plan and tasks did not dictate. Disagree with one?
It is drift: amend the spec/plan and re-sync tasks — do not quietly edit the code.

## T1–T3 · frontend-dev · 2026-11-19
- default: `react/jsx-no-literals` set with `noStrings: true, ignoreProps: true` — why: it flagged `to`/`href` props, and AC-8.3 is about visible text — where: `frontend/eslint.config.js`
- default: fontsource CSS imported from `main.tsx` without the `.css` suffix, not via CSS `@import` — why: Vite cannot resolve the `@import` form given the packages' `exports` map — where: `frontend/src/main.tsx`
- assumption: the zod schema applies stricter validation than the notes spell out (kebab-case slug/id, http(s)-only URLs, real calendar dates, email format) — why: this is what the "malformed" cases need, and the real content passes it — where: `frontend/src/content/schema.ts`
- scope: the plugin also fails if the profile photo file is missing, and runs validation in `buildStart` — why: AC-7.2 says build and dev must fail on invalid content even when nothing imports it — where: `frontend/vite-plugins/content.ts`
- scope: edited `HomePage.tsx` and `home/strings.en.ts` outside T1's touch list — why: the new lint rule rejects the scaffold's hard-coded text — where: `frontend/src/features/home/`
- reinterpretation: `profile.photo` in `virtual:content` is the fingerprinted asset URL, not the YAML path — why: the app needs a URL it can render — where: `frontend/vite-plugins/content.ts`
- default: `vitest.config.ts` includes the content plugin through an `as unknown as Plugin` cast, with a comment — why: vitest 2 types against vite 5 and the project pins must not move — where: `frontend/vitest.config.ts`
- default: focus-to-h1 is owned by `PageHeader` and keyed on title change, with per-router state in a context — why: robust to lazy loading, back/forward and StrictMode, and no focus steal on first load — where: `frontend/src/components/layout/PageHeader.tsx`
- default: stub h1s reuse `common.nav.*` labels, and the stub talk-detail h1 is the talk title from content — why: no new strings until the page tasks — where: `frontend/src/features/*/*Page.tsx`
- default: footer line reads "Michele is CTO and co-founder of WellD" — why: matches the owner's bio; the tasks only said "WellD line + link" — where: `frontend/src/i18n/common.en.ts`
- default: the wordmark link to Home has `aria-current` forced off — why: the spec calls for exactly one current link, and it belongs to the nav — where: `frontend/src/components/layout/SiteLayout.tsx`
- default: the router is a code-based tree with a `createAppRouter({history})` factory — why: tests use memory history — where: `frontend/src/app/router.tsx`
- assumption: the T1 dev dependencies `vitest-axe`, `@playwright/test`, `@axe-core/playwright` and `eslint-plugin-react` are installed as the task lists them, but only `vitest-axe` and `eslint-plugin-react` are used so far — why: Playwright is T9 — where: `frontend/package.json`
- default: no `user-event` dependency added; tests use `fireEvent` — why: it is not in the T1 add list — where: `frontend/src/app/App.test.tsx`
