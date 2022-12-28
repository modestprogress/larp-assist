<template>hi</template>

<style lang="scss"></style>

<script setup lang="ts">
import { ref, provide, computed } from 'vue';

// Ours - Components
import MotdCrudTable from 'components/gm/MotdCrudTable.vue';
import CurrencyCrudTable from 'components/gm/CurrencyCrudTable.vue';
import DivinationCrudTable from 'components/gm/DivinationCrudTable.vue';
import MarketCrudTable from 'components/gm/MarketCrudTable.vue';
import BookCrudTable from 'components/gm/BookCrudTable.vue';
import TrapCrudTable from 'components/gm/TrapCrudTable.vue';
import CharacterCrudTable from 'components/gm/CharacterCrudTable.vue';

// Ours - Store
import { useCharactersStore } from 'stores/characters';
import { useCurrenciesStore } from 'stores/currencies';
import { useTrapsStore } from 'stores/traps';

const tab = ref('book');

const charactersStore = useCharactersStore();
charactersStore.refresh();
provide('characterNames', computed(charactersStore.getCharacterNames));

const currenciesStore = useCurrenciesStore();
currenciesStore.refresh();
provide('currencyNames', computed(currenciesStore.getCurrencyNames));

const trapsStore = useTrapsStore();
trapsStore.refresh();
provide(
  'trapsById',
  computed(() => trapsStore.itemsById)
);
</script>
