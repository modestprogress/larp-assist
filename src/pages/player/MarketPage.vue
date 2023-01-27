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

.market__item__value,
.market__item__amount {
  margin-bottom: 0.1rem;
}

.market__name {
  text-align: center;
  color: $secondary;
}

.market__item__actions {
  display: flex;
  flex-direction: row;
  align-items: center;
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
        <div class="market__item__value">Value {{ listing.value }}</div>
        <div class="market__item__amount">Amount {{ listing.amount }}</div>
        <div class="market__item__description">
          {{ listing.item.description }}
        </div>
        <div class="market__item__actions">
          <q-btn
            v-if="listing.amount > 0 && listing.type == ListingType.SPEND"
            class="market__item__actions__button q-mr-md"
            color="accent"
            @click="spend(listing)"
            >Spend</q-btn
          >
          <q-btn
            v-if="listing.type == ListingType.OFFER"
            class="market__item__actions__button"
            color="accent"
            @click="offer(listing)"
            >Offer</q-btn
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
import { Listing, ListingType } from 'src/models';

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

  return (character.balances || {})[market.value.currencyId] || 0;
});

const currenciesStore = useCurrenciesStore();
currenciesStore.refresh();

const currencyName = computed(() => {
  if (!market.value) return '';

  return currenciesStore.getCurrency(market.value.currencyId)?.name || '';
});

const listings = computed(() => {
  if (!market.value) return [];
  if (!market.value.listings) return [];
  if (itemsStore.items.length === 0) return [];

  return Object.values(market.value.listings)
    .map((listing: Listing) => {
      const item = itemsStore.getItem(listing.itemId) || {};
      return { ...listing, item };
    })
    .sort((a, b) => a.item.name.localeCompare(b.item.name));
});

const exchange = async (listing: Listing, spend = true) => {
  const confirmPrefix = spend ? 'Spend on' : 'Purchase';
  if (!confirm(`${confirmPrefix} ${listing.item.name}?`)) {
    return;
  }

  $q.loading.show();

  try {
    await marketsStore
      .exchange(marketId, listing.itemId, user.characterId, spend)
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

  const message = spend
    ? `Spent ${listing.value} ${currencyName.value} on ${listing.item.name}`
    : `Offered ${listing.item.name} for ${listing.value} ${currencyName.value}`;
  $q.loading.hide();
  $q.notify({
    type: 'positive',
    message: message,
  });
};

const offer = (listing: Listing) => exchange(listing, false);
const spend = (listing: Listing) => exchange(listing, true);
</script>
