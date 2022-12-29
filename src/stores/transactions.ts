// Pinia data store
import { defineStore } from 'pinia';

// Ours
import { useFirestoreCollection } from 'stores/firestore';
import { Transaction } from 'src/models';

export const useTransactionsStore = defineStore('transactions', () => {
  return {
    ...useFirestoreCollection<Transaction>('transactions', {
      map: (id, data) => ({
        amount: data.amount,
        characterId: data.characterId,
        currencyId: data.currencyId,
        notes: data.notes,
        id: id,
      }),
    }),
  };
});
