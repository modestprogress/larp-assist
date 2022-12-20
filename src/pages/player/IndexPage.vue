<template>a</template>

<style lang="scss">
.heading {
  text-shadow: 1px 1px 1px $dark;
}
</style>

<script setup lang="ts">
// Vue
import { computed, provide } from 'vue';

// Ours - Stores
import { useCharactersStore } from 'stores/characters';
import { useMotdsStore } from 'stores/motds';
import { useDivinationsStore } from 'stores/divinations';
import { useCurrenciesStore } from 'stores/currencies';
import { useMarketsStore } from 'stores/markets';

// Ours - Components
import TitledCard from 'components/common/TitledCard.vue';
import MotdsList from 'components/player/MotdsList.vue';
import DivinationsList from 'components/player/DivinationsList.vue';
import BookLookup from 'components/common/BookLookup.vue';
import CurrencyList from 'components/player/CurrencyList.vue';
import { useUserStore } from 'src/stores/user';

const motdsStore = useMotdsStore();
motdsStore.refresh();

const divinationsStore = useDivinationsStore();
divinationsStore.refresh();

const charactersStore = useCharactersStore();
charactersStore.refresh();
provide('characterNames', computed(charactersStore.getCharacterNames));
const name = computed(
  () => charactersStore.getCharacter(userStore.user.characterId)?.name
);

const userStore = useUserStore();

const currenciesStore = useCurrenciesStore();
currenciesStore.refresh();
const currencies = computed(() =>
  currenciesStore.items.filter((currency) =>
    currency.characterIds.includes(userStore.user.characterId)
  )
);
provide('currencies', currencies);
provide(
  'currencyNames',
  computed(() => {
    const currencyNames = new Map();
    currencies.value.forEach((currency) =>
      currencyNames.set(currency.id, currency.name)
    );
    return currencyNames;
  })
);

const marketsStore = useMarketsStore();
marketsStore.refresh();
provide(
  'markets',
  computed(() => marketsStore.getCharacterMarkets(userStore.user.characterId))
);

const motds = computed(() =>
  motdsStore.items.filter(
    (motd) =>
      !motd.characterId || motd.characterId == userStore.user.characterId
  )
);

const divinations = computed(() =>
  divinationsStore.getCharacterDivinations(userStore.user.characterId)
);
</script>
