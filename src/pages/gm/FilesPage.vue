<template>
  <div class="q-pa-md">
    <FileCrudTable />
    <q-btn class="q-mt-sm" color="primary" label="Sync" @click="onSync" />
  </div>
</template>

<script setup lang="ts">
// Quasar
import { useQuasar } from 'quasar';

// Ours - Components
import FileCrudTable from 'components/gm/FileCrudTable.vue';

// Ours - Stores
import { useFilesStore } from 'stores/files';

const $q = useQuasar();

const filesStore = useFilesStore();
await filesStore.refresh();

const onSync = async () => {
  $q.loading.show();
  await filesStore.sync();
  await filesStore.refresh();
  $q.loading.hide();
};
</script>
