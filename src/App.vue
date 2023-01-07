<script setup lang="ts">
import { useQuasar } from 'quasar';
const $q = useQuasar();

$q.dark.set(true);
</script>

<template>
  <Suspense>
    <router-view />

    <template #fallback>Loading...</template>
  </Suspense>
</template>
