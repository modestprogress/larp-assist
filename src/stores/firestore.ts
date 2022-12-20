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
  const loading = ref(false);
  const items = ref<T[]>([]) as Ref<T[]>;
  const itemsById = ref<Map<string, T>>(new Map()) as Ref<Map<string, T>>;
  const refresh = () => {
    loading.value = true;

    const db = getFirestore();

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
          const item = settings.map(id, doc.data());

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

    const db = getFirestore();
    const docRef = doc(db, `${collectionPath}/${id}`);

    return updateDoc(docRef, item).then(refresh);
  };

  const create = (item: object) => {
    loading.value = true;

    const db = getFirestore();

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

      const db = getFirestore();
      const docRef = doc(db, `${collectionPath}/${id}`);

      return deleteDoc(docRef).then(refresh);
    },
  };
};
