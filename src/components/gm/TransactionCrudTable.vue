<template>
  <div class="q-pa-md">
    <CrudTable
      :columns="columns"
      :rows="transactions"
      :loading="loading"
      title="Transactions"
      @add="onEdit"
      @edit="onEdit"
      @delete="onDelete"
    />

    <DialogForm ref="dialog" @submit="onSubmit">
      <SelectField
        label="Character"
        v-model="formData.characterId"
        class="q-mb-md"
        hint="Character's balance to be effected"
        :values_labels="characterNames"
      />
      <SelectField
        label="Currency"
        v-model="formData.currencyId"
        class="q-mb-md"
        hint="Currency of transaction"
        :rules="[$rules.required()]"
        :values_labels="currencyNames"
      />
      <q-input
        outlined
        type="number"
        label="Amount"
        v-model="formData.amount"
        class="q-mb-md"
        hint="Amount of currency transaction is for"
        :rules="[$rules.required()]"
      />
      <q-input
        outlined
        type="textarea"
        label="Note"
        v-model="formData.notes"
        hint="Notes to show user for this transaction"
      />
    </DialogForm>
  </div>
</template>

<script setup lang="ts">
// Vue
import { computed, ref, inject } from 'vue';

// Ours - stores
import { useTransactionsStore } from 'stores/transactions';

// Ours - Components
import CrudTable from 'components/common/CrudTable.vue';
import DialogForm from 'components/common/DialogForm.vue';
import SelectField from 'components/common/SelectField.vue';

const columns = [
  {
    name: 'characterName',
    field: 'characterName',
    label: 'Character',
    align: 'left',
    sortable: true,
  },
  {
    name: 'currencyName',
    field: 'currencyName',
    label: 'Currency',
    align: 'left',
    sortable: true,
  },
  ...['amount', 'notes'].map((name) => ({
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
const dialog = ref(null);

// The callback when you click edit or add
const onEdit = (transaction = {}) => {
  formData.value = {
    id: transaction.id,
    amount: transaction.amount || 0,
    notes: transaction.notes || '',
    currencyId: transaction.currencyId || null,
    characterId: transaction.characterId || null,
  };
  dialog.value.show();
};

const transactionsStore = useTransactionsStore();
transactionsStore.refresh();

const onDelete = (transaction) => transactionsStore.delete(transaction.id);
const onSubmit = () => transactionsStore.createOrUpdate(formData.value);

// Character names provided upstream
const characterNames = inject<Map<string, string>>('characterNames');
const currencyNames = inject<Map<string, string>>('currencyNames');

// The rows we're displaying. We add in the character names.
const transactions = computed(() =>
  transactionsStore.items.map((transaction) => ({
    characterName: characterNames.value.get(transaction.characterId),
    currencyName: currencyNames.value.get(transaction.currencyId),
    ...transaction,
  }))
);

// Determines when the loading indicator will be shown in the table
const loading = computed(() => transactionsStore.loading);
</script>
