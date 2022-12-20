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
