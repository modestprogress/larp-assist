<style scoped lang="scss">
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
  <div class="text-h2 q-my-lg heading text-wizard text-center">Larp Assist</div>
  <q-tabs
    dense
    class="text-grey"
    active-color="secondary"
    indicator-color="secondary"
    align="justify"
    narrow-indicator
  >
    <q-route-tab to="/gm/books" icon="menu_book" label="Books" />
    <q-route-tab to="/gm/characters" icon="face" label="Characters" />
    <q-route-tab to="/gm/currency" icon="attach_money" label="Currency" />
    <q-route-tab to="/gm/divinations" icon="visibility" label="Divinations" />
    <q-route-tab to="/gm/files" icon="file_open" label="Files" />
    <q-route-tab to="/gm/items" icon="backpack" label="Items" />
    <q-route-tab to="/gm/markets" icon="store" label="Markets" />
    <q-route-tab to="/gm/motds" icon="today" label="MOTDs" />
    <q-route-tab to="/gm/transactions" icon="edit_note" label="Transactions" />
    <q-route-tab to="/gm/traps" icon="warning" label="Traps" />
    <q-route-tab to="/gm/users" icon="group" label="Users" />
  </q-tabs>
  <router-view />
</template>
