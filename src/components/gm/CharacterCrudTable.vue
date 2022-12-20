<template>
  <div class="q-pa-md">
    <CrudTable
      :columns="columns"
      :rows="characters"
      :loading="loading"
      title="Characters"
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
        label="Registration Code"
        v-model="formData.code"
        :autofocus="true"
        :rules="[$rules.required()]"
      />
      <q-input
        outlined
        label="Notes"
        type="textarea"
        v-model="formData.notes"
      />
    </DialogForm>
  </div>
</template>

<script setup lang="ts">
// Vue
import { computed, ref } from 'vue';

// Ours - stores
import { useCharactersStore } from 'stores/characters';

// Ours - Components
import CrudTable from 'components/common/CrudTable.vue';
import DialogForm from 'components/common/DialogForm.vue';
import { Character } from 'src/models';

const columns = ['name', 'notes', 'code'].map((name) => ({
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
const dialog = ref();

// The callback when you click edit or add
const onEdit = (character = {}) => {
  formData.value = {
    id: character.id,
    code:
      character.code || Math.random().toString(36).slice(2, 7).toLowerCase(),
    name: character.name || '',
    notes: character.notes || '',
  };
  dialog.value.show();
};

const charactersStore = useCharactersStore();
charactersStore.refresh();

const onDelete = (character: Character) => charactersStore.delete(character.id);
const onSubmit = () => charactersStore.createOrUpdate(formData.value);

const characters = computed(() => charactersStore.items);

// Determines when the loading indicator will be shown in the table
const loading = computed(() => charactersStore.loading);
</script>
