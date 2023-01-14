// Pinia data store
import { defineStore } from 'pinia';

// Ours
import { useFirestoreCollection } from 'stores/firestore';
import { User } from 'src/models';

export const useUsersStore = defineStore('users', () => {
  return {
    ...useFirestoreCollection<User>('users', {
      map: (id, data) => ({
        id: id,
        gm: data.gm,
        name: data.name,
        characterId: data.characterId,
        email: data.email,
        isActivated: data.isActivated,
      }),
    }),
  };
});
