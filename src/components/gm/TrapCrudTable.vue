<template>
  <div class="q-pa-md">
    <CrudTable
      :columns="columns"
      :rows="traps"
      :loading="loading"
      title="Traps"
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
        label="Content"
        v-model="formData.content"
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
import { useTrapsStore } from 'stores/traps';

// Ours - Components
import CrudTable from 'components/common/CrudTable.vue';
import DialogForm from 'components/common/DialogForm.vue';

const columns = ['name', 'content'].map((name) => ({
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
const onEdit = (trap) => {
  formData.value = { ...trap };
  dialog.value.show();
};

const trapsStore = useTrapsStore();
trapsStore.refresh();

const onDelete = (trap) => trapsStore.delete(trap.id);
const onSubmit = () => trapsStore.createOrUpdate(formData.value);

// The rows we're displaying.
const traps = computed(() => trapsStore.items);

// Determines when the loading indicator will be shown in the table
const loading = computed(() => trapsStore.loading);
</script>
