<template>
  <UserCrudTable />
</template>

<script setup lang="ts">
// Vue
import { provide, computed } from 'vue';

// Ours - Stores
import { useCharactersStore } from 'stores/characters';

// Ours - Components
import UserCrudTable from 'components/gm/UserCrudTable.vue';

const charactersStore = useCharactersStore();
charactersStore.refresh();
provide('characterNames', computed(charactersStore.getCharacterNames));
</script>
