// Pinia data store
import { defineStore } from 'pinia';

// VueUse for lcoalStorage
import { useStorage } from '@vueuse/core';

// Firebase/Firestore
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Ours
import { useCharactersStore } from './characters';

function getSignedOutUser() {
  return {
    isAuthorized: false,
    id: '',
    gm: false,
    characterId: '',
  };
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: useStorage('user', getSignedOutUser()),
  }),

  actions: {
    signOut(): void {
      this.user = getSignedOutUser();
    },

    login(userId: string): Promise<void> {
      const charactersStore = useCharactersStore();
      charactersStore.refresh;
      const db = getFirestore();
      this.user.id = userId;
      return Promise.all([
        getDoc(doc(db, `users/${userId}`)).then((doc) => {
          const userData = doc.data();
          if (userData) {
            this.user.gm = userData.gm;
            this.user.characterId = userData.characterId;
          }
        }),
      ]).then(() => {
        this.user.isAuthorized = true;
      });
    },

    register(characterId: string, userId: string): Promise<void> {
      this.user.id = userId;
      this.user.characterId = characterId;
      this.user.isAuthorized = true;

      const db = getFirestore();

      return setDoc(doc(db, `users/${userId}`), { characterId: characterId });
    },
  },
});
