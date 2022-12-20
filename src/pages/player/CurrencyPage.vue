<template>
  <SimpleCard>
    <CurrencyList />
  </SimpleCard>
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
import SimpleCard from 'components/common/SimpleCard.vue';

const userStore = useUserStore();

const currenciesStore = useCurrenciesStore();
currenciesStore.refresh();
const currencies = computed(() =>
  currenciesStore.items.filter((currency) =>
    currency.characterIds.includes(userStore.user.characterId)
  )
);
provide('currencies', currencies);
provide('currencyNames', computed(currenciesStore.getCurrencyNames));

const marketsStore = useMarketsStore();
marketsStore.refresh();
provide(
  'markets',
  computed(() => marketsStore.items)
);

const characterStore = useCharactersStore();
provide('characterNames', computed(characterStore.getCharacterNames));
</script>
