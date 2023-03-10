// Vue
import { ref, Ref } from 'vue';

// Firebase/Firestore
import {
  getFirestore,
  getDocs,
  collection,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  DocumentData,
} from 'firebase/firestore';

// Ours
import { Model } from 'src/models';

export const useFirestoreCollection = <T extends Model>(
  collectionPath: string,
  settings: {
    refresh?: () => void;
    map: (id: string, data: DocumentData) => T;
    after?: (models: T[]) => void;
  }
) => {
  const db = getFirestore();
  const loading = ref(false);
  const items = ref<T[]>([]) as Ref<T[]>;
  const itemsById = ref<Map<string, T>>(new Map()) as Ref<Map<string, T>>;
  const refresh = () => {
    loading.value = true;

    const ref = collection(db, collectionPath);

    return getDocs(ref)
      .then((docs) => {
        if (settings.refresh) {
          settings.refresh();
        }

        items.value = [];
        itemsById.value = new Map<string, T>();
        docs.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();
          const item = settings.map(id, data);
          item.createdAtEpoch = data.createdAtEpoch;

          items.value.push(item);
          itemsById.value.set(id, item);
        });

        loading.value = false;
      })
      .then(() => {
        if (settings.after) {
          settings.after(items.value);
        }
      });
  };

  const update = (id: string, item: object) => {
    loading.value = true;
    item.updatedAtEpoch = Date.now();

    const docRef = doc(db, `${collectionPath}/${id}`);

    return updateDoc(docRef, item).then(refresh);
  };

  const create = (item: object) => {
    loading.value = true;
    item.createdAtEpoch = Date.now();

    return addDoc(collection(db, collectionPath), { ...item }).then(refresh);
  };

  return {
    items,
    loading,
    refresh,
    create,
    update,
    itemsById,
    createOrUpdate(item: T) {
      const { id, ...safe } = item;
      if (id) {
        update(id, safe);
      } else {
        create(safe);
      }
    },
    delete(id: string) {
      loading.value = true;

      const docRef = doc(db, `${collectionPath}/${id}`);

      return deleteDoc(docRef).then(refresh);
    },
  };
};
