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
        toCharacterId: data.toCharacterId || '',
        fromCharacterId: data.fromCharacterId || '',
        currency: data.currency,
        notes: data.notes,
        createdAtEpoch: data.createdAtEpoch,
        createdByCharacterId: data.createdByCharacterId,
        id: id,
      }),
    }),
  };
});
