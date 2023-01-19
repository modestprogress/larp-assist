<template>
  <div class="q-pa-md">
    <CrudTable
      :columns="columns"
      :rows="books"
      :loading="loading"
      title="Books"
      @add="onEdit"
      @edit="onEdit"
      @delete="onDelete"
    />

    <DialogForm ref="dialog" @submit="onSubmit">
      <div class="text-center q-mb-md text-h6" v-if="formData.id">
        <router-link class="text-primary" :to="`/gm/books/${formData.id}`">
          Edit chapters
        </router-link>
      </div>

      <q-input
        outlined
        label="Name"
        v-model="formData.name"
        :autofocus="true"
        :rules="[$rules.required()]"
        class="q-mb-md"
        hint="The name of the book to display"
      />
      <q-input
        outlined
        label="Lookup Code"
        v-model="formData.code"
        :rules="[$rules.required()]"
        class="q-mb-md"
        hint="The code players will lookup the book with"
      />
      <q-input
        outlined
        label="Author"
        v-model="formData.author"
        class="q-mb-md"
        hint="The in-game 'author' of the book to show players"
      />
      <q-input
        outlined
        label="Location"
        v-model="formData.location"
        :rules="[$rules.required()]"
        class="q-mb-md"
        hint="The 'location' of the book to show players"
      />
      <q-input
        outlined
        type="textarea"
        label="Description"
        v-model="formData.description"
        :rules="[$rules.required()]"
        class="q-mb-md"
        hint="Description of the book to show players"
      />
    </DialogForm>
  </div>
</template>

<script setup lang="ts">
// Vue
import { computed, ref } from 'vue';

// Ours - stores
import { useBooksStore } from 'stores/books';

// Ours - Components
import CrudTable from 'components/common/CrudTable.vue';
import DialogForm from 'components/common/DialogForm.vue';

const columns = [
  ...['name', 'author', 'code', 'description', 'location'].map((name) => ({
    name: name,
    field: name,
    label: name[0].toUpperCase() + name.slice(1),
    required: true,
    align: 'left',
    sortable: true,
  })),
];

// The data backing the form
const formData = ref();

// The form dialog for editing/creating
const dialog = ref();

// The callback when you click the add button
const onEdit = (book) => {
  formData.value = { ...book };
  dialog.value.show();
};

const booksStore = useBooksStore();
booksStore.refresh();

const onDelete = (book) => booksStore.delete(book.id);
const onSubmit = () => booksStore.createOrUpdate(formData.value);

// The rows we're displaying.
const books = computed(() => booksStore.items);

// Determines when the loading indicator will be shown in the table
const loading = computed(() => booksStore.loading);
</script>
