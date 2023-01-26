<style scoped lang="scss">
.character__balance {
  text-align: center;
}

.market {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5rem;
  margin: 0.5rem;
  gap: 1.5rem;
}

.market__item {
  border-style: solid;
  border-width: 1px;
  border-radius: 5px;
  border-color: $secondary;
  padding: 10px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.market__item__name {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.market__item__description {
  flex-grow: 1;
  margin-bottom: 0.6rem;
  margin-top: 0.5rem;
}

.market__item__cost,
.market__item__available {
  margin-bottom: 0.1rem;
}

.market__name {
  text-align: center;
  color: $secondary;
}
</style>

<template>
  <div class="container">
    <div class="market__name text-h5">{{ marketName }}</div>
    <div class="character__balance text-h6">
      Balance: {{ balance }} {{ currencyName }}
    </div>
    <div class="market">
      <div
        class="market__item"
        v-for="listing in listings"
        :key="listing.item.id"
      >
        <div class="market__item__name">{{ listing.item.name }}</div>
        <div class="market__item__cost">Cost {{ listing.cost }}</div>
        <div class="market__item__available">
          Available {{ listing.available }}
        </div>
        <div class="market__item__description">
          {{ listing.item.description }}
        </div>
        <div class="market__item__actions">
          <q-btn
            class="market__item__actions__button"
            color="accent"
            @click="purchase(listing)"
            >Purchase</q-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';

// Ours - Stores
import { useItemsStore } from 'src/stores/items';
import { useMarketsStore } from 'src/stores/markets';
import { useUserStore } from 'src/stores/user';
import { useCharactersStore } from 'src/stores/characters';
import { useCurrenciesStore } from 'src/stores/currencies';

// Ours - types
import { Item, Listing } from 'src/models';

const route = useRoute();
const $q = useQuasar();

const { user } = useUserStore();

const itemsStore = useItemsStore();
itemsStore.refresh();

const marketsStore = useMarketsStore();
marketsStore.refresh();
const marketId: string = route?.params.id || '';
const market = computed(() => marketsStore.itemsById.get(marketId));
const marketName = computed(() => market.value?.name || '');

const charactersStore = useCharactersStore();
charactersStore.refresh();

const balance = computed(() => {
  if (!market.value) return 0;

  const character = charactersStore.getCharacter(user.characterId);

  return character.balances[market.value.currencyId] || 0;
});

const currenciesStore = useCurrenciesStore();
currenciesStore.refresh();

const currencyName = computed(() => {
  if (!market.value) return '';

  return currenciesStore.getCurrency(market.value.currencyId)?.name || '';
});

const listings = computed(() => {
  if (!market.value) return [];

  return Object.values(market.value.listings).map((listing: Listing) => {
    const item = itemsStore.getItem(listing.itemId);
    return { ...listing, item };
  });
});

const purchase = async (listing: Listing) => {
  if (!confirm(`Purchase ${listing.item.name}?`)) {
    return;
  }

  $q.loading.show();

  try {
    await marketsStore
      .purchase(marketId, listing.itemId, user.characterId)
      .then(() => {
        marketsStore.refresh();
        charactersStore.refresh();
      });
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.message,
    });
    $q.loading.hide();
    return;
  }

  $q.loading.hide();
  $q.notify({
    type: 'positive',
    message: 'Purchase successful. Check your ledger.',
  });
};
</script>
