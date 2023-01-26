<template>
  <q-list class="text-body1">
    <q-item class="motd" v-for="motd in motds" v-bind:key="motd.id">
      {{ motd.content }}
    </q-item>
  </q-list>
</template>

<style scoped lang="scss">
.motd {
  border: 2px solid $accent;
  margin-bottom: 10px;
}
</style>

<script lang="ts">
export default {
  props: ['motds'],
};
</script>
