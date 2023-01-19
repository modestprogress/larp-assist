<template>
  <CrudTable
    :columns="columns"
    :rows="listings"
    :loading="loading"
    title="Market Listings"
    @add="onEdit"
    @edit="onEdit"
    @delete="onDelete"
  />

  <DialogForm ref="dialog" @submit="onSubmit" class="column">
    <div class="text-center q-mb-md text-h6" v-if="formData.id">
      <router-link :to="`/gm/markets/${formData.id}`">
        Edit item quantities
      </router-link>
    </div>
    <SelectField
      label="Item"
      class="q-mb-md"
      v-model="formData.itemId"
      :values_labels="itemNames"
      hint="The item available to purchase"
    />
    <q-input
      outlined
      label="Available"
      v-model="formData.available"
      class="q-mb-md"
      hint="Number available to players in this market"
      :rules="[$rules.required()]"
    />
    <q-input
      outlined
      label="Cost"
      v-model="formData.cost"
      class="q-mb-md"
      hint="Cost in units of the market's currency"
      :rules="[$rules.required()]"
    />
  </DialogForm>
</template>

<script setup lang="ts">
// Vue
import { computed, ref, provide } from 'vue';

// Ours - stores
import { useMarketsStore } from 'stores/markets';
import { useItemsStore } from 'stores/items';

// Ours - Components
import CrudTable from 'components/common/CrudTable.vue';
import DialogForm from 'components/common/DialogForm.vue';
import SelectField from 'components/common/SelectField.vue';

const columns = [
  {
    name: 'item',
    field: 'itemId',
    label: 'Item',
    format: (itemId) => itemsStore.getItem(itemId)?.name,
    align: 'left',
    sortable: true,
    required: true,
  },
  {
    name: 'available',
    field: 'available',
    label: 'Available',
    align: 'left',
    sortable: true,
    required: true,
  },
  {
    name: 'cost',
    field: 'cost',
    label: 'Cost',
    align: 'left',
    sortable: true,
    required: true,
  },
];

const props = defineProps({
  marketId: String,
});

// The data backing the form
const formData = ref();

// The form dialog for editing/creating
const dialog = ref(null);

// The callback when you click edit or add
const onEdit = (item = {}) => {
  formData.value = { ...item };
  dialog.value.show();
};

const itemsStore = useItemsStore();
itemsStore.refresh();

const marketsStore = useMarketsStore();
marketsStore.refresh();

const listings = computed(() => {
  const market = marketsStore.getMarket(props.marketId);
  if (!market) {
    return [];
  }

  return Object.values(market.listings);
});

const itemNames = computed(() => {
  return itemsStore.getItemNames();
});

provide(
  'items',
  computed(() => itemsStore.items)
);

const onDelete = (listing) =>
  marketsStore.deleteListing(props.marketId, listing.itemId);
const onSubmit = () =>
  marketsStore.createOrUpdateListing(props.marketId, formData.value);

// Determines when the loading indicator will be shown in the table
const loading = computed(() => itemsStore.loading || marketsStore.loading);
</script>
