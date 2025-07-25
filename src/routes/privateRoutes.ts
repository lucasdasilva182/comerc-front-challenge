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

  // System Users Routes
  {
    path: '/systemUsers',
    name: 'Users',
    component: () => import('@/pages/SystemUsers/SystemUserList.vue'),
    meta: {
      requiresAuth: true,
      title: 'System Users',
    },
  },
  {
    path: '/systemUsers/new',
    name: 'NewUser',
    component: () => import('@/pages/SystemUsers/UserForm.vue'),
    meta: {
      requiresAuth: true,
      title: 'New User',
    },
  },
  {
    path: '/systemUsers/:id/edit',
    name: 'EditUser',
    component: () => import('@/pages/SystemUsers/UserForm.vue'),
    meta: {
      requiresAuth: true,
      title: 'Edit User',
    },
  },

  //Customer Routes
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('@/pages/Customers/CustomersList.vue'),
    meta: {
      requiresAuth: true,
      title: 'Customers',
    },
  },
  {
    path: '/customers/new',
    name: 'NewCustomer',
    component: () => import('@/pages/Customers/CustomerForm.vue'),
    meta: {
      requiresAuth: true,
      title: 'New Customer',
    },
  },
  {
    path: '/customers/:id/edit',
    name: 'EditCustomer',
    component: () => import('@/pages/Customers/CustomerForm.vue'),
    meta: {
      requiresAuth: true,
      title: 'Edit Customer',
    },
  },

  // Rentals Routes
  {
    path: '/rentals',
    name: 'Rentals',
    component: () => import('@/pages/Rentals/RentalsList.vue'),
    meta: {
      requiresAuth: true,
      title: 'Rentals',
    },
  },
];
