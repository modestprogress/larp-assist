<template>
  <q-select
    clearable
    filled
    map-options
    emit-value
    :hint="hint"
    @input="$emit('update:modelValue', $event.target.value)"
    :options="currencyNameOptions"
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

const currencyNames = inject('currencyNames');

const currencyNameOptions = computed(() => {
  const options = [];
  currencyNames.value.forEach((name, currencyId) =>
    options.push({
      label: name,
      value: currencyId,
    })
  );

  return options;
});
</script>
