// Vue
import { RouteRecordRaw } from 'vue-router';

// Ours
import { useUserStore } from 'stores/user';

const routes: RouteRecordRaw[] = [
  // Login and register page
  {
    path: '/auth',
    component: () => import('pages/AuthPage.vue'),
    // If the user is logged in, redirect to the home page
    beforeEnter: () => {
      const userStore = useUserStore();
      if (userStore.user.isLoggedIn) {
        return '/';
      }
    },
  },
  {
    path: '/unactivated',
    component: () => import('pages/UnactivatedPage.vue'),
    // If the user is activated, redirect to the home page
    beforeEnter: () => {
      const userStore = useUserStore();
      if (userStore.user.isActivated || !userStore.user.isLoggedIn) {
        return '/';
      }
    },
  },
  {
    path: '/',
    redirect: () => {
      const userStore = useUserStore();

      if (!userStore.user.isLoggedIn) {
        return '/auth';
      }

      if (!userStore.user.isActivated) {
        return '/unactivated';
      }

      return store.user.gm ? '/gm' : '/player';
    },
  },
  {
    path: '/player',
    component: () => import('layouts/PlayerLayout.vue'),
    children: [
      { path: '', redirect: '/player/motds' },
      {
        path: 'divinations',
        component: () => import('pages/player/DivinationsPage.vue'),
      },
      {
        path: 'library',
        component: () => import('pages/player/LibraryPage.vue'),
      },
      {
        path: 'currency',
        component: () => import('pages/player/CurrencyPage.vue'),
      },
      {
        path: 'motds',
        component: () => import('pages/player/MotdsPage.vue'),
      },
    ],
  },
  {
    path: '/gm',
    component: () => import('layouts/GMLayout.vue'),
    children: [
      { path: '', redirect: '/gm/characters' },
      {
        path: 'books/:id',
        component: () => import('pages/gm/BookPage.vue'),
      },
      {
        path: 'markets/:id',
        component: () => import('pages/gm/MarketPage.vue'),
      },
      {
        path: 'books',
        component: () => import('pages/gm/BooksPage.vue'),
      },
      {
        path: 'divinations',
        component: () => import('pages/gm/DivinationsPage.vue'),
      },
      {
        path: 'characters',
        component: () => import('pages/gm/CharactersPage.vue'),
      },
      {
        path: 'currency',
        component: () => import('pages/gm/CurrenciesPage.vue'),
      },
      {
        path: 'markets',
        component: () => import('pages/gm/MarketsPage.vue'),
      },
      {
        path: 'traps',
        component: () => import('pages/gm/TrapsPage.vue'),
      },
      {
        path: 'items',
        component: () => import('pages/gm/ItemsPage.vue'),
      },
      {
        path: 'transactions',
        component: () => import('pages/gm/TransactionsPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
