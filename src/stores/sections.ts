// Vue
import { ref } from 'vue';

// Pinia data store
import { defineStore } from 'pinia';

// Ours
import { useFirestoreCollection } from 'stores/firestore';
import { Section, groupSectionsByChapter, SectionType } from 'src/models/books';
import { useTrapsStore } from 'stores/traps';

export const useSectionsStore = defineStore('sections', () => {
  const sectionsByBookId = ref(new Map<string, Array<Section>>());
  const chaptersByBookId = ref(new Map<string, string[][]>());

  const crud = useFirestoreCollection<Section>('sections', {
    refresh: () => {
      sectionsByBookId.value = new Map();
      chaptersByBookId.value = new Map();
    },
    map: (id, data) => ({
      sectionIdx: data.sectionIdx,
      chapterIdx: data.chapterIdx,
      bookId: data.bookId,
      trapId: data.trapId,
      text: data.text,
      type: data.type,
      id: id,
    }),
    after: (sections: Section[]) => {
      const trapsStore = useTrapsStore();
      // TODO dear god refactor this mess after the meeting
      trapsStore.refresh().then(() => {
        const byBookIdUnsorted = new Map();
        sections.forEach((section) => {
          const siblings = byBookIdUnsorted.get(section.bookId) || [];
          byBookIdUnsorted.set(section.bookId, siblings.concat(section));
        });

        sectionsByBookId.value = byBookIdUnsorted;

        byBookIdUnsorted.forEach((sections, bookId) => {
          chaptersByBookId.value.set(
            bookId,
            groupSectionsByChapter(sections).map((chapters) => {
              return chapters.map((section) => {
                if (section.type == SectionType.Trap) {
                  const trap = trapsStore.itemsById.get(section.trapId);
                  if (trap) {
                    return trap.content;
                  }

                  return '';
                }

                return section.text;
              });
            })
          );
        });
      });
    },
  });

  return {
    sectionsByBookId,
    chaptersByBookId,
    getSectionsByBookId: (bookId: string): Promise<Section[]> => {
      if (sectionsByBookId.value.has(bookId)) {
        const sections = sectionsByBookId.value.get(bookId) || [];
        return Promise.resolve(sections);
      }

      return crud.refresh().then(() => {
        return sectionsByBookId.value.get(bookId) || [];
      });
    },
    ...crud,
  };
});
