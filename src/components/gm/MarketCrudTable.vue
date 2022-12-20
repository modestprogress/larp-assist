<template>
  <div class="q-pa-md">
    <CrudTable
      :columns="columns"
      :rows="markets"
      :loading="loading"
      title="Markets"
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

      <CurrencySelect label="Currency" v-model="formData.currencyId" />

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
import { useMarketsStore } from 'stores/markets';

// Ours - Components
import CrudTable from 'components/common/CrudTable.vue';
import DialogForm from 'components/common/DialogForm.vue';
import CharacterMultiSelect from 'components/common/CharacterMultiSelect.vue';
import CurrencySelect from 'components/common/CurrencySelect.vue';

const columns = [
  {
    name: 'name',
    field: 'name',
    label: 'Name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'currency',
    field: 'currencyName',
    label: 'Currency',
    align: 'left',
    sortable: true,
  },
  {
    name: 'characterNames',
    field: 'characterNames',
    label: 'Characters',
    format: (characterNames) => characterNames.join(', '),
    align: 'left',
    sortable: true,
  },
];

// The data backing the form
const formData = ref();

// The form dialog for editing/creating
const dialog = ref(null);

// The callback when you click edit or add
const onEdit = (market) => {
  formData.value = { ...market };
  dialog.value.show();
};

const marketsStore = useMarketsStore();
marketsStore.refresh();

const onDelete = (market) => marketsStore.delete(market.id);
const onSubmit = () => marketsStore.createOrUpdate(formData.value);

// Character and currency names provided upstream
const characterNames = inject('characterNames');
const currencyNames = inject('currencyNames');

// The rows we're displaying. We add in the character names.
const markets = computed(() =>
  marketsStore.items.map((market) => ({
    characterNames: (market.characterIds || []).map((id) =>
      characterNames.value.get(id)
    ),
    currencyName: currencyNames.value.get(market.currencyId),
    ...market,
  }))
);

// Determines when the loading indicator will be shown in the table
const loading = computed(() => marketsStore.loading);
</script>
