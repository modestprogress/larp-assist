<template>
  <q-list class="text-body1">
    <q-item v-for="motd in motds" v-bind:key="motd.id">
      {{ motd.content }}
    </q-item>
  </q-list>
</template>

<script lang="ts">
export default {
  props: ['motds'],
};
</script>
