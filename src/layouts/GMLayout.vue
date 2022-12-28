<template>
  <q-layout view="lHh lpr lFf">
    <q-header elevated>
      <q-toolbar class="q-px-lg">
        <q-icon name="tips_and_updates" size="md" />

        <q-toolbar-title>
          <router-link style="text-decoration: none; color: inherit" to="/">
            LARP Assist
          </router-link>
        </q-toolbar-title>

        <q-btn size="md" label="Logout" @click="onSignOut" color="secondary" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page padding>
        <q-tabs
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-route-tab to="/gm/books" icon="book" label="Books" />
          <q-route-tab
            to="/gm/divinations"
            icon="visibility"
            label="Divinations"
          />
          <q-route-tab to="/gm/characters" icon="person" label="Characters" />
          <q-route-tab to="/gm/currency" icon="attach_money" label="Currency" />
          <q-route-tab to="/gm/markets" icon="store" label="Markets" />
          <q-route-tab to="/gm/traps" icon="warning" label="Traps" />
          <q-route-tab to="/gm/items" icon="backpack" label="Items" />
        </q-tabs>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
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
