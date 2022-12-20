// Pinia data store
import { defineStore } from 'pinia';

// Ours
import { useFirestoreCollection } from 'stores/firestore';
import { Motd } from 'src/models';

export const useMotdsStore = defineStore('motds', () => {
  return {
    ...useFirestoreCollection<Motd>('motds', {
      map: (id, data) => ({
        content: data.content,
        characterId: data.characterId || '',
        id: id,
      }),
    }),
  };
});
