<template>
  <MarketCrudTable />
</template>

<script setup lang="ts">
// Vue
import { provide, computed } from 'vue';

// Ours - Components
import MarketCrudTable from 'components/gm/MarketCrudTable.vue';

// Ours - Store
import { useCharactersStore } from 'stores/characters';
import { useCurrenciesStore } from 'stores/currencies';

const charactersStore = useCharactersStore();
provide(
  'characterNames',
  computed(() => charactersStore.getCharacterNames())
);

const currenciesStore = useCurrenciesStore();
provide(
  'currencyNames',
  computed(() => currenciesStore.getCurrencyNames())
);

await Promise.all([currenciesStore.refresh(), charactersStore.refresh()]);
</script>
