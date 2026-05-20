---
name: run-ci-locally
description: Reproduces GitHub Actions CI locally — dotnet test, web type-check/lint/unit/build, and Playwright e2e. Use before pushing, when validating PRs, or matching CI failures.
disable-model-invocation: false
---

# Run CI Locally

Mirrors `.github/workflows/ci.yml`.

## Job: api

```bash
cd /home/johnspence/Repos/vue-shadcn-template
dotnet restore Template.sln
dotnet build Template.sln --no-restore
dotnet test apps/api.tests/Api.Tests.csproj --no-build --verbosity normal
```

## Job: web

```bash
cd apps/web
npm ci
npm run type-check
npm run lint
npm run test:unit -- --run
npm run build
```

## Job: e2e

Requires api + web tooling:

```bash
cd e2e
npm ci
npx playwright install chromium --with-deps
CI=true npm test
```

Playwright config starts api and web automatically (`e2e/playwright.config.ts`).

## Run all sequentially

```bash
# api
dotnet restore Template.sln && dotnet build Template.sln && dotnet test apps/api.tests/Api.Tests.csproj

# web
cd apps/web && npm ci && npm run type-check && npm run lint && npm run test:unit -- --run && npm run build

# e2e
cd ../../e2e && npm ci && CI=true npm test
```

## Prerequisites

- .NET 9 SDK
- Node 22+
- Chromium deps for Playwright (install step above)

On failure, use skill `fix-ci-failure`.
