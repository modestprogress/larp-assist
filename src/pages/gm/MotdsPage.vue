<template>
  <MotdCrudTable />
</template>

<script setup lang="ts">
// Vue
import { provide, computed } from 'vue';

// Ours - Stores
import { useCharactersStore } from 'stores/characters';

// Ours - Components
import MotdCrudTable from 'components/gm/MotdCrudTable.vue';

const charactersStore = useCharactersStore();
charactersStore.refresh();
provide(
  'characterNames',
  computed(() => charactersStore.getCharacterNames())
);
</script>
