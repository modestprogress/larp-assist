// Vue
import { RouteRecordRaw } from 'vue-router';

// Ours
import { useUserStore } from 'stores/user';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: () => {
          const store = useUserStore();
          return { path: store.user.gm ? '/gm' : '/player' };
        },
      },
      { path: 'auth', component: () => import('pages/AuthPage.vue') },
      {
        path: 'player',
        component: () => import('layouts/PlayerLayout.vue'),
        children: [
          { path: '', component: () => import('pages/player/IndexPage.vue') },
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
        path: 'gm',
        component: () => import('layouts/GMLayout.vue'),
        children: [
          { path: '', component: () => import('pages/gm/IndexPage.vue') },
          {
            path: 'books/:id',
            component: () => import('pages/gm/BookPage.vue'),
          },
        ],
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
