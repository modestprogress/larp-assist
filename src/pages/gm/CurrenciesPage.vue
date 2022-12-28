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
currenciesStore.refresh();
provide('currencyNames', computed(currenciesStore.getCurrencyNames));

const charactersStore = useCharactersStore();
charactersStore.refresh();
provide('characterNames', computed(charactersStore.getCharacterNames));
</script>
