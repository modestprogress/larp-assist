<template>
  <div
    v-for="currency in currenciesWithMarkets"
    class="row q-mb-md"
    v-bind:key="currency.id"
  >
    <div class="col">
      <div class="currency-name">
        {{ currency.name }}
      </div>
      <div class="row text-body1">
        <div class="col-3">Amount:</div>
        <div class="col">{{ currency.amount }}</div>
      </div>
      <div class="row text-body1">
        <div class="col-3">Markets:</div>
        <div class="col">
          <div v-for="market in currency.markets" v-bind:key="market.id">
            <router-link class="text-link" to="/market/">{{
              market.name
            }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <q-separator inset class="q-mb-md" />
  <div class="text-h6 q-mb-md">Transfer</div>
  <q-form @submit="onTransfer">
    <div class="col">
      <div class="row">
        <q-input
          outlined
          v-model="transferAmount"
          :rules="[validateAmount]"
          label="Amount"
          class="col-3"
        />
        <CurrencySelect
          label="Currency"
          v-model="transferCurrency"
          class="col"
        />
      </div>
      <CharacterSelect label="To" v-model="transferTo" />
      <q-btn color="primary" label="Transfer" type="submit" class="q-mt-lg" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
// Vue
import { computed, ref, inject } from 'vue';

// Ours - Components
//import CurrencySelect from 'components/common/CurrencySelect.vue';
//import CharacterSelect from 'components/common/CharacterSelect.vue';

const onTransfer = () => {
  console.log('Transfering!');
};

const validateAmount = (val) => {
  const amount = Number(val);

  if (!(Number.isInteger(amount) && amount >= 0)) {
    return 'Invalid amount';
  }
};

const transferAmount = ref(0);
const transferTo = ref();
const transferCurrency = ref();

const markets = inject('markets');
const marketsByCurrency = computed(() => {
  const byCurrency = new Map();
  markets.value.forEach((market) => {
    const currencyId = market.currencyId;
    const siblingMarkets = byCurrency.get(currencyId) || [];
    byCurrency.set(currencyId, siblingMarkets.concat(market));
  });

  return byCurrency;
});

const currencies = inject('currencies');
const currenciesWithMarkets = computed(() => {
  return currencies.value.map((currency) => ({
    name: currency.name,
    id: currency.id,
    amount: 0,
    markets: marketsByCurrency.value.get(currency.id) || [],
  }));
});
</script>

<style lang="scss">
.currency-name {
  font-size: 1.2rem;
}
</style>
