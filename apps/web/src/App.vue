<script setup lang="ts">
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import AppSidebar from './components/AppSidebar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { Calendar, CheckSquare, Home, Inbox, Search, Settings } from 'lucide-vue-next'

const route = useRoute()

const routeInfo: Record<string, { label: string; icon: typeof Home }> = {
  home: { label: 'Home', icon: Home },
  tasks: { label: 'Tasks', icon: CheckSquare },
  inbox: { label: 'Inbox', icon: Inbox },
  calendar: { label: 'Calendar', icon: Calendar },
  search: { label: 'Search', icon: Search },
  settings: { label: 'Settings', icon: Settings }
}

const isGuestRoute = computed(() => route.meta.guest === true)

const currentRoute = computed(() => {
  const name = route.name as string
  return routeInfo[name] ?? { label: 'Page', icon: Home }
})

const breadcrumbs = computed(() => {
  if (route.meta.breadcrumbs) {
    return route.meta.breadcrumbs as Array<{ label: string; path: string }>
  }

  const name = route.name as string
  if (routeInfo[name]) {
    return [{ label: routeInfo[name].label, path: route.path }]
  }

  return []
})
</script>

<template>
  <div
    v-if="isGuestRoute"
    class="flex min-h-svh w-full flex-1 items-center justify-center bg-muted/40 p-4"
  >
    <router-view />
  </div>
  <SidebarProvider v-else class="flex min-h-svh w-full flex-1">
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <nav class="flex items-center gap-2 text-sm">
          <component :is="currentRoute.icon" class="h-4 w-4" />
          <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
            <router-link
              v-if="index < breadcrumbs.length - 1"
              :to="crumb.path"
              class="font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {{ crumb.label }}
            </router-link>
            <span v-else class="font-medium">
              {{ crumb.label }}
            </span>
            <span v-if="index < breadcrumbs.length - 1" class="text-muted-foreground">/</span>
          </template>
        </nav>
      </header>
      <div class="flex flex-1 flex-col">
        <router-view />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
