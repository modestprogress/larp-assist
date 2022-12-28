<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-form class="full-width" @submit="onSubmit">
        <q-card-section>
          <slot>Not yet implemented.</slot>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="primary"
            label="Submit"
            @submit="onSubmit"
            type="submit"
          />
          <q-btn color="primary" label="Cancel" @click="onCancelClick" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
export default {
  emits: ['submit', 'hide'],

  expose: ['show'],

  methods: {
    show() {
      this.$refs.dialog.show();
    },

    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      this.$emit('hide');
    },

    onCancelClick() {
      this.hide();
    },

    onSubmit() {
      this.$emit('submit');
      this.hide();
    },
  },
};
</script>
