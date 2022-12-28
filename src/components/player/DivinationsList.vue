<template>
  <q-list class="text-body1">
    <q-expansion-item
      v-for="divination in divinations"
      switch-toggle-side
      v-bind:key="divination.uid"
      :label="divination.name"
    >
      <q-card class="bg-blur">
        <q-card-section>
          {{ divination.content }}
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>

<script lang="ts">
export default {
  props: ['divinations'],
};
</script>
