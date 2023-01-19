<template>
  <div class="q-pa-md">
    <CrudTable
      :columns="columns"
      :rows="items"
      :loading="loading"
      title="Items"
      @add="onEdit"
      @edit="onEdit"
      @delete="onDelete"
    />

    <DialogForm ref="dialog" @submit="onSubmit">
      <q-input
        outlined
        label="Name"
        v-model="formData.name"
        :autofocus="true"
        :rules="[$rules.required()]"
      />
      <q-input
        outlined
        type="textarea"
        label="description"
        v-model="formData.description"
        :autofocus="true"
        :rules="[$rules.required()]"
      />
    </DialogForm>
  </div>
</template>

<script setup lang="ts">
// Vue
import { computed, ref } from 'vue';

// Ours - stores
import { useItemsStore } from 'stores/items';

// Ours - Components
import CrudTable from 'components/common/CrudTable.vue';
import DialogForm from 'components/common/DialogForm.vue';

const columns = ['name', 'description'].map((name) => ({
  name: name,
  field: name,
  label: name[0].toUpperCase() + name.slice(1),
  required: true,
  align: 'left',
  sortable: true,
}));

// The data backing the form
const formData = ref();

// The form dialog for editing/creating
const dialog = ref(null);

// The callback when you click edit or add
const onEdit = (item) => {
  formData.value = { ...item };
  dialog.value.show();
};

const itemsStore = useItemsStore();
itemsStore.refresh();

const onDelete = (item) => itemsStore.delete(item.id);
const onSubmit = () => itemsStore.createOrUpdate(formData.value);

// The rows we're displaying.
const items = computed(() => itemsStore.items);

// Determines when the loading indicator will be shown in the table
const loading = computed(() => itemsStore.loading);
</script>
