import { createRouter, createWebHistory } from 'vue-router'
import { useLoader } from '@/utils/hooks/useRouterLoader'

const routes = [
  { path: '/', name: 'Home', component: useLoader(() => import('../views/home')), },
  {
    path: '/ui-define', name: 'UiDefine', redirectTo: '/ui-define/define', component: useLoader(() => import('../views/uiDefine')),
    children: [
      { path: '/ui-define/define', name: 'UiDefine/Define', component: useLoader(() => import('../views/uiDefine/define')) },
      { path: '/ui-define/table-define', name: 'UiDefine/TableDefine', component: useLoader(() => import('../views/uiDefine/tableDefine')) }
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
