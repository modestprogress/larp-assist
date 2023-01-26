<style scoped lang="scss">
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
  border-color: #ddd;
  padding: 10px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.market__item__name {
  font-size: 1.4rem;
}

.market__item__description {
  flex-grow: 1;
}

.market__item__price,
.market__item__amount {
  font-size: 1.2rem;
}
</style>

<template>
  <div class="container">
    <div class="text-h4">{{ market?.name }}</div>
    <div class="market">
      <div
        class="market__item"
        v-for="listing in listings"
        :key="listing.item.id"
      >
        <div class="market__item__name">{{ listing.item.name }}</div>
        <div class="market__item__price">{{ listing.item.price }}</div>
        <div class="market__item__description">
          {{ listing.item.description }}
        </div>
        <div class="market__item__actions">
          <button
            class="market__item__actions__button"
            @click="purchase(listing)"
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// Ours - Stores
import { useItemsStore } from 'src/stores/items';
import { useMarketsStore } from 'src/stores/markets';

// Ours - types
import { Item, Listing } from 'src/models';

const route = useRoute();

const itemsStore = useItemsStore();
itemsStore.refresh();

const marketsStore = useMarketsStore();
marketsStore.refresh();
const marketId = route?.params.id || '';
const market = computed(() => marketsStore.getMarket(marketId));

const listings = computed(() => {
  if (!market.value) return [];

  return Object.values(market.value.listings).map((listing: Listing) => {
    const item = itemsStore.getItem(listing.itemId);
    return { ...listing, item };
  });
});

const purchase = (listing: Listing) => {
  console.log('purchase!');
};
</script>
