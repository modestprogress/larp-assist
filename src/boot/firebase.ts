import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { boot } from 'quasar/wrappers';
import { computed } from 'vue';

// Ours
import { useUserStore } from 'stores/user';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export default boot(({ app, router }) => {
  const firebaseApp = initializeApp(config);
  const storage = getStorage(firebaseApp);
  const auth = getAuth(firebaseApp);

  app.config.globalProperties.$auth = auth;
  app.config.globalProperties.$storage = storage;
  app.config.globalProperties.$db = getFirestore(firebaseApp);
  const userStore = useUserStore();
  app.config.globalProperties.$user = computed(() => userStore.user);

  onAuthStateChanged(auth, (user) => {
    if (!user && userStore.user.isAuthorized) {
      userStore.signOut();
      router.go(0);
    }
  });

  router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    const authorized = userStore.user.isAuthorized;
    if (!authorized && to.path !== '/auth') {
      next('auth');
    } else if (authorized && to.path === '/auth') {
      next('/');
    } else {
      next();
    }
  });
});
