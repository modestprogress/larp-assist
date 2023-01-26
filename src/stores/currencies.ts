// Pinia data store
import { defineStore } from 'pinia';

// Ours
import { useFirestoreCollection } from 'stores/firestore';
import { Currency } from 'src/models';

// Firebase functions
import { getFunctions, httpsCallable } from 'firebase/functions';

export const useCurrenciesStore = defineStore('currencies', () => {
  const collection = useFirestoreCollection<Currency>('currencies', {
    map: (id, data) => ({
      name: data.name,
      characterIds: data.characterIds || [],
      id: id,
    }),
  });

  return {
    ...collection,
    getCharacterCurrenciesNames: (characterId: string) => {
      collection.items.value
        .filter((currency) => currency.characterIds.includes(characterId))
        .map((currency) => currency.name);
    },
    getCurrency: (currencyId: string) => {
      return collection.items.value.find(
        (currency) => currency.id === currencyId
      );
    },
    getCurrencyNames: () =>
      new Map<string, string>(
        collection.items.value.map(({ id, name }) => [id, name])
      ),

    transfer: (to: string, currencyId: string, amount: number) => {
      const transfer = httpsCallable(getFunctions(), 'transferCurrency');

      return transfer({ to, currencyId, amount });
    },
  };
});
