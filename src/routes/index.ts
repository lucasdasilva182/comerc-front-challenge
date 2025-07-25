import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { publicRoutes } from './publicRoutes';
import { privateRoutes } from './privateRoutes';
import { useAuthStore } from '../stores/authStore';

const routes = [
  {
    path: '/',
    component: () => import('@/pages/Layout.vue'),
    children: [
      ...publicRoutes,
      ...privateRoutes,
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/pages/NotFound.vue'),
        meta: {
          title: 'Page Not Found',
        },
      },
    ],
  },
] as RouteRecordRaw[];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.title) {
    document.title = `${to.meta.title} - Comerc Front Challenge`;
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    next({
      name: 'Login',
    });
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

router.afterEach((to, from, failure) => {
  if (!failure) {
    window.scrollTo(0, 0);
  }
});
