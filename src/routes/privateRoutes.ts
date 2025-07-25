import type { AppRoutes } from './routeTypes';

export const privateRoutes: AppRoutes = [
  // {
  //   path: '/client-register',
  //   name: 'ClientRegister',
  //   component: () => import('@/pages/ClientRegister.vue'),
  //   meta: {
  //     title: 'ClientRegister',
  //   },
  // },
  {
    path: '/searchMovies',
    name: 'SearchMovies',
    component: () => import('@/pages/SearchMovies.vue'),
    meta: {
      title: 'Search Movies',
    },
    props: (route) => ({ query: route.query.search }),
  },
];
