<template>
  <MotdsList v-if="motds && motds.length > 0" :motds="motds" />
  <div v-else>No MOTDs</div>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue';

// Ours - Stores
import { useMotdsStore } from 'stores/motds';
import { useUserStore } from 'stores/user';

// Ours - Components
import MotdsList from 'components/player/MotdsList.vue';

const userStore = useUserStore();

const motdsStore = useMotdsStore();
motdsStore.refresh();

const motds = computed(() =>
  motdsStore.items.filter(
    (motd) =>
      motd.characterId === userStore.user.characterId || !motd.characterId
  )
);
</script>
