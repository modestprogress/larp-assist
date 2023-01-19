<template>
  <CurrencyCrudTable />
</template>

<script setup lang="ts">
// Vue
import { provide, computed } from 'vue';

// Ours - Stores
import { useCurrenciesStore } from 'stores/currencies';
import { useCharactersStore } from 'stores/characters';

// Ours - Components
import CurrencyCrudTable from 'components/gm/CurrencyCrudTable.vue';

const currenciesStore = useCurrenciesStore();
provide(
  'currencyNames',
  computed(() => currenciesStore.getCurrencyNames())
);

const charactersStore = useCharactersStore();
provide(
  'characterNames',
  computed(() => charactersStore.getCharacterNames())
);

await Promise.all([currenciesStore.refresh(), charactersStore.refresh()]);
</script>
