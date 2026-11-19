# Michele Talks

Personal speaker website: profile, available talks, talk history, a creative talks graph and a contact form.

A full-stack TypeScript monorepo: **Hono** backend + **React + TypeScript + Vite** frontend.

> ⚠️ **Rigor tier: `mvp` — not production-ready.**
> MVP: coverage is advisory in CI (SAST and the security floor still block).
> This is tracked debt — raise it with `/wellforge:promote` before shipping; never lower a tier silently.

## Quickstart

```bash
mise install        # install pinned tools (node, pnpm)
mise run install    # install backend + frontend dependencies
mise run dev        # start backend + frontend in dev mode
```

## Layout

| Path | What |
|---|---|
| `backend/` | Hono API service (TypeScript, Zod-OpenAPI) |
| `frontend/` | React + TypeScript + Vite SPA |
| `specs/` | Spec-driven workflow artifacts (see `specs/README.md`) |
| `mise.toml` | Root tool pins + aggregate tasks |
| `.forge/manifest.json` | WellForge generation manifest (upgrade contract) |

## Commands

| Command | What it does |
|---|---|
| `mise run install` | Install all dependencies |
| `mise run dev` | Run backend + frontend |
| `mise run build` | Build all services |
| `mise run test` | Test all services |
| `mise run lint` | Lint all services |

Run a single service's task with the service prefix, e.g. `mise run backend:test`.


## Documentation

See [AGENTS.md](./AGENTS.md) for the full stack reference, conventions, and the
spec-driven development workflow.

## Connections

| Tool | Status | Verified by |
|---|---|---|
| GitHub repo (`Smirne/michele-talks`, public, default `main`) | connected | `gh repo view Smirne/michele-talks --json name,visibility,defaultBranchRef` |
| Merge strategy (squash + rebase only, linear history) | connected | `gh api repos/Smirne/michele-talks --jq '{merge: .allow_merge_commit}'` → `false` |
| Branch protection on `main` (PRs, 5 required checks, linear history, no force push, 0 approvals: solo maintainer) | connected | `gh api repos/Smirne/michele-talks/branches/main/protection` |
| CI quality gates (rigor `mvp`) | connected | first runs green on `main` |
| CI secrets / variables | none needed yet | `gh secret list` (empty) |
| MCP servers (playwright, context-hub) | connected (plugin-provided, no project `.mcp.json`) | `/mcp` in a session |
| Environments | connected (no DB; public `VITE_*` defaults in `mise.toml`) | `mise env \| grep VITE_` |
| Architecture map (groma.md 0.6.6) | connected: first scan, not yet curated | `npx -y --package=groma.md@0.6.6 --package=groma.md-darwin-arm64@0.6.6 groma view --plain` |

Local setup per clone: `git config merge.ff only && git config pull.rebase true`.

## Pending setup

- **Hosting / deploy**: not decided. The site is planned as static pages with no runtime backend (no contact form, no CMS), so any static host fits: Cloudflare Pages, GitHub Pages or Netlify. To be specified as a feature.
- **groma CI action** (`MrLesk/groma.md-action`): optional, not added.
