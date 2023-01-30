<style scoped lang="scss">
.title-row {
  display: flex;
  align-items: center;
}
</style>

<template>
  <q-table
    dark
    class="bg-transparent"
    :rows="rows || []"
    :columns="columns"
    wrap-cells
    row-key="id"
    binary-state-sort
    v-model:pagination="paginationSettings"
  >
    <template v-slot:top>
      <div class="row title-row">
        <div class="q-table__title q-mr-sm">{{ title }}</div>
        <q-btn
          round
          v-if="!hideAdd"
          size="xs"
          class="q-mr-sm"
          color="secondary"
          icon="add"
          @click="onAdd"
        />
        <q-btn
          round
          size="xs"
          class="q-mr-sm"
          color="primary"
          icon="archive"
          no-caps
          @click="onExport"
        />
      </div>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn icon="mode_edit" @click="onEdit(props.row)"></q-btn>
        <q-btn
          v-if="!hideDelete"
          icon="delete"
          @click="onDelete(props.row)"
        ></q-btn>
      </q-td>
    </template>
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>
  </q-table>
</template>

<script setup lang="ts">
// Vue
import { computed, ref } from 'vue';

// export-to-csv
import { ExportToCsv } from 'export-to-csv';

const props = defineProps([
  'columns',
  'rows',
  'title',
  'loading',
  'hideDelete',
  'hideAdd',
]);
const emit = defineEmits(['delete', 'edit', 'add']);

const columns = computed(() =>
  props.columns.concat({ name: 'actions', label: 'Action' })
);

const paginationSettings = ref({
  page: 1,
  rowsPerPage: 20,
  sortBy: props.columns[0].field,
  descending: true,
});

const onEdit = (row) => emit('edit', row);

const onDelete = (row) => {
  // Confirm before deleting.
  const confirmed = confirm('Are you sure you want to delete?');
  if (confirmed) {
    emit('delete', row);
  }
};

const onAdd = () => emit('add');

const onExport = () => {
  const tableContents = props.rows.map((row) =>
    Object.fromEntries(
      props.columns
        .filter((col) => col.label)
        .map((col) => {
          const label = col.label;
          const fieldValue = row[col.field || col.name];
          const value =
            typeof col.format === 'function'
              ? col.format(fieldValue, row)
              : fieldValue;

          return [label, value];
        })
    )
  );

  const options = {
    filename: props.title + ' ' + new Date(),
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  };

  const csvExporter = new ExportToCsv(options);
  csvExporter.generateCsv(tableContents);
};
</script>
