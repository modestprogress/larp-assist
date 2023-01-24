<script setup lang="ts">
// Vue
import { computed } from 'vue';

import FileLookup from 'components/common/FileLookup.vue';
import BookLookup from 'components/common/BookLookup.vue';

import { useFilesStore } from 'stores/files';

const filesStore = useFilesStore();
filesStore.refresh();

const files = computed(() => filesStore.items);
const commonFiles = computed(() => files.value.filter((file) => file.common));

const download = (file) => {
  filesStore.downloadFile(file);
};
</script>

<template>
  <FileLookup class="q-mb-md" :files="files" />
  <BookLookup class="q-mb-md" />
  <q-list>
    <q-item v-for="file in commonFiles" :key="file.id">
      <q-btn @click="download(file)" ouline-color="primary">
        {{ file.common_name }}
      </q-btn>
    </q-item>
  </q-list>
</template>
