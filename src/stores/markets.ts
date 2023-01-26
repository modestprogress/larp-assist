//  Vue
import { computed } from 'vue';

// Pinia data store
import { defineStore } from 'pinia';

// Firebase functions
import { getFunctions, httpsCallable } from 'firebase/functions';

// Ours
import { useFirestoreCollection } from 'stores/firestore';
import { Market, Listing } from 'src/models';

export const useMarketsStore = defineStore('markets', () => {
  const collection = useFirestoreCollection<Market>('markets', {
    map: (id, data) => ({
      name: data.name,
      characterIds: data.characterIds || [],
      currencyId: data.currencyId,
      listings: data.listings || {},
      id: id,
    }),
  });

  return {
    ...collection,
    markets: computed(() => collection.items.value),

    createOrUpdateListing: (marketId: string, listing: Listing) => {
      const market = collection.items.value.find(({ id }) => id == marketId);
      if (!market.listings) {
        market.listings = {};
      }

      market.listings[listing.itemId] = listing;

      collection.createOrUpdate({ id: marketId, listings: market.listings });
    },

    deleteListing: (marketId: string, itemId: string) => {
      const market = collection.items.value.find(({ id }) => id == marketId);
      if (!market.listings) {
        market.listings = {};
      }

      delete market.listings[itemId];

      collection.createOrUpdate({ id: marketId, listings: market.listings });
    },

    getCharacterMarkets: (characterId: string) => {
      return collection.items.value.filter((market) =>
        market.characterIds.includes(characterId)
      );
    },

    getMarket: (marketId: string) => {
      return collection.items.value.find(({ id }) => id == marketId);
    },

    getMarketNames: () =>
      new Map<string, string>(
        collection.items.value.map(({ id, name }) => [id, name])
      ),

    purchase: (marketId: string, itemId: string, characterId: string) => {
      const functions = getFunctions();
      const purchase = httpsCallable(functions, 'purchase');

      return purchase({ marketId, itemId, characterId });
    },
  };
});
