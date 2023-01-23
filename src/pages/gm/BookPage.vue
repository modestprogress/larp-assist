<template>
  <div class="q-pa-md">
    <div class="text-h6">
      {{ book?.name }}
    </div>
    <SectionCrudTable class="q-mb-md" :bookId="book?.id" />
    <div class="text-h6">Preview</div>
    <BookReader :bookId="book?.id" />
  </div>
</template>

<script setup lang="ts">
// Vue
import { provide, computed } from 'vue';
import { useRoute } from 'vue-router';

// Ours - Components
import SectionCrudTable from 'components/gm/SectionCrudTable.vue';
import BookReader from 'components/common/BookReader.vue';

// Ours - Store
import { useBooksStore } from 'stores/books';
import { useTrapsStore } from 'stores/traps';

const route = useRoute();

const booksStore = useBooksStore();
await booksStore.refresh();
const book = booksStore.itemsById.get(route.params.id);

const trapsStore = useTrapsStore();
trapsStore.refresh();
// associate traps with this book
provide(
  'trapsById',
  computed(() => trapsStore.itemsById)
);
</script>
