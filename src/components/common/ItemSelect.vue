<template>
  <q-select
    clearable
    filled
    map-options
    emit-value
    :hint="hint"
    @input="$emit('update:modelValue', $event.target.value)"
    :options="itemNameOptions"
    :label="label"
  />
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';

defineProps({
  label: String,
  hint: {
    type: String,
    default: '',
  },
});

const items = inject('items');
const itemNameOptions = computed(() => {
  return items.value.map(({ id, name }) => ({
    label: name,
    value: id,
  }));
});
</script>
