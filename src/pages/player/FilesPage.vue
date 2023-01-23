<template>
  <SimpleCard>
    <MotdsList v-if="motds.length > 0" :motds="motds" />
    <div v-else>No MOTDs</div>
  </SimpleCard>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue';

// Ours - Stores
import { useMotdsStore } from 'stores/motds';
import { useUserStore } from 'stores/user';
import { useFilesStore } from 'stores/files';

// Ours - Components
import SimpleCard from 'components/common/SimpleCard.vue';
import MotdsList from 'components/player/MotdsList.vue';

const motdsStore = useMotdsStore();
motdsStore.refresh();

const userStore = useUserStore();

const filesStore = useFilesStore();
filesStore.refresh();

const files = computed(() => filesStore.items);

const motds = computed(() =>
  motdsStore.items.filter(
    (motd) => motd.characterId === userStore.user.characterId
  )
);
</script>
