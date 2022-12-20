<template>
  <q-select
      multiple
      clearable
      filled
      map-options
      use-chips
      stack-label
      emit-value
      :options="characterNameOptions"
      @input="$emit('update:modelValue', $event.target.value)"
      :label="label" />
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

defineProps({
  label: String
})

const characterNames = inject('characterNames')

const characterNameOptions = computed(() => {
  const options = []
  characterNames.value.forEach((name, characterId) =>
    options.push({
      label: name,
      value: characterId
    })
  )

  return options
})
</script>
