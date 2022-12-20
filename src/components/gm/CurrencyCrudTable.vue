<template>
  <div class="q-pa-md">
    <CrudTable
      :columns="columns"
      :rows="currencies"
      :loading="loading"
      title="Currencies"
      @add="onEdit"
      @edit="onEdit"
      @delete="onDelete"
    />

    <DialogForm ref="dialog" @submit="onSubmit">
      <q-input
        outlined
        label="name"
        v-model="formData.name"
        :rules="[$rules.required()]"
      />

      <CharacterMultiSelect
        label="Characters"
        v-model="formData.characterIds"
      />
    </DialogForm>
  </div>
</template>

<script setup lang="ts">
// Vue
import { computed, ref, inject } from 'vue';

// Ours - stores
import { useCurrenciesStore } from 'stores/currencies';

// Ours - Components
import CrudTable from 'components/common/CrudTable.vue';
import DialogForm from 'components/common/DialogForm.vue';
import CharacterMultiSelect from 'components/common/CharacterMultiSelect.vue';

const columns = [
  {
    name: 'name',
    field: 'name',
    label: 'Name',
    required: true,
    align: 'left',
    sortable: true,
  },
  {
    name: 'characterNames',
    field: 'characterNames',
    label: 'Characters',
    required: true,
    format: (characterNames) => characterNames.join(', '),
    align: 'left',
    sortable: true,
  },
];

// The data backing the form
const formData = ref();

// The form dialog for editing/creating
const dialog = ref();

// The callback when you click edit or add
const onEdit = (currency) => {
  formData.value = { ...currency };
  dialog.value.show();
};

const currenciesStore = useCurrenciesStore();
currenciesStore.refresh();

const onDelete = (currency) => currenciesStore.delete(currency.id);
const onSubmit = () => currenciesStore.createOrUpdate(formData.value);

// Character names provided upstream
const characterNames = inject('characterNames');

// The rows we're displaying. We add in the character names.
const currencies = computed(() =>
  currenciesStore.items.map((currency) => ({
    characterNames: (currency.characterIds || []).map((id) =>
      characterNames.value.get(id)
    ),
    ...currency,
  }))
);

// Determines when the loading indicator will be shown in the table
const loading = computed(() => currenciesStore.loading);
</script>
