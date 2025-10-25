# Vue 3 + shadcn-vue Sidebar Template

A clean, production-ready Vue 3 starter template with:

- ✅ **shadcn-vue** components (Sidebar, Button, Input, etc.)
- ✅ **Tailwind CSS v4** for styling
- ✅ **Vue Router** for navigation
- ✅ **Breadcrumbs** that auto-update based on route
- ✅ **TypeScript** for type safety
- ✅ **Pinia** for state management
- ✅ **Vitest** for testing

## What's Included

### Layout
- Collapsible sidebar with shadcn-vue components
- Responsive header with breadcrumbs
- Clean white dashboard with black text
- Mobile-responsive design

### Pages (Examples)
- Home (with nested example: Home > Details)
- Inbox
- Calendar
- Search
- Settings

### Project Structure
```
src/
├── components/
│   ├── AppSidebar.vue          # Main sidebar component
│   └── ui/                      # shadcn-vue components
├── views/                       # Page components
│   ├── HomeView.vue
│   ├── HomeDetailsView.vue
│   └── ...
├── router/
│   └── index.ts                 # Route configuration
├── stores/                      # Pinia stores
└── style.css                    # Tailwind + theme config
```

## Quick Start

### 1. Clone or Use as Template

**Option A: Clone this repo**
\`\`\`bash
git clone <your-repo-url> my-new-project
cd my-new-project
\`\`\`

**Option B: Use as GitHub Template**
1. Click "Use this template" button on GitHub
2. Create your new repository
3. Clone your new repo

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

## How to Use

### Adding a New Page

1. **Create the view** in `src/views/MyPageView.vue`:
\`\`\`vue
<script setup lang="ts">
// Your logic here
</script>

<template>
  <div class="my-page-view">
    <h1 class="text-3xl font-bold mb-4">My Page</h1>
    <p class="text-gray-600">Content here</p>
  </div>
</template>

<style scoped>
.my-page-view {
  padding: 2rem;
}
</style>
\`\`\`

2. **Add the route** in `src/router/index.ts`:
\`\`\`typescript
{
  path: '/my-page',
  name: 'my-page',
  component: () => import('@/views/MyPageView.vue'),
}
\`\`\`

3. **Add to sidebar** in `src/components/AppSidebar.vue`:
\`\`\`typescript
import { MyIcon } from "lucide-vue-next"

const items = [
  // ... existing items
  {
    title: "My Page",
    url: "/my-page",
    icon: MyIcon,
  },
]
\`\`\`

4. **Update breadcrumb mapping** in `src/App.vue`:
\`\`\`typescript
const routeInfo: Record<string, { label: string; icon: any }> = {
  // ... existing routes
  'my-page': { label: "My Page", icon: MyIcon },
}
\`\`\`

### Adding Nested Pages (Breadcrumbs)

For pages like "Settings > Profile":

\`\`\`typescript
{
  path: '/settings/profile',
  name: 'settings-profile',
  component: () => import('@/views/SettingsProfileView.vue'),
  meta: {
    breadcrumbs: [
      { label: 'Settings', path: '/settings' },
      { label: 'Profile', path: '/settings/profile' },
    ],
  },
}
\`\`\`

### Customizing Colors

Edit `src/style.css` to change the theme:

\`\`\`css
:root {
  --background: #ffffff;    /* Main background */
  --foreground: #000000;    /* Main text color */
  --sidebar: #ffffff;       /* Sidebar background */
  --sidebar-foreground: #000000; /* Sidebar text */
  /* ... more variables */
}
\`\`\`

### Adding shadcn-vue Components

Use the shadcn-vue CLI:

\`\`\`bash
npx shadcn-vue@latest add [component-name]
\`\`\`

Example:
\`\`\`bash
npx shadcn-vue@latest add card
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add dropdown-menu
\`\`\`

## Scripts

\`\`\`bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test:unit    # Run tests
npm run lint         # Lint and fix files
npm run format       # Format with Prettier
\`\`\`

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS v4** - Utility-first CSS
- **shadcn-vue** - Beautiful, accessible components
- **Vue Router** - Official Vue router
- **Pinia** - Vue state management
- **Vitest** - Fast unit testing
- **lucide-vue-next** - Icon library

## Tips

- The sidebar automatically handles mobile responsiveness
- Breadcrumbs update automatically based on route
- All shadcn components use Tailwind classes
- Use `<router-link>` for navigation to avoid page reloads
- Icons come from lucide-vue-next (https://lucide.dev)

## License

MIT

---

**Happy coding! 🚀**
