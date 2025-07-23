import type { AppRoutes } from './routeTypes';

export const publicRoutes: AppRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
    meta: {
      title: 'Home',
    },
    // },
    // {
    //   path: '/login',
    //   name: 'Login',
    //   component: () => import('@/pages/auth/Login.vue'),
    //   meta: {
    //     title: 'Login',
    //   },
    // },
    // {
    //   path: '/register',
    //   name: 'Register',
    //   component: () => import('@/pages/auth/Register.vue'),
    //   meta: {
    //     title: 'Register',
    //   },
  },
];
