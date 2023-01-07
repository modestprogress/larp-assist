<style scoped lang="scss">
.logout-top-right {
  position: fixed;
  top: 0;
  right: 0;
}

.q-tab__content .q-icon {
  font-size: 1.8em;
}
.q-tab__label {
  font-size: 1.2em;
}

.text-h2 {
  color: $white-warm;
}
</style>

<template>
  <div class="text-h2 q-mb-lg heading text-wizard text-center">Larp Assist</div>
  <q-tabs
    dense
    class="text-grey"
    active-color="secondary"
    indicator-color="secondary"
    align="justify"
    narrow-indicator
  >
    <q-route-tab to="/gm/books" icon="menu_book" label="Books" />
    <q-route-tab to="/gm/divinations" icon="visibility" label="Divinations" />
    <q-route-tab to="/gm/characters" icon="face" label="Characters" />
    <q-route-tab to="/gm/currency" icon="attach_money" label="Currency" />
    <q-route-tab to="/gm/markets" icon="store" label="Markets" />
    <q-route-tab to="/gm/traps" icon="warning" label="Traps" />
    <q-route-tab to="/gm/items" icon="backpack" label="Items" />
    <q-route-tab to="/gm/transactions" icon="edit_note" label="Transactions" />
  </q-tabs>
  <q-btn
    size="md"
    label="Sign Out"
    @click="onSignOut"
    class="logout-top-right"
    color="secondary"
  />
  <router-view />
</template>

<script setup lang="ts">
// Quasar (plugins)
import { useQuasar } from 'quasar';

// Firebase
import { signOut, getAuth } from 'firebase/auth';

const $q = useQuasar();

const onSignOut = () => {
  signOut(getAuth()).catch((err) => {
    $q.notify({ type: 'negative', message: err });
  });
};
</script>
