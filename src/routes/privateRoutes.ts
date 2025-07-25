import type { AppRoutes } from './routeTypes';

export const privateRoutes: AppRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
    meta: {
      title: 'Home',
      requiresAuth: true,
    },
  },
  {
    path: '/searchMovies',
    name: 'SearchMovies',
    component: () => import('@/pages/SearchMovies/SearchMovies.vue'),
    meta: {
      title: 'Search Movies',
      requiresAuth: true,
    },
    props: (route) => ({ query: route.query.search }),
  },
];
