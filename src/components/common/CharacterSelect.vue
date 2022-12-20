<template>
  <q-select
      clearable
      filled
      map-options
      emit-value
      @input="$emit('update:modelValue', $event.target.value)"
      :options="characterNameOptions"
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
