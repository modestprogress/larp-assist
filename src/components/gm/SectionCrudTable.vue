<template>
  <div class="q-pa-md">
    <CrudTable
      :columns="columns"
      :rows="sections"
      :loading="loading"
      title="Sections"
      @add="onAdd"
      @edit="onEdit"
      @delete="onDelete"
    />

    <DialogForm ref="dialog" @submit="onSubmit">
      <q-select
        label="Chapter"
        v-model="formData.chapterIdx"
        :options="numberingOptions"
        :autofocus="true"
        :rules="[$rules.required()]"
      />
      <q-select
        label="Section"
        :options="numberingOptions"
        v-model="formData.sectionIdx"
        :rules="[$rules.required()]"
      />
      <q-select
        outlined
        :options="[SectionType.Inline, SectionType.Trap]"
        label="Type"
        v-model="formData.type"
        :rules="[$rules.required()]"
      />
      <TrapSelect
        v-if="formData.type == SectionType.Trap"
        label="Trap"
        v-model="formData.trapId"
        :rules="[$rules.required()]"
      />
      <q-input
        outlined
        v-else
        type="textarea"
        label="Text"
        v-model="formData.text"
      />
    </DialogForm>
  </div>
</template>

<script setup lang="ts">
// Vue
import { computed, ref, inject, watch } from 'vue';

// Ours - model
import { SectionType, sortSections } from 'src/models/books';

// Ours - stores
import { useSectionsStore } from 'stores/sections';

// Ours - Components
import CrudTable from 'components/common/CrudTable.vue';
import DialogForm from 'components/common/DialogForm.vue';
import TrapSelect from 'components/common/TrapSelect.vue';

const props = defineProps({
  bookId: String,
});

const trapsById = inject('trapsById');

const displayText = (section: Section) => {
  if (section.type == SectionType.Trap) {
    const trapName = trapsById.value.get(section.trapId).name;
    return `trap[${trapName}]`;
  }

  return section.text;
};

const columns = [
  {
    name: 'chapterIdx',
    field: 'chapterIdx',
    label: 'Chapter',
    required: true,
    align: 'left',
  },
  {
    name: 'sectionIdx',
    field: 'sectionIdx',
    label: 'Section',
    required: true,
    align: 'left',
  },
  {
    name: 'text',
    label: 'Text',
    format: (_, section) => displayText(section),
    required: true,
    align: 'left',
  },
];

const numberingOptions = Array.from({ length: 20 }, (_, i) => i + 1);

// The data backing the form
const formData = ref();

// The form dialog for editing/creating
const dialog = ref(null);

const sectionsStore = useSectionsStore();
sectionsStore.refresh();

const onDelete = (section) => sectionsStore.delete(section.id);
const onSubmit = () => {
  const section = formData.value;
  section.trapId ||= '';
  section.text ||= '';

  sectionsStore.createOrUpdate(section);
};

// The rows we're displaying.
const sections = computed(() => {
  return sortSections(sectionsStore.sectionsByBookId.get(props.bookId) || []);
});

// Determines when the loading indicator will be shown in the table
const loading = computed(() => sectionsStore.loading);

// The callback when you click the add button
const onEdit = (section) => {
  formData.value = {
    ...section,
    bookId: props.bookId,
  };
  dialog.value.show();
};

const onAdd = () => {
  let lastSectionIdx = 0;
  let lastChapterIdx = 1;
  if (sections.value && sections.value.length > 0) {
    const lastSection = sections.value[sections.value.length - 1];
    lastSectionIdx = lastSection.sectionIdx;
    lastChapterIdx = lastSection.chapterIdx;
  }

  return onEdit({
    type: SectionType.Inline,
    sectionIdx: lastSectionIdx + 1,
    chapterIdx: lastChapterIdx,
  });
};
</script>
