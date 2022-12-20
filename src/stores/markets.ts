// Pinia data store
import { defineStore } from 'pinia';

// Ours
import { useFirestoreCollection } from 'stores/firestore';
import { Market } from 'src/models';

export const useMarketsStore = defineStore('markets', () => {
  const collection = useFirestoreCollection<Market>('markets', {
    map: (id, data) => ({
      name: data.name,
      characterIds: data.characterIds || [],
      currencyId: data.currencyId,
      id: id,
    }),
  });

  return {
    ...collection,
    getCharacterMarkets: (characterId: string) => {
      return collection.items.value.filter((market) =>
        market.characterIds.includes(characterId)
      );
    },
    getMarketNames: () =>
      new Map<string, string>(
        collection.items.value.map(({ id, name }) => [id, name])
      ),
  };
});
