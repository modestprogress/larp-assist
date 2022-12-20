<template>
  <q-layout class="bg-image" view="lHh lpr lFf">
    <q-page-container>
      <q-page padding class="page q-mx-auto">
        <div class="text-h2 q-mb-lg heading text-wizard text-center">
          The journal of {{ name }}
        </div>
        <q-tabs shrink stretch class="q-mb-md">
          <q-route-tab to="/player/motds" icon="email" label="Missives" />
          <q-route-tab
            to="/player/divinations"
            icon="visibility"
            label="Divinations"
          />
          <q-route-tab to="/player/library" icon="book" label="Library" />
          <q-route-tab
            to="/player/currency"
            icon="attach_money"
            label="Currency"
          />
        </q-tabs>

        <q-btn
          size="md"
          label="Close Journal"
          @click="onSignOut"
          class="logout-top-right"
          color="secondary"
        />
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
.bg-image {
  background-image: url(/images/background.jpg);
  background-size: auto;
}

.logout-top-right {
  position: fixed;
  top: 0;
  right: 0;
}

.page {
  max-width: 768px;
}

.q-tab__content .q-icon {
  font-size: 1.8em;
}
.q-tab__label {
  font-size: 1.2em;
}
</style>

<script setup lang="ts">
// Vue
import { computed } from 'vue';

// Quasar (plugins)
import { useQuasar } from 'quasar';

// Firebase
import { signOut, getAuth } from 'firebase/auth';

// Ours - Stores
import { useCharactersStore } from 'stores/characters';
import { useUserStore } from 'stores/user';

const $q = useQuasar();

const onSignOut = () => {
  signOut(getAuth()).catch((err) => {
    $q.notify({ type: 'negative', message: err });
  });
};

const userStore = useUserStore();
const charactersStore = useCharactersStore();
charactersStore.refresh();
const name = computed(
  () => charactersStore.getCharacter(userStore.user.characterId)?.name
);
</script>
