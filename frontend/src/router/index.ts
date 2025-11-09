import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import HomeDetailsView from '@/views/HomeDetailsView.vue'
import InboxView from '@/views/InboxView.vue'
import CalendarView from '@/views/CalendarView.vue'
import SearchView from '@/views/SearchView.vue'
import SettingsView from '@/views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/home/details',
      name: 'home-details',
      component: HomeDetailsView,
      meta: {
        breadcrumbs: [
          { label: 'Home', path: '/' },
          { label: 'Details', path: '/home/details' },
        ],
      },
    },
    {
      path: '/inbox',
      name: 'inbox',
      component: InboxView,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
  ],
})

export default router
