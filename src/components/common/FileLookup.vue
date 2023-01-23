<template>
  <q-form @submit.prevent="download">
    <q-input
      v-model="fileCode"
      label="File Code"
      dark
      filled
      clearable
      :rules="[validateFileCode]"
    />
    <q-btn
      type="submit"
      color="primary"
      label="Download"
      icon="cloud_download"
    />
  </q-form>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';

import { File } from 'src/models';

const props = defineProps({
  files: {
    type: Array<File>,
    required: true,
  },
});

const file = computed(() => {
  return props.files.find((file) => file.code === fileCode.value);
});

const validateFileCode = (value: string) => {
  if (value.length === 0) {
    return 'File code is required';
  }

  if (!file.value) {
    return 'File not found';
  }

  return true;
};

const fileCode = ref('');

const download = () => {
  window.open(file.value.url, '_blank');
};
</script>
