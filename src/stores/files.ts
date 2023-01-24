// Pinia data store
import { defineStore } from 'pinia';

// Firestore Functions
import { getFunctions, httpsCallable } from 'firebase/functions';

// Ours
import { useFirestoreCollection } from 'stores/firestore';
import { File } from 'src/models';

export const useFilesStore = defineStore('files', () => {
  return {
    ...useFirestoreCollection<File>('files', {
      map: (id, data) => ({
        id,
        url: data.url,
        code: data.code,
        bucket: data.bucket,
        path: data.path,
        common_name: data.common_name || '',
        common: data.common || false,
      }),
    }),
    sync: async () => {
      const functions = getFunctions();
      const call = httpsCallable(functions, 'syncFiles');
      await call();
    },
  };
});
