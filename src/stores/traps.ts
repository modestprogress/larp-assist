// Pinia data store
import { defineStore } from 'pinia';

// Ours
import { useFirestoreCollection } from 'stores/firestore';
import { Trap } from 'src/models/books';

export const useTrapsStore = defineStore('traps', () => {
  const collection = useFirestoreCollection<Trap>('traps', {
    map: (id, data) => ({
      name: data.name,
      content: data.content,
      id: id,
    }),
  });

  return {
    ...collection,
    getTrapNames: () =>
      new Map<string, string>(
        collection.items.value.map(({ id, name }) => [id, name])
      ),
  };
});
