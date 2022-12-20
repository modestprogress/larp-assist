<template>
  <div class="q-pa-md">
    <q-table
      :rows="rows || []"
      :columns="columns"
      :loading="loading"
      wrap-cells
      row-key="id"
      binary-state-sort
    >
      <template v-slot:top>
        <div class="col">
          <div class="q-table__title">{{ title }}</div>
          <q-btn
            round
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
          <q-btn icon="delete" @click="onDelete(props.row)"></q-btn>
        </q-td>
      </template>
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue';

// export-to-csv
import { ExportToCsv } from 'export-to-csv';

const props = defineProps(['columns', 'rows', 'title', 'loading']);
const emit = defineEmits(['delete', 'edit', 'add']);

const columns = computed(() =>
  props.columns.concat({ name: 'actions', label: 'Action' })
);

const onEdit = (row) => emit('edit', row);
const onDelete = (row) => emit('delete', row);
const onAdd = () => emit('add');
const onExport = () => {
  const tableContents = props.rows.map((row) =>
    Object.fromEntries(
      props.columns
        .filter((col) => col.label)
        .map((col) => {
          const label = col.label;
          const value =
            typeof col.field === 'function'
              ? col.field(row)
              : row[col.field || col.name];

          return [label, value];
        })
    )
  );
  console.dir(tableContents);

  const options = {
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
