<template>
  <q-card class="bg-blur">
    <q-card-section>
      <slot />
    </q-card-section>
  </q-card>
</template>

<style lang="scss"></style>

<script setup lang="ts">
defineProps(['title']);
</script>
