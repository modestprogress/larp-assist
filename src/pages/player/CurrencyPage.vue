<template>
  <CurrencyList
    :character="character"
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
const currencyNames = computed(() => {
  const currencyNames = new Map();
  currencies.value.forEach((currency) => {
    currencyNames.set(currency.id, currency.name);
  });

  return currencyNames;
});

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
const character = computed(() =>
  charactersStore.items.find(
    (character) => character.id === userStore.user.characterId
  )
);
</script>
