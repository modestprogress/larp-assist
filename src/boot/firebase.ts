import { initializeApp } from 'firebase/app';

import {
  getAuth,
  onAuthStateChanged,
  connectAuthEmulator,
} from 'firebase/auth';

import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

import { getStorage, connectStorageEmulator } from 'firebase/storage';

import { boot } from 'quasar/wrappers';

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
  const firestore = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);
  const auth = getAuth(firebaseApp);
  const functions = getFunctions(firebaseApp);

  if (process.env.DEV) {
    connectFirestoreEmulator(firestore, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFunctionsEmulator(functions, 'localhost', 5001);
  }

  app.config.globalProperties.$auth = auth;
  app.config.globalProperties.$storage = storage;
  app.config.globalProperties.$db = getFirestore(firebaseApp);

  onAuthStateChanged(auth, (user) => {
    const userStore = useUserStore();

    if (!user && userStore.user.isLoggedIn) {
      userStore.signOut();
      router.go(0);
    }
  });
});
