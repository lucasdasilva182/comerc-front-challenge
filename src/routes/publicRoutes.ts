import type { AppRoutes } from './routeTypes';

export const publicRoutes: AppRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/Login.vue'),
    meta: {
      title: 'Login',
    },
  },
];
