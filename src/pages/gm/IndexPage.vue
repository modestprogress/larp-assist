<template>
  <q-page class="gm-page">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="book" icon="book" label="Books" />
      <q-tab name="divinations" icon="visibility" label="Divinations" />
      <q-tab name="characters" icon="person" label="Characters" />
      <q-tab name="currency" icon="attach_money" label="Currency" />
      <q-tab name="markets" icon="store" label="Markets" />
      <q-tab name="traps" icon="warning" label="Traps" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="book">
        <BookCrudTable />
      </q-tab-panel>

      <q-tab-panel name="divinations">
        <DivinationCrudTable />
      </q-tab-panel>

      <q-tab-panel name="characters">
        <CharacterCrudTable />
      </q-tab-panel>

      <q-tab-panel name="currency">
        <CurrencyCrudTable />
      </q-tab-panel>

      <q-tab-panel name="markets">
        <MarketCrudTable />
      </q-tab-panel>

      <q-tab-panel name="motds">
        <MotdCrudTable />
      </q-tab-panel>

      <q-tab-panel name="traps">
        <TrapCrudTable />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<style lang="scss">
.gm-page .q-tab-panel {
}
</style>

<script setup lang="ts">
import { ref, provide, computed } from 'vue';

// Ours - Components
import MotdCrudTable from 'components/gm/MotdCrudTable.vue';
import CurrencyCrudTable from 'components/gm/CurrencyCrudTable.vue';
import DivinationCrudTable from 'components/gm/DivinationCrudTable.vue';
import MarketCrudTable from 'components/gm/MarketCrudTable.vue';
import BookCrudTable from 'components/gm/BookCrudTable.vue';
import TrapCrudTable from 'components/gm/TrapCrudTable.vue';
import CharacterCrudTable from 'components/gm/CharacterCrudTable.vue';

// Ours - Store
import { useCharactersStore } from 'stores/characters';
import { useCurrenciesStore } from 'stores/currencies';
import { useUserStore } from 'stores/user';
import { useTrapsStore } from 'stores/traps';

const tab = ref();

const userStore = useUserStore();

const charactersStore = useCharactersStore();
charactersStore.refresh();
provide(
  'characterNames',
  computed(() => charactersStore.getCharacterNames())
);

const currenciesStore = useCurrenciesStore();
currenciesStore.refresh();
provide('currencyNames', computed(currenciesStore.getCurrencyNames));

const trapsStore = useTrapsStore();
trapsStore.refresh();
provide(
  'trapsById',
  computed(() => trapsStore.itemsById)
);
</script>
