// Pinia data store
import { defineStore } from 'pinia'

// Ours
import { useFirestoreCollection } from 'stores/firestore'
import { Trap } from 'src/models'

export const useTrapsStore = defineStore('traps', () => {
  return {
    ...useFirestoreCollection<Trap>('traps', {
      map: (id, data) => ({
        name: data.name,
        content: data.content,
        id: id,
      }),
    }),
  }
})
