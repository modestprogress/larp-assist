import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

export function installFirebase() {
  const firebaseConfig = {
    apiKey: 'AIzaSyD4BDuubAFz6SXLhA8KLOoa4tYTfeWWf3s',
    authDomain: 'larp-assist.firebaseapp.com',
    projectId: 'larp-assist',
    storageBucket: 'larp-assist.appspot.com',
    messagingSenderId: '543453625683',
    appId: '1:543453625683:web:0475fe4d62dfaafb32f5a6',
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const firestore = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);
  const auth = getAuth(firebaseApp);
  const functions = getFunctions(firebaseApp);

  connectFirestoreEmulator(firestore, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
