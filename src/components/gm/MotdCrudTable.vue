<template>
  <div class="q-pa-md">
    <CrudTable
      :columns="columns"
      :rows="motds"
      :loading="loading"
      title="MOTDs"
      @add="onEdit"
      @edit="onEdit"
      @delete="onDelete"
    />

    <DialogForm ref="dialog" @submit="onSubmit">
      <q-input
        outlined
        type="textarea"
        label="Content"
        v-model="formData.content"
        :autofocus="true"
        :rules="[$rules.required()]"
      />
      <CharacterSelect label="Character" v-model="formData.characterId" />
    </DialogForm>
  </div>
</template>

<script setup lang="ts">
// Vue
import { computed, ref, inject } from 'vue';

// Ours - stores
import { useMotdsStore } from 'stores/motds';

// Ours - Components
import CrudTable from 'components/common/CrudTable.vue';
import DialogForm from 'components/common/DialogForm.vue';
import CharacterSelect from 'components/common/CharacterSelect.vue';

const columns = [
  {
    name: 'content',
    field: 'content',
    label: 'Content',
    required: true,
    align: 'left',
    sortable: true,
  },
  {
    name: 'characterName',
    required: true,
    label: 'Character',
    align: 'left',
    field: 'characterName',
    sortable: true,
  },
];

// The data backing the form
const formData = ref();

// The form dialog for editing/creating
const dialog = ref(null);

// The callback when you click edit or add
const onEdit = (motd = {}) => {
  formData.value = {
    id: motd.id,
    characterId: motd.characterId || '',
    content: motd.content,
  };
  dialog.value.show();
};

const motdsStore = useMotdsStore();
motdsStore.refresh();

const onDelete = (motd) => motdsStore.delete(motd.id);
const onSubmit = () => motdsStore.createOrUpdate(formData.value);

// Character names provided upstream
const characterNames = inject('characterNames');

// The rows we're displaying. We add in the character names.
const motds = computed(() =>
  motdsStore.items.map((motd) => ({
    characterName: characterNames.value.get(motd.characterId),
    ...motd,
  }))
);

// Determines when the loading indicator will be shown in the table
const loading = computed(() => motdsStore.loading);
</script>
