<template>
  <DivinationCrudTable />
</template>

<script setup lang="ts">
// Vue
import { provide, computed } from 'vue';

// Ours - Stores
import { useCharactersStore } from 'stores/characters';

// Ours - Components
import DivinationCrudTable from 'components/gm/DivinationCrudTable.vue';

const charactersStore = useCharactersStore();
charactersStore.refresh();
provide('characterNames', computed(charactersStore.getCharacterNames));
</script>
