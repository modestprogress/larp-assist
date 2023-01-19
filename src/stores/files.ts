// Pinia data store
import { defineStore } from 'pinia';

// Ours
import { useFirestoreCollection } from 'stores/firestore';
import { File } from 'src/models';

export const useFilesStore = defineStore('files', () => {
  return {
    ...useFirestoreCollection<File>('files', {
      map: (id, data) => ({
        id,
        code: data.code,
        bucket: data.bucket,
        filename: data.filename,
        url: data.url,
        common_name: data.common_name || '',
        common: data.common || false,
      }),
    }),
  };
});
