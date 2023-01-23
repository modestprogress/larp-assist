<script setup lang="ts">
// Vue
import { computed } from 'vue';

import FileLookup from 'components/common/FileLookup.vue';
import BookLookup from 'components/common/BookLookup.vue';

import { useFilesStore } from 'stores/files';

const filesStore = useFilesStore();
filesStore.refresh();

const files = computed(() => filesStore.items);
</script>

<template>
  <BookLookup />
  <FileLookup :files="files" />
</template>
