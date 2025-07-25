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
  {
    path: '/systemUsers',
    name: 'Users',
    component: () => import('@/pages/SystemUsers/SystemUserList.vue'),
    meta: {
      requiresAuth: true,
      title: 'Usuários',
    },
  },
  {
    path: '/systemUsers/new',
    name: 'NewUser',
    component: () => import('@/pages/SystemUsers/UserForm.vue'),
    meta: {
      requiresAuth: true,
      title: 'Novo Usuário',
    },
  },
  {
    path: '/systemUsers/:id/edit',
    name: 'EditUser',
    component: () => import('@/pages/SystemUsers/UserForm.vue'),
    meta: {
      requiresAuth: true,
      title: 'Editar Usuário',
    },
  },
];
