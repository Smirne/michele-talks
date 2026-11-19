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
