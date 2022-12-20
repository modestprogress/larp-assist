<template>
  <q-dialog ref="dialog">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <BookReader :bookId="book.id" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Close" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <div class="col">
    <q-form @submit="onRead">
      <div class="row lookup-form">
        <q-input
          outlined
          v-model="bookCode"
          :rules="[validateCode]"
          label="Book Code"
          class="col"
        />
        <q-btn
          color="primary"
          label="Read"
          type="submit"
          class="col-auto q-ml-sm"
        />
      </div>
    </q-form>
    <div class="col text-body1" v-if="book">
      <div class="row">
        <div class="col-2">Title:</div>
        <div class="col">{{ book.name }}</div>
      </div>
      <div class="row">
        <div class="col-2">Location:</div>
        <div class="col">{{ book.location }}</div>
      </div>
      <div class="text-body1 q-mt-sm">
        {{ book.description }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.lookup-form {
  button {
    height: 56px;
  }
}
</style>

<script setup lang="ts">
// Vue
import { ref, computed } from 'vue';

// Ours - stores
import { useBooksStore } from 'stores/books';

// Ours - components
import BookReader from 'components/common/BookReader.vue';

const dialog = ref();

const bookCode = ref('');

const onCancelClick = () => {
  dialog.value.hide();
};

const booksStore = useBooksStore();
booksStore.refresh();

const book = computed(() =>
  booksStore.items.find((book) => book.code == bookCode.value)
);

const onRead = () => {
  if (book.value) {
    dialog.value.show();
  }
};

const validateCode = (val: string) => {
  return book.value || val.length == 0 || 'book not found';
};
</script>
