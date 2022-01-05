import { createRouter, createWebHistory } from 'vue-router'
import { useLoader } from '@/utils/hooks/useRouterLoader'

const routes = [
  { path: '/', name: 'Home', component: useLoader(() => import('../views/home')), },
  {
    path: '/define-ui', name: 'DefineUi', component: useLoader(() => import('../views/defineUi')),
    children: [
      { path: '/define-ui/define-form', name: 'DefineUi/DefineForm', component: useLoader(() => import('../views/defineUi/defineForm')) },
      { path: '/define-ui/define-table', name: 'DefineUi/DefineTable', component: useLoader(() => import('../views/defineUi/defineTable')) }
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: useLoader(() => import('@/views/notFound')), },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  next()
})

export default router
