// Pinia data store
import { defineStore } from 'pinia';

// Firebase Functions
import { getFunctions, httpsCallable } from 'firebase/functions';

// Firebase Storage
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from 'firebase/storage';

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
    downloadFile: async (file: File) => {
      const storage = getStorage();
      const ref = storageRef(storage, file.path);
      const url = await getDownloadURL(ref);
      window.open(url, '_blank');
    },
  };
});
