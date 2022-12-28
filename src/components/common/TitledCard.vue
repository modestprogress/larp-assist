<template>
  <q-card class="bg-blur">
    <q-card-section>
      <div class="text-h5">{{ title }}</div>
    </q-card-section>
    <q-separator inset />
    <q-card-section>
      <slot />
    </q-card-section>
  </q-card>
</template>

<style lang="scss"></style>

<script setup lang="ts">
defineProps(['title']);
</script>
