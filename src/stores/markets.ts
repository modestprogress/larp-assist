//  Vue
import { computed } from 'vue';

// Pinia data store
import { defineStore } from 'pinia';

// Firebase functions
import { getFunctions, httpsCallable } from 'firebase/functions';

// Ours
import { useFirestoreCollection } from 'stores/firestore';
import { Market, Listing, ListingType } from 'src/models';

export const useMarketsStore = defineStore('markets', () => {
  const collection = useFirestoreCollection<Market>('markets', {
    map: (id, data) => {
      const listings = data.listings || {};

      Object.keys(listings).forEach((key) => {
        const listing = listings[key];

        // Defaults for historical listings.
        listing.type = listing.type || ListingType.SPEND;
      });

      return {
        name: data.name,
        characterIds: data.characterIds || [],
        currencyId: data.currencyId,
        id: id,
        listings: listings,
      };
    },
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

    exchange: (
      marketId: string,
      itemId: string,
      characterId: string,
      spend: boolean
    ) => {
      const functions = getFunctions();
      const exchange = httpsCallable(functions, 'exchange');

      return exchange({ marketId, itemId, characterId, spend });
    },
  };
});
