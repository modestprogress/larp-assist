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
      hint="The item value, offered or spent"
    />
    <q-input
      outlined
      label="Quantity"
      v-model="formData.amount"
      class="q-mb-md"
      hint="Number amount to players in this market"
      :rules="[$rules.required()]"
    />
    <q-input
      outlined
      label="Value"
      v-model="formData.value"
      class="q-mb-md"
      hint="Value in units of the market's currency"
      :rules="[$rules.required()]"
    />
    <div class="q-gutter-sm">
      <q-radio
        v-model="formData.type"
        :val="ListingType.SPEND"
        label="Player Spends"
      />
      <q-radio
        v-model="formData.type"
        :val="ListingType.OFFER"
        label="Player Offers"
      />
    </div>
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

// Ours - models
import { Listing, ListingType } from 'src/models';

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
    name: 'amount',
    field: 'amount',
    label: 'Quantity',
    align: 'left',
    sortable: true,
    required: true,
  },
  {
    name: 'value',
    field: 'value',
    label: 'Value',
    align: 'left',
    sortable: true,
    required: true,
  },
  {
    name: 'type',
    field: 'type',
    label: 'Type',
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
const onEdit = (listing: Listing) => {
  formData.value = { ...(listing || {}) };

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
