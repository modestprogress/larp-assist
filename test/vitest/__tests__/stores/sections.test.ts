// Vitest
import { assert, describe, it, beforeEach } from 'vitest'

// Pinia - Data stor
import { setActivePinia, createPinia } from 'pinia'

// Firestore
import { initializeApp } from 'firebase/app';

// Ours
import { useSectionsStore } from 'src/stores/sections'

describe('sections', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    };

    const firebaseApp = initializeApp(config);
  })

  it('refresh', async () => {
    const store = useSectionsStore()
    const sections = await store.refresh()
    assert.isDefined(sections)
  })
})
