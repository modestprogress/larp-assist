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
            <router-link
              class="text-link"
              :to="'/player/markets/' + market.id"
              >{{ market.name }}</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <q-separator inset class="q-mb-md" />
  <div class="text-h6 q-mb-md">Transfer</div>
  <q-form @submit="transfer">
    <div class="col">
      <div class="row">
        <q-input
          outlined
          v-model="transferAmount"
          :rules="[validateAmount]"
          label="Amount"
          class="col-3"
        />
        <SelectField
          label="Currency"
          class="col"
          v-model="transferCurrency"
          :values_labels="currencyNames"
          hint="The currency the market uses"
        />
      </div>
      <SelectField
        label="To"
        v-model="transferTo"
        :values_labels="characterNames"
        hint="Who can see and shop at the markets"
      />
      <q-btn color="primary" label="Transfer" type="submit" class="q-mt-lg" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
// Vue
import { computed, ref } from 'vue';

// Ours - Components
import SelectField from 'components/common/SelectField.vue';

// Ours - Stores
import { useCurrenciesStore } from 'stores/currencies';
import { useCharactersStore } from 'stores/characters';

const props = defineProps([
  'character',
  'characterNames',
  'currencyNames',
  'currencies',
  'markets',
]);

const validateAmount = (val: string) => {
  const amount = Number(val);

  if (!(Number.isInteger(amount) && amount >= 0)) {
    return 'Invalid amount';
  }
};

const transferAmount = ref(0);
const transferTo = ref();
const transferCurrency = ref();

const marketsByCurrency = computed(() => {
  const byCurrency = new Map();
  props.markets.forEach((market) => {
    const currencyId = market.currencyId;
    const siblingMarkets = byCurrency.get(currencyId) || [];
    byCurrency.set(currencyId, siblingMarkets.concat(market));
  });

  return byCurrency;
});

const currenciesWithMarkets = computed(() => {
  return props.currencies.map((currency) => ({
    name: currency.name,
    id: currency.id,
    amount: (props.character.balances || {})[currency.id] || 0,
    markets: marketsByCurrency.value.get(currency.id) || [],
  }));
});

const currenciesStore = useCurrenciesStore();
const charactersStore = useCharactersStore();

const transfer = async () => {
  await currenciesStore.transfer(
    transferTo.value,
    transferCurrency.value,
    transferAmount.value
  );

  transferAmount.value = 0;
  transferTo.value = null;
  transferCurrency.value = null;
  await charactersStore.refresh();
};
</script>

<style lang="scss">
.currency-name {
  font-size: 1.2rem;
}
</style>
