---
name: fix-ci-failure
description: Triages and fixes GitHub Actions CI failures for api, web, and e2e jobs. Use when CI is red, PR checks fail, or reproducing workflow errors from logs.
disable-model-invocation: true
---

# Fix CI Failure

## 1. Identify failing job

From `.github/workflows/ci.yml`:

| Job | Common failures |
|-----|-----------------|
| `api` | compile errors, test failures, missing restore |
| `web` | type-check, ESLint, Vitest, Vite build |
| `e2e` | Playwright timeout, auth flow, port conflict |

## 2. Reproduce locally

Use skill `run-ci-locally` — run **only** the failing job first.

## 3. Job-specific fixes

### api

```bash
dotnet build Template.sln
dotnet test apps/api.tests/Api.Tests.csproj -v normal
```

- Fix compile errors in `apps/api` or `apps/api.tests`
- Update `CustomWebApplicationFactory` if auth/pipeline changed
- Ensure migrations compatible with test DB config

### web

```bash
cd apps/web
npm run type-check   # fix TS errors first
npm run lint         # ESLint
npm run test:unit -- --run
npm run build
```

- Path alias `@/` must resolve
- No `any`, no broken imports after refactor

### e2e

```bash
cd e2e
CI=true npm test
```

- Check `playwright.config.ts` webServer commands and ports
- Auth tests need seed admin credentials
- Install browsers: `npx playwright install chromium --with-deps`

## 4. Verify full pipeline

Run all three jobs locally before pushing.

## 5. Anti-patterns

Do not fix CI by:
- Disabling tests without replacement
- `--no-verify` on commits (unless user requests)
- Pointing workflow at `frontend/` or `backend/Api/`

## Log tips

- GitHub Actions: expand failed step stdout
- E2E: check `e2e/test-results/` traces on retry failures
