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

    <DialogForm ref="dialog" @submit="onSubmit" class="column">
      <div class="text-center q-mb-md text-h6" v-if="formData.id">
        <router-link class="text-primary" :to="`/gm/markets/${formData.id}`">
          Edit item quantities
        </router-link>
      </div>
      <q-input
        outlined
        label="Name"
        v-model="formData.name"
        class="q-mb-md"
        :rules="[$rules.required()]"
        hint="Name to show for the currency"
      />

      <SelectField
        label="Currency"
        class="q-mb-md"
        v-model="formData.currencyId"
        :values_labels="currencyNames"
        hint="The currency the market uses"
      />

      <SelectField
        multiple
        label="Characters"
        v-model="formData.characterIds"
        :values_labels="characterNames"
        hint="Who can see and shop at the markets"
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
import SelectField from 'components/common/SelectField.vue';

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
const onEdit = (market = {}) => {
  formData.value = market;
  dialog.value.show();
};

const marketsStore = useMarketsStore();
marketsStore.refresh();

const onDelete = (market) => marketsStore.delete(market.id);
const onSubmit = () => marketsStore.createOrUpdate(formData.value);

// Character and currency names provided upstream
const characterNames = inject<Map<string, string>>('characterNames');
const currencyNames = inject<Map<string, string>>('currencyNames');

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
