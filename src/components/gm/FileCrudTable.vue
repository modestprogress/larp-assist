<template>
  <div class="q-pa-md">
    <CrudTable
      title="Files"
      :columns="columns"
      :rows="files"
      :loading="loading"
      :hideAdd="true"
      :hideDelete="true"
      @edit="onEdit"
    />

    <DialogForm ref="dialog" @submit="onSubmit">
      <q-input
        outlined
        label="Code"
        v-model="formData.code"
        :rules="[$rules.required()]"
        class="q-mb-md"
        hint="The code used to lookup the file"
      />

      <q-checkbox v-model="formData.common" label="Common" />

      <q-input
        v-model="formData.common_name"
        hint="The quick-link name of the file (common only)"
        label="Common Name"
        :disable="!formData.common"
        :rules="[formData.common || $rules.required()]"
      />
    </DialogForm>
  </div>
</template>

<script setup lang="ts">
// Vue
import { ref, computed } from 'vue';

// Ours - stores
import { useFilesStore } from 'stores/files';

// Ours - Components
import CrudTable from 'components/common/CrudTable.vue';
import DialogForm from 'components/common/DialogForm.vue';

const columns = [
  ...['path', 'code', 'common_name'].map((name) => ({
    name: name,
    field: name,
    label: (name[0].toUpperCase() + name.slice(1)).replace('_', ' '),
    required: true,
    align: 'left',
    sortable: true,
  })),

  {
    name: 'common',
    field: 'common',
    label: 'Common',
    required: true,
    align: 'left',
    sortable: true,
    format: (value) => (value ? 'Yes' : 'No'),
  },
];

// The data backing the form
const formData = ref();

// The form dialog for editing/creating
const dialog = ref(null);

// The callback when you click edit or add
const onEdit = (file: any = {}) => {
  formData.value = {
    id: file.id,
    url: file.url,
    code: file.code,
    path: file.path,
    common_name: file.common_name || '',
    common: file.common || false,
  };
  dialog.value.show();
};

const filesStore = useFilesStore();
filesStore.refresh();

const files = computed(() => filesStore.items);

const onSubmit = () => filesStore.update(formData.value.id, formData.value);

// Determines when the loading indicator will be shown in the table
const loading = computed(() => filesStore.loading);
</script>
