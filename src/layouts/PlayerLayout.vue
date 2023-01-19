<template>
  <div class="text-h2 q-my-lg heading text-wizard text-center">
    The journal of {{ name }}
  </div>
  <q-tabs shrink stretch class="q-mb-md">
    <q-route-tab to="/player/motds" icon="email" label="Missives" />
    <q-route-tab
      to="/player/divinations"
      icon="visibility"
      label="Divinations"
    />
    <q-route-tab to="/player/library" icon="book" label="Library" />
    <q-route-tab to="/player/currency" icon="attach_money" label="Currency" />
  </q-tabs>
</template>

<style scoped lang="scss">
.bg-image {
  background-image: url(/images/background.jpg);
  background-size: auto;
}

.q-tab__content .q-icon {
  font-size: 1.8em;
}
.q-tab__label {
  font-size: 1.2em;
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
