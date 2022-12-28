<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
      fill="#212121"
    />
  </svg>
</template>

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
