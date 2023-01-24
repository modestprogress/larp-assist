// Pinia data store
import { defineStore } from 'pinia';

// VueUse for lcoalStorage
import { useStorage } from '@vueuse/core';

// Firebase/Firestore
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Firebase functions
import { getFunctions, httpsCallable } from 'firebase/functions';

// Ours
import { useCharactersStore } from './characters';

export const getSignedOutUser = () => {
  return {
    isLoggedIn: false,
    id: '',
    gm: false,
    characterId: '',
    isActivated: false,
  };
};

export const useUserStore = defineStore('user', {
  state: () => ({
    user: useStorage('user', getSignedOutUser()),
  }),

  actions: {
    signOut(): void {
      this.user = getSignedOutUser();
    },

    async update(updates: { name?: string }): Promise<void> {
      const functions = getFunctions();
      const call = httpsCallable(functions, 'updateUser');
      await call(updates);
    },
    async login(userId: string) {
      const charactersStore = useCharactersStore();
      charactersStore.refresh;
      const db = getFirestore();
      this.user.id = userId;
      const userDoc = await getDoc(doc(db, `users/${userId}`));
      const userData = userDoc.data();
      if (userData) {
        this.user.gm = userData.gm;
        this.user.characterId = userData.characterId;
        this.user.isActivated = userData.isActivated;
      }

      this.user.isLoggedIn = true;
    },
  },
});
