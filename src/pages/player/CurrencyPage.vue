<template>
  <CurrencyList
    :currencies="currencies"
    :markets="markets"
    :characterNames="characterNames"
    :currencyNames="currencyNames"
  />
</template>

<script setup lang="ts">
// Vue
import { computed, provide } from 'vue';

// Ours - Components
import CurrencyList from 'components/player/CurrencyList.vue';

// Ours - Store
import { useCurrenciesStore } from 'stores/currencies';
import { useMarketsStore } from 'stores/markets';
import { useCharactersStore } from 'stores/characters';

import { useUserStore } from 'stores/user';

const userStore = useUserStore();

const currenciesStore = useCurrenciesStore();
currenciesStore.refresh();

const currencies = computed(() =>
  currenciesStore.items.filter((currency) =>
    currency.characterIds.includes(userStore.user.characterId)
  )
);
const currencyNames = computed(() => currenciesStore.getCurrencyNames());

const marketsStore = useMarketsStore();
marketsStore.refresh();

const markets = computed(() =>
  marketsStore.items.filter((market) =>
    market.characterIds.includes(userStore.user.characterId)
  )
);

const charactersStore = useCharactersStore();
charactersStore.refresh();

const characterNames = computed(() => charactersStore.getCharacterNames());
</script>
