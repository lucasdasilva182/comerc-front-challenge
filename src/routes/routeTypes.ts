import type { RouteRecordRaw } from 'vue-router';

export interface AppRoute extends Omit<RouteRecordRaw, 'meta'> {
  meta?: {
    requiresAuth?: boolean;
    title?: string;
    layout?: string;
    roles?: string[];
  };
}

export type AppRoutes = AppRoute[];
