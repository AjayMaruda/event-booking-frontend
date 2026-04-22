import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes = [
  {
    path: '/',
    redirect: '/events',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { guest: true },
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('../views/EventsView.vue'),
  },
  {
    path: '/events/:id',
    name: 'EventDetail',
    component: () => import('../views/EventDetailView.vue'),
  },
  {
    path: '/my-bookings',
    name: 'MyBookings',
    component: () => import('../views/MyBookingsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return next({ name: 'Events' })
  }
  if (to.meta.guest && auth.isAuthenticated) {
    return next({ name: 'Events' })
  }
  next()
})

export default router
