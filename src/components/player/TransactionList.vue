<template>
  <q-list bordered class="rounded-borders">
    <q-expansion-item
      v-for="transaction in transactions"
      v-bind:key="transaction.uid"
      expand-separator
      :label="
        ''.concat(
          transaction.toFrom,
          ' (',
          transaction.amount,
          ' ',
          transaction.currency,
          ')'
        )
      "
      :caption="transaction.time"
    >
      <q-card>
        <q-card-section>
          {{ transaction.note }}
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>

<script setup lang="ts">
defineProps(['transactions']);
</script>
