<script setup lang="ts">
import { Calendar, CheckSquare, Home, Inbox, LogOut, Search, Settings } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

const router = useRouter()
const auth = useAuthStore()
const { isMobile, setOpen, setOpenMobile } = useSidebar()

const items = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Tasks', url: '/tasks', icon: CheckSquare },
  { title: 'Inbox', url: '/inbox', icon: Inbox },
  { title: 'Calendar', url: '/calendar', icon: Calendar },
  { title: 'Search', url: '/search', icon: Search },
  { title: 'Settings', url: '/settings', icon: Settings }
]

function closeSidebar() {
  if (isMobile.value) {
    setOpenMobile(false)
  } else {
    setOpen(false)
  }
}

function logout() {
  auth.logout()
  closeSidebar()
  router.push({ name: 'login' })
}
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton as-child>
                <router-link :to="item.url" @click="closeSidebar">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </router-link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter class="p-2">
      <p v-if="auth.user" class="truncate px-2 text-xs text-muted-foreground">
        {{ auth.user.email }}
      </p>
      <Button variant="outline" class="w-full justify-start gap-2" @click="logout">
        <LogOut class="size-4" />
        Sign out
      </Button>
    </SidebarFooter>
  </Sidebar>
</template>
