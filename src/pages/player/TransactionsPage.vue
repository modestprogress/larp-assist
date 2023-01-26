<template>
  <div class="container">
    <div
      class="transaction"
      v-for="transaction in transactions"
      :key="transaction.id"
    >
      <div class="transaction__details">
        <div>{{ transaction.amount }} {{ transaction.currency?.name }}</div>
        <div>{{ transaction.time }}</div>
      </div>
      <q-separator inset />
      <div class="transaction__notes">
        {{ transaction.notes }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.transaction {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}

.transaction__details {
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  justify-content: space-between;
}

.transaction__notes {
  height: auto;
  margin-top: 1rem;
  text-indent: 10%;
}
</style>

<script setup lang="ts">
// Vue
import { computed } from 'vue';

// Ours - Stores
import { useTransactionsStore } from 'stores/transactions';
import { useUserStore } from 'stores/user';
import { useCurrenciesStore } from 'stores/currencies';

// Day.js
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const userStore = useUserStore();

const transactionsStore = useTransactionsStore();
transactionsStore.refresh();

const currenciesStore = useCurrenciesStore();
currenciesStore.refresh();

const motdsStore = useTransactionsStore();
motdsStore.refresh();

const transactions = computed(() =>
  transactionsStore.items
    .filter(
      (transaction) =>
        transaction.characterId === userStore.user.characterId ||
        !transaction.characterId
    )
    .map((transaction) => ({
      ...transaction,
      currency: currenciesStore.items.find(
        (currency) => currency.id === transaction.currencyId
      ),
      time: dayjs(transaction.createdAtEpoch).from(),
    }))
    .sort((a, b) => b.createdAtEpoch - a.createdAtEpoch)
);
</script>
