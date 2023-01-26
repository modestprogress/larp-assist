<template>
  <div class="page">
    <div class="text-h2 q-my-lg heading text-wizard text-center">
      The journal of {{ name }}
    </div>
    <q-tabs
      dense
      class="text-grey q-mb-lg"
      active-color="secondary"
      indicator-color="secondary"
      align="justify"
      narrow-indicator
    >
      <q-route-tab to="/player/motds" icon="email" label="Missives" />
      <q-route-tab
        to="/player/divinations"
        icon="visibility"
        label="Divinations"
      />
      <q-route-tab to="/player/library" icon="book" label="Library" />
      <q-route-tab to="/player/currency" icon="attach_money" label="Currency" />
      <q-route-tab
        to="/player/transactions"
        icon="dynamic_feed"
        label="Ledger"
      />
    </q-tabs>
    <router-view />
  </div>
</template>

<style scoped lang="scss">
.q-tab__content .q-icon {
  font-size: 1.8em;
}
.q-tab__label {
  font-size: 1.2em;
}

.page {
  max-width: 768px;
  margin: auto;
  padding: 0 16px;
}
</style>

<script setup lang="ts">
// Vue
import { computed } from 'vue';

// Ours - Stores
import { useCharactersStore } from 'stores/characters';
import { useUserStore } from 'stores/user';

const userStore = useUserStore();
const charactersStore = useCharactersStore();
charactersStore.refresh();
const name = computed(
  () => charactersStore.getCharacter(userStore.user.characterId)?.name
);
</script>
