<template>
  <q-select
      clearable
      filled
      map-options
      emit-value
      @input="$emit('update:modelValue', $event.target.value)"
      :options="trapOptions"
      :label="label" />
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

defineProps({
  label: String
})

const trapsById = inject('trapsById')

const trapOptions = computed(() => {
  const options = []
  trapsById.value.forEach((trap, trapId) =>
    options.push({
      label: trap.content,
      value: trapId
    })
  )

  return options
})
</script>
