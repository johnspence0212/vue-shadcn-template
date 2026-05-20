---
name: add-shadcn-component
description: Adds shadcn-vue UI components via the CLI into apps/web. Use when adding buttons, dialogs, forms, tables, or other shadcn-vue primitives to the Vue frontend.
---

# Add shadcn-vue Component

## Prerequisites

```bash
cd apps/web
npm install   # if needed
```

`components.json` is configured for **new-york** style, Tailwind 4, `@/components/ui` aliases.

## Add component

```bash
cd apps/web
npx shadcn-vue@latest add button
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add form
```

Components land in `src/components/ui/{name}/`.

## Use in Vue

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <Button variant="default">Save</Button>
</template>
```

## Conventions

- Prefer existing UI primitives over custom markup
- Use `cn()` from `@/lib/utils` for class merging
- Icons: `lucide-vue-next` (see existing components)
- Forms: pair `form` + `input` + `label` components; wire to Pinia/API in parent view

## Verify

```bash
npm run type-check
npm run lint
```

Browse [shadcn-vue docs](https://www.shadcn-vue.com/docs/components) for available components.
