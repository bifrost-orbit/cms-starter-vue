import { createRouter, createWebHistory } from 'vue-router'
import CmsPageView from '@/views/CmsPageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ path: '/:slug(.*)*', component: CmsPageView }],
})

export default router
