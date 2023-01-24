<template>
  <SimpleCard>
    <DivinationsList v-if="divinations.length > 0" :divinations="divinations" />
    <div v-else>No Divinations</div>
  </SimpleCard>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue';

// Ours - Stores
import { useDivinationsStore } from 'stores/divinations';
import { useUserStore } from 'stores/user';

// Ours - Components
import SimpleCard from 'components/common/SimpleCard.vue';
import DivinationsList from 'components/player/DivinationsList.vue';

const userStore = useUserStore();

const divinationsStore = useDivinationsStore();
divinationsStore.refresh();

const divinations = computed(() =>
  divinationsStore.getCharacterDivinations(userStore.user.characterId)
);
</script>
