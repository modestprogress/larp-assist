<template>
  <TransctionCrudTable />
</template>

<script setup lang="ts">
// Vue
import { provide, computed } from 'vue';

// Ours - Components
import TransctionCrudTable from 'components/gm/TransactionCrudTable.vue';

// Ours - Store
import { useCharactersStore } from 'stores/characters';
import { useCurrenciesStore } from 'stores/currencies';

const charactersStore = useCharactersStore();
charactersStore.refresh();
provide('characterNames', computed(charactersStore.getCharacterNames));

const currenciesStore = useCurrenciesStore();
currenciesStore.refresh();
provide('currencyNames', computed(currenciesStore.getCurrencyNames));
</script>
