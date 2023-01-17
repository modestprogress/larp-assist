<template>
  <q-select
    filled
    color="secondary"
    emit-value
    map-options
    use-chips
    stack-label
    use-input
    @filter="filterFn"
    input-debounce="0"
    v-bind="$attrs"
    :options="options"
    @input="$emit('update:modelValue', $event.target.value)"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">No results</q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';

const props = defineProps({
  values_labels: Map<string, string>,
});

const labeledOptions = computed(() => {
  const { values_labels } = toRefs(props);

  if (values_labels?.value === undefined) {
    return [];
  }

  return Array.from(values_labels.value.keys())
    .sort()
    .map((value: string) => {
      return {
        label: values_labels.value?.get(value),
        value: value,
      };
    });
});

const options = ref<Map<string, string>>(labeledOptions.value);

const filterFn = (val: string, update: (options: any) => void) => {
  update(() => {
    options.value = labeledOptions.value.filter((i) => {
      return i?.label?.toLowerCase().includes(val.toLowerCase());
    });
  });
};
</script>
