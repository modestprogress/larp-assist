<template>
  <div class="q-pa-md">
    <CrudTable
      title="Users"
      :columns="columns"
      :rows="users"
      :loading="loading"
      :hideAdd="true"
      :hideDelete="true"
      @edit="onEdit"
    />

    <DialogForm ref="dialog" @submit="onSubmit">
      <q-input
        outlined
        label="Name"
        v-model="formData.name"
        :autofocus="true"
        :rules="[$rules.required()]"
      />

      <q-checkbox v-model="formData.isActivated" label="Account activated" />
      <q-checkbox v-model="formData.gm" label="GM Super Powers" />

      <SelectField
        label="Character"
        :values_labels="characterNames"
        v-model="formData.characterId"
      />
    </DialogForm>
  </div>
</template>

<script setup lang="ts">
// Vue
import { computed, ref, inject } from 'vue';

// Ours - models
import { User } from 'src/models';

// Ours - stores
import { useUsersStore } from 'stores/users';

// Ours - Components
import CrudTable from 'components/common/CrudTable.vue';
import DialogForm from 'components/common/DialogForm.vue';
import SelectField from 'components/common/SelectField.vue';

const columns = [
  ...['name', 'character', 'email', 'activated'].map((name) => ({
    name: name,
    field: name,
    label: name[0].toUpperCase() + name.slice(1),
    required: true,
    align: 'left',
    sortable: true,
  })),

  {
    name: 'gm',
    field: 'gm',
    label: 'GM',
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
const onEdit = (user = {}) => {
  formData.value = {
    id: user.id,
    characterId: user.characterId || null,
    name: user.name || '',
    gm: user.gm || false,
    isActivated: user.isActivated || false,
  };
  dialog.value.show();
};

const usersStore = useUsersStore();
usersStore.refresh();

const onSubmit = () => usersStore.createOrUpdate(formData.value);

// Character names provided upstream
const characterNames = inject('characterNames');

// The rows we're displaying. We add in the character names.
const users = computed(() =>
  usersStore.items.map((user: User) => ({
    character: characterNames.value.get(user.characterId),
    activated: user.isActivated ? 'Yes' : 'No',
    ...user,
  }))
);

// Determines when the loading indicator will be shown in the table
const loading = computed(() => usersStore.loading);
</script>
