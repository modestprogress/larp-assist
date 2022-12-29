<template>
  <div class="q-ma-xl">
    <div class="text-h5">{{ market?.name }}</div>
    <div class="text-h6">{{ currencyNames?.get(market?.currencyId) }}</div>
    <ListingCrudTable :marketId="marketId" />
    <ItemCrudTable />
  </div>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// Ours - Stores
import { useMarketsStore } from 'stores/markets';
import { useCurrenciesStore } from 'stores/currencies';

// Ours - Components
import ListingCrudTable from 'components/gm/ListingCrudTable.vue';
import ItemCrudTable from 'components/gm/ItemCrudTable.vue';

const marketsStore = useMarketsStore();
marketsStore.refresh();
const route = useRoute();

const marketId = route.params.id;
const market = computed(() => marketsStore.getMarket(marketId));

const currenciesStore = useCurrenciesStore();
currenciesStore.refresh();
const currencyNames = computed(() => currenciesStore.getCurrencyNames());
</script>
