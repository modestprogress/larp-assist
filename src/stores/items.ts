// Pinia data store
import { defineStore } from 'pinia';

// Ours
import { useFirestoreCollection } from 'stores/firestore';
import { Item } from 'src/models';

export const useItemsStore = defineStore('items', () => {
  const collection = useFirestoreCollection<Item>('items', {
    map: (id, data) => ({
      name: data.name,
      description: data.description,
      id: id,
    }),
  });

  return {
    ...collection,

    getItemNames: () =>
      new Map<string, string>(
        collection.items.value.map(({ id, name }) => [id, name])
      ),

    getItem(id: string) {
      return collection.items.value.find((item) => item.id === id);
    },
  };
});
