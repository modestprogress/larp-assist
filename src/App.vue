<script setup lang="ts">
// Vue
import { computed } from 'vue';

// Quasar
import { useQuasar } from 'quasar';

// Firebase
import { signOut, getAuth } from 'firebase/auth';

// Ours
import { useUserStore } from 'src/stores/user';

const $q = useQuasar();
$q.dark.set(true);

const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.user.isLoggedIn);

const onSignOut = async () => {
  await signOut(getAuth())
    .then(() => {
      userStore.signOut();
    })
    .catch((err) => {
      $q.notify({ type: 'negative', message: err });
    });
};
</script>

<template>
  <q-layout class="bg" view="lHh lpr lFf">
    <q-page-container>
      <q-page>
        <Suspense>
          <router-view />
          <template #fallback>Loading...</template>
        </Suspense>
      </q-page>
    </q-page-container>
    <q-btn
      v-if="isLoggedIn"
      size="md"
      label="Sign Out"
      @click="onSignOut"
      class="logout-top-right"
      color="secondary"
    />
  </q-layout>
</template>

<style scoped lang="scss">
$clr-bg: hsl(359, 100%, 13%);
$clr-form-text: hsl(44, 70%, 89%);
$clr-dark: #111;
$clr-trim: #d3a625;
$clr-button: #222f5b;
$clr-slytherin: #1a472a;

.logout-top-right {
  position: fixed;
  top: 0;
  right: 0;
  font-size: 1.1rem !important;
}

.bg {
  background: linear-gradient(0deg, $clr-bg, $clr-dark);
}
</style>
